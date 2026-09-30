"""Private visit statistics. Run behind the supplied Nginx proxy."""
import hmac
import hashlib
import json
import ipaddress
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError

from flask import Flask, Response, jsonify, render_template, request, redirect

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 2048
DB = os.environ.get('STATS_DB', 'data/visits.sqlite3')
ADMIN_PATH = os.environ.get('STATS_ADMIN_PATH', '')
PASSWORD = os.environ.get('STATS_ADMIN_PASSWORD', '')
refresh_lock = Lock()
if not re.fullmatch(r'/[a-zA-Z0-9_-]{16,100}', ADMIN_PATH) or len(PASSWORD) < 16:
    raise RuntimeError('Set STATS_ADMIN_PATH (16+ characters) and STATS_ADMIN_PASSWORD (16+ characters)')


@contextmanager
def database():
    con = sqlite3.connect(DB, timeout=10)
    con.row_factory = sqlite3.Row
    try:
        with con:
            yield con
    finally:
        con.close()


Path(DB).parent.mkdir(parents=True, exist_ok=True)
with database() as con:
    con.execute('PRAGMA journal_mode=WAL')
    con.execute('''CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY, ip TEXT NOT NULL, started REAL NOT NULL,
        seen REAL NOT NULL, seconds REAL NOT NULL DEFAULT 0)''')
    con.execute('CREATE INDEX IF NOT EXISTS visits_ip ON visits(ip)')
    con.execute('''CREATE TABLE IF NOT EXISTS ip_details (
        ip TEXT PRIMARY KEY, location TEXT NOT NULL, isp TEXT NOT NULL,
        checked REAL NOT NULL, expires REAL NOT NULL, error TEXT NOT NULL)''')


@app.after_request
def private_headers(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"
    return response


@app.post('/api/visits')
def visit():
    # Nginx overwrites this header. Do not expose the backend port publicly.
    raw_ip = request.headers.get('X-Real-IP', request.remote_addr)
    try:
        ip = str(ipaddress.ip_address(raw_ip))
    except ValueError:
        return jsonify(error='Invalid IP'), 400
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error='Invalid body'), 400
    now = time.time()
    with database() as con:
        con.execute('BEGIN IMMEDIATE')
        # Default retention: 90 days; purged as traffic arrives.
        con.execute('DELETE FROM visits WHERE seen < ?', (now - 90 * 86400,))
        con.execute('DELETE FROM ip_details WHERE ip NOT IN (SELECT ip FROM visits)')
        token = data.get('id')
        if token is None:
            count = con.execute('SELECT COUNT(*) FROM visits WHERE ip=? AND started>?', (ip, now - 60)).fetchone()[0]
            if count >= 60:
                return jsonify(error='Too many visits'), 429
            token = secrets.token_urlsafe(32)
            con.execute('INSERT INTO visits(id,ip,started,seen) VALUES(?,?,?,?)', (token, ip, now, now))
        else:
            seconds = data.get('seconds')
            if not isinstance(token, str) or len(token) > 100 or type(seconds) not in (int, float) or not 0 <= seconds <= 864000:
                return jsonify(error='Invalid heartbeat'), 400
            row = con.execute('SELECT * FROM visits WHERE id=? AND ip=?', (token, ip)).fetchone()
            if row is None:
                return jsonify(error='Unknown visit'), 404
            # Cumulative client time makes retries/reordering idempotent; server
            # elapsed time bounds fabricated heartbeats. Never move time backwards.
            total = max(row['seconds'], min(seconds, now - row['started']))
            con.execute('UPDATE visits SET seconds=?, seen=? WHERE id=?', (total, now, token))
    return jsonify(id=token)


def lookup_token(ip):
    return hmac.new(PASSWORD.encode(), ('lookup:' + ip).encode(), hashlib.sha256).hexdigest()


def lookup_ip(ip):
    now = time.time()
    with database() as con:
        cached = con.execute('SELECT * FROM ip_details WHERE ip=?', (ip,)).fetchone()
    if cached and cached['expires'] > now:
        return
    location, isp, error = '', '', ''
    expires = now + 7 * 86400
    try:
        if not ipaddress.ip_address(ip).is_global:
            location, isp = '非公网地址', '不适用'
        else:
            with urlopen('https://ipwho.is/' + ip, timeout=4) as response:
                data = json.loads(response.read(65536))
            if not isinstance(data, dict) or data.get('success') is not True:
                raise ValueError('Lookup rejected')
            location = ' / '.join(str(data.get(key) or '')[:100] for key in ('country', 'region', 'city') if data.get(key)) or '未知'
            connection = data.get('connection') or {}
            isp = str(connection.get('isp') or connection.get('org') or '未知')[:200]
    except (URLError, TimeoutError, OSError, ValueError, TypeError, AttributeError):
        error = '查询暂不可用，10分钟后可重试'
        expires = now + 600
    with database() as con:
        con.execute('INSERT OR REPLACE INTO ip_details VALUES(?,?,?,?,?,?)',
                    (ip, location, isp, now, expires, error))


@app.route(ADMIN_PATH, methods=['GET', 'POST'])
def admin():
    auth = request.authorization
    if not auth or not hmac.compare_digest((auth.username or '').encode(), b'admin') or not hmac.compare_digest((auth.password or '').encode(), PASSWORD.encode()):
        return Response('需要管理员密码', 401, {'WWW-Authenticate': 'Basic realm="Visit statistics", charset="UTF-8"'})
    if request.method == 'POST':
        ip = request.form.get('ip', '')
        token = request.form.get('token', '')
        if not hmac.compare_digest(token.encode(), lookup_token(ip).encode()):
            return Response('无效查询请求', 403)
        with database() as con:
            exists = con.execute('SELECT 1 FROM visits WHERE ip=? LIMIT 1', (ip,)).fetchone()
        if not exists:
            return Response('未找到访问记录', 404)
        lookup_ip(ip)
        return redirect(ADMIN_PATH, code=303)
    # Bound login latency to one parallel batch, and skip overlapping refreshes.
    if refresh_lock.acquire(blocking=False):
        try:
            with database() as con:
                pending = con.execute('''SELECT v.ip FROM visits v
                    LEFT JOIN ip_details d ON d.ip=v.ip
                    WHERE d.ip IS NULL OR d.expires<=?
                    GROUP BY v.ip ORDER BY MAX(v.seen) DESC LIMIT 4''', (time.time(),)).fetchall()
            with ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(lookup_ip, (row['ip'] for row in pending)))
        finally:
            refresh_lock.release()
    with database() as con:
        rows = con.execute('''SELECT v.*, d.location, d.isp, d.error, d.checked, d.expires FROM
            (SELECT ip, COUNT(*) AS visits, SUM(seconds) AS seconds,
            MIN(started) AS first, MAX(seen) AS last FROM visits
            GROUP BY ip ORDER BY last DESC LIMIT 1000) v
            LEFT JOIN ip_details d ON d.ip=v.ip ORDER BY v.last DESC''').fetchall()
        totals = con.execute('SELECT COUNT(DISTINCT ip), COUNT(*), COALESCE(SUM(seconds),0) FROM visits').fetchone()
    return render_template('admin.html', rows=rows, totals=totals, admin_path=ADMIN_PATH,
                           lookup_token=lookup_token, now=time.time())


@app.template_filter('duration')
def duration(seconds):
    seconds = int(seconds)
    return f'{seconds // 3600}小时 {(seconds % 3600) // 60}分 {seconds % 60}秒'


@app.template_filter('date')
def date(timestamp):
    from datetime import datetime, timezone, timedelta
    return datetime.fromtimestamp(timestamp, timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S')

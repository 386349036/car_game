"""Private visit statistics. Run behind the supplied Nginx proxy."""
import hmac
import ipaddress
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 2048
DB = os.environ.get('STATS_DB', 'data/visits.sqlite3')
ADMIN_PATH = os.environ.get('STATS_ADMIN_PATH', '')
PASSWORD = os.environ.get('STATS_ADMIN_PASSWORD', '')
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


@app.after_request
def private_headers(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; frame-ancestors 'none'"
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


@app.get(ADMIN_PATH)
def admin():
    auth = request.authorization
    if not auth or not hmac.compare_digest((auth.username or '').encode(), b'admin') or not hmac.compare_digest((auth.password or '').encode(), PASSWORD.encode()):
        return Response('需要管理员密码', 401, {'WWW-Authenticate': 'Basic realm="Visit statistics", charset="UTF-8"'})
    with database() as con:
        rows = con.execute('''SELECT ip, COUNT(*) AS visits, SUM(seconds) AS seconds,
            MIN(started) AS first, MAX(seen) AS last FROM visits
            GROUP BY ip ORDER BY last DESC LIMIT 1000''').fetchall()
        totals = con.execute('SELECT COUNT(DISTINCT ip), COUNT(*), COALESCE(SUM(seconds),0) FROM visits').fetchone()
    return render_template('admin.html', rows=rows, totals=totals)


@app.template_filter('duration')
def duration(seconds):
    seconds = int(seconds)
    return f'{seconds // 3600}小时 {(seconds % 3600) // 60}分 {seconds % 60}秒'


@app.template_filter('date')
def date(timestamp):
    from datetime import datetime, timezone, timedelta
    return datetime.fromtimestamp(timestamp, timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S')

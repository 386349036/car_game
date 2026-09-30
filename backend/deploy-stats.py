"""Run on the target host with sudo, from the uploaded package directory."""
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import sys


def run(*args):
    subprocess.run(args, check=True)


release_id = sys.argv[1]
source = Path(__file__).resolve().parent
run('apt-get', 'update', '-qq')
run('apt-get', 'install', '-y', 'python3-venv')
destination = Path('/opt/game01-stats')
destination.mkdir(exist_ok=True)
for name in ('app.py', 'requirements.txt'):
    shutil.copy2(source / name, destination / name)
shutil.copytree(source / 'templates', destination / 'templates', dirs_exist_ok=True)
run('python3', '-m', 'venv', str(destination / '.venv'))
run(str(destination / '.venv/bin/pip'), 'install', '-r', str(destination / 'requirements.txt'))
run('install', '-d', '-o', 'www-data', '-g', 'www-data', '-m', '700', '/var/lib/game01-stats')
env_file = Path('/etc/game01-stats.env')
if not env_file.exists():
    fd = os.open(env_file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as stream:
        stream.write('STATS_DB=/var/lib/game01-stats/visits.sqlite3\n')
        stream.write('STATS_ADMIN_PATH=/stats-' + secrets.token_urlsafe(24) + '\n')
        stream.write('STATS_ADMIN_PASSWORD=' + secrets.token_urlsafe(32) + '\n')
shutil.copy2(source / 'game01-stats.service', '/etc/systemd/system/game01-stats.service')
run('systemctl', 'daemon-reload')
run('systemctl', 'enable', '--now', 'game01-stats')
run('systemctl', 'restart', 'game01-stats')
run('systemctl', 'is-active', '--quiet', 'game01-stats')

config = Path('/etc/nginx/sites-available/game01')
original = config.read_text()
backup = config.with_name('game01.before-stats-' + release_id)
shutil.copy2(config, backup)
zone = Path('/etc/nginx/conf.d/game01-stats-limit.conf')
zone.write_text('limit_req_zone $binary_remote_addr zone=game01_stats:10m rate=10r/s;\n')
if 'location = /api/visits' not in original:
    snippet = '''
    location = /api/visits {
        limit_req zone=game01_stats burst=20 nodelay;
        client_max_body_size 2k;
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
    }
'''
    config.write_text(original[:original.rfind('}')] + snippet + original[original.rfind('}'):])
try:
    run('nginx', '-t')
    run('systemctl', 'reload', 'nginx')
except Exception:
    config.write_text(original)
    raise
print('Statistics installed; administrator access via SSH tunnel only.')

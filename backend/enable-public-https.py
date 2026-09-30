"""Configure IP HTTPS after issuing /etc/letsencrypt/live/game01-ip."""
from pathlib import Path
import shutil
import subprocess

config = dict(line.split('=', 1) for line in Path('/etc/game01-stats.env').read_text().splitlines())
path = config['STATS_ADMIN_PATH']
site = Path('/etc/nginx/sites-available/game01')
original = site.read_text()
shutil.copy2(site, '/etc/nginx/sites-available/game01.before-public-https')
https = original.replace('listen 80;', 'listen 443 ssl;').replace('listen [::]:80;', 'listen [::]:443 ssl;')
https = https.replace('    index index.html;', '''    index index.html;
    ssl_certificate /etc/letsencrypt/live/game01-ip/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/game01-ip/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;''')
admin = f'''
    location = {path} {{
        limit_req zone=game01_stats burst=5 nodelay;
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }}
'''
https = https[:https.rfind('}')] + admin + https[https.rfind('}'):]
http = '''server {
    listen 80;
    listen [::]:80;
    server_name 35.220.184.100;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/game01/current;
        try_files $uri =404;
    }
    location / { return 308 https://35.220.184.100$request_uri; }
}
'''
site.write_text(http + https)
try:
    subprocess.run(['nginx', '-t'], check=True)
    subprocess.run(['systemctl', 'reload', 'nginx'], check=True)
except Exception:
    site.write_text(original)
    raise
Path('/etc/systemd/system/game01-cert-renew.service').write_text('''[Unit]
Description=Renew game01 IP HTTPS certificate
After=network-online.target
[Service]
Type=oneshot
ExecStart=/opt/certbot-ip/bin/certbot renew --quiet
''')
Path('/etc/systemd/system/game01-cert-renew.timer').write_text('''[Unit]
Description=Check game01 certificate renewal twice daily
[Timer]
OnCalendar=*-*-* 00,12:00:00
RandomizedDelaySec=1800
Persistent=true
[Install]
WantedBy=timers.target
''')
subprocess.run(['systemctl', 'daemon-reload'], check=True)
subprocess.run(['systemctl', 'enable', '--now', 'game01-cert-renew.timer'], check=True)
print('HTTPS and password-protected public administrator route configured.')

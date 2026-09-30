# 访问统计后台

前端继续使用 Nginx 静态托管；统计服务为 Python 3 + Flask + Gunicorn + SQLite。
数据放在 `/var/lib/game01-stats/visits.sqlite3`，不随前端发布切换。

## 统计口径

- 每次打开或刷新游戏页面计一次访问，按服务器获取的 IP 汇总；不代表独立人数。
- 每15秒上报累计可见时长；隐藏标签页暂停，恢复后继续。多标签页相加。
- 关闭时尽力上报；断网、浏览器强制退出或阻止请求可能少计。不能回溯部署前的停留时长。
- 保留最近90天的访问，收到新访问时清理过期记录；备份需另行按相同周期清理。
- 此次新增 IP 收集覆盖原产品规格的“第一版不收集数据”约束。仅收集 IP 和访问时间，不采集游戏操作或身份信息。

## Debian 部署

线上目前已配置公网 IP HTTPS，管理员可使用 `https://35.220.184.100` 加 `STATS_ADMIN_PATH` 直接登录，无需隧道。旧 SSH 隧道方式仍可用。密码保持不变。IP 证书为短期证书，自动续期 timer 为 `game01-cert-renew.timer`；维护时应核对 `systemctl list-timers` 和 `journalctl -u game01-cert-renew.service`。`enable-public-https.py` 是本次从 HTTP 升级的安装脚本，重复运行前必须检查现有配置。

当前线上已于2026-09-30部署，HTTPS 公网入口和 SSH 隧道均可用。执行 `powershell -ExecutionPolicy Bypass -File backend/open-admin.ps1` 打开后台，用户名为 `admin`。本机密码副本为 `.deploy/admin-credentials.local`。管理员路径通过 HTTPS 的 Nginx 代理访问。

先按 DEPLOYMENT_GCP.md 的发布流程构建前端。后台单独安装，不放在公开的网站根目录。

1. 安装 `python3-venv`，将本目录的 `app.py`、`requirements.txt`、`templates/` 上传至 `/opt/game01-stats/`。
2. 创建环境并安装依赖：

```bash
sudo python3 -m venv /opt/game01-stats/.venv
sudo /opt/game01-stats/.venv/bin/pip install -r /opt/game01-stats/requirements.txt
sudo install -d -o www-data -g www-data -m 700 /var/lib/game01-stats
```

3. 用 `python3 -c "import secrets; print(secrets.token_urlsafe(24))"` 分别生成路径和密码。
   用 `sudoedit /etc/game01-stats.env` 写入以下内容（替换占位符，路径至少16个字符，密码至少16个字符）：

```ini
STATS_DB=/var/lib/game01-stats/visits.sqlite3
STATS_ADMIN_PATH=/替换为随机路径
STATS_ADMIN_PASSWORD=替换为随机密码
```

然后 `sudo chmod 600 /etc/game01-stats.env`。不要把此文件或真实密码提交到 Git。

4. 将 `game01-stats.service` 放到 `/etc/systemd/system/`，执行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now game01-stats
sudo systemctl status game01-stats
```

5. 按 `nginx-stats.conf.example` 修改现有 Nginx 配置：添加请求限流 zone、两个精确路径，管理员路径须和环境变量一致。后端只监听本机；Nginx 必须覆盖 X-Real-IP，避免访客伪造 IP。
6. 当前部署文档记录的是 HTTP 地址。必须先为网站配置 HTTPS，才能在公网安全地输入后台密码。没有域名/证书时，可通过 SSH 隧道访问后台测试，不在 HTTP 公网输入密码。
7. `sudo nginx -t` 成功后再 `sudo systemctl reload nginx`。访问 `https://你的域名/随机路径`，用户名 `admin`，密码为上述服务端密码。

## 本地开发

设置三个环境变量（数据库可用默认 `data/visits.sqlite3`），安装 requirements 后，从仓库根目录执行：

```bash
python -m flask --app backend.app run --host 127.0.0.1 --port 8787
```

另一个终端执行 `pnpm dev`。Vite 只代理访客上报；本地后台直接访问 `http://127.0.0.1:8787/随机路径`。

## 验收和运维

打开游戏，等待20秒，刷新后台，确认次数和时长；隐藏游戏20秒后确认不累计隐藏时间。
未带密码的后台请求应返回401，错误路径返回404，重复上报同一累计秒数不得重复加时。
重启统计服务后数据仍应存在。前端发布/回滚均需保留 API 代理和独立统计服务。
使用 SQLite backup API 做一致性备份，不要只复制正在写入的主数据库而遗漏 WAL。
统计接口不可用时游戏仍能正常使用；后台安装完成前的前端上报失败会静默忽略。

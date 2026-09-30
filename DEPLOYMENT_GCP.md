# game01 网页发布说明（Google Cloud）

本文件供后续负责“本地启动”和线上发布的对话使用。以下信息于 **2026-09-30** 在服务器上核对；执行下一次发布前，请重新检查 Git 状态、服务器连接和当前发布目录。

## 当前环境

| 项目 | 当前值 |
| --- | --- |
| 公网地址 | http://35.220.184.100/ |
| 云服务器 | Google Cloud Compute Engine，Debian 12，`asia-east2-c` |
| SSH 用户 | `hk61023` |
| SSH 私钥（仅本机） | `T:\codeX\game01\.ssh\gcp_hk_xftp` |
| 网站根目录 | `/var/www/game01/current`（指向某个独立发布目录的符号链接） |
| 发布目录 | `/var/www/game01/releases/` |
| Nginx 配置 | `/etc/nginx/sites-available/game01` |
| 网站访问日志 | `/var/log/nginx/game01.access.log` |
| 网站错误日志 | `/var/log/nginx/game01.error.log` |
| 最近确认的线上版本 | `/var/www/game01/releases/20260930-153359-e942623`；对应 GitHub `main` 提交 `6b55236` 的构建内容 |

项目是 **React + Vite 纯前端**。`pnpm build` 会生成 `dist/`；服务器仅用 Nginx 提供静态文件，无需长期运行 Vite 或 Node 服务。`dist/` 包含首页、WebP 图片和中文 MP3 语音。当前 Nginx 已设为开机启动，并配置了站内路径回退到 `index.html`。

## 发布前确认

部署上传前同时阅读 [服务器传输优化记录](docs/game01-transfer-tuning-20260930.md)。该次 TCP 调整和工具准备已完成；后续参考现有配置，不重复执行，也不覆盖原始参数备份。

### 新增访问统计服务

同日已升级至 IP HTTPS：`https://35.220.184.100/`。管理员可直接访问 `https://35.220.184.100` 加服务器环境变量 `STATS_ADMIN_PATH`，使用原用户名和密码。HTTP 重定向至 HTTPS，ACME 验证路径仍支持 HTTP。证书路径 `/etc/letsencrypt/live/game01-ip/`，由 `/opt/certbot-ip/bin/certbot` 管理；`game01-cert-renew.timer` 每天检查两次续期，成功后检查并重载 Nginx。之前的 SSH 隧道仍可作为维护入口。配置备份为 `/etc/nginx/sites-available/game01.before-public-https`。

2026-09-30 已部署统计服务，并切换前端至 `/var/www/game01/releases/20260930-stats-72b4cc8`，上一个版本为 `/var/www/game01/releases/20260930-183242-b358a85`。本次为用户授权的工作区直接发布。后台由 `game01-stats.service` 管理，监听 `127.0.0.1:8787`，Nginx 公开统计 API 和受密码保护的 HTTPS 管理员路径。管理员也可通过 SSH 隧道访问，本机端口为 `18787`。运行 `backend/open-admin.ps1` 可重建隧道并打开后台；用户名 `admin`。真实密码保存在服务器 `/etc/game01-stats.env`，本次部署的本机私密副本在被 Git 忽略的 `.deploy/admin-credentials.local`。

仓库已添加独立统计后台，安装和 Nginx 代理配置见 [backend/README.md](backend/README.md)。下文纯静态部署说明描述原部署；仅上传新版 `dist/` 不会启用统计。统计服务和 SQLite 数据目录需要单独安装并持久保留，管理员密码必须通过 HTTPS 或 SSH 隧道使用。

在 `T:\codeX\game01` 工作区确认计划发布的提交已合并到 `main`，且工作区干净。确认 GitHub `main` 已包含该提交；不要从未合并的工作树或旧的 `dist/` 上传。先查看 `package.json` 和 `vite.config.ts`，若项目结构改变，应重新确认发布方式。

Windows PowerShell 示例：

```powershell
git status --short --branch
git rev-parse HEAD
pnpm install --frozen-lockfile
pnpm build
```

构建成功后，检查 `dist/index.html`、`dist/images/`、`dist/audio/voice/` 是否存在。打包 **`dist/` 内的文件**，不要把 `dist` 目录自身套进 ZIP：

```powershell
$releaseId = Get-Date -Format 'yyyyMMdd-HHmmss'
$zipPath = Join-Path $env:TEMP "game01-$releaseId.zip"
Compress-Archive -Path (Join-Path (Get-Location) 'dist\*') -DestinationPath $zipPath -CompressionLevel Optimal
Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath
```

## 上传与切换

本机使用 Windows OpenSSH。私钥不得放入 ZIP、发布目录或 Git 提交。下面以实际生成的 ZIP 名称和 `$releaseId` 替换示例值：

```powershell
$keyPath = 'T:\codeX\game01\.ssh\gcp_hk_xftp'
scp -i $keyPath -o IdentitiesOnly=yes -o BatchMode=yes $zipPath "hk61023@35.220.184.100:/home/hk61023/game01-$releaseId.zip"
ssh -i $keyPath -o IdentitiesOnly=yes -o BatchMode=yes hk61023@35.220.184.100
```

进入服务器后，先用 `sha256sum /home/hk61023/game01-<发布编号>.zip` 和本机 SHA256 核对，再将文件解压到**新的**发布目录。以下命令在服务器的 Bash 中执行；不要直接覆盖 `/var/www/game01/current` 指向的旧目录：

```bash
set -e
release_id=替换为发布编号
release="/var/www/game01/releases/$release_id"
zip="/home/hk61023/game01-$release_id.zip"

sudo mkdir -p "$release"
sudo unzip -q "$zip" -d "$release"
sudo test -f "$release/index.html"
sudo test -f "$release/images/car.webp"
sudo chown -R root:root "$release"
sudo find "$release" -type d -exec chmod 755 {} +
sudo find "$release" -type f -exec chmod 644 {} +
sudo nginx -t

previous=$(readlink -f /var/www/game01/current)
sudo ln -sfnT "$release" /var/www/game01/current
if ! sudo systemctl reload nginx; then
  sudo ln -sfnT "$previous" /var/www/game01/current
  exit 1
fi
readlink -f /var/www/game01/current
```

`sudo nginx -t` 必须成功后才切换。保留上一个发布目录，便于回滚。**不要重启整台服务器**，正常静态版本更新只需切换链接并平滑重载 Nginx。

## 发布验收

从本机检查公网地址、至少一张 WebP 图片和一条中文语音文件是否返回 `200` 与正确类型：

```powershell
curl.exe -I http://35.220.184.100/
curl.exe -I http://35.220.184.100/images/car.webp
curl.exe -I http://35.220.184.100/audio/voice/garden-water-daisy-hint.mp3
```

再用浏览器实际打开首页，进入四宫格中的旅程并点击场景目标，确认图片显示、场景推进和音效。手机语音需要在用户点按后播放；仅凭 HTTP 200 不能证明手机已发声。服务状态与日志：

```bash
systemctl is-active nginx
systemctl is-enabled nginx
sudo tail -n 50 /var/log/nginx/game01.error.log
sudo tail -n 50 /var/log/nginx/game01.access.log
```

当前 Nginx 对 `/assets/` 缓存 30 天（构建文件名带哈希），对 WebP、MP3 等图片与音频缓存 7 天。后续如果同名图片或语音被替换，回访浏览器可能继续显示旧资源；发布验收应使用无痕窗口或清缓存，并为长期更新考虑资源版本化。

## 回滚

若新版本有问题，在服务器把 `current` 指回上一个**已验证**的发布目录，再检查 Nginx 并重载：

```bash
sudo ln -sfnT /var/www/game01/releases/上一个发布目录名 /var/www/game01/current
sudo nginx -t && sudo systemctl reload nginx
readlink -f /var/www/game01/current
```

回滚后重新检查公网首页和资源。不要删除旧发布目录或更改 Nginx/Ops Agent/Guest Agent，除非单独安排维护。

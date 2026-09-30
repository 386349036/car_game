$ErrorActionPreference = 'Stop'
$keyPath = 'T:\codeX\game01\.ssh\gcp_hk_xftp'
$privatePath = (& ssh -i $keyPath -o IdentitiesOnly=yes -o BatchMode=yes hk61023@35.220.184.100 "sudo -n sed -n 's/^STATS_ADMIN_PATH=//p' /etc/game01-stats.env").Trim()
if ($LASTEXITCODE -ne 0 -or !$privatePath.StartsWith('/stats-')) { throw '无法获取后台路径' }
if (!(Test-NetConnection 127.0.0.1 -Port 18787 -InformationLevel Quiet -WarningAction SilentlyContinue)) {
    Start-Process ssh.exe -ArgumentList @('-i', $keyPath, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'ExitOnForwardFailure=yes', '-o', 'ServerAliveInterval=30', '-N', '-L', '127.0.0.1:18787:127.0.0.1:8787', 'hk61023@35.220.184.100') -WindowStyle Hidden
    Start-Sleep -Seconds 3
}
Start-Process "http://127.0.0.1:18787$privatePath"
Write-Host '用户名：admin。密码存于服务器 /etc/game01-stats.env；首次部署本机副本位于 .deploy/admin-credentials.local。'

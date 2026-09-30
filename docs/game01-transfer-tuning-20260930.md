# game01 云服务器文件传输优化记录

- 记录日期：2026-09-30（北京时间）
- 关联工程：game01
- 服务器：Google Cloud 香港节点，Debian 12，e2-small，约 2 GB RAM（依据当前工程上下文）
- 主机名：instance-20260929-064754
- 登录用户：hk61023
- 公网地址：35.220.184.100（当前工程记录地址，后续可能变化）
- 传输场景：本地 Windows 使用 Xftp，经 SFTP 上传文件到云服务器。

## 1. 问题与本次结果

用户反馈原 Xftp 上传速度约为 100～300 KB/s。完成 TCP 缓冲区调整后，用户反馈速度提高至约 1 MB/s。

按上述单位估算，观察到约 3～10 倍提升。该结果属于用户实测反馈，尚未进行同文件、多次重复或 iperf3 对照测试，因此不能将全部提升确定归因于 TCP 参数调整；网络波动及重新建立连接也可能影响结果。

本次已完成：原始参数备份、TCP 参数配置与即时应用、rsync 安装、zstd 安装状态确认。未执行服务器重启。

## 2. 原始参数备份

首次直接运行 `sysctl` 报错：

```text
-bash: sysctl: command not found
```

随后使用完整路径 `/sbin/sysctl` 成功备份。该结果说明命令可用，首次报错符合用户 PATH 未包含命令目录的情况。

执行命令：

```bash
sudo /sbin/sysctl \
  net.core.rmem_max \
  net.core.wmem_max \
  net.ipv4.tcp_rmem \
  net.ipv4.tcp_wmem \
  > ~/tcp-buffer-before.conf

cat ~/tcp-buffer-before.conf
```

已确认备份内容：

```text
net.core.rmem_max = 212992
net.core.wmem_max = 212992
net.ipv4.tcp_rmem = 4096 131072 6291456
net.ipv4.tcp_wmem = 4096 16384 4194304
```

备份路径：`/home/hk61023/tcp-buffer-before.conf`。后续不要用调整后的参数覆盖这份原始备份。

## 3. TCP 缓冲区调整

创建持久化配置：

```bash
sudo tee /etc/sysctl.d/99-transfer-tuning.conf >/dev/null <<'EOF'
net.core.rmem_max = 4194304
net.core.wmem_max = 4194304
net.ipv4.tcp_rmem = 4096 262144 16777216
net.ipv4.tcp_wmem = 4096 262144 33554432
EOF
```

即时应用该文件：

```bash
sudo /sbin/sysctl -p /etc/sysctl.d/99-transfer-tuning.conf
```

实际输出：

```text
net.core.rmem_max = 4194304
net.core.wmem_max = 4194304
net.ipv4.tcp_rmem = 4096 262144 16777216
net.ipv4.tcp_wmem = 4096 262144 33554432
```

参数对照（单位：字节）：

| 参数 | 调整前 | 调整后 |
|---|---|---|
| net.core.rmem_max | 212992 | 4194304 |
| net.core.wmem_max | 212992 | 4194304 |
| net.ipv4.tcp_rmem | 4096 / 131072 / 6291456 | 4096 / 262144 / 16777216 |
| net.ipv4.tcp_wmem | 4096 / 16384 / 4194304 | 4096 / 262144 / 33554432 |

调整目的：扩大 socket 缓冲相关上限及 TCP 自动调节空间，减少高时延传输中缓冲不足对吞吐的限制。这些数值不是立即为每个连接预留的内存量，也不代表可以增加公网线路本身的带宽。TCP 缓冲区与实际在途数据窗口并非同一概念。

配置已在本次运行中生效；文件位于 `/etc/sysctl.d/`，用于系统启动时加载。重启后的最终值尚未核验，可能受其他配置文件覆盖影响。

## 4. rsync 与 zstd 安装

执行命令：

```bash
sudo apt install -y rsync zstd
```

安装日志确认：

| 工具 | 版本 | 结果 |
|---|---|---|
| rsync | 3.2.7-1+deb12u6 | 本次新安装，Setting up 完成 |
| zstd | 1.5.4+dfsg2-5 | 已安装，apt 确认为当前软件源最新版本 |

日志中的以下提示正常：

```text
rsync.service is a disabled or a static unit, not starting it.
```

计划使用 rsync over SSH 时无需启动 rsync 守护服务，也无需为 rsync 另开公网端口。

安装工具不会自动改变 Xftp 的传输方式。本次尚未实际使用 rsync 增量同步、zstd 压缩或 tar 打包，不能将观察到的 Xftp 提速归因于这两个工具。

## 5. 本次变更范围

实际写入或新增内容：

- 原始参数备份：`/home/hk61023/tcp-buffer-before.conf`。
- TCP 配置文件：`/etc/sysctl.d/99-transfer-tuning.conf`。
- 安装软件包：rsync；确认 zstd 已存在。

本次没有记录到 SSH 配置、加密算法、MTU、BBR、云防火墙或网站部署目录的改动。Xftp 并发调整及 iperf3 测试尚未执行。

## 6. 回退方法

在服务器 SSH 终端执行：

```bash
sudo rm /etc/sysctl.d/99-transfer-tuning.conf
sudo /sbin/sysctl -p /home/hk61023/tcp-buffer-before.conf
```

核验恢复值：

```bash
sudo /sbin/sysctl \
  net.core.rmem_max \
  net.core.wmem_max \
  net.ipv4.tcp_rmem \
  net.ipv4.tcp_wmem
```

应与第 2 节原始备份一致。回退 TCP 参数无需卸载 rsync 或 zstd，也无需重启服务器。

## 7. 后续验证与工程建议

1. 使用同一个大文件重复上传两三次，记录时间、文件大小、平均速度及峰值，确认约 1 MB/s 是否稳定。
2. 多文件上传时，可测试 Xftp 4 路并发，比较总吞吐；此项通常不提高单个大文件的速度。
3. 后续工程部署可接入 rsync over SSH，避免重复上传未变化文件；启用删除同步前，先确认目标目录并进行 dry-run。
4. 大量小文件首次上传可考虑 tar 打包；文本资源可结合 zstd 压缩，已压缩的图片、音视频收益可能有限。
5. 若仍需定位瓶颈，再安排 iperf3 单流与多流测试。本次未安装或运行 iperf3，未开放 5201 端口。

当前结论：TCP 参数调整已应用，传输工具准备完成，用户观察到 Xftp 上传速度明显改善；持续性能与具体瓶颈仍需对照测试确认。

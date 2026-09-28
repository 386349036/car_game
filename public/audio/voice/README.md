# 中文语音素材

这些 WAV 文件随游戏一起发布，由 Windows 本地中文语音 `Microsoft Yaoyao` 离线生成。浏览器播放这些文件，不调用运行时语音合成或在线服务。

在安装了对应中文声线的 Windows 设备上，从仓库根目录运行：

```powershell
pwsh -File scripts/generate-voice.ps1
```

需要 PowerShell 7 和可用的 `System.Speech` 中文声线；可通过 `-VoiceName` 指定另一种已安装的 `zh-CN` 声线。脚本中的文字与 `src/game/audio/useGameAudio.ts` 的文件映射须保持一致。更换文字或声线后重新生成全部文件。

新增场景提示：

- `animal-crossing-hint.wav`：小鸭子想过马路，点一点来帮忙。
- `tire-change-hint.wav`：把新轮胎放上去吧。
- `rainy-drive-hint.wav`：下雨啦，点一下雨刷，帮小车看清前面。

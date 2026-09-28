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
- `night-lights-hint.wav`：天黑啦，点一下车灯，照亮前面的路。
- `fuel-stop-hint.wav`：小车要加油啦，点一下加油机。
- `car-wash-hint.wav`：小车身上有点脏，点一点泡泡，洗干净吧。
- `rabbit-feeding-hint.wav`：小兔子饿啦，点一下胡萝卜，送给小兔子。
- `flower-watering-hint.wav`：小花渴啦，点一下水壶，给它浇浇水。
- `home-garage-hint.wav`：到家啦，点一下车库门，小车回家休息。

这六条提示已加入生成脚本。此工作环境目前无法启用 Windows System.Speech 声线，因此 V3 场景暂时播放已随项目提供的“小车出发啦”语音；生成并打包专属 WAV 后，再把对应映射切换到新文件。

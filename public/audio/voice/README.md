# 中文语音素材

游戏使用预先生成并随项目发布的中文 MP3 音频。浏览器播放本地文件，游戏运行时不请求语音服务。

重新生成素材需要 Python 3 和网络连接。生成时，脚本会把通用游戏提示文字发送给 Microsoft Edge 在线语音服务；不需要提交个人信息。

```powershell
python -m pip install edge-tts
python scripts/generate-voice.py
```

默认使用语速稍慢的 `zh-CN-XiaoxiaoNeural` 声线，也可指定另一种中文声线：

```powershell
python scripts/generate-voice.py --voice zh-CN-XiaoxiaoNeural --rate=-8%
```

提示文字在 `scripts/generate-voice.py` 中维护；文件名须与 `src/game/audio/useGameAudio.ts` 中的映射一致。每次运行会重新生成全部提示。

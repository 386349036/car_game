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

提示文字在 `scripts/generate-voice.py` 中维护；文件名须与 `src/game/audio/useGameAudio.ts` 中的映射一致。默认运行会重新生成全部提示。

需要只更新新动物主题的语音时，可通过 `--only` 指定提示文件名，避免重写其余语音：

```powershell
python scripts/generate-voice.py --only kitten-reunion-hint.mp3 bird-nest-hint.mp3 turtle-beach-hint.mp3 lamb-meadow-hint.mp3 elephant-bath-hint.mp3 animal-journey-complete.mp3
```

动物主题有单独的开场、场景提示、互动夸奖和完成语音，均以本地 MP3 播放。可按需只重生成动物主题新增音频：

```powershell
python scripts/generate-voice.py --only animal-journey-start.mp3 animal-scene-complete.mp3 kitten-reunion-hint.mp3 bird-nest-hint.mp3 turtle-beach-hint.mp3 lamb-meadow-hint.mp3 elephant-bath-hint.mp3 animal-journey-complete.mp3
```

# 中文语音素材

2026-10-03：盖被关角色改为小朋友，文字脚本已更新为“给小朋友盖上被子吧。”。2026-10-04 已定向补录并核验，恢复 `life-bear-blanket` 提示映射，实际播放为小朋友盖被子的新文案。

第二页四个主题各有十条场景提示，以及各自的开场、互动夸奖和整轮完成语音，共52条运行时使用的本地 MP3。新增与更新的48条准确文字脚本见 `docs/new-theme-voice-prompts.json`；首关提示沿用既有四条。`*-preview-complete.mp3` 保留为历史素材，完整旅程不再引用。

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

快乐农场与奇妙花园各有十条独立场景提示，也有各自的开场、夸奖和旅程完成语音；所有 MP3 随网站一起本地提供。

七条调整过的关卡提示（谷仓晚安、雏菊浇水、向日葵种植、蝴蝶做客、草莓采摘、铺石路、刺猬进门）已重新生成。两主题的新开场和完成语音使用 `farm-theme-*`、`garden-theme-*` 文件，并已接入播放映射。
# 2026-10-04 乐器提示更新

音乐派对第8–10关已替换为古筝、二胡、八音盒。沿用内部文件名 `music-bear-dance-hint.mp3`、`music-note-score-hint.mp3`、`music-box-goodnight-hint.mp3`，实际内容分别为“点一点古筝，听听小旋律。”“点一点二胡，听听小旋律。”“点一点八音盒，听首晚安歌。”三条已定向重新生成并检查解码，播放映射继续对应原稳定ID。

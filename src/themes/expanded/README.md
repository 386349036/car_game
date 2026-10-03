# 第二页扩展36关

海洋、天空、生活和音乐主题的第2–10关由 `expandedScenes.ts` 维护稳定 ID、标题、提示、无障碍标签、目标位置和素材路径。`ExpandedThemeScene.tsx` 沿用 SceneProps、TapTarget 与 ForgivingDrag，每关只开放一个主要目标。

点击或吸附成功后立即禁用目标，独立动画展示完成反馈；非音乐关正常2.4秒、降低动态效果500毫秒后自动推进。音乐关须完整播放独立6.4秒演奏再推进，静音和降低动态效果也保持时长。完成回调有重复保护，卸载清理计时器和音轨，不依赖 animationend。拖偏温和回弹，Enter或空格将物品送到唯一目标。

素材为随站点发布的本地 WebP，透明目标与配角保留 alpha，每张不超过300,000字节。按场景选用海滩、海底、白天/夜晚天空、洗手台、餐桌、卧室和舞台背景；配角和环境不接受交互。月亮、小熊与音乐盒有对应完成态素材。

各场景有独立反馈：贝壳亮光、螃蟹回窝、章鱼挥手、鲸鱼喷水、风车旋转、洗手冲水、擦桌、整理衣物、乐器演奏和晚安等。音乐关使用本地 WAV 乐器特征音色演奏，文件与创作说明见 public/audio/instruments/README.md；声音关闭时动画和自动推进仍正常。

旅程顺序在 `src/game/flow.ts`，组件路由在 `src/App.tsx`，语音映射在 `src/game/audio/useGameAudio.ts`。准确录音文字在 `scripts/generate-voice.py`；本次48条定向生成脚本另存于 `docs/new-theme-voice-prompts.json`。完整40关设计见 `docs/SECOND_PAGE_THEME_PLAN.md`。

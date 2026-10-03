# 第二页四个首关

四个主题的第1关：贝壳打开啦、热气球出发、拖鞋摆整齐、小鼓咚咚。每关完成后进入同主题第2关，十关结束后显示完整旅程完成页。返回目录保留第二页；品牌入口与刷新回到第一页。

`firstScenes.ts` 维护题名、准确提示与无障碍标签；`FirstThemeScene.tsx` 沿用 SceneProps、TapTarget 和 ForgivingDrag。非音乐关成功后立即禁用目标，2.2秒后仅完成一次；降低动态效果时450毫秒完成。小鼓关完整播放6.4秒演奏，降低动态效果也保持时长。卸载清理计时器与音轨，不依赖 animationend。

本地素材由 imagegen 生成，保存在 `public/images/themes/{ocean,sky,life,music}/`：每主题一个独立背景和一个透明交互图层；海洋额外有打开贝壳与珍珠完成态。透明 WebP 保留 alpha，每张不得超过300,000字节，封面位于原 upcoming 目录。背景中央不含重复的操作目标。

- 海洋：点闭合贝壳，切换到同款打开贝壳与珍珠。
- 天空：点气球篮的宽大区域，完整热气球缓慢升起。
- 生活：将拖鞋拖到固定拖鞋左侧虚线区域，宽容吸附并排；拖偏会回弹，Enter或空格也可完成。固定拖鞋与拖动层使用同一素材保持一致。
- 音乐：点小鼓，鼓面弹动、音符反馈，播放独立6.4秒低鼓演奏，结束后进入铃铛关。降低动态效果不缩短演奏。音效遵守 effectsEnabled，语音遵守 voiceEnabled，背景音乐遵守 musicEnabled；完全静音仍等待同样时长再完成。

四个主题各有十条提示及开场、夸奖、整轮完成 MP3，文案同步维护在 scripts/generate-voice.py，映射维护在 useGameAudio.ts。定向生成使用 --only，不重写无关语音。入口真实点击解锁移动端音频，播放失败不会阻断游戏。

其余36关见 ../expanded/README.md；完整设计见 docs/SECOND_PAGE_THEME_PLAN.md。

# 新主题40关背景检查与替换

2026-10-03：逐关检查场景截图、主体位置、操作区域及手机裁切。35关重新生成独立背景，5关保留近期已修正且符合情境的背景。40关使用39张不同的起始背景；洗手与擦手连续发生在同一洗手池，有意共享背景。睡觉完成后仍切换盖好被子的图片。

使用内置 imagegen 生成，统一温柔儿童水彩风。将细节集中在环境边缘，中心为唯一点击或拖动目标留空间；背景中不绘制另一个可操作主体。贝壳背景二次编辑移除误生成的珍珠贝壳；阅读角二次编辑提高地板起点，使大书架落在地面。完整原始提示见 [生成清单](BACKGROUND_AUDIT_40_SCENES.json)。

主要问题：海底5关、天空7关、生活玄关4关与餐桌3关、音乐舞台9关分别反复共用通用背景，场景之间缺少变化。新的潮池、深水区、海湾、云海、山谷、卧室、洗衣间、阅读角及各乐器舞台对应实际章节。已修正的鲸鱼海面、风车草地、顶视洗手池与儿童床铺继续保留。

| 主题 / 场景 | 原背景 | 当前背景 | 处理 |
| --- | --- | --- | --- |
| 贝壳打开啦 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-shell-pearl-bg.webp) | 重新绘制，独立场景背景 |
| 小螃蟹回沙窝 | `shore-bg` | [图片](../public/images/themes/ocean/ocean-crab-home-bg.webp) | 重新绘制，独立场景背景 |
| 给寄居蟹新家 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-hermit-shell-bg.webp) | 重新绘制，独立场景背景 |
| 小海星翻个身 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-starfish-turn-bg.webp) | 重新绘制，独立场景背景 |
| 小章鱼打招呼 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-octopus-wave-bg.webp) | 重新绘制，独立场景背景 |
| 水母亮起来 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-jellyfish-glow-bg.webp) | 重新绘制，独立场景背景 |
| 小鲸鱼喷水 | `sea-surface-bg` | [图片](../public/images/themes/ocean/sea-surface-bg.webp) | 保留已修正背景 |
| 小海豹玩皮球 | `shore-bg` | [图片](../public/images/themes/ocean/ocean-seal-ball-bg.webp) | 重新绘制，独立场景背景 |
| 珊瑚小屋开门 | `ocean-bg` | [图片](../public/images/themes/ocean/ocean-coral-door-bg.webp) | 重新绘制，独立场景背景 |
| 海底朋友晚安 | `night-bg` | [图片](../public/images/themes/ocean/ocean-shell-goodnight-bg.webp) | 重新绘制，独立场景背景 |
| 热气球出发 | `sky-bg` | [图片](../public/images/themes/sky/sky-balloon-launch-bg.webp) | 重新绘制，独立场景背景 |
| 云朵让让路 | `sky-bg` | [图片](../public/images/themes/sky/sky-cloud-clear-bg.webp) | 重新绘制，独立场景背景 |
| 小太阳露脸 | `sky-bg` | [图片](../public/images/themes/sky/sky-sun-hello-bg.webp) | 重新绘制，独立场景背景 |
| 云朵小火车 | `sky-bg` | [图片](../public/images/themes/sky/sky-cloud-train-bg.webp) | 重新绘制，独立场景背景 |
| 彩虹连起来 | `sky-bg` | [图片](../public/images/themes/sky/sky-rainbow-bridge-bg.webp) | 重新绘制，独立场景背景 |
| 送一封天空信 | `sky-bg` | [图片](../public/images/themes/sky/sky-airship-letter-bg.webp) | 重新绘制，独立场景背景 |
| 小雨云下雨 | `sky-bg` | [图片](../public/images/themes/sky/sky-rain-cloud-bg.webp) | 重新绘制，独立场景背景 |
| 风车转起来 | `windmill-meadow-bg` | [图片](../public/images/themes/sky/windmill-meadow-bg.webp) | 保留已修正背景 |
| 星星回天空 | `night-bg` | [图片](../public/images/themes/sky/sky-star-home-bg.webp) | 重新绘制，独立场景背景 |
| 月亮盖云被 | `night-bg` | [图片](../public/images/themes/sky/sky-moon-blanket-bg.webp) | 重新绘制，独立场景背景 |
| 拖鞋摆整齐 | `life-bg` | [图片](../public/images/themes/life/life-slippers-pair-bg.webp) | 重新绘制，独立场景背景 |
| 泡泡洗小手 | `wash-overhead-bg` | [图片](../public/images/themes/life/wash-overhead-bg.webp) | 保留已修正背景（洗手与擦手保持同一地点） |
| 毛巾擦擦手 | `wash-overhead-bg` | [图片](../public/images/themes/life/wash-overhead-bg.webp) | 保留已修正背景（洗手与擦手保持同一地点） |
| 小熊戴围兜 | `table-bg` | [图片](../public/images/themes/life/life-bear-bib-bg.webp) | 重新绘制，独立场景背景 |
| 早餐摆勺子 | `table-bg` | [图片](../public/images/themes/life/life-breakfast-spoon-bg.webp) | 重新绘制，独立场景背景 |
| 纸巾擦桌子 | `table-bg` | [图片](../public/images/themes/life/life-wipe-table-bg.webp) | 重新绘制，独立场景背景 |
| 袜子进篮子 | `life-bg` | [图片](../public/images/themes/life/life-socks-basket-bg.webp) | 重新绘制，独立场景背景 |
| 挂好小外套 | `life-bg` | [图片](../public/images/themes/life/life-hang-coat-bg.webp) | 重新绘制，独立场景背景 |
| 图画书回书架 | `life-bg` | [图片](../public/images/themes/life/life-book-shelf-bg.webp) | 重新绘制，独立场景背景 |
| 小朋友盖被子 | `child-bed-uncovered` | [图片](../public/images/themes/life/child-bed-uncovered.webp) | 保留已修正背景 |
| 小鼓咚咚 | `music-bg` | [图片](../public/images/themes/music/music-soft-drum-bg.webp) | 重新绘制，独立场景背景 |
| 铃铛叮叮 | `music-bg` | [图片](../public/images/themes/music/music-bell-ring-bg.webp) | 重新绘制，独立场景背景 |
| 沙锤沙沙 | `music-bg` | [图片](../public/images/themes/music/music-shaker-bg.webp) | 重新绘制，独立场景背景 |
| 木琴小旋律 | `music-bg` | [图片](../public/images/themes/music/music-xylophone-bg.webp) | 重新绘制，独立场景背景 |
| 拨一下琴弦 | `music-bg` | [图片](../public/images/themes/music/music-pluck-string-bg.webp) | 重新绘制，独立场景背景 |
| 小号唱歌 | `music-bg` | [图片](../public/images/themes/music/music-trumpet-bg.webp) | 重新绘制，独立场景背景 |
| 手风琴伸伸腰 | `music-bg` | [图片](../public/images/themes/music/music-accordion-bg.webp) | 重新绘制，独立场景背景 |
| 小熊跳个舞 | `music-bg` | [图片](../public/images/themes/music/music-bear-dance-bg.webp) | 重新绘制，独立场景背景 |
| 音符回乐谱 | `music-bg` | [图片](../public/images/themes/music/music-note-score-bg.webp) | 重新绘制，独立场景背景 |
| 音乐盒晚安 | `night-bg` | [图片](../public/images/themes/music/music-box-goodnight-bg.webp) | 重新绘制，独立场景背景 |

素材位置：`public/images/themes/{ocean,sky,life,music}/`。35张新WebP均可解码、内容不同且低于300,000字节，源资源与构建产物一致。

验证：桌面40关逐关截图与键盘推进；320px手机及768px平板共80次完整检查，包含点击、实际拖动、键盘吸附、重复触发禁用、自动推进、降低动态效果及音乐6.4秒时长。阅读角最终补图后另验1024/320/768px。TypeScript/生产构建通过，lint仅保留已有3条警告；未修改音频、统计服务，未提交、推送或部署。

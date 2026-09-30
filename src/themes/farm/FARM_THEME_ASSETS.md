# 快乐农场场景素材

本主题使用本地 PNG 背景 `public/images/themes/farm/`。十个主操作物体另以 imagegen 生成透明素材，分别保存在 `public/images/interactive/farm-*.webp`。组件把独立物体放在宽容的点按区内，点击后物体移动、缩放或发光，背景提供故事环境。画面沿用暖色绘本水彩、圆润角色、暖棕描边与柔和纸纹；插画本身不含文字、标志或水印。

## 文件与画面焦点

| 场景 | PNG | 点按目标 | 目标中心（桌面 / 窄屏） |
| --- | --- | --- | --- |
| 给奶牛喂干草 | `farm-feed-cow.webp` | 奶牛嘴边的大捆干草 | 64%, 83% / 77%, 78% |
| 收鸡蛋啦 | `farm-egg-basket.webp` 背景、`farm-single-egg.webp` 独立透明鸡蛋 | 点击左侧鸡蛋，落入中部篮子 | 36%, 54% / 35%, 54% |
| 给小猪洗澡 | `farm-pig-bath.webp` | 小猪旁的大海绵 | 67%, 58% / 83%, 57% |
| 摘苹果装篮 | `farm-apple-picking.webp` | 树上正中的大红苹果 | 49%, 28% / 49%, 31% |
| 种下一粒种子 | `farm-seed-planting-empty.webp` 无种子背景、`farm-seed-soil-cover.webp` 透明泥土 | 点击种子后落进土坑，泥土随后覆盖 | 51%, 54% / 51%, 53% |
| 帮绵羊梳梳毛 | `farm-sheep-brushing.webp` | 绵羊身上的大木刷子 | 69%, 60% / 87%, 58% |
| 南瓜装上拖拉机 | `farm-pumpkin-tractor-empty.webp` 空车斗背景，`public/images/interactive/farm-pumpkin-tractor.webp` 独立南瓜 | 南瓜起点在地面，点击后跳进车斗 | 24%, 83% / 25%, 83% |
| 给小水槽添水 | `farm-fill-trough-empty.webp` 无水桶背景、`farm-water-pour.webp` 透明水流、独立蓝色水桶 | 点击右上角水桶后倾斜，水流落进水槽 | 77%, 39% / 77%, 39% |
| 拔出胡萝卜 | `farm-carrot-harvest-empty.webp` 无胡萝卜背景、独立胡萝卜素材 | 中间土坑露出叶子，点击后拔出并落在右侧地面 | 50%, 70% / 50%, 66% |
| 农场朋友晚安 | `farm-barn-goodnight-closed.webp`、`farm-barn-goodnight-open.webp`、`farm-barn-goodnight-inside.webp` | 正中的谷仓大门；点击后门打开，动物进入谷仓 | 50%, 63% / 50%, 62% |

桌面定位已补偿横向宽屏容器裁切的上下边缘；窄屏定位已补偿正方形容器的左右裁切。目标宽高保持约画布的 24–41%，方便小手点按，也不要求精确瞄准。提示文案、无障碍名称与图中实际目标保持一致。

## 图像生成提示词

### `farm-feed-cow.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a cheerful farmyard scene about feeding a friendly cow a bundle of hay
Scene/backdrop: sunny green farm pasture beside a simple red barn, soft blue sky, a few clouds, low fence and distant rounded hills
Subject: one large gentle cream-and-brown dairy cow leaning toward a bright golden hay bundle; the cow and hay are the clear story focal point, with the hay bundle directly in front of the cow
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, expressive kind eyes, warm brown hand-painted outlines, gentle paper texture; visually consistent with the supplied project's cute yellow cartoon car style, not photorealistic
Composition/framing: wide landscape composition, whole environment visible; cow and hay placed together in the center-middle and lower half, occupying about half the frame; keep the top fifth visually simple and open for UI text; keep the focal interaction fully inside the frame with room around it
Lighting/mood: soft sunny morning light, safe, calm, happy
Color palette: fresh pasture green, sky blue, warm yellow hay, cream, soft red barn, warm brown outlines
Constraints: one complete coherent scene; no car; no text, letters, signs, logo, watermark, border, extra foreground characters, or cropped main subject
Avoid: complex clutter, tiny focal objects, realistic photography
```

### `farm-egg-basket.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a gentle farm scene about gathering fresh eggs into a basket
Scene/backdrop: cozy wooden chicken coop with straw nest boxes, a small sunny yard visible through the open coop, soft blue sky and rounded green pasture
Subject: one large woven basket with several clean cream-colored eggs, placed directly below a few friendly hens; make the basket and eggs the unmistakable focal point
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, kind animal expressions, warm brown hand-painted outlines, gentle paper texture, matching the project's bright cute illustrated farm style
Composition/framing: wide landscape full scene; the egg basket centered around the middle and lower half, large and fully visible, occupying about one-third of the frame; hens nearby but secondary; keep the top fifth calm and uncluttered for interface text
Lighting/mood: warm morning sunlight, peaceful and joyful
Color palette: honey wood, straw gold, creamy eggs, leafy greens, soft sky blue, warm brown outlines
Constraints: one coherent scene; no car; no words, letters, signs, logo, watermark, border, tiny basket, or cropped focal objects
Avoid: photorealism, cluttered coop, many extra animals
```

### `farm-pig-bath.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a happy little pink pig getting a gentle bath in a farm wash tub
Scene/backdrop: clean farmyard washing corner with a shallow round wooden tub, soft green grass, a low fence, a red barn far behind and a few light blue bubbles
Subject: one friendly pink pig smiling in the tub and one oversized yellow bath sponge right beside the pig, clearly recognizable and directly associated with washing; place pig and sponge together as the dominant focal group
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, kind eyes, warm brown hand-painted outlines, gentle paper texture, matching the project's cheerful farm illustration style
Composition/framing: wide landscape full scene; pig and sponge form one large focal group centered in the middle-lower area, fully visible and occupying about half the frame; top fifth stays simple and open for interface text
Lighting/mood: bright gentle daylight, clean, safe, playful
Color palette: soft pink, pale aqua bubbles, warm honey wood, fresh greens, sky blue and warm brown outlines
Constraints: one coherent scene; no car; no text, letters, signs, logo, watermark, border, cropped pig, or tiny sponge
Avoid: photorealism, harsh scrubbing, clutter, extra animals
```

### `farm-apple-picking.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a joyful orchard harvest where shiny red apples are picked and collected into a basket
Scene/backdrop: sunny little farm orchard with a leafy apple tree, soft green grass, a low wooden fence and distant rolling hills
Subject: a large bright red apple hanging low from the tree directly above an open wicker basket that already holds a few apples; apple and basket together make one unmistakable interactive focal group
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, warm brown hand-painted outlines, gentle paper texture, bright soft colors consistent with a preschool farm storybook
Composition/framing: wide landscape full scene; main low-hanging apple and large basket centered in the middle-lower area and fully visible, occupying about one-third of the frame; open simple upper area for interface text
Lighting/mood: warm gentle afternoon sunshine, cheerful and calm
Color palette: leafy greens, vivid apple red, straw gold basket, blue sky, warm brown outlines
Constraints: one coherent scene; no car; no text, letters, signs, logo, watermark, border, tiny apples, or cropped focal object
Avoid: photorealism, cluttered orchard, extra people or animals
```

### `farm-seed-planting.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: planting one seed in a cozy farm vegetable patch
Scene/backdrop: a sunny garden bed on a small farm, soft green grass, simple wooden border, watering can resting in the distance and rounded hills beyond
Subject: one large golden-brown bean seed placed right above a clear soft dark planting hole in a mound of rich soil; this oversized seed and planting spot are the only main focal point
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, warm brown hand-painted outlines, gentle paper texture, bright soft colors in a cute preschool storybook style
Composition/framing: wide landscape full scene; oversized seed and soil planting spot centered in the middle-lower area, fully visible and easy to recognize, occupying about one-third of the frame; keep upper fifth open for interface text
Lighting/mood: warm spring daylight, hopeful and peaceful
Color palette: garden greens, warm cocoa soil, golden seed, soft blue sky, warm brown outlines
Constraints: one coherent scene; no car; no text, letters, labels, logo, watermark, border, tiny seed, hands, or cropped focal object
Avoid: photorealism, busy rows, clutter, extra characters
```

### `farm-sheep-brushing.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: helping a fluffy white sheep enjoy a gentle brushing at a small farm meadow
Scene/backdrop: sunny green farm pasture with a low wooden fence, rounded hills and a few tiny flowers
Subject: one large smiling cream-white sheep with soft curly wool; an oversized friendly wooden-handled grooming brush rests against the sheep's wool, clearly visible and close to its side; sheep and brush form one simple focal group
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly animal proportions, kind expressive eyes, warm brown hand-painted outlines, gentle paper texture, bright soft colors matching a cozy preschool farm storybook
Composition/framing: wide landscape full scene; sheep and large brush centered in the middle-lower area, fully visible and easy to tap, occupying about half the frame; keep top fifth open and simple for interface text
Lighting/mood: gentle sunny morning light, calm and caring
Color palette: cream wool, warm wood, fresh green meadow, soft blue sky, warm brown outlines
Constraints: one coherent scene; no car; no text, letters, signs, logo, watermark, border, tiny brush, cropped sheep, or extra foreground animals
Avoid: photorealism, sharp bristles, clutter, distressed expressions
```

### `farm-pumpkin-tractor.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a cheerful little farm tractor carrying one giant pumpkin ready for harvest
Scene/backdrop: sunny pumpkin patch beside a red barn, a few green vines and rounded hills under a clear sky
Subject: a friendly small red tractor with one oversized bright orange pumpkin already sitting securely on its trailer; keep tractor and pumpkin together as the large obvious focal group
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly shapes, gentle expressive face on the tractor, warm brown hand-painted outlines, light paper texture, bright colors matching a cozy preschool farm storybook
Composition/framing: wide landscape full scene; tractor with giant pumpkin centered in the middle-lower half, entirely inside the frame and occupying about half of it; leave the top fifth visually open for interface text
Lighting/mood: warm sunny daylight, proud and playful
Color palette: pumpkin orange, leafy green, cheerful red tractor, soft blue sky, warm brown outlines
Constraints: one coherent scene; no other vehicle; no text, letters, numbers, signs, logos, watermark, border, tiny pumpkin, or cropped tractor
Avoid: photorealism, danger, smoke, complex machinery, extra people or animals
```

### `farm-fill-trough.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: filling a farm water trough with fresh water
Scene/backdrop: a peaceful farm pasture with a low fence, green grass, a small red barn and soft rolling hills
Subject: one large wooden water trough in the foreground and one oversized shiny metal pail tilted beside it, a clear gentle stream of blue water pouring into the trough; pail, water and trough form a single obvious focal group
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly shapes, warm brown hand-painted outlines, light paper texture, bright soft colors in a cozy preschool farm style
Composition/framing: wide landscape full scene; trough and large pail centered in the middle-lower area, fully visible and occupying about half of the frame; keep the top fifth calm and open for interface text
Lighting/mood: soft sunny daylight, refreshing and caring
Color palette: fresh grass green, sky blue, pale aqua water, warm honey wood, silver-gray pail, warm brown outlines
Constraints: one coherent scene; no car; no text, letters, signs, logo, watermark, border, tiny pail, or cropped focal group
Avoid: photorealism, clutter, spills that look dangerous, extra people or animals
```

### `farm-carrot-harvest.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: pulling one big orange carrot from a farm vegetable patch
Scene/backdrop: a sunny farm garden with soft green leaves, rich brown soil, a simple low wooden border and distant rounded green hills
Subject: one very large bright orange carrot partly above the soil in the foreground, with a full leafy green top that is easy to recognize and grasp visually; make this carrot the dominant focal point
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly shapes, warm brown hand-painted outlines, gentle paper texture, bright soft colors in a preschool storybook style
Composition/framing: wide landscape full scene; big carrot centered in the middle-lower area, fully inside the frame, occupying about one-quarter of the image; leave top fifth open and calm for interface text
Lighting/mood: warm sunny daylight, satisfying and cheerful
Color palette: carrot orange, leafy greens, cocoa-brown soil, sky blue, warm brown outlines
Constraints: one coherent scene; no car; no text, labels, numbers, logo, watermark, border, tiny carrot, hands, or cropped focal object
Avoid: photorealism, clutter, sharp gardening tools, extra characters or vegetables competing with the carrot
```

### `farm-barn-goodnight.webp`

```text
Use case: illustration-story
Asset type: horizontal full-scene background illustration for a preschool web game
Primary request: a peaceful bedtime moment for farm friends at their cozy barn
Scene/backdrop: a red wooden barn at gentle blue twilight, a few soft stars and a round moon above, quiet green meadow and rolling hills in the distance
Subject: one large warmly lit open barn doorway with friendly farm animals resting safely inside, visible as a cozy grouped scene; a softly glowing golden lantern beside the wide doorway is the clear tap target
Style/medium: soft warm children's picture-book watercolor illustration, rounded friendly forms, warm brown hand-painted outlines, gentle paper texture; cozy, safe and tender, consistent with a preschool farm storybook
Composition/framing: wide landscape full scene; barn doorway and glowing lantern centered in the middle-lower area, large and fully visible; animals remain clearly inside the barn; keep top fifth calm for interface text
Lighting/mood: blue twilight outside, warm amber light inside, sleepy and comforting
Color palette: muted indigo-blue sky, warm crimson barn, golden lantern glow, soft meadow green, warm brown outlines
Constraints: one coherent scene; no car; no text, letters, signs, logo, watermark, border, scary darkness, cropped door or animals outside the barn
Avoid: photorealism, ominous shadows, busy night sky, extra characters
```

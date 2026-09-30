# 奇妙花园主题素材

十个主操作物体另以 imagegen 生成透明 PNG，保存在 `public/images/interactive/garden-*.webp`。组件将它们叠放在场景图前方，点击后物体移动、缩放或发光，提供可见的动作反馈。

本主题场景插画由 Codex 内置 `image_gen.imagegen` 生成。需要主体运动的关卡使用不含该主体的新版背景，目标则使用独立透明 PNG；页面为主体添加移动或旋转动作。所有插画为本地 PNG，不依赖远程图片服务。

## 图片、交互与目标位置

目标位置和尺寸使用场景容器百分比；`x`、`y` 表示按钮中心。手机布局使用方形场景，背景图以 `object-fit: cover` 显示，目标仍保持宽大且可点。

| 场景 ID | 插画路径 | 单次点按目标 | 画面中的目标覆盖位置（中心 x/y，宽×高） |
| --- | --- | --- | --- |
| `garden-water-daisy` | `public/images/themes/garden/garden-water-daisy.webp` | 点花旁的小水壶，倾斜向花朵洒水 | 66% / 79%，19% × 20% |
| `garden-plant-sunflower` | `public/images/themes/garden/garden-plant-sunflower-empty.webp` | 点土堆旁的独立种子，种进土里并盖好泥土 | 68% / 76%，17% × 19% |
| `garden-butterfly-flower` | `public/images/themes/garden/garden-butterfly-flower-empty.webp` | 点左侧独立蝴蝶，飞向花心 | 30% / 58%，22% × 25% |
| `garden-pick-strawberry` | `public/images/themes/garden/garden-pick-strawberry-empty.webp` | 点中央独立红草莓，落进左侧篮子 | 53% / 72%，34% × 32% |
| `garden-sweep-leaves` | `public/images/themes/garden/garden-sweep-leaves.webp` | 点独立扫帚，围绕背景落叶堆清扫约 3 秒 | 52% / 76%，42% × 29% |
| `garden-stone-path` | `public/images/themes/garden/garden-stone-path-empty.webp` | 点中间独立踏脚石，落下并轻轻弹跳 | 50% / 71%，39% × 29% |
| `garden-gate-hedgehog` | `public/images/themes/garden/garden-gate-hedgehog-empty.webp`、`garden-gate-hedgehog-open.webp` | 点中央绿色小门，轻抖后切换到门开背景 | 48% / 68%，31% × 37% |
| `garden-light-lantern` | `public/images/themes/garden/garden-light-lantern.webp`、`garden-light-lantern-bright.webp` | 点未亮的灯笼，切换亮灯素材并照亮小路 | 49% / 63%，23% × 38% |
| `garden-dandelion-wish` | `public/images/themes/garden/garden-dandelion-wish-empty.webp` | 点独立蒲公英，八枚绒毛向不同方向飞散 | 49% / 59%，43% × 55% |
| `garden-snail-lettuce` | `public/images/themes/garden/garden-snail-lettuce.webp` | 点生菜旁的小蜗牛，出现嫩叶色粒子 | 49% / 72%，48% × 35% |

目标只接受一次宽容点按，没有错误对象、分数或倒计时。目标提示由宿主的 `hintVisible` 驱动；扫落叶关的动作持续约 3 秒，其余关卡约 1.7 秒，然后经过约 1.15 秒温和庆祝调用 `onComplete`。定时器会在组件卸载时清除；减少动态效应偏好下仍会使用短时定时器完成流程。

蒲公英关使用一张不含蒲公英及预画飞散绒毛的背景。点击主体后，页面重复使用 `public/images/interactive/garden-dandelion-seed.webp` 展示八枚向不同方向飘动的独立绒毛。

## 图片生成提示

### `garden-water-daisy.webp`

互动水壶位于雏菊右侧，点击后倾斜并向花朵方向洒水。水壶使用本地 PNG，水滴由页面动画呈现。


```text
Use case: illustration-story
Asset type: full-screen background illustration for one scene in a preschool web game
Primary request: a happy garden scene where a child helps water a little daisy
Scene/backdrop: a sunny storybook garden with soft green grass, distant rolling garden beds, a few rounded shrubs and tiny flowers; keep the upper quarter calm and uncluttered for interface prompts
Subject: one large, cheerful white daisy with a warm yellow center, clearly the main interactive subject; a simple small watering can beside it is secondary
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent with a calm preschool game
Composition/framing: wide horizontal landscape, complete scene, daisy centered horizontally and placed in the lower-middle area, large and instantly recognizable; preserve open sky and simple shapes around the top for prompt text
Lighting/mood: bright gentle morning sunlight, reassuring and joyful
Color palette: soft natural greens, sky blue, cream white, sunny yellow, warm earth browns
Constraints: no text, no letters, no logo, no watermark, no frame; single clear focal subject; no tiny important objects; child-friendly, no sharp or scary details
```

### `garden-plant-sunflower.webp`

实际游戏使用 `garden-plant-sunflower-empty.webp` 作为背景：土堆里没有预先画好的种子和新芽。独立种子使用 `public/images/interactive/garden-plant-sunflower.webp`，点击后落进中央土坑，接着出现泥土覆盖动画。

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: a child plants one big sunflower seed in the garden
Scene/backdrop: a warm sunny garden patch with soft green leaves, small garden beds, a few rounded bushes and an uncluttered blue sky above
Subject: one oversized, clearly visible brown sunflower seed resting in a small mound of dark soft soil, centered low in the composition; a child’s mitten-sized hand gently points toward it from the side, secondary; a tiny green sprout nearby is okay but the seed remains the clear focal target
Style/medium: soft watercolor and gouache children’s picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; the seed and soil mound are large in the lower-middle center, occupying roughly one third of the image width; leave the upper quarter open and uncluttered for prompts
Lighting/mood: gentle morning sun, safe, hopeful, cheerful
Color palette: natural greens, sky blue, warm soil browns, small sunny yellow accents
Constraints: no text, letters, logo, watermark, frame; only one clear primary target; no sharp tools or scary details
```

### `garden-butterfly-flower.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: a friendly butterfly visiting one big flower in a peaceful garden
Scene/backdrop: a sunny garden with a pale blue open sky, soft rolling green beds, low rounded plants and a few tiny flowers; keep the upper quarter calm for interface prompts
Subject: one large coral-and-yellow butterfly gently resting on the petals of one oversized pink garden flower; the butterfly and flower form one unmistakable central-lower focal subject
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly shapes, warm brown hand-drawn outlines, light paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; main flower centered horizontally in lower-middle, large and clearly visible; butterfly clearly visible on the flower; leave open uncluttered space above
Lighting/mood: soft golden morning light, calm, welcoming and joyful
Color palette: garden greens, sky blue, pink petals, soft coral, butter yellow, warm browns
Constraints: no text, letters, logo, watermark, border; no other insects; no sharp or scary details; one clear main subject
```

### `garden-pick-strawberry.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: picking one ripe red strawberry in a friendly garden
Scene/backdrop: a sunny berry patch in a small garden with soft green leaves, faint fence and gentle blue sky, simple background and calm upper quarter for prompt text
Subject: one very large bright red strawberry with small pale yellow seeds, still attached to a low leafy plant, centered in the lower-middle foreground; a small woven basket sits nearby as a quiet secondary detail
Style/medium: soft watercolor and gouache children’s picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; the strawberry is the clear large focal target in the center-lower area, occupying about one quarter of image width; preserve simple open space above
Lighting/mood: soft warm sunshine, inviting and cheerful
Color palette: leafy natural greens, strawberry red, cream highlights, warm basket tan, sky blue
Constraints: no text, letters, logo, watermark, border; only one oversized strawberry is the main target; no sharp tools, no scary details
```

### `garden-sweep-leaves.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: a child gently sweeps fallen autumn leaves into one neat pile in a garden
Scene/backdrop: a quiet garden path with soft green hedges, a small fence and a pale blue sky; keep the upper quarter simple and open for prompt text
Subject: one large colorful pile of golden, orange and soft red leaves centered in the lower-middle foreground; a rounded child-sized broom rests beside the pile as a secondary prop, its bristles visible
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded forms, warm brown outlines, light paper texture, consistent gentle preschool-game art
Composition/framing: wide horizontal complete scene, pile of leaves is a broad obvious focal target near bottom-center, approximately one third of image width; uncluttered sky and distant greenery above
Lighting/mood: mild autumn sunshine, cozy and content
Color palette: soft natural greens, golden yellow, orange, muted red, warm brown and sky blue
Constraints: no text, letters, logos, watermark, border; no other main actions; no sharp tools or scary details
```

### `garden-stone-path.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: placing one big stepping stone to finish a little garden path
Scene/backdrop: a peaceful garden with soft grass, round bushes and a narrow path leading into the distance; pale blue open sky and uncluttered top quarter for prompt text
Subject: one large smooth, round pale tan stepping stone resting just above a small clear gap in the path, centered in the lower-middle foreground; a few other stones form a simple path around it, but the loose stone is the obvious interactive target
Style/medium: soft watercolor and gouache children’s picture-book illustration, rounded forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; loose stone is large and centered low, with the small path gap visible directly beneath it; maintain open prompt space above
Lighting/mood: warm gentle daylight, tidy and satisfying
Color palette: soft greens, sandy stone beige, warm brown edges, light blue sky
Constraints: no text, letters, logo, watermark, border; no tools or extra action; one clear focal stone; no sharp or scary details
```

### `garden-gate-hedgehog.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: opening a small garden gate to welcome a hedgehog friend
Scene/backdrop: a peaceful garden entrance with leafy rounded hedges, colorful tiny flowers and a soft path; keep blue sky and top quarter uncluttered for prompt text
Subject: one broad little wooden garden gate in the center-lower foreground, clearly closed but friendly and easy to recognize; a small smiling hedgehog waits beside the gate, visible but secondary, facing toward the garden
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; gate is the clear main interaction target centered horizontally and low in the scene, hedgehog near its base; open simple prompt space above
Lighting/mood: gentle afternoon sunlight, welcoming and safe
Color palette: soft leafy greens, warm wooden tan, earthy brown hedgehog, muted flower colors, pale sky blue
Constraints: no text, letters, logo, watermark, border; no sharp spikes emphasized; no scary details; one obvious gate target
```

### `garden-light-lantern.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: lighting one cozy lantern on a garden path at dusk
Scene/backdrop: a peaceful blue evening garden with soft leafy bushes, a curved path, a few tiny flowers and a gentle twilight sky; keep the top quarter uncluttered for prompt text
Subject: one large, unlit, child-safe garden lantern hanging from a short rounded wooden post, centered in the lower-middle foreground; its glass chamber and simple handle are clearly visible and make it the single obvious target
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; lantern large and centered low, no other lanterns; open dusk sky and simple shapes above
Lighting/mood: soothing twilight blue with warm amber glow-ready lantern, cozy and reassuring, no darkness or fear
Color palette: twilight blue, soft green, warm wood, amber and cream accents
Constraints: no text, letters, logo, watermark, border; no candles, flames, electricity wires, scary details, or sharp shapes
```

### `garden-dandelion-wish.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: gently blowing a dandelion wish and sending its soft seeds drifting
Scene/backdrop: a dreamy but bright garden meadow with low rounded green plants, a few tiny flowers and pale open sky; keep the upper quarter calm and clear for prompt text
Subject: one very large white fluffy dandelion seed head on a green stem, centered in the lower-middle foreground; a few loose soft white seeds float gently to one side, making the dandelion the unmistakable main tap target
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; dandelion head is large, centered horizontally and low enough for an easy wide tap area; open space above for prompt text
Lighting/mood: warm afternoon light, gentle, magical but calm
Color palette: soft leaf greens, creamy white, pale sky blue, warm yellow accents
Constraints: no text, letters, logo, watermark, border; no face required; no sharp or scary details; no storm or blowing wind
```

### `garden-snail-lettuce.webp`

```text
Use case: illustration-story
Asset type: full-screen background illustration for a preschool web game garden scene
Primary request: a tiny friendly snail enjoying a crisp lettuce leaf in a garden
Scene/backdrop: a bright quiet vegetable garden with soft grass, leafy beds, distant rounded shrubs and an open pale blue sky; keep the top quarter uncluttered for prompt text
Subject: one big smiling pale-green lettuce head beside a cute small snail with a rounded warm brown shell and gentle eyes; place them together as a clear central-lower focal group, with the snail visibly nibbling one leaf
Style/medium: soft watercolor and gouache children's picture-book illustration, rounded friendly forms, warm brown hand-drawn outlines, gentle paper texture, consistent calm preschool-game art
Composition/framing: wide horizontal complete landscape; the snail and lettuce group is large, centered low and easy to recognize, with simple open sky above
Lighting/mood: soft morning sunlight, peaceful, cozy, joyful
Color palette: leaf greens, soft tan and brown shell, cream highlights, pale blue sky
Constraints: no text, letters, logo, watermark, border; no other animals or focal action; snail must look friendly with a simple shell, no scary details
```

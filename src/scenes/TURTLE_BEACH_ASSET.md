# 小海龟回海边素材说明

## 用途与构图

- `public/images/scenes/turtle-beach.png` 是小海龟的独立角色图，供海龟爬向水边的场景使用。
- PNG 使用透明 alpha 背景；完整呈现朝右的小海龟、四只鳍状肢和龟壳，不包含海滩、水面或其它物件，便于在场景中单独移动。
- 背景复用 `/images/scenes/fish-pond-background.png`，水波由场景 CSS 动画绘制。
- 图片由内置 imagegen 生成，使用 `public/images/car.png` 作为水彩绘本画风参考。

## 最终生成提示词

```text
An isolated gentle sea turtle character for a preschool storybook game, full body, side view facing right as if slowly crawling toward the sea. Small friendly olive-green turtle with four clearly visible flippers, rounded golden-brown segmented shell, kind expressive eyes, soft smile, rounded safe shapes, subtle watercolor paper texture and warm-brown hand-painted outlines matching the supplied car.png reference. Centered, large clear silhouette with generous padding. No water, beach, sand, waves, plants, other creatures, props, text, logo, or watermark. A single character only, transparent PNG with genuine alpha background.
```

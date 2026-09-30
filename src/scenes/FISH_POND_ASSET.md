# Fish Pond 场景素材

## 文件与用途

- `public/images/scenes/fish-pond-background.webp`：1536×1024 全幅池塘背景；右侧和下方是开阔水面，左侧保留干燥岸边作为小鱼起点。
- `public/images/scenes/fish.webp`：透明底、朝右的金橙色小鱼；场景中从左侧浅岸边出发，点击池塘后游向水面中央。

## 生成说明

以上图片由 imagegen 生成，使用 `public/images/car.webp` 作为画风参考：明亮水彩绘本质感、柔和纸纹、圆润形状和暖棕色描边。背景为不透明 RGB；小鱼为带透明通道的 RGBA PNG。池塘背景不预绘鱼或其它主要交互物。

### 最终提示词

**背景**

```text
Create one full-bleed landscape 3:2 background illustration for a gentle preschool game, matching the warm watercolor storybook style and palette of the supplied car.webp reference (soft paper grain, rounded shapes, warm brown painterly contours, bright sunny colors). Scene: a peaceful sunny garden pond viewed at child eye level. A broad clean turquoise-blue pond occupies most of the right and lower half, with a clearly readable curved shoreline and shallow water glow to make the pond an obvious destination for a small animated fish. On the left, a grassy bank with soft reeds, a few round flowers and smooth stones; distant low hills and pale blue sky. Keep the pond surface uncluttered and open. No fish, no frogs, no characters, no floating objects, no text, no letters, no UI, no border, no watermark. Opaque edge-to-edge painted background.
```

**小鱼**

```text
Create one isolated cute orange goldfish character swimming toward the right, for a preschool game. Match the attached car.webp reference exactly in friendly watercolor storybook illustration style: bright orange and golden scales, plump rounded body, large kind sparkling eye, small smiling mouth, expressive flowing fins and tail, warm brown hand-inked outlines, subtle paper texture and soft highlights. Side three-quarter view, centered, full fish visible. No water, bubbles, plants, other animals, text, or UI. PNG with genuine transparent alpha around the fish; no backdrop, checkerboard, ground plane, or cast shadow. Generous transparent padding so it moves independently.
```

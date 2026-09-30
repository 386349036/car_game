# Toy Cleanup 场景素材

## 文件与用途

- `public/images/scenes/toy-cleanup-background.webp`：1536×1024 全幅玩具房背景；上方墙面可放提示，下方木地板留给动画物件。
- `public/images/scenes/toy-box.webp`：透明底、敞开的玩具箱；作为积木的收纳目标，接收积木时会发光反馈。
- `public/images/scenes/blocks.webp`：透明底的红、蓝、黄三块积木组合；可整体拖动到玩具箱。

## 生成说明

以上图片由 imagegen 生成，使用 `public/images/car.webp` 作为画风参考：明亮水彩绘本质感、柔和纸纹、圆润形状和暖棕色描边。背景为不透明 RGB；玩具箱和积木为带透明通道的 RGBA PNG。

### 最终提示词

**背景**

```text
Create a full-bleed 3:2 landscape background for a preschool toy-tidying game, matching the attached car.webp reference style: warm watercolor storybook painting, sunny cream and honey colors, soft paper texture, rounded shapes, gentle warm-brown outlines. Scene is a quiet empty toddler playroom viewed straight on. The upper quarter is a simple clean pale cream wall with a small centered square window and plain soft curtains, left mostly open for hint text. The lower two-thirds is a broad uninterrupted honey-colored wooden floor with subtle wide floorboards and lots of empty space for separately animated objects. Keep the whole room uncluttered: no shelves, no rug, no furniture, no toys, no toy chest, no blocks, no teddy bears, no characters, no objects on the floor. No text, letters, UI, border, watermark. Opaque painted background edge to edge.
```

**玩具箱**

```text
Isolated open toy storage chest for a preschool game, matching the attached car.webp reference style: friendly watercolor storybook, bright teal body with sunny yellow open lid, warm brown hand-inked outlines, rounded forms, subtle paper texture, soft highlights. Front three-quarter view, centered, full silhouette. Empty clearly visible interior, no toys, no characters, no text, no UI. PNG with genuine transparent alpha around the chest, no backdrop, checkerboard, ground, or cast shadow; generous padding for animation.
```

**积木**

```text
Create one isolated small bundle of three chunky preschool wooden building blocks: a red cube, a blue rectangular block, and a yellow triangular prism, stacked loosely with clear separations. Match the attached car.webp reference exactly in friendly watercolor storybook illustration style: bright saturated colors, warm brown hand-inked outlines, rounded corners, subtle paper texture and soft highlights. Three-quarter view, centered, full silhouette. No box, no characters, no extra toys, no text, no UI. PNG with genuine transparent alpha around the blocks; no backdrop, checkerboard, ground plane, or cast shadow. Generous transparent padding for animation.
```

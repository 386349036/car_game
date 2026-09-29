# 小鸟回鸟窝素材

## 用途与构图

- 角色图：`/images/scenes/bird-nest.png`，一只完整、朝右、轻轻张开翅膀的小鸟，单独置于透明画布中央；动画由场景 CSS 控制，飞回页面右上方的鸟窝。
- 背景复用：`/images/kite-flying-background.png`。树枝与鸟窝由本场景的 DOM/CSS 轻量绘制，小汽车与道路由共用 `CarIllustration`、`SceneBackdrop` 提供。
- Alpha：生成图为 RGBA 透明背景，鸟儿四周保留透明留白；无枝条、鸟窝、底色、文字或阴影。

## 最终生成提示词

> Use case: illustration-story. Asset type: single isolated transparent character sprite for a gentle toddler web game. Create exactly one small, sweet baby songbird, full body, facing to the right as if happily ready to fly home. Show both feet, a rounded golden-yellow body, soft cream belly, warm coral-orange beak and feet, and pale teal-blue wings gently held a little open. Give it kind bright eyes and a calm, confident expression; it is safe and cheerful, not startled, injured, falling, or distressed. Center the complete bird in the canvas with generous transparent margin; no cropped feathers or feet. Match a soft watercolor picture-book illustration with subtle paper grain, warm chestnut-brown hand-painted outline, bright gentle colors, and rounded friendly shapes used in existing local game art. True transparent background. No branch, nest, ground, cast shadow, motion streaks, other birds, text, border, or watermark.

# 小象洗澡素材

## 文件与用途

- `public/images/scenes/elephant-bath.png`：透明背景的小象角色，作为点击目标并在洗澡时轻轻弹跳；内含小水洼和少量水花。
- `/images/scenes/fish-pond-background.png`：复用已有本地池塘背景，作为小象玩水的环境。

## 生成说明

小象 PNG 使用 Codex 内置 `image_gen.imagegen` 生成，并设置透明背景；画面中的小象和脚下水洼组成一个整体，外部保留透明区域，便于缩放和动画。背景复用游戏已有生成素材，没有外部图片请求。

### 最终提示词

```text
Use case: illustration-story
Asset type: transparent character sprite for a preschool animal game
Primary request: a gentle baby elephant character enjoying a bath, with a playful raised trunk and a few small water drops around it
Subject: one adorable baby elephant only, full body, sitting in a shallow friendly puddle pose, soft blue-gray skin, large warm eyes, rounded ears, tiny smile, clearly separated limbs and trunk
Style/medium: watercolor children's picture-book illustration, soft warm-brown outlines, rounded shapes, subtle paper grain, bright but gentle colors; match a cozy local storybook game character style
Composition/framing: isolated centered figure, facing slightly right, full silhouette visible with generous transparent padding, square composition suitable for independent CSS animation
Constraints: genuine transparent PNG background; no scene or backdrop; no text, letters, logos, watermark, border, sharp splash, scary expression, or extra animals
```

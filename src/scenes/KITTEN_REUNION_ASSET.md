# 小猫找到妈妈素材

## 用途与构图

- 角色图：`/images/scenes/kitten-reunion.png`，一张透明 PNG 横向素材图。左半为朝右的小猫，右半为朝左的猫妈妈；角色之间留有透明间隔，场景用 CSS 分别裁切两半并让它们靠近、轻轻蹭脸。
- 背景复用：`/images/meadow.png`。道路与小汽车继续由共用 `SceneBackdrop`、`CarIllustration` 提供。
- Alpha：生成图为 RGBA 透明背景；主体四周留透明边距，无底色、文字或阴影。场景说明该素材按左右半幅裁切使用。

## 最终生成提示词

> Use case: illustration-story. Asset type: one transparent sprite sheet for a gentle toddler web game. Create exactly two separate, fully visible cats on a true transparent background, arranged horizontally with a broad clear transparent gap between them so the two silhouettes can be cropped and animated independently. In the left half, a small cream-and-ginger kitten stands facing right; in the right half, its slightly larger loving mother cat stands facing left. Their faces are at similar height and their paws rest naturally; both have soft tabby markings, kind relaxed eyes, tiny warm smiles, and rounded friendly proportions. Keep each cat centered inside its own half with comfortable transparent margins; no overlap or touching. Match a soft watercolor picture-book style with subtle paper grain, warm chestnut-brown hand-painted outlines, bright gentle colors, and the rounded friendly finish of the existing local game art. Keep anatomy simple and appealing for a three-year-old. No background, ground plane, cast shadow, text, collar, accessories, props, extra animals, border, or watermark.

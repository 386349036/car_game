# 小鸭子素材说明

`public/images/ducklings.webp` 是本场景使用的小鸭子透明 PNG。它用仓库的 `public/images/car.webp` 作为画风参考，通过 Codex 内置图片生成工具制作；保留了相近的暖棕描边、明亮配色和绘本质感。

场景用 CSS 将横向鸭群转为纵向行走方向，再沿斑马线移动。保持透明底，不给图片加底板；点击范围由 `TapTarget` 提供，继续沿用共享的场景反馈接口。

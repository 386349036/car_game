# 共用场景素材

`SceneArt.tsx` 导出后续首页、场景和完成页可共用的展示模块：

- `SceneBackdrop`：生成的草地背景和游戏道路，背景装饰默认对辅助技术隐藏。
- `CarIllustration`：游戏内置的 PNG 小汽车。默认作为装饰隐藏；传入 `label` 时会作为有名称的图片供辅助技术读取。
- `SceneButton`：大尺寸、圆角和按压反馈一致的按钮。可传入正常的 `<button>` 属性，`variant="warm"` 使用暖珊瑚色。

组件会自动导入 `scene-art.css`，图片保存在 `public/images`，不依赖外部图片服务。最小用法：

```tsx
import { CarIllustration, SceneBackdrop, SceneButton } from './components/SceneArt'

<SceneBackdrop className="road-scene">
  <CarIllustration className="road-scene__car" />
  <div className="road-scene__action">
    <SceneButton onClick={onStart}>出发</SceneButton>
  </div>
</SceneBackdrop>
```

汽车和按钮的位置由各场景的类名决定，便于在不同构图中保持素材一致：

```css
.road-scene__car {
  position: absolute;
  z-index: 1;
  bottom: 9%;
  left: 8%;
  width: clamp(190px, 34%, 320px);
}

.road-scene__action {
  position: absolute;
  right: 5%;
  bottom: 7%;
}
```

## 画风约定

- 色彩变量集中在 `scene-art.css` 的 `:root`：天空 `#c7edf0`、草地 `#7fc798`、道路 `#eaa66d`、汽车 `#ffbd59`、暖棕描边 `#8c633d`、主按钮绿 `#378f69`。新素材优先沿用这些变量。
- 新增形象素材使用图片生成工具生成透明 PNG，并沿用柔和的绘本笔触、暖棕色描边和圆润轮廓。
- 卡片使用 `--scene-radius-card`（32px），按钮使用 `--scene-radius-control`（22px）；按钮最小高度约 62px，阴影使用柔和的绿色灰调。
- 背景最小高度和按钮触控尺寸已包含窄屏规则。新增场景元素请使用自己的 `className` 定位，避免改动共用组件内部结构。

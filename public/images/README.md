# 图片素材说明

这些图片由 Codex 内置 `image_gen.imagegen` 生成，再复制到本目录。游戏运行时只读取本地图片，不依赖外部图片服务。生成工具没有可选的具体模型版本参数，因此这里记录实际使用的工具，不标注未经确认的模型版本。

## 通用画风提示

面向三岁儿童的绘本式公路游戏，暖棕色柔和描边、圆润友好的造型、轻微手绘纸张纹理、明亮而柔和的颜色；小尺寸手机屏幕上也要有清晰轮廓。独立物件使用透明 PNG，完整主体居中，不含文字、标志、水印或多余物件。后续物件使用 `car.png` 作为画风参考。

| 文件 | 生成提示中的主体要求 | 用途 |
| --- | --- | --- |
| `car.png` | 朝右的金黄色微笑小车，两个深色车轮，浅青色车窗 | 首页、三关、完成页、站点图标 |
| `excavator.png` | 朝左伸出铲斗的金黄色玩具挖掘机 | 清理石头关 |
| `stone.png` | 圆润的中灰色路障石头，蓝灰色高光 | 清理石头关 |
| `plank.png` | 横向蜂蜜棕木桥板，能覆盖道路缺口 | 搭桥关 |
| `traffic-red.png` | 正面三灯交通灯和底座，红灯亮 | 红绿灯关初始状态 |
| `traffic-green.png` | 同风格正面三灯交通灯和底座，绿灯亮 | 红绿灯关完成状态 |
| `meadow.png` | 横向全幅阳光草地、青蓝天空、白云、远山；中部和下方留出互动空间，不画道路或车辆 | 首页和场景背景 |
| `tire.png` | 立起的深灰色备用轮胎，暖奶油色轮毂 | 换胎关 |
| `wiper.png` | 单支深炭灰色挡风玻璃雨刷，水平收起姿态 | 雨刷关 |
| `rainy-meadow.png` | 阴雨天空下的草地道路，无雷电或洪水 | 雨刷关背景 |
| `ducklings.png` | 一列向前行走的可爱小鸭子，透明背景，以小车图像作风格参考 | 小鸭子过马路关 |

模式：使用内置图片生成工具直接生成；草地为不透明全幅插画，其他物件为透明背景 PNG。道路、触控区域和反馈动画由 CSS 呈现，方便适配不同手机尺寸。

## V3 新增场景

下列 PNG 均由 Codex 内置 `image_gen.imagegen` 生成，运行时从本地加载。每关的构图和提示词见对应的 `src/scenes/*_ASSET.md`。

| 文件 | 用途 |
| --- | --- |
| `night-lights-background.png` | 夜间乡间道路背景；小车复用 `car.png` |
| `fuel-stop-background.png` | 加油站背景；小车复用 `car.png` |
| `home-garage-closed.png`、`home-garage-open.png` | 黄昏车库关闭和打开状态 |
| `car-wash.png`、`wash-sponge.png` | 洗车房背景和海绵点击目标 |
| `rabbit-feeding.png`、`feeding-carrot.png` | 菜园兔子背景和胡萝卜点击目标 |
| `flower-watering.png`、`watering-can.png`、`flower-open.png` | 花园背景、浇水壶点击目标和开花反馈 |

## V4 新增场景

前三组素材由 Codex 内置图片生成工具生成。每张背景使用全幅绘本场景构图，互动人物和物件为独立透明 PNG，场景提示词记录在相应的 `src/scenes/*_ASSET.md` 中。

| 文件 | 用途 |
| --- | --- |
| `mail-delivery-background.png`、`mailbox.png`、`envelope.png`、`mailbox-flag.png` | 乡间送信背景、邮箱、可拖动信封和邮箱旗子 |
| `feed-chicks-background.png`、`feeding-chicks.png`、`grain-bowl.png` | 农场背景、小鸡组和可点击谷粒碗 |
| `kite-flying-background.png`、`kite.png`、`kite-spool.png` | 草坡蓝天背景、风筝和按住线轴 |
| `scenes/puppy-frisbee-background.png`、`scenes/puppy.png`、`scenes/frisbee.png` | 草地背景、小狗和可点击飞盘 |
| `scenes/toy-cleanup-background.png`、`scenes/toy-box.png`、`scenes/blocks.png` | 空玩具房背景、敞开的收纳箱和可拖动积木 |
| `scenes/fish-pond-background.png`、`scenes/fish.png` | 池塘背景和游回池塘的小鱼 |

后三组场景的生成提示词与用途说明见对应的 `src/scenes/*_ASSET.md` 文件。

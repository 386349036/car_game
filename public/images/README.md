# 图片素材说明

这些图片由 Codex 内置 `image_gen.imagegen` 生成，再复制到本目录。游戏运行时只读取本地图片，不依赖外部图片服务。生成工具没有可选的具体模型版本参数，因此这里记录实际使用的工具，不标注未经确认的模型版本。

## 通用画风提示

面向三岁儿童的绘本式公路游戏，暖棕色柔和描边、圆润友好的造型、轻微手绘纸张纹理、明亮而柔和的颜色；小尺寸手机屏幕上也要有清晰轮廓。独立物件使用透明 WebP，完整主体居中，不含文字、标志、水印或多余物件。后续物件使用 `car.webp` 作为画风参考。

| 文件 | 生成提示中的主体要求 | 用途 |
| --- | --- | --- |
| `car.webp` | 朝右的金黄色微笑小车，两个深色车轮，浅青色车窗 | 首页、三关、完成页、站点图标 |
| `excavator.webp` | 朝左伸出铲斗的金黄色玩具挖掘机 | 清理石头关 |
| `stone.webp` | 圆润的中灰色路障石头，蓝灰色高光 | 清理石头关 |
| `plank.webp` | 横向蜂蜜棕木桥板，能覆盖道路缺口 | 搭桥关 |
| `traffic-red.webp` | 正面三灯交通灯和底座，红灯亮 | 红绿灯关初始状态 |
| `traffic-green.webp` | 同风格正面三灯交通灯和底座，绿灯亮 | 红绿灯关完成状态 |
| `meadow.webp` | 横向全幅阳光草地、青蓝天空、白云、远山；中部和下方留出互动空间，不画道路或车辆 | 首页和场景背景 |
| `tire.webp` | 立起的深灰色备用轮胎，暖奶油色轮毂 | 换胎关 |
| `wiper.webp` | 单支深炭灰色挡风玻璃雨刷，水平收起姿态 | 雨刷关 |
| `rainy-meadow.webp` | 阴雨天空下的草地道路，无雷电或洪水 | 雨刷关背景 |
| `ducklings.webp` | 一列向前行走的可爱小鸭子，透明背景，以小车图像作风格参考 | 小鸭子过马路关 |

模式：使用内置图片生成工具直接生成；草地为不透明全幅插画，其他物件为透明背景 PNG。道路、触控区域和反馈动画由 CSS 呈现，方便适配不同手机尺寸。

## V3 新增场景

下列 PNG 均由 Codex 内置 `image_gen.imagegen` 生成，运行时从本地加载。每关的构图和提示词见对应的 `src/scenes/*_ASSET.md`。

| 文件 | 用途 |
| --- | --- |
| `night-lights-background.webp` | 夜间乡间道路背景；小车复用 `car.webp` |
| `fuel-stop-background.webp` | 加油站背景；小车复用 `car.webp` |
| `home-garage-closed.webp`、`home-garage-open.webp` | 黄昏车库关闭和打开状态 |
| `car-wash.webp`、`wash-sponge.webp` | 洗车房背景和海绵点击目标 |
| `rabbit-feeding.webp`、`feeding-carrot.webp` | 菜园兔子背景和胡萝卜点击目标 |
| `flower-watering.webp`、`watering-can.webp`、`flower-open.webp` | 花园背景、浇水壶点击目标和开花反馈 |

## V4 新增场景

前三组素材由 Codex 内置图片生成工具生成。每张背景使用全幅绘本场景构图，互动人物和物件为独立透明 PNG，场景提示词记录在相应的 `src/scenes/*_ASSET.md` 中。

| 文件 | 用途 |
| --- | --- |
| `mail-delivery-background.webp`、`mailbox.webp`、`envelope.webp`、`mailbox-flag.webp` | 乡间送信背景、邮箱、可拖动信封和邮箱旗子 |
| `feed-chicks-background.webp`、`feeding-chicks.webp`、`grain-bowl.webp` | 农场背景、小鸡组和可点击谷粒碗 |
| `kite-flying-background.webp`、`kite.webp`、`kite-spool.webp` | 草坡蓝天背景、风筝和按住线轴 |
| `scenes/puppy-frisbee-background.webp`、`scenes/puppy.webp`、`scenes/frisbee.webp` | 草地背景、小狗和可点击飞盘 |
| `scenes/toy-cleanup-background.webp`、`scenes/toy-box.webp`、`scenes/blocks.webp` | 空玩具房背景、敞开的收纳箱和可拖动积木 |
| `scenes/fish-pond-background.webp`、`scenes/fish.webp` | 池塘背景和游回池塘的小鱼 |

## 小动物朋友前五关（背景与互动层）

五张背景由内置图片生成工具分别生成，再转为本地 WebP。背景仅包含远景地形、植被和光线；松果、竹枝、叶枝都作为独立透明素材，由场景代码控制移动，避免背景中出现重复的互动对象。

| 文件 | 用途 |
| --- | --- |
| `scenes/animal-squirrel-background.webp`、`scenes/animal-squirrel-empty.webp`、`scenes/animal-pinecone.webp` | 秋日树林；松鼠空手，松果移动到手中 |
| `scenes/animal-bear-background.webp`、`scenes/animal-bear-body.webp`、`scenes/animal-bear-arm.webp` | 春日草地；独立前臂绕肩膀挥动 |
| `scenes/animal-fox-background.webp` | 暖色草坡；狐狸原图跳跃 |
| `scenes/animal-panda-background.webp`、`scenes/animal-bamboo.webp` | 竹林；竹枝移动到熊猫嘴边 |
| `scenes/animal-giraffe-background.webp`、`scenes/animal-leafy-twig.webp` | 草原；叶枝移动到长颈鹿嘴边 |

后三组场景的生成提示词与用途说明见对应的 `src/scenes/*_ASSET.md` 文件。

## V5 小动物朋友主题

五个新角色由 Codex 内置图片生成工具制作为透明 PNG；小猫、小鸟、小海龟和小绵羊素材由分支工作 2 号、3 号生成，小象素材由主工作区生成。场景复用已有本地背景，不从外部地址加载图片。

| 文件 | 用途 |
| --- | --- |
| `scenes/kitten-reunion.webp` | 小猫与猫妈妈团聚角色 |
| `scenes/bird-nest.webp` | 回到鸟窝的小鸟角色 |
| `scenes/turtle-beach.webp` | 爬向海边的小海龟 |
| `scenes/lamb-meadow.webp` | 吃青草的小绵羊 |
| `scenes/elephant-bath.webp` | 在水边洗澡的小象 |

每关复用的环境背景、PNG 透明通道和最终提示词记录在相应的 `src/scenes/*_ASSET.md` 文件中。

## V6 快乐农场与奇妙花园主题

`themes/farm/` 与 `themes/garden/` 各有十张完整场景 PNG，文件名与对应的场景 ID 一致。两组插画均由 Codex 内置 `image_gen.imagegen` 逐张生成，游戏从本地读取。逐关的生成提示、用途和点按目标位置分别记录在 `src/themes/farm/FARM_THEME_ASSETS.md` 与 `src/themes/garden/GARDEN_THEME_ASSETS.md`。

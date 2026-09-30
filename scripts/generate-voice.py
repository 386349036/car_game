"""Generate the bundled Mandarin prompts as local MP3 files."""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path

import edge_tts


PROMPTS = {
    "journey-start.mp3": "小车出发啦！",
    "animal-journey-start.mp3": "小动物朋友，我们出发啦！",
    "animal-squirrel-hint.mp3": "点一点小松鼠，一起抱住松果。",
    "animal-bear-hint.mp3": "点一点小熊，和它挥挥手。",
    "animal-fox-hint.mp3": "点一点小狐狸，陪它轻轻跳。",
    "animal-panda-hint.mp3": "点一点熊猫，送它嫩竹叶。",
    "animal-giraffe-hint.mp3": "点一点长颈鹿，帮它够树叶。",
    "stone-hint.mp3": "石头挡路啦，请挖掘机来帮忙。",
    "bridge-hint.mp3": "把木板放到小桥上吧。",
    "traffic-light-hint.mp3": "点一点红绿灯，小车就能走啦。",
    "animal-crossing-hint.mp3": "小鸭子想过马路，点一点来帮忙。",
    "tire-change-hint.mp3": "把新轮胎放上去吧。",
    "rainy-drive-hint.mp3": "下雨啦，点一下雨刷，帮小车看清前面。",
    "night-lights-hint.mp3": "天黑啦，点一点小车的车灯，照亮前面的路。",
    "fuel-stop-hint.mp3": "小车要加油啦，点一下加油机，陪小车补充能量。",
    "car-wash-hint.mp3": "小车要洗澡啦，点一下大海绵，给小车洗干净。",
    "rabbit-feeding-hint.mp3": "小兔子饿了，点一下胡萝卜，送给小兔子吃。",
    "flower-watering-hint.mp3": "花朵渴了，点一下浇水壶，给花朵浇浇水。",
    "mail-delivery-hint.mp3": "信件准备好了，把信送进邮箱里吧。",
    "feed-chicks-hint.mp3": "小鸡饿了，点一点谷粒，喂给小鸡吃吧。",
    "kite-flying-hint.mp3": "风筝要飞起来啦，按住线轴，让它慢慢升高。",
    "puppy-frisbee-hint.mp3": "小狗想玩飞盘，点一下飞盘，陪它玩一玩。",
    "toy-cleanup-hint.mp3": "把积木放进玩具箱，玩具回家啦。",
    "fish-pond-hint.mp3": "小鱼想回池塘，点一点池塘来帮忙。",
    "home-garage-hint.mp3": "到家啦，点一下大大的车库门，送小车回家。",
    "kitten-reunion-hint.mp3": "小猫在找妈妈，点一点小猫，陪它们团聚吧。",
    "bird-nest-hint.mp3": "小鸟想回鸟窝，点一点小鸟，陪它回家吧。",
    "turtle-beach-hint.mp3": "小海龟想回海边，点一点它来帮忙。",
    "lamb-meadow-hint.mp3": "小绵羊肚子饿了，点一点小绵羊，陪它吃青草吧。",
    "elephant-bath-hint.mp3": "小象要洗澡啦，点一下小象，陪它开心地玩水吧。",
    "farm-feed-cow-hint.mp3": "小奶牛肚子饿了，点一点干草，送给它吃吧。",
    "farm-egg-basket-hint.mp3": "点一下鸡蛋，让它轻轻落进篮子里。",
    "farm-pig-bath-hint.mp3": "小猪身上脏脏的，点一下大海绵，帮它洗个澡。",
    "farm-apple-picking-hint.mp3": "苹果红彤彤的，点一下苹果，收进篮子里。",
    "farm-seed-planting-hint.mp3": "点一下小种子，把它种进土里。",
    "farm-sheep-brushing-hint.mp3": "点一下大刷子，帮绵羊梳梳毛。",
    "farm-pumpkin-tractor-hint.mp3": "南瓜要装车啦，点一下南瓜，送到拖拉机上。",
    "farm-fill-trough-hint.mp3": "点一下蓝色水桶，把水倒进水槽。",
    "farm-carrot-harvest-hint.mp3": "胡萝卜长好啦，点一点胡萝卜，把它拔出来。",
    "farm-barn-goodnight-hint.mp3": "天黑啦，点一下谷仓门，让动物朋友们进去休息。",
    "garden-water-daisy-hint.mp3": "点一点小水壶，给花朵浇浇水。",
    "garden-plant-sunflower-hint.mp3": "点一下大种子，把它种进松软的土里。",
    "garden-butterfly-flower-hint.mp3": "点一下小蝴蝶，让它飞到花朵上。",
    "garden-pick-strawberry-hint.mp3": "点一下大草莓，把它摘进篮子。",
    "garden-sweep-leaves-hint.mp3": "叶子落下来啦，点一下小耙子，把叶子扫整齐。",
    "garden-stone-path-hint.mp3": "点一下中间的大石头，铺好小路。",
    "garden-gate-hedgehog-hint.mp3": "点一下小门，邀请刺猬进来。",
    "garden-light-lantern-hint.mp3": "天色暗下来啦，点一下小灯笼，照亮花园。",
    "garden-dandelion-wish-hint.mp3": "点一点蒲公英，让小伞轻轻飞起来。",
    "garden-snail-lettuce-hint.mp3": "小蜗牛肚子饿了，点一点生菜，送给它吃吧。",
    "farm-journey-start.mp3": "欢迎来到快乐农场，我们一起玩吧！",
    "garden-journey-start.mp3": "欢迎来到奇妙花园，发现好多小惊喜！",
    "farm-scene-complete.mp3": "真棒，农场朋友都很开心！",
    "garden-scene-complete.mp3": "真棒，花园里开出好多鲜花！",
    "farm-journey-complete.mp3": "快乐农场的旅程完成啦，太棒了！",
    "garden-journey-complete.mp3": "奇妙花园的旅程完成啦，太棒了！",
    "farm-theme-start.mp3": "农场到了，来和农场朋友打个招呼吧！",
    "farm-theme-complete.mp3": "农场朋友都安顿好啦，谢谢你帮忙！",
    "garden-theme-start.mp3": "花园到了，来和花园朋友一起玩吧！",
    "garden-theme-complete.mp3": "花园变得真美，谢谢你帮忙！",
    "scene-complete.mp3": "真棒，小车继续前进！",
    "animal-scene-complete.mp3": "真棒，小动物很开心，我们继续玩吧！",
    "journey-complete.mp3": "小车到家啦，真棒！",
    "animal-journey-complete.mp3": "小动物朋友都玩得真开心，太棒啦！",
}


async def generate(
    output_directory: Path,
    voice: str,
    rate: str,
    only: set[str] | None = None,
) -> None:
    output_directory.mkdir(parents=True, exist_ok=True)

    for filename, text in PROMPTS.items():
        if only is not None and filename not in only:
            continue
        output_path = output_directory / filename
        temporary_path = output_path.with_suffix(".mp3.tmp")
        try:
            communicate = edge_tts.Communicate(
                text,
                voice,
                rate=rate,
                volume="+0%",
                pitch="+0Hz",
            )
            await communicate.save(str(temporary_path))
            temporary_path.replace(output_path)
        finally:
            temporary_path.unlink(missing_ok=True)

        print(f"{filename} - {text}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--voice", default="zh-CN-XiaoxiaoNeural")
    parser.add_argument("--rate", default="-8%")
    parser.add_argument(
        "--output-directory",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "public" / "audio" / "voice",
    )
    parser.add_argument(
        "--only",
        nargs="*",
        choices=tuple(PROMPTS),
        help="Generate only these prompt files instead of refreshing the full voice pack.",
    )
    args = parser.parse_args()
    selected_prompts = set(args.only) if args.only is not None else None
    asyncio.run(generate(args.output_directory, args.voice, args.rate, selected_prompts))


if __name__ == "__main__":
    main()

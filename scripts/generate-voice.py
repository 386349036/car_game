"""Generate the bundled Mandarin prompts as local MP3 files."""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path

import edge_tts


PROMPTS = {
    "music-journey-complete.mp3": "音乐派对的十个小场景完成啦，音乐朋友晚安！",
    "music-scene-complete.mp3": "真棒，音乐朋友真开心！",
    "life-journey-complete.mp3": "十次暖暖的小帮忙完成啦，谢谢你！",
    "life-scene-complete.mp3": "谢谢你，小帮手真棒！",
    "sky-journey-complete.mp3": "天空旅行的十个小场景完成啦，月亮晚安！",
    "sky-scene-complete.mp3": "真棒，天空旅行继续啦！",
    "ocean-journey-complete.mp3": "海洋奇遇的十个小场景完成啦，海底朋友晚安！",
    "ocean-scene-complete.mp3": "真棒，海底朋友都很开心！",
    "music-box-goodnight-hint.mp3": "点一点八音盒，听首晚安歌。",
    "music-note-score-hint.mp3": "点一点二胡，听听小旋律。",
    "music-bear-dance-hint.mp3": "点一点古筝，听听小旋律。",
    "music-accordion-hint.mp3": "点一点手风琴，伸伸腰吧。",
    "music-trumpet-hint.mp3": "点一点小号，唱首小歌吧。",
    "music-pluck-string-hint.mp3": "点一点琴弦，弹个小旋律。",
    "music-xylophone-hint.mp3": "点一点木琴，听听小旋律。",
    "music-shaker-hint.mp3": "点一点沙锤，沙沙沙。",
    "music-bell-ring-hint.mp3": "点一点铃铛，叮叮叮。",
    "life-bear-blanket-hint.mp3": "给小朋友盖上被子吧。",
    "life-book-shelf-hint.mp3": "把图画书放回书架吧。",
    "life-hang-coat-hint.mp3": "把小外套挂到挂钩上吧。",
    "life-socks-basket-hint.mp3": "把袜子放进洗衣篮吧。",
    "life-wipe-table-hint.mp3": "点一点纸巾，擦擦桌子吧。",
    "life-breakfast-spoon-hint.mp3": "把勺子放到餐垫上吧。",
    "life-bear-bib-hint.mp3": "给小熊戴上围兜吧。",
    "life-dry-hands-hint.mp3": "把毛巾送到小手旁边吧。",
    "life-wash-hands-hint.mp3": "点一点肥皂泡，洗洗小手吧。",
    "sky-moon-blanket-hint.mp3": "给月亮盖上云被吧。",
    "sky-star-home-hint.mp3": "把星星送到月亮旁边吧。",
    "sky-windmill-spin-hint.mp3": "点一点风车，转起来吧。",
    "sky-rain-cloud-hint.mp3": "点一点雨云，下点小雨吧。",
    "sky-airship-letter-hint.mp3": "把信封放进飞艇邮袋吧。",
    "sky-rainbow-bridge-hint.mp3": "把彩虹片放到空缺里吧。",
    "sky-cloud-train-hint.mp3": "点一点云火车，向前开吧。",
    "sky-sun-hello-hint.mp3": "点一点小太阳，出来吧。",
    "sky-cloud-clear-hint.mp3": "点一点大云朵，让让路吧。",
    "ocean-shell-goodnight-hint.mp3": "点一点贝壳灯，朋友们晚安。",
    "ocean-coral-door-hint.mp3": "点一点小门，看看谁来了。",
    "ocean-seal-ball-hint.mp3": "把皮球送给小海豹吧。",
    "ocean-whale-splash-hint.mp3": "点一点小鲸鱼，喷喷水吧。",
    "ocean-jellyfish-glow-hint.mp3": "点一点水母，让它亮起来吧。",
    "ocean-octopus-wave-hint.mp3": "点一点小章鱼，打个招呼吧。",
    "ocean-starfish-turn-hint.mp3": "点一点海星，帮它翻个身吧。",
    "ocean-hermit-shell-hint.mp3": "把贝壳送到寄居蟹身边吧。",
    "ocean-crab-home-hint.mp3": "点一点小螃蟹，回沙窝吧。",
    "ocean-journey-start.mp3": "欢迎来到海洋奇遇，一起发现海底的小惊喜吧。",
    "sky-journey-start.mp3": "欢迎来到天空旅行，一起看看天空的小惊喜吧。",
    "life-journey-start.mp3": "欢迎来到生活小帮手，一起帮个小忙吧。",
    "music-journey-start.mp3": "欢迎来到音乐派对，一起奏响小旋律吧。",
    "ocean-shell-pearl-hint.mp3": "点一点贝壳，打开看看吧。",
    "sky-balloon-launch-hint.mp3": "点一点气球篮，出发吧。",
    "life-slippers-pair-hint.mp3": "把拖鞋放到另一只旁边吧。",
    "music-soft-drum-hint.mp3": "点一点小鼓，咚咚咚。",
    "ocean-preview-complete.mp3": "贝壳打开啦，珍珠亮晶晶！谢谢你的小帮忙。",
    "sky-preview-complete.mp3": "热气球慢慢升起来啦，谢谢你帮忙。",
    "life-preview-complete.mp3": "两只拖鞋摆整齐啦，谢谢你的小帮忙。",
    "music-preview-complete.mp3": "小鼓咚咚，真好听！谢谢你一起玩。",
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

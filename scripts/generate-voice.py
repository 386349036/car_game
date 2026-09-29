"""Generate the bundled Mandarin prompts as local MP3 files."""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path

import edge_tts


PROMPTS = {
    "journey-start.mp3": "小车出发啦！",
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
    "home-garage-hint.mp3": "到家啦，点一下大大的车库门，送小车回家。",
    "scene-complete.mp3": "真棒，小车继续前进！",
    "journey-complete.mp3": "小车到家啦，真棒！",
}


async def generate(output_directory: Path, voice: str, rate: str) -> None:
    output_directory.mkdir(parents=True, exist_ok=True)

    for filename, text in PROMPTS.items():
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
    args = parser.parse_args()
    asyncio.run(generate(args.output_directory, args.voice, args.rate))


if __name__ == "__main__":
    main()

"""Convert bundled game illustrations to compact WebP files.

Requires Pillow. Run from the repository root with:
    python scripts/optimize-images.py
"""

from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "public" / "images"
MAX_BYTES = 300_000
QUALITIES = (82, 76, 70, 64, 58, 52, 46)
MAX_WIDTHS = (1536, 1360, 1200, 1050, 900, 768)


def encode_under_limit(image: Image.Image) -> bytes:
    for max_width in MAX_WIDTHS:
        candidate = image.copy()
        if candidate.width > max_width:
            new_height = round(candidate.height * max_width / candidate.width)
            candidate = candidate.resize((max_width, new_height), Image.Resampling.LANCZOS)

        for quality in QUALITIES:
            buffer = BytesIO()
            candidate.save(buffer, format="WEBP", quality=quality, method=6)
            if buffer.tell() <= MAX_BYTES:
                return buffer.getvalue()

    raise ValueError(f"Could not compress {image.width}x{image.height} image below {MAX_BYTES} bytes")


def main() -> None:
    sources = sorted(IMAGE_ROOT.rglob("*.png"))
    if not sources:
        print("No PNG illustrations remain.")
        return

    before = sum(path.stat().st_size for path in sources)
    for source in sources:
        target = source.with_suffix(".webp")
        with Image.open(source) as image:
            encoded = encode_under_limit(image)
        target.write_bytes(encoded)

    # Every game image uses the same extension, including dynamic scene paths.
    for root in (ROOT / "src", ROOT / "public" / "images"):
        for path in root.rglob("*"):
            if path.suffix not in {".tsx", ".ts", ".css", ".md"}:
                continue
            content = path.read_text(encoding="utf-8")
            updated = content.replace(".png", ".webp")
            if updated != content:
                path.write_text(updated, encoding="utf-8", newline="")

    for path in (ROOT / "index.html", ROOT / "GAME_PLAN.md", ROOT / "README.md"):
        content = path.read_text(encoding="utf-8")
        updated = content.replace(".png", ".webp")
        if updated != content:
            path.write_text(updated, encoding="utf-8", newline="")

    for source in sources:
        source.unlink()

    after = sum(path.with_suffix(".webp").stat().st_size for path in sources)
    print(f"Converted {len(sources)} illustrations: {before:,} -> {after:,} bytes ({after / before:.1%}).")


if __name__ == "__main__":
    main()

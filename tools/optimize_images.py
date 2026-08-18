#!/usr/bin/env python3
"""
Resize and convert images to WebP/JPEG responsive sizes.

Usage:
  python tools/optimize_images.py path/to/source.jpg

Generates: assets/images/ with -400, -800, -1200 variants in JPG and WebP.
"""
import sys
from pathlib import Path
from PIL import Image


SIZES = [400, 800, 1200]


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def process(src_path: Path):
    if not src_path.exists():
        print(f"Source image not found: {src_path}")
        return 1

    out_dir = Path("assets/images")
    ensure_dir(out_dir)

    img = Image.open(src_path)
    img = img.convert("RGB")

    for w in SIZES:
        ratio = w / img.width
        h = int(img.height * ratio)
        resized = img.resize((w, h), Image.LANCZOS)

        jpg_path = out_dir / f"{src_path.stem}-{w}.jpg"
        webp_path = out_dir / f"{src_path.stem}-{w}.webp"

        resized.save(jpg_path, format="JPEG", quality=85, optimize=True)
        resized.save(webp_path, format="WEBP", quality=80, method=6)

        print(f"Wrote: {jpg_path} and {webp_path}")

    print("Done. Add the assets/images files to your repo or deploy folder.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/optimize_images.py path/to/source.jpg")
        sys.exit(2)
    src = Path(sys.argv[1])
    sys.exit(process(src))

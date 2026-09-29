#!/usr/bin/env python3
"""
Regenerate the hero web assets from the full-resolution originals.

    python3 scripts/build-images.py

Inputs  (committed, never served):
    src/img/image_1.png   background-removed cutout, 5448x3376 RGBA
    src/img/image_0.jpg   the original office photograph

Outputs (served from /public, referenced in src/data/resume.js):
    public/ognjen-portrait.webp      1000x1000 square cutout → circular disc
    public/ognjen-portrait-sm.webp    520x520  same, for small viewports
    public/ognjen-backdrop.webp      2000w     faint parallax plate
    public/ognjen-backdrop-sm.webp   1100w     same, for small viewports

The square crop below is tuned to the current cutout: it frames the head with
headroom and cuts just under the crossed arms, so nothing important falls
outside the inscribed circle. If you replace the source photo, print
`Image.open(src).getchannel('A').getbbox()` and re-derive LEFT/TOP/SIDE.
"""

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'img')
OUT = os.path.join(ROOT, 'public')

# Square window over the cutout, in source pixels.
LEFT, TOP, SIDE = 1539, 280, 2450


def build_portrait():
    cut = Image.open(os.path.join(SRC, 'image_1.png')).convert('RGBA')
    square = cut.crop((LEFT, TOP, LEFT + SIDE, TOP + SIDE))

    square.resize((1000, 1000), Image.LANCZOS).save(
        os.path.join(OUT, 'ognjen-portrait.webp'), 'WEBP', quality=90, method=6)
    square.resize((520, 520), Image.LANCZOS).save(
        os.path.join(OUT, 'ognjen-portrait-sm.webp'), 'WEBP', quality=88, method=6)


def build_backdrop():
    full = Image.open(os.path.join(SRC, 'image_0.jpg')).convert('RGB')
    w, h = full.size
    for width, name, quality in ((2000, 'ognjen-backdrop.webp', 72),
                                 (1100, 'ognjen-backdrop-sm.webp', 70)):
        full.resize((width, round(h * width / w)), Image.LANCZOS).save(
            os.path.join(OUT, name), 'WEBP', quality=quality, method=6)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build_portrait()
    build_backdrop()
    for f in sorted(os.listdir(OUT)):
        if f.endswith('.webp'):
            path = os.path.join(OUT, f)
            print(f'{f:<30} {os.path.getsize(path) / 1024:6.0f} KB  {Image.open(path).size}')

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

Outputs (served from /public, referenced in index.html):
    public/og-image.jpg              1200x630  social share card (Open Graph / Twitter)
    public/favicon.ico               16/32/48  "OB" monogram
    public/favicon-32.png / icon-192.png / icon-512.png / apple-touch-icon.png

The share card and icons use the fonts in scripts/fonts/ (Sora, JetBrains Mono —
both OFL, from github.com/google/fonts) and fall back to DejaVu if missing.

The square crop below is tuned to the current cutout: it frames the head with
headroom and cuts just under the crossed arms, so nothing important falls
outside the inscribed circle. If you replace the source photo, print
`Image.open(src).getchannel('A').getbbox()` and re-derive LEFT/TOP/SIDE.
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'img')
OUT = os.path.join(ROOT, 'public')
FONTS = os.path.join(ROOT, 'scripts', 'fonts')

INK = (17, 22, 19)
SURFACE = (27, 36, 32)
ACCENT = (78, 159, 61)
ACCENT_SOFT = (111, 191, 92)
SAGE = (163, 193, 173)

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


def font(name, size, weight=None):
    path = os.path.join(FONTS, name)
    if not os.path.exists(path):
        fallback = 'DejaVuSansMono.ttf' if 'Mono' in name else 'DejaVuSans-Bold.ttf'
        return ImageFont.truetype(os.path.join('/usr/share/fonts/truetype/dejavu', fallback), size)
    f = ImageFont.truetype(path, size)
    if weight:
        f.set_variation_by_name(weight)
    return f


def build_og_image():
    W, H = 1200, 630
    card = Image.new('RGB', (W, H), INK)

    # Soft accent glow behind the portrait
    glow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(glow).ellipse((700, 40, 1220, 560), fill=110)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    card.paste(Image.new('RGB', (W, H), ACCENT_SOFT), (0, 0), glow)

    # Portrait disc on the right
    disc_size = 460
    cut = Image.open(os.path.join(SRC, 'image_1.png')).convert('RGBA')
    face = cut.crop((LEFT, TOP, LEFT + SIDE, TOP + SIDE)).resize((disc_size, disc_size), Image.LANCZOS)
    mask = Image.new('L', (disc_size, disc_size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, disc_size, disc_size), fill=255)
    disc = Image.new('RGBA', (disc_size, disc_size), SURFACE + (255,))
    disc.alpha_composite(face)
    dx, dy = W - disc_size - 70, (H - disc_size) // 2
    ImageDraw.Draw(card).ellipse((dx - 6, dy - 6, dx + disc_size + 6, dy + disc_size + 6), outline=ACCENT, width=4)
    card.paste(disc.convert('RGB'), (dx, dy), mask)

    d = ImageDraw.Draw(card)
    x = 72
    d.text((x, 92), 'NIŠ, SERBIA · OPEN TO WORK', font=font('JetBrainsMono.ttf', 20, b'Medium'), fill=SAGE)
    d.text((x, 150), 'Ognjen', font=font('Sora.ttf', 92, b'ExtraBold'), fill=(255, 255, 255))
    d.text((x, 248), 'Badivuk', font=font('Sora.ttf', 92, b'ExtraBold'), fill=ACCENT_SOFT)
    d.rounded_rectangle((x, 362, x + 260, 367), radius=3, fill=ACCENT)
    d.text((x, 396), 'Backend / Application Engineer', font=font('Sora.ttf', 32, b'SemiBold'), fill=(255, 255, 255))
    d.text((x, 446), 'PHP · Python · Laravel · ETL pipelines', font=font('Sora.ttf', 24, b'Regular'), fill=SAGE)
    d.text((x, 540), 'ognjenbadivuk.com', font=font('JetBrainsMono.ttf', 22, b'Medium'), fill=ACCENT_SOFT)

    card.save(os.path.join(OUT, 'og-image.jpg'), 'JPEG', quality=88, optimize=True, progressive=True)


def monogram(size):
    """Rounded-square "OB" mark, drawn at 4x and downsampled for clean edges."""
    s = size * 4
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=s // 5, fill=INK)
    d.rounded_rectangle((s * 0.18, s * 0.80, s * 0.82, s * 0.85), radius=s // 40, fill=ACCENT)
    f = font('Sora.ttf', int(s * 0.46), b'ExtraBold')
    d.text((s / 2, s * 0.47), 'OB', font=f, fill=ACCENT_SOFT, anchor='mm')
    return img.resize((size, size), Image.LANCZOS)


def build_icons():
    monogram(48).save(os.path.join(OUT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
    monogram(32).save(os.path.join(OUT, 'favicon-32.png'), optimize=True)
    monogram(192).save(os.path.join(OUT, 'icon-192.png'), optimize=True)
    monogram(512).save(os.path.join(OUT, 'icon-512.png'), optimize=True)
    # iOS draws its own rounded mask and shows transparency as black, so fill edge to edge
    touch = Image.new('RGBA', (180, 180), INK + (255,))
    touch.alpha_composite(monogram(180))
    touch.convert('RGB').save(os.path.join(OUT, 'apple-touch-icon.png'), optimize=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build_portrait()
    build_backdrop()
    build_og_image()
    build_icons()
    for f in sorted(os.listdir(OUT)):
        if f.endswith(('.webp', '.jpg', '.png', '.ico')):
            path = os.path.join(OUT, f)
            print(f'{f:<30} {os.path.getsize(path) / 1024:6.0f} KB  {Image.open(path).size}')

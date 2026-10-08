#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFilter

ROOT = Path("frontend/public/uploaded")
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
WHITE_THRESHOLD = 245
PADDING = 0

def background_mask(img):
    rgb = img.convert("RGB")
    w, h = rgb.size
    candidate = Image.new("L", (w, h), 0)
    px = rgb.load()
    cp = candidate.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                cp[x, y] = 255

    # Remove only white-ish regions connected to the outside boundary.
    # Interior white areas in the artwork remain untouched.
    bg = candidate.copy()
    seeds = []
    for x in range(w):
        seeds.append((x, 0))
        if h > 1:
            seeds.append((x, h - 1))
    for y in range(1, h - 1):
        seeds.append((0, y))
        if w > 1:
            seeds.append((w - 1, y))

    for seed in seeds:
        if bg.getpixel(seed) == 255:
            ImageDraw.floodfill(bg, seed, 0, thresh=0)

    return bg

def crop_one(path):
    with Image.open(path) as im:
        original_size = im.size
        if original_size[0] < 4 or original_size[1] < 4:
            return False, original_size, original_size

        rgb = im.convert("RGB")
        bg = background_mask(rgb)

        # Foreground = everything not classified as exterior white background.
        fg = ImageChops.invert(bg)
        bbox = fg.getbbox()
        if not bbox:
            return False, original_size, original_size

        left, top, right, bottom = bbox
        left = max(0, left - PADDING)
        top = max(0, top - PADDING)
        right = min(rgb.width, right + PADDING)
        bottom = min(rgb.height, bottom + PADDING)
        crop_box = (left, top, right, bottom)

        if crop_box == (0, 0, rgb.width, rgb.height):
            return False, original_size, original_size

        cropped = im.crop(crop_box)

        # Preserve the existing extension exactly.
        ext = path.suffix.lower()
        if ext in {".jpg", ".jpeg"}:
            if cropped.mode not in ("RGB", "L"):
                cropped = cropped.convert("RGB")
            cropped.save(path, format="JPEG", quality=95, optimize=True, progressive=True)
        elif ext == ".png":
            cropped.save(path, format="PNG", optimize=True)
        elif ext == ".webp":
            cropped.save(path, format="WEBP", quality=95, method=6)
        else:
            return False, original_size, original_size

        return True, original_size, cropped.size

def main():
    files = sorted(p for p in ROOT.iterdir() if p.is_file() and p.suffix.lower() in EXTS)
    changed = 0
    unchanged = 0
    print(f"Found {len(files)} root uploaded images")
    for path in files:
        try:
            did, before, after = crop_one(path)
            if did:
                changed += 1
                print(f"CROPPED {path.name}: {before} -> {after}")
            else:
                unchanged += 1
                print(f"UNCHANGED {path.name}: {before}")
        except Exception as exc:
            print(f"ERROR {path.name}: {exc}")
            raise
    print(f"SUMMARY changed={changed} unchanged={unchanged} total={len(files)}")

if __name__ == "__main__":
    main()

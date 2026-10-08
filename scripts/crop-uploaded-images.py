#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path("frontend/public/uploaded")
EXTS = {".jpg", ".jpeg", ".png"}
# Conservative thresholds: only border-connected near-white/very-light neutral pixels
# are treated as removable background. White pixels inside the artwork are preserved.
WHITE_MIN = 238
NEUTRAL_SPREAD = 24

def crop_one(path: Path):
    with Image.open(path) as im:
        original_mode = im.mode
        rgba = im.convert("RGBA")
        arr = np.asarray(rgba)
        rgb = arr[..., :3].astype(np.int16)
        alpha = arr[..., 3]

        # Candidate background: very light and close to neutral white.
        mx = rgb.max(axis=2)
        mn = rgb.min(axis=2)
        neutral = (mx - mn) <= NEUTRAL_SPREAD
        light = mn >= WHITE_MIN
        candidate = light & neutral & (alpha > 0)

        # Connected components without OpenCV: use scipy if available, otherwise
        # a scanline flood fill. The runner installs scipy in the workflow.
        from scipy import ndimage
        labels, count = ndimage.label(candidate, structure=np.ones((3, 3), dtype=np.uint8))
        if count == 0:
            return False, im.size, im.size, "no-background"

        border_labels = set()
        border_labels.update(np.unique(labels[0, :]).tolist())
        border_labels.update(np.unique(labels[-1, :]).tolist())
        border_labels.update(np.unique(labels[:, 0]).tolist())
        border_labels.update(np.unique(labels[:, -1]).tolist())
        border_labels.discard(0)

        if not border_labels:
            return False, im.size, im.size, "no-border-background"

        bg = np.isin(labels, list(border_labels))
        # Preserve transparent pixels as background too, but only for bounding-box
        # calculation; this is especially useful for existing PNG assets.
        bg |= alpha == 0

        fg = ~bg
        ys, xs = np.where(fg)
        if len(xs) == 0:
            return False, im.size, im.size, "empty-foreground"

        left, right = int(xs.min()), int(xs.max()) + 1
        top, bottom = int(ys.min()), int(ys.max()) + 1
        box = (left, top, right, bottom)

        if box == (0, 0, im.width, im.height):
            return False, im.size, im.size, "already-tight"

        cropped = im.crop(box)

        # Keep the exact original filename and extension. JPEG cannot store alpha.
        if path.suffix.lower() in {".jpg", ".jpeg"}:
            out = cropped.convert("RGB")
            out.save(path, format="JPEG", quality=95, optimize=True, progressive=True)
        else:
            cropped.save(path, format="PNG", optimize=True)

        return True, im.size, cropped.size, f"crop={box}"

def main():
    files = sorted(p for p in ROOT.iterdir() if p.is_file() and p.suffix.lower() in EXTS)
    if not files:
        raise SystemExit("No product images found.")

    report = []
    changed = 0
    for p in files:
        try:
            did, old, new, reason = crop_one(p)
            changed += int(did)
            report.append(f"{p.name}\t{old[0]}x{old[1]}\t{new[0]}x{new[1]}\t{'CROPPED' if did else 'UNCHANGED'}\t{reason}")
        except Exception as exc:
            raise SystemExit(f"Failed on {p}: {exc}") from exc

    report_path = ROOT / ".crop-verification.txt"
    report_path.write_text(
        f"source_count={len(files)}\nchanged_count={changed}\n"
        "filename\tbefore\tafter\tstatus\tdetail\n" + "\n".join(report) + "\n",
        encoding="utf-8"
    )
    print(f"Processed {len(files)} images; cropped {changed}.")
    print(report_path)

if __name__ == "__main__":
    main()

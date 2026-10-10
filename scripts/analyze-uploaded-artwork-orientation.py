#!/usr/bin/env python3
"""Report dimensions and orientation for original images directly in uploaded."""

from collections import Counter
from pathlib import Path
import csv
import re

from PIL import Image, UnidentifiedImageError

ROOT = Path("frontend/public/uploaded")
OUT = Path("reports/uploaded-artwork-orientation")
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
CODE_PATTERN = re.compile(r"gilas([a-z0-9]{3})", re.IGNORECASE)
SQUARE_TOLERANCE = 0.03


def artwork_code(filename: str) -> str:
    match = CODE_PATTERN.search(filename)
    return f"Gilas{match.group(1)}" if match else ""


def classify(width: int, height: int) -> tuple[str, str, float]:
    ratio = width / height
    if abs(ratio - 1.0) <= SQUARE_TOLERANCE:
        return "مربع", "بدون جهت افقی/عمودی", ratio
    if width > height:
        return "مستطیل", "افقی", ratio
    return "مستطیل", "عمودی", ratio


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit(f"Uploaded root directory not found: {ROOT}")
    files = sorted(p for p in ROOT.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS)
    if not files:
        raise SystemExit(f"No supported images found directly inside {ROOT}")

    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for path in files:
        code = artwork_code(path.name)
        try:
            with Image.open(path) as image:
                width, height = image.size
                shape, orientation, ratio = classify(width, height)
                rows.append({
                    "filename": path.name, "artwork_code": code,
                    "width_px": width, "height_px": height,
                    "aspect_ratio_width_div_height": f"{ratio:.5f}",
                    "shape": shape, "orientation": orientation,
                    "status": "OK" if code else "کد در نام فایل پیدا نشد",
                })
        except (OSError, UnidentifiedImageError, ValueError) as exc:
            rows.append({
                "filename": path.name, "artwork_code": code,
                "width_px": "", "height_px": "",
                "aspect_ratio_width_div_height": "",
                "shape": "نامشخص", "orientation": "نامشخص",
                "status": f"خطا در خواندن تصویر: {type(exc).__name__}",
            })

    fields = ["filename", "artwork_code", "width_px", "height_px",
              "aspect_ratio_width_div_height", "shape", "orientation", "status"]
    csv_path = OUT / "uploaded-artwork-orientation.csv"
    with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    good = [r for r in rows if r["shape"] != "نامشخص"]
    square = [r for r in good if r["shape"] == "مربع"]
    horizontal = [r for r in good if r["orientation"] == "افقی"]
    vertical = [r for r in good if r["orientation"] == "عمودی"]
    no_code = [r for r in rows if not r["artwork_code"]]
    unreadable = [r for r in rows if r["shape"] == "نامشخص"]
    code_counts = Counter(r["artwork_code"] for r in good if r["artwork_code"])

    md = [
        "# گزارش ابعاد و جهت تابلوهای GilasArt", "",
        f"- تعداد فایل‌های تصویری بررسی‌شده در ریشه uploaded: **{len(files)}**",
        f"- تصاویر مربع (تلورانس نسبت ابعاد ۳٪): **{len(square)}**",
        f"- مستطیل‌های افقی: **{len(horizontal)}**",
        f"- مستطیل‌های عمودی: **{len(vertical)}**",
        f"- تصاویر با خطای خواندن ابعاد: **{len(unreadable)}**",
        f"- فایل‌های بدون کد قابل استخراج از نام: **{len(no_code)}**",
        f"- کدهای تابلو یکتای استخراج‌شده: **{len(code_counts)}**", "",
        "## تابلوهای مربع", "",
    ]
    md.extend(f"- {r['artwork_code'] or 'بدون کد'} — {r['filename']} ({r['width_px']}×{r['height_px']})" for r in square)
    md.extend(["", "## مستطیل‌های افقی", ""])
    md.extend(f"- {r['artwork_code'] or 'بدون کد'} — {r['filename']} ({r['width_px']}×{r['height_px']})" for r in horizontal)
    md.extend(["", "## مستطیل‌های عمودی", ""])
    md.extend(f"- {r['artwork_code'] or 'بدون کد'} — {r['filename']} ({r['width_px']}×{r['height_px']})" for r in vertical)
    md.extend(["", "## فایل‌های نیازمند بررسی", ""])
    if not no_code and not unreadable:
        md.append("- موردی وجود ندارد.")
    for r in no_code:
        md.append(f"- کد از نام فایل استخراج نشد: {r['filename']}")
    for r in unreadable:
        md.append(f"- ابعاد خوانده نشد: {r['filename']} — {r['status']}")
    md.extend(["", "## کدهای تکراری", ""])
    duplicates = sorted(code for code, count in code_counts.items() if count > 1)
    md.extend(f"- {code}: {code_counts[code]} فایل" for code in duplicates)
    if not duplicates:
        md.append("- کد تکراری بین تصاویر قابل‌خواندن پیدا نشد.")
    md.extend([
        "", "> گزارش فقط خواندنی است؛ هیچ تصویر، نام فایل، دیتابیس یا داده محصولی تغییر نکرده است.",
        "> تصاویر داخل پوشه‌های فرعی مانند thumb در شمارش وارد نشده‌اند.",
    ])
    summary_path = OUT / "uploaded-artwork-orientation-summary.md"
    summary_path.write_text("\n".join(md) + "\n", encoding="utf-8")
    print("\n".join(md[:10]))
    print(f"CSV: {csv_path}")
    print(f"Summary: {summary_path}")


if __name__ == "__main__":
    main()

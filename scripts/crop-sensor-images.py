# -*- coding: utf-8 -*-
"""Crop each KY module photo from the 37 SENSOR KIT reference chart."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC_CANDIDATES = [
    Path(r"C:\Users\PULSE Electronics\AppData\Roaming\Cursor\User\workspaceStorage\7687a200917627bbcee8c0d9fe527237\images\image-792518c8-ef28-4faa-b701-0e58a21b7658.jpg"),
    Path(r"C:\Users\PULSE Electronics\.cursor\projects\c-Users-PULSE-Electronics-OneDrive-Desktop-FShMN-Semestri-5-IOT-Excel\assets\c__Users_PULSE_Electronics_AppData_Roaming_Cursor_User_workspaceStorage_7687a200917627bbcee8c0d9fe527237_images_image-792518c8-ef28-4faa-b701-0e58a21b7658.jpg"),
]

# 6x6 chart cells; last cell holds BOTH KY-031 and KY-010
CODES_36 = [
    "KY-023", "KY-026", "KY-016", "KY-039", "KY-027", "KY-003",
    "KY-019", "KY-024", "KY-009", "KY-034", "KY-017", "KY-001",
    "KY-037", "KY-036", "KY-011", "KY-008", "KY-020", "KY-013",
    "KY-038", "KY-028", "KY-029", "KY-004", "KY-018", "KY-005",
    "KY-033", "KY-012", "KY-025", "KY-002", "KY-015", "KY-022",
    "KY-032", "KY-006", "KY-021", "KY-040", "KY-035", "KY-031",
]


def find_src() -> Path:
    for p in SRC_CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError("Reference kit image not found")


def make_card(crop: Image.Image, size: int = 400) -> Image.Image:
    crop = crop.filter(ImageFilter.SHARPEN)
    crop = ImageEnhance.Contrast(crop).enhance(1.2)
    crop = ImageEnhance.Color(crop).enhance(1.05)
    scale = min((size - 32) / max(crop.width, 1), (size - 32) / max(crop.height, 1))
    nw = max(1, int(crop.width * scale))
    nh = max(1, int(crop.height * scale))
    resized = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (236, 245, 246))
    # subtle inner frame
    frame = Image.new("RGB", (size - 16, size - 16), (255, 255, 255))
    canvas.paste(frame, (8, 8))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2))
    return canvas


def main() -> None:
    src = find_src()
    im = Image.open(src).convert("RGB")
    w, h = im.size
    print(f"Opened {src.name} ({w}x{h})")

    # Tuned for this photo: title overlaps top of row 0; paper ends before table
    left, right = 6, 1018
    top, bottom = 125, 670
    cols, rows = 6, 6
    cw = (right - left) / cols
    ch = (bottom - top) / rows
    print(f"cell {cw:.1f}x{ch:.1f}")

    out_dir = ROOT / "public" / "sensors"
    out_dir.mkdir(parents=True, exist_ok=True)
    for p in out_dir.glob("ky-*.jpg"):
        p.unlink()

    im.save(ROOT / "public" / "kit-reference.jpg", quality=92)

    dbg = im.copy()
    draw = ImageDraw.Draw(dbg)
    mapping: dict[str, str] = {}

    def save_code(code: str, box: tuple[int, int, int, int]) -> None:
        x0, y0, x1, y1 = box
        draw.rectangle([x0, y0, x1, y1], outline=(220, 40, 40), width=2)
        crop = im.crop((x0, y0, x1, y1))
        card = make_card(crop)
        fname = f"{code.lower()}.jpg"
        card.save(out_dir / fname, quality=93, optimize=True)
        mapping[code] = f"/sensors/{fname}"
        print(f"{code} -> {fname} {box}")

    for i, code in enumerate(CODES_36):
        r, c = divmod(i, cols)
        cx0 = left + c * cw
        cy0 = top + r * ch
        cx1 = left + (c + 1) * cw
        cy1 = top + (r + 1) * ch

        # Photo region: skip top (title/pins edge) and bottom labels
        x0 = int(cx0 + cw * 0.08)
        x1 = int(cx1 - cw * 0.08)
        top_pad = 0.28 if r == 0 else 0.10  # row 0 sits under title overlay
        y0 = int(cy0 + ch * top_pad)
        y1 = int(cy0 + ch * 0.82)

        if code == "KY-031":
            # Last cell contains KY-031 (left) + KY-010 (right)
            mid = (x0 + x1) // 2
            save_code("KY-031", (x0, y0, mid - 2, y1))
            save_code("KY-010", (mid + 2, y0, x1, y1))
        else:
            save_code(code, (x0, y0, x1, y1))

    dbg.save(out_dir / "_debug-boxes.jpg", quality=85)

    # Previews
    for name, start in (("_preview-row1.jpg", 0), ("_preview-row6.jpg", 30)):
        preview = Image.new("RGB", (400 * 6, 400), (255, 255, 255))
        for i in range(start, start + 6):
            code = CODES_36[i]
            p = Image.open(out_dir / f"{code.lower()}.jpg")
            preview.paste(p, ((i - start) * 400, 0))
        # also show KY-010 after row6 preview
        if start == 30:
            p10 = Image.open(out_dir / "ky-010.jpg")
            # append below
            wide = Image.new("RGB", (400 * 6, 800), (255, 255, 255))
            wide.paste(preview, (0, 0))
            wide.paste(p10, (0, 400))
            wide.save(out_dir / name, quality=90)
        else:
            preview.save(out_dir / name, quality=90)

    map_path = ROOT / "src" / "data" / "sensor-images.json"
    map_path.write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    print(f"Wrote {len(mapping)} mapped images")


if __name__ == "__main__":
    main()

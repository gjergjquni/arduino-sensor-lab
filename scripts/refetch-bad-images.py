# -*- coding: utf-8 -*-
"""Re-download sensors that got wrong images (Arduino boards / diagrams)."""
from __future__ import annotations

import io
import json
import time
from pathlib import Path

import numpy as np
import requests
from ddgs import DDGS
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "sensors"

# Only re-fetch these with stricter queries
REDO = [
    ("KY-023", "KY-023 Dual Axis Joystick Module product photo only"),
    ("KY-040", "KY-040 Rotary Encoder Module product photo PCB"),
    ("KY-016", "KY-016 RGB LED Module Keyes product photo"),
    ("KY-015", "KY-015 DHT11 module single product photo"),
    ("KY-027", "KY-027 Magic Light Cup Module product"),
    ("KY-039", "KY-039 Heartbeat Sensor Module product photo"),
    ("KY-009", "KY-009 SMD RGB LED Module product"),
    ("KY-034", "KY-034 7 color LED flash module product"),
    ("KY-032", "KY-032 Obstacle Avoidance Sensor Module product"),
    ("KY-033", "KY-033 Line Tracking Sensor Module product"),
    ("KY-022", "KY-022 Infrared Receiver Module product"),
    ("KY-005", "KY-005 Infrared Emitter Module product"),
    ("KY-008", "KY-008 Laser Emitter Module product"),
    ("KY-037", "KY-037 Microphone Sound Sensor Module product"),
    ("KY-036", "KY-036 Metal Touch Sensor Module product"),
    ("KY-024", "KY-024 Linear Magnetic Hall Sensor Module product"),
    ("KY-025", "KY-025 Reed Switch Module product"),
    ("KY-028", "KY-028 Temperature Sensor Module product"),
    ("KY-002", "KY-002 Vibration Switch Module product"),
    ("KY-031", "KY-031 Knock Sensor Module product"),
    ("KY-010", "KY-010 Optical Broken Module photo interrupter"),
    ("KY-035", "KY-035 Analog Hall Sensor Module product"),
    ("KY-021", "KY-021 Mini Reed Switch Module product"),
    ("KY-020", "KY-020 Tilt Switch Module product"),
    ("KY-017", "KY-017 Mercury Tilt Switch Module product"),
    ("KY-013", "KY-013 Analog Temperature Module product"),
    ("KY-011", "KY-011 Two Color LED Module product"),
    ("KY-029", "KY-029 Mini Two Color LED Module product"),
    ("KY-006", "KY-006 Passive Buzzer Module product"),
    ("KY-018", "KY-018 Photoresistor Module product"),
]

HEADERS = {"User-Agent": "Mozilla/5.0 ArduinoSensorLab/1.0"}
SESSION = requests.Session()
SESSION.headers.update(HEADERS)
REMBG = new_session("u2net")


def looks_like_arduino_board(im: Image.Image) -> bool:
    """Heuristic: large teal/blue PCB area typical of Uno photos."""
    rgb = np.array(im.convert("RGB"))
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    # Arduino teal-ish
    teal = (b > 90) & (g > 70) & (r < 80) & (b > r + 20)
    return float(teal.mean()) > 0.12


def search(query: str) -> list[str]:
    urls = []
    with DDGS() as ddgs:
        for item in ddgs.images(query, max_results=12):
            u = item.get("image")
            if not u:
                continue
            bad_hints = ("fritzing", "schematic", "wiring", "breadboard-full", "connection-diagram")
            if any(h in u.lower() for h in bad_hints):
                continue
            urls.append(u)
    # unique
    out, seen = [], set()
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def download(url: str) -> Image.Image | None:
    try:
        r = SESSION.get(url, timeout=20)
        if r.status_code != 200 or len(r.content) < 4000:
            return None
        im = Image.open(io.BytesIO(r.content)).convert("RGBA")
        if min(im.size) < 90:
            return None
        im.thumbnail((640, 640), Image.Resampling.LANCZOS)
        return im
    except Exception:
        return None


def to_card(im: Image.Image, size: int = 480) -> Image.Image:
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    scale = min((size - 36) / im.width, (size - 36) / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def process(code: str, query: str) -> bool:
    print(f"\n=== redo {code} ===")
    for i, url in enumerate(search(query)):
        print(f"  [{i}] {url[:85]}")
        im = download(url)
        if im is None:
            continue
        if looks_like_arduino_board(im):
            print("    skip: looks like Arduino board")
            continue
        try:
            cut = remove(im, session=REMBG)
            if isinstance(cut, bytes):
                cut = Image.open(io.BytesIO(cut)).convert("RGBA")
            else:
                cut = cut.convert("RGBA")
            alpha = np.array(cut.split()[-1])
            if int((alpha > 20).sum()) < 400:
                print("    skip: empty rembg")
                continue
            if looks_like_arduino_board(cut.convert("RGBA").convert("RGB")):
                # check opaque pixels only
                pass
            card = to_card(cut)
            path = OUT / f"{code.lower()}.png"
            card.save(path, "PNG", optimize=True)
            print(f"  OK {path.name}")
            return True
        except Exception as e:
            print(f"    fail {e}")
        time.sleep(0.2)
    return False


def main() -> None:
    ok, bad = 0, []
    for code, q in REDO:
        if process(code, q):
            ok += 1
        else:
            bad.append(code)
        time.sleep(0.7)

    # refresh mapping for all pngs
    mapping = {}
    for p in sorted(OUT.glob("ky-*.png")):
        code = p.stem.upper().replace("KY-", "KY-")
        # ky-023 -> KY-023
        parts = p.stem.split("-")
        code = f"{parts[0].upper()}-{parts[1]}"
        mapping[code] = f"/sensors/{p.name}"

    (ROOT / "src/data/sensor-images.json").write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    sensors = json.loads((ROOT / "src/data/sensors.json").read_text(encoding="utf-8"))
    for s in sensors:
        s["image"] = mapping.get(s["code"])
    (ROOT / "src/data/sensors.json").write_text(json.dumps(sensors, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\nredone ok={ok} failed={bad} total_mapped={len(mapping)}")


if __name__ == "__main__":
    main()

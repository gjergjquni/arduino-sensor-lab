# -*- coding: utf-8 -*-
"""Download KY module photos from the web and remove backgrounds."""
from __future__ import annotations

import io
import json
import time
from pathlib import Path

import requests
from ddgs import DDGS
from PIL import Image
from rembg import new_session, remove

# Lightweight model (~176MB) - avoid huge bria-rmbg default
SESSION_REMBG = None


def get_rembg_session():
    global SESSION_REMBG
    if SESSION_REMBG is None:
        SESSION_REMBG = new_session("u2net")
    return SESSION_REMBG

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "sensors"
RAW = ROOT / "public" / "sensors" / "_raw"
OUT.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

# Search queries tuned to find product photos of each KY module
SENSORS = [
    ("KY-023", "KY-023 joystick module arduino"),
    ("KY-026", "KY-026 flame sensor module arduino"),
    ("KY-016", "KY-016 RGB LED module arduino"),
    ("KY-039", "KY-039 heartbeat pulse sensor module"),
    ("KY-027", "KY-027 magic light cup module"),
    ("KY-003", "KY-003 hall magnetic sensor module"),
    ("KY-019", "KY-019 5V relay module arduino"),
    ("KY-024", "KY-024 linear hall sensor module"),
    ("KY-009", "KY-009 SMD RGB LED module"),
    ("KY-034", "KY-034 7 color flash LED module"),
    ("KY-017", "KY-017 mercury tilt switch module"),
    ("KY-001", "KY-001 DS18B20 temperature sensor module"),
    ("KY-037", "KY-037 big sound microphone sensor module"),
    ("KY-036", "KY-036 metal touch sensor module"),
    ("KY-011", "KY-011 two color LED module"),
    ("KY-008", "KY-008 laser emitter module arduino"),
    ("KY-020", "KY-020 ball switch tilt module"),
    ("KY-013", "KY-013 analog temperature thermistor module"),
    ("KY-038", "KY-038 small sound microphone module"),
    ("KY-028", "KY-028 digital temperature sensor module"),
    ("KY-029", "KY-029 mini two color LED module"),
    ("KY-004", "KY-004 button key switch module"),
    ("KY-018", "KY-018 photoresistor LDR module"),
    ("KY-005", "KY-005 IR infrared emission LED module"),
    ("KY-033", "KY-033 line tracking sensor module"),
    ("KY-012", "KY-012 active buzzer module"),
    ("KY-025", "KY-025 reed switch module"),
    ("KY-002", "KY-002 shock vibration sensor module"),
    ("KY-015", "KY-015 DHT11 temperature humidity module"),
    ("KY-022", "KY-022 IR receiver module arduino"),
    ("KY-032", "KY-032 obstacle avoidance IR module"),
    ("KY-006", "KY-006 passive buzzer module"),
    ("KY-021", "KY-021 mini reed switch module"),
    ("KY-040", "KY-040 rotary encoder module arduino"),
    ("KY-035", "KY-035 analog hall sensor module"),
    ("KY-031", "KY-031 tap knock sensor module"),
    ("KY-010", "KY-010 optical light blocking interrupter module"),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ArduinoSensorLab/1.0 Educational",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)


def search_urls(query: str, n: int = 8) -> list[str]:
    urls: list[str] = []
    try:
        with DDGS() as ddgs:
            for item in ddgs.images(query, max_results=n):
                u = item.get("image") or item.get("url")
                if not u:
                    continue
                if any(u.lower().endswith(ext) or ext in u.lower() for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif")):
                    urls.append(u)
                elif "http" in u:
                    urls.append(u)
    except Exception as e:
        print(f"  search error: {e}")
    # de-dupe
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def download(url: str) -> Image.Image | None:
    try:
        r = SESSION.get(url, timeout=25, stream=True)
        if r.status_code != 200:
            return None
        ctype = r.headers.get("Content-Type", "")
        if "image" not in ctype and not any(x in url.lower() for x in (".jpg", ".png", ".webp", ".jpeg")):
            return None
        data = r.content
        if len(data) < 3000:
            return None
        im = Image.open(io.BytesIO(data)).convert("RGBA")
        if im.width < 80 or im.height < 80:
            return None
        # Keep small for fast rembg on CPU
        im.thumbnail((640, 640), Image.Resampling.LANCZOS)
        return im
    except Exception:
        return None


def to_square_png(im: Image.Image, size: int = 512) -> Image.Image:
    # Fit module on transparent square
    im = im.convert("RGBA")
    # trim mostly-transparent edges
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    scale = min((size - 40) / im.width, (size - 40) / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def process_one(code: str, query: str) -> str | None:
    out_path = OUT / f"{code.lower()}.png"
    print(f"\n=== {code} ===")
    print(f"  query: {query}")
    urls = search_urls(query)
    print(f"  candidates: {len(urls)}")
    for i, url in enumerate(urls):
        print(f"  try[{i}] {url[:90]}...")
        im = download(url)
        if im is None:
            print("    download failed")
            continue
        raw_path = RAW / f"{code.lower()}-src.jpg"
        try:
            im.convert("RGB").save(raw_path, quality=90)
        except Exception:
            pass
        try:
            cut = remove(im, session=get_rembg_session())
            if isinstance(cut, bytes):
                cut = Image.open(io.BytesIO(cut)).convert("RGBA")
            else:
                cut = cut.convert("RGBA")
            # Reject if almost empty after rembg
            import numpy as np

            alpha = np.array(cut.split()[-1])
            if int((alpha > 20).sum()) < 400:
                print("    rembg too empty")
                continue
            card = to_square_png(cut, size=480)
            card.save(out_path, "PNG", optimize=True)
            print(f"  OK -> {out_path.name}")
            return f"/sensors/{out_path.name}"
        except Exception as e:
            print(f"    rembg failed: {e}")
            continue
        finally:
            time.sleep(0.25)
    return None


def main() -> None:
    # Remove old jpg crops from kit chart so they are not used
    for p in OUT.glob("ky-*.jpg"):
        p.unlink()

    # Warm rembg session once
    print("Loading rembg u2net...")
    get_rembg_session()
    print("Model ready.")

    mapping: dict[str, str] = {}
    failed: list[str] = []

    # Resume: keep existing PNGs
    for code, _ in SENSORS:
        existing = OUT / f"{code.lower()}.png"
        if existing.exists() and existing.stat().st_size > 5000:
            mapping[code] = f"/sensors/{existing.name}"
            print(f"skip existing {code}")

    for idx, (code, query) in enumerate(SENSORS, 1):
        if code in mapping:
            continue
        print(f"\n[{idx}/{len(SENSORS)}]")
        path = process_one(code, query)
        if path:
            mapping[code] = path
        else:
            failed.append(code)
        time.sleep(0.8)  # be polite to search API

    map_path = ROOT / "src" / "data" / "sensor-images.json"
    map_path.write_text(json.dumps(mapping, indent=2), encoding="utf-8")

    # Merge into sensors.json
    sensors_path = ROOT / "src" / "data" / "sensors.json"
    sensors = json.loads(sensors_path.read_text(encoding="utf-8"))
    for s in sensors:
        s["image"] = mapping.get(s["code"])
    sensors_path.write_text(json.dumps(sensors, ensure_ascii=False, indent=2), encoding="utf-8")

    print("\n==== DONE ====")
    print(f"success: {len(mapping)}/{len(SENSORS)}")
    if failed:
        print("failed:", ", ".join(failed))


if __name__ == "__main__":
    main()

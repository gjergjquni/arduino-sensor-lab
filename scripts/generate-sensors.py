# -*- coding: utf-8 -*-
"""Generate enriched sensors.ts from Excel-exported JSON."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = json.loads((ROOT / "src/data/sensors-raw.json").read_text(encoding="utf-8"))
_IMG_PATH = ROOT / "src/data/sensor-images.json"
IMAGES: dict[str, str] = (
    json.loads(_IMG_PATH.read_text(encoding="utf-8")) if _IMG_PATH.exists() else {}
)

# Short English labels for icons / filters
CATEGORY_META = {
    "Hyrje / Kontroll": {"icon": "gamepad", "color": "#0d9488"},
    "Sensor drite / zjarri": {"icon": "flame", "color": "#ea580c"},
    "Dalje / Ndriçim": {"icon": "lightbulb", "color": "#eab308"},
    "Sensor biometrik": {"icon": "heart", "color": "#e11d48"},
    "Sensor anim / Dritë": {"icon": "tilt", "color": "#8b5cf6"},
    "Sensor magnetik": {"icon": "magnet", "color": "#2563eb"},
    "Dalje / Komutim": {"icon": "relay", "color": "#dc2626"},
    "Sensor anim": {"icon": "tilt", "color": "#7c3aed"},
    "Sensor temperature": {"icon": "thermo", "color": "#f97316"},
    "Sensor zëri": {"icon": "mic", "color": "#0891b2"},
    "Sensor prekje": {"icon": "touch", "color": "#db2777"},
    "Dalje / Dritë": {"icon": "laser", "color": "#ef4444"},
    "Sensor dridhje / anim": {"icon": "shake", "color": "#a855f7"},
    "Komunikim IR": {"icon": "ir", "color": "#be123c"},
    "Sensor optik": {"icon": "eye", "color": "#0284c7"},
    "Dalje / Zë": {"icon": "speaker", "color": "#0ea5e9"},
    "Sensor dridhje": {"icon": "shake", "color": "#9333ea"},
    "Sensor temperature / lagështie": {"icon": "droplet", "color": "#14b8a6"},
    "Sensor pengese": {"icon": "radar", "color": "#f59e0b"},
    "Sensor goditje": {"icon": "tap", "color": "#c026d3"},
    "Sensor drite": {"icon": "sun", "color": "#ca8a04"},
}

PRINCIPLE = {
    1: "Dy potenciometra ndryshojnë tensionin analog në boshtin X/Y; butoni SW është kontakt digjital.",
    2: "Dioda IR reagon ndaj rrezatimit 760–1100 nm të flakës; LM393 krahasues jep prag digjital.",
    3: "Tre LED (R/G/B) me katodë të përbashkët; intensiteti kontrollohet me PWM.",
    4: "Pulsi ndryshon absorbimin e dritës IR nëpër gisht; fototransistori e shndërron në sinjal analog.",
    5: "Sfera e zhives mbyll kontaktin kur moduli anohet; LED-i ndizet nga pini L.",
    6: "Efekti Hall: fusha magnetike ndryshon gjendjen e A3144 (dalje digjitale).",
    7: "Sinjali digjital nga Arduino aktivizon bobinën e relés; kontakti mekanik komuton ngarkesën.",
    8: "SS49E jep tension linear sipas fushës; LM393 shton prag digjital.",
    9: "LED RGB SMD 5050; kërkon rezistorë të jashtëm për çdo kanal.",
    10: "Çipi i brendshëm ciklon automatikisht 7 ngjyra kur moduli furnizohet.",
    11: "Sfera e zhives mbyll/hap qarkun sipas këndit të animit.",
    12: "DS18B20 komunikon temperaturën digjitale përmes bus-it 1-Wire.",
    13: "Mikrofoni jep sinjal analog; LM393 krahason me pragun e potenciometrit.",
    14: "Prekja e elektrodës ndryshon kapacitetin/tensionin; moduli jep A0 dhe D0.",
    15: "Dy LED (e kuqe/e gjelbër) me katodë të përbashkët.",
    16: "Dioda lazer 650 nm emeton rreze të kuqe kur pini S është HIGH.",
    17: "Sfera metalike mbyll kontaktin sipas pozitës së modulit.",
    18: "Termistori NTC ndryshon rezistencën me temperaturën; ndarësi i tensionit jep sinjal analog.",
    19: "Mikrofon i vogël + LM393 për prag digjital dhe lexim analog.",
    20: "NTC + LM393: D0 ndryshon kur temperatura kalon pragun e potenciometrit.",
    21: "Dy LED të vogla (3 mm) për sinjalizim statusi.",
    22: "Butoni mbyll qarkun; rezistori 10kΩ stabilizon leximin digjital.",
    23: "LDR: më shumë dritë → më pak rezistencë → tension i ndryshëm në A0.",
    24: "LED IR 940 nm emeton impulse të padukshme për komunikim IR.",
    25: "TCRT5000 mat reflektimin IR: sipërfaqe e bardhë vs e zezë.",
    26: "Osilatori i brendshëm gjeneron ton kur moduli merr tension.",
    27: "Kontakti reed në qelq mbyllet pranë magnetit; LM393 jep A0/D0.",
    28: "Susta lëviz dhe mbyll kontaktin kur moduli goditet.",
    29: "DHT11 mat temperaturën dhe lagështinë dhe i dërgon digjitalisht në pin.",
    30: "VS1838B demodulon sinjalet IR 38 kHz nga telekomanda.",
    31: "Çifti IR emetues/marrës detekton pengesa në 2–40 cm.",
    32: "Pa oscilator të brendshëm; frekuenca e tonit vjen nga PWM/tone().",
    33: "Reed i vogël me pull-up 10kΩ; mbyllet pranë magnetit.",
    34: "Dy sinjale kuadrature (CLK/DT) tregojnë drejtimin; SW është buton.",
    35: "Sensori Hall 49E jep tension analog proporcional me fushën dhe polaritetin.",
    36: "Susta reaguese detekton trokitje/goditje të lehta.",
    37: "Photo-interrupter U: objekti ndërpret rrezen midis LED dhe fotodetektorit.",
}

SAFETY = {
    7: "Kujdes: kontakti i relés mund të lidhet me 230V AC. Punoni vetëm nën mbikëqyrje dhe me izolim të duhur.",
    16: "Mos e drejtoni rrezen lazer në sy - rrezik për dëmtim të retinës.",
}


def infer_output(wiring: str, category: str) -> str:
    w = wiring.lower()
    has_a = "analogread" in w or "→a0" in w or "a0→" in w
    has_d = "digitalread" in w or "digitalwrite" in w or "pwm" in w or "tone(" in w
    if "analogwrite" in w or "pwm" in w:
        if "digital" in w or "digitalwrite" in w:
            return "PWM / Digjitale"
        return "PWM"
    if has_a and ("d0" in w or "digitalread" in w):
        return "Analoge + Digjitale"
    if has_a:
        return "Analoge"
    if "1-wire" in w.lower() or "onewire" in w.lower() or "dht" in w.lower() or "irremote" in w.lower():
        return "Digjitale (protokoll)"
    return "Digjitale"


def infer_power(wiring: str) -> str:
    if "5v" in wiring.lower() or "+→" in wiring or "middle→5v" in wiring.lower() or "v+→" in wiring.lower():
        return "5V (Arduino Uno)"
    if "'-'→gnd" in wiring.lower() or "→gnd" in wiring.lower():
        # laser/buzzer often only S and GND, still 5V logic via S
        return "5V përmes pin-it të sinjalit / GND"
    return "5V (tipike për KY module)"


def infer_pins(wiring: str, name: str) -> list[dict]:
    pins = []
    pairs = re.findall(
        r"([A-Za-z0-9+'\-]+)\s*→\s*([^,\.]+)",
        wiring.replace("p.sh. ", ""),
    )
    for src, dst in pairs:
        src = src.strip().strip("'")
        dst = dst.strip()
        role = "Sinjal"
        if src.upper() in ("G", "GND", "-") or "gnd" in dst.lower():
            role = "Tokë"
        elif src in ("+", "V+", "5V", "+5V") or "5v" in dst.lower():
            role = "Furnizim"
        elif src.upper() in ("MIDDLE",):
            role = "Furnizim"
        elif "pwm" in dst.lower() or src.upper() in ("R", "G", "B", "L"):
            role = "PWM / Dalje"
        elif src.upper() in ("SW", "CLK", "DT", "EN", "OUT", "S", "A0", "D0", "VRX", "VRY"):
            role = "Sinjal"
        pins.append({"module": src, "arduino": dst[:80], "role": role})
    if not pins:
        pins = [{"module": "S", "arduino": "sipas udhëzimit", "role": "Sinjal"}]
    return pins


def components_for(s: dict) -> list[str]:
    base = ["Arduino Uno (ose kompatibël)", f"Moduli {s['name']}", "Kabllo jumper (meshë femër-meshë)"]
    w = s["wiring"].lower()
    name = s["name"].lower()
    if "220" in w or "rezistor" in w or "smd rgb" in name or "two-color" in name:
        base.append("Rezistorë 220Ω (nëse nuk janë në modul)")
    if "onewire" in w or "dallas" in w:
        base.append("Libraria OneWire + DallasTemperature")
        base.append("Rezistor pull-up 4.7kΩ (shpesh i nevojshëm në bus 1-Wire)")
    if "dht" in w:
        base.append("Libraria DHT (Adafruit)")
    if "irremote" in w:
        base.append("Libraria IRremote")
    if "relay" in name:
        base.append("Ngarkesë e jashtme (vetëm nëse e dini si ta lidhni në mënyrë të sigurt)")
    return base


def code_example(s: dict) -> dict | None:
    sid = s["id"]
    code = None
    notes = []
    if sid == 1:
        code = """const int VRx = A0;
const int VRy = A1;
const int SW = 2;

void setup() {
  Serial.begin(9600);
  pinMode(SW, INPUT_PULLUP);
}

void loop() {
  int x = analogRead(VRx);
  int y = analogRead(VRy);
  int btn = digitalRead(SW); // LOW kur shtypet
  Serial.print("X="); Serial.print(x);
  Serial.print(" Y="); Serial.print(y);
  Serial.print(" SW="); Serial.println(btn);
  delay(100);
}"""
        notes = [
            "analogRead() kthen 0–1023 për çdo bosht.",
            "INPUT_PULLUP: butoni lexohet LOW kur shtypet.",
        ]
    elif sid == 2:
        code = """const int flameA = A0;
const int flameD = 2;

void setup() {
  Serial.begin(9600);
  pinMode(flameD, INPUT);
}

void loop() {
  int raw = analogRead(flameA);
  int alert = digitalRead(flameD);
  Serial.print("Analog="); Serial.print(raw);
  Serial.print(" Digital="); Serial.println(alert);
  delay(200);
}"""
        notes = ["Rregulloni potenciometrin për pragun digjital.", "Vlera analoge bie kur ka flakë (varësisht modulit)."]
    elif sid == 3:
        code = """const int R = 9, G = 10, B = 11;

void setup() {
  pinMode(R, OUTPUT);
  pinMode(G, OUTPUT);
  pinMode(B, OUTPUT);
}

void loop() {
  analogWrite(R, 255); analogWrite(G, 0);   analogWrite(B, 0);   delay(500); // kuqe
  analogWrite(R, 0);   analogWrite(G, 255); analogWrite(B, 0);   delay(500); // gjelbër
  analogWrite(R, 0);   analogWrite(G, 0);   analogWrite(B, 255); delay(500); // blu
}"""
        notes = ["Përdorni pina PWM (~).", "0 = fikur, 255 = intensitet maksimal (për katodë të përbashkët mund të jetë e kundërta)."]
    elif sid == 4:
        code = """const int sensorPin = A0;
int threshold = 30;
int last = 0;

void setup() { Serial.begin(9600); }

void loop() {
  int v = analogRead(sensorPin);
  if (abs(v - last) > threshold) {
    Serial.println("Rrahje e mundshme");
  }
  last = v;
  delay(20);
}"""
        notes = ["Vendoseni gishtin midis LED IR dhe fototransistorit.", "Ky shembull është thjeshtuar - BPM kërkon filtrimin e sinjalit."]
    elif sid in (6, 11, 17, 22, 25, 28, 33, 36, 37):
        code = f"""const int sensorPin = 2;

void setup() {{
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
}}

void loop() {{
  int state = digitalRead(sensorPin);
  Serial.println(state == HIGH ? "HIGH" : "LOW");
  delay(100);
}}"""
        notes = ["Ndryshoni pin-in sipas lidhjes suaj.", "Disa module janë aktive LOW - provojeni me Serial Monitor."]
    elif sid == 7:
        code = """const int relayPin = 7;

void setup() { pinMode(relayPin, OUTPUT); }

void loop() {
  digitalWrite(relayPin, HIGH); // aktivizo
  delay(1000);
  digitalWrite(relayPin, LOW);  // çaktivizo
  delay(1000);
}"""
        notes = ["Testoni fillimisht vetëm anën e sinjalit 5V.", "Mos lidhni 230V pa mbikëqyrje profesionale."]
    elif sid in (8, 13, 14, 19, 20, 27):
        code = """const int pinA = A0;
const int pinD = 2;

void setup() {
  Serial.begin(9600);
  pinMode(pinD, INPUT);
}

void loop() {
  Serial.print("A0="); Serial.print(analogRead(pinA));
  Serial.print(" D0="); Serial.println(digitalRead(pinD));
  delay(200);
}"""
        notes = ["A0 = nivel analog, D0 = prag digjital.", "Rregulloni potenciometrin në modul nëse ka."]
    elif sid in (9, 15, 21):
        code = """const int LED1 = 9;
const int LED2 = 10;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
}

void loop() {
  digitalWrite(LED1, HIGH); digitalWrite(LED2, LOW);  delay(400);
  digitalWrite(LED1, LOW);  digitalWrite(LED2, HIGH); delay(400);
}"""
        notes = ["Për RGB SMD shtoni rezistorë 220Ω në çdo kanal.", "Kontrolloni polaritetin e katodës/anodës."]
    elif sid in (10, 16, 26):
        code = """const int outPin = 8;

void setup() { pinMode(outPin, OUTPUT); }

void loop() {
  digitalWrite(outPin, HIGH);
  delay(1000);
  digitalWrite(outPin, LOW);
  delay(1000);
}"""
        notes = ["HIGH ndez daljen (buzzer aktiv / lazer / flash)."]
    elif sid == 12:
        code = """#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float t = sensors.getTempCByIndex(0);
  Serial.print("Temp: "); Serial.print(t); Serial.println(" C");
  delay(1000);
}"""
        notes = ["Instaloni libraritë OneWire dhe DallasTemperature.", "Shpesh nevojitet pull-up 4.7kΩ midis S dhe 5V."]
    elif sid == 18:
        code = """const int tempPin = A0;

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(tempPin);
  float v = raw * (5.0 / 1023.0);
  // Përafrim i thjeshtë - për saktësi përdorni Steinhart-Hart
  Serial.print("raw="); Serial.print(raw);
  Serial.print(" V="); Serial.println(v, 3);
  delay(500);
}"""
        notes = ["Excel përmend ekuacionin Steinhart-Hart për °C.", "Ky kod tregon vetëm leximin e papërpunuar."]
    elif sid == 23:
        code = """const int ldrPin = A0;

void setup() { Serial.begin(9600); }

void loop() {
  int light = analogRead(ldrPin); // 0–1023
  Serial.println(light);
  delay(200);
}"""
        notes = ["Vlera e lartë/ulët varet nga skema e ndarësit të tensionit."]
    elif sid == 24:
        code = """#include <IRremote.hpp>
const int IR_SEND_PIN = 3;

void setup() {
  IrSender.begin(IR_SEND_PIN);
}

void loop() {
  IrSender.sendNEC(0x00FF00FF, 32); // shembull kodi
  delay(1000);
}"""
        notes = ["Përdorni pinin e rekomanduar nga libraria IRremote (shpesh D3).", "Kodi NEC është shembull - përshtateni me marrësin tuaj."]
    elif sid == 29:
        code = """#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println("Lexim i dështuar");
    return;
  }
  Serial.print("T="); Serial.print(t);
  Serial.print("C H="); Serial.print(h); Serial.println("%");
  delay(2000);
}"""
        notes = ["Instaloni librarinë DHT sensor library (Adafruit).", "Prisni ~2s midis leximëve."]
    elif sid == 30:
        code = """#include <IRremote.hpp>
const int RECV_PIN = 11;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(RECV_PIN, ENABLE_LED_FEEDBACK);
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
    IrReceiver.resume();
  }
}"""
        notes = ["Drejtoni telekomandën drejt modulit KY-022.", "Shikoni kodet HEX në Serial Monitor."]
    elif sid == 31:
        code = """const int avoidPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(avoidPin, INPUT);
}

void loop() {
  if (digitalRead(avoidPin) == LOW) {
    Serial.println("Pengese!");
  }
  delay(50);
}"""
        notes = ["Rregulloni potenciometrat e distancës/frekuencës në modul.", "Gjendja aktive LOW/HIGH varët nga moduli."]
    elif sid == 32:
        code = """const int buzzer = 8;

void setup() {}

void loop() {
  tone(buzzer, 440);  // La4
  delay(300);
  noTone(buzzer);
  delay(200);
  tone(buzzer, 880);
  delay(300);
  noTone(buzzer);
  delay(500);
}"""
        notes = ["tone() funksionon me buzzer pasiv.", "Ndryshoni frekuencën për melodi."]
    elif sid == 34:
        code = """const int CLK = 2;
const int DT = 3;
const int SW = 4;
int lastCLK;

void setup() {
  Serial.begin(9600);
  pinMode(CLK, INPUT);
  pinMode(DT, INPUT);
  pinMode(SW, INPUT_PULLUP);
  lastCLK = digitalRead(CLK);
}

void loop() {
  int clk = digitalRead(CLK);
  if (clk != lastCLK && clk == HIGH) {
    if (digitalRead(DT) != clk) Serial.println("CW");
    else Serial.println("CCW");
  }
  lastCLK = clk;
  if (digitalRead(SW) == LOW) Serial.println("CLICK");
}"""
        notes = ["Leximi me interrupt është më i besueshëm për rrotullim të shpejtë.", "Mund të përdorni librarinë Encoder."]
    elif sid in (5,):
        code = """const int tiltPin = 2;
const int ledPin = 9;

void setup() {
  pinMode(tiltPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int tilted = digitalRead(tiltPin);
  analogWrite(ledPin, tilted ? 255 : 0);
}"""
        notes = ["Light Cup zakonisht përdoret në çift.", "S = input tilt, L = LED PWM."]
    elif sid == 35:
        code = """const int hallPin = A0;

void setup() { Serial.begin(9600); }

void loop() {
  int v = analogRead(hallPin);
  Serial.println(v);
  delay(100);
}"""
        notes = ["Vlera ndryshon me largësinë dhe polaritetin e magnetit."]
    else:
        return None

    return {
        "language": "arduino",
        "title": f"Shembull bazë për {s['name']}",
        "code": code,
        "notes": notes,
        "verified": False,
        "disclaimer": "Shembull edukativ - nuk është verifikuar kundër hardware-it tuaj specifik. Kontrolloni pinout-in e modulit dhe rregulloni pinat.",
    }


def applications(purpose: str) -> list[str]:
    parts = re.split(r"[,;]", purpose)
    apps = [p.strip().rstrip(".") for p in parts if p.strip()]
    return apps or [purpose]


def short_desc(desc: str) -> str:
    if len(desc) <= 110:
        return desc
    cut = desc[:107]
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut + "…"


enriched = []
for s in RAW:
    meta = CATEGORY_META.get(s["category"], {"icon": "chip", "color": "#00878F"})
    item = {
        **s,
        "shortDescription": short_desc(s["description"]),
        "icon": meta["icon"],
        "accent": meta["color"],
        "outputType": infer_output(s["wiring"], s["category"]),
        "power": infer_power(s["wiring"]),
        "pins": infer_pins(s["wiring"], s["name"]),
        "principle": PRINCIPLE.get(s["id"], "Moduli shndërron një madhësi fizike në sinjal elektrik të lexueshëm nga Arduino."),
        "applications": applications(s["purpose"]),
        "components": components_for(s),
        "safety": SAFETY.get(s["id"]),
        "codeExample": code_example(s),
        "tags": list(
            {
                s["code"].lower(),
                *[t.lower() for t in re.split(r"[\s/]+", s["category"]) if t],
                *re.findall(r"[a-z0-9]+", s["name"].lower()),
            }
        ),
        "image": IMAGES.get(s["code"]),
    }
    enriched.append(item)

out_json = ROOT / "src/data/sensors.json"
out_json.write_text(json.dumps(enriched, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {len(enriched)} sensors to {out_json}")

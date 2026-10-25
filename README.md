# Arduino Sensor Lab

Uebfaqe edukative për **Arduino 37 Sensor Kit** - e ndërtuar me React, Vite dhe TypeScript.

Të dhënat e 37 sensorëve (emri, kategoria, përshkrimi, qëllimi, lidhja me Arduino) janë nxjerrë nga `37_Sensor_Kit_Arduino.xlsx`. Shembujt e kodit, projektet dhe quiz-et janë materiale shtesë edukative dhe janë të etiketuara si të tilla.

## Nisja lokale

```bash
cd arduino-sensor-lab
npm install
npm run dev
```

Hapni URL-në që shfaq Vite (zakonisht `http://localhost:5173`).

## Skripte

| Komanda        | Përshkrimi              |
|----------------|-------------------------|
| `npm run dev`  | Server zhvillimi         |
| `npm run build`| Build prodhimi          |
| `npm run preview` | Parapamje e build-it |

## Rifreskimi i të dhënave nga Excel

1. Eksportoni përsëri JSON nga Excel (ose rivendosni `src/data/sensors-raw.json`).
2. Ekzekutoni:

```bash
python scripts/generate-sensors.py
```

## Fotot e sensorëve

Fotot në `public/sensors/*.png` janë shkarkuar nga interneti (foto produkti KY) dhe u është hequr background-i (`rembg` / u2net).

```bash
python scripts/fetch-sensor-images.py
# opsionale: ripërtëritje për foto të gabuara
python scripts/refetch-bad-images.py
```

## Struktura

- `src/data/` - sensorë, projekte, quiz, learn
- `src/pages/` - faqet e aplikacionit
- `src/components/` - UI i ripërdorshëm
- `src/hooks/useProgress.ts` - progresi në `localStorage`

## Faqet

- `/` - landing
- `/sensors` - biblioteka + kërkim/filtra
- `/sensors/:slug` - detaje sensori
- `/learn` - IoT & Arduino
- `/learn/quiz` & `/learn/flashcards` - vlerësim interaktiv
- `/projects` - mini-projekte të sugjeruara

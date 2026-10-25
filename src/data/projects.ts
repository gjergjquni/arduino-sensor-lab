export interface Project {
  id: string
  title: string
  level: 'Fillestar' | 'Mesatar' | 'I avancuar'
  duration: string
  summary: string
  objective: string
  sensors: string[]
  components: string[]
  steps: string[]
  wiring: string[]
  code?: string
  notes: string[]
  sourceNote: string
}

export const projects: Project[] = [
  {
    id: 'stacion-moti',
    title: 'Stacion i vogël moti',
    level: 'Fillestar',
    duration: '45–60 min',
    summary:
      'Lexoni temperaturën dhe lagështinë me DHT11 dhe shfaqini në Serial Monitor.',
    objective:
      'Të kuptoni si një sensor digjital dërgon dy madhësi mjedisore te Arduino.',
    sensors: ['KY-015 Temp and Humidity (DHT11)'],
    components: [
      'Arduino Uno',
      'KY-015 DHT11',
      'Kabllo jumper',
      'Libraria DHT (Adafruit)',
    ],
    steps: [
      'Lidhni S→D2, middle→5V, −→GND sipas Excel.',
      'Instaloni librarinë DHT në Arduino IDE.',
      'Ngarkoni kodin dhe hapni Serial Monitor (9600 baud).',
      'Krahasoni leximin me temperaturën e dhomës.',
    ],
    wiring: ['S → D2', 'middle → 5V', '− → GND'],
    code: `#include <DHT.h>
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
  Serial.print(t); Serial.print(" C, ");
  Serial.print(h); Serial.println(" %");
  delay(2000);
}`,
    notes: [
      'Prisni ~2 sekonda midis leximëve.',
      'Nëse leximi dështon, kontrolloni polaritetin e pinave.',
    ],
    sourceNote:
      'Projekt i sugjeruar për mësim - jo pjesë e skedarit Excel. Lidhja e KY-015 bazohet në Excel.',
  },
  {
    id: 'lampe-automatike',
    title: 'Lampë automatike me LDR',
    level: 'Fillestar',
    duration: '30–45 min',
    summary:
      'Kur drita bie, ndizni një LED (ose RGB) duke lexuar fotorezistorin.',
    objective: 'Të lidhni një sensor analog me një dalje PWM/digjitale.',
    sensors: ['KY-018 Photoresistor', 'KY-016 RGB LED'],
    components: ['Arduino Uno', 'KY-018', 'KY-016', 'Jumpera'],
    steps: [
      'Lidhni LDR: S→A0, middle→5V, −→GND.',
      'Lidhni RGB: R/G/B në pina PWM, −→GND.',
      'Kalibroni pragun e dritës me Serial Monitor.',
      'Ndizni LED kur vlera kalon pragun.',
    ],
    wiring: ['LDR S → A0', 'RGB R→D9, G→D10, B→D11, −→GND'],
    code: `const int ldr = A0;
const int led = 9;
const int threshold = 400;

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(ldr);
  Serial.println(light);
  digitalWrite(led, light < threshold ? HIGH : LOW);
  delay(100);
}`,
    notes: [
      'Pragu 400 është shembull - rregulloni sipas dhomës suaj.',
      'Mund të përdorni KY-011 Two-Color në vend të RGB.',
    ],
    sourceNote:
      'Projekt i sugjeruar. Përshkrimet e moduleve vijnë nga Excel; logjika e projektit është shtesë edukative.',
  },
  {
    id: 'alarm-zjarri',
    title: 'Alarm zjarri me flakë + buzzer',
    level: 'Mesatar',
    duration: '45–60 min',
    summary:
      'Kur sensor i flakës detekton IR të flakës, aktivizoni buzzer-in aktiv.',
    objective: 'Të kombinoni sensor digjital me dalje zanore për alarm.',
    sensors: ['KY-026 Flame', 'KY-012 Buzzer (aktiv)'],
    components: ['Arduino Uno', 'KY-026', 'KY-012', 'Jumpera'],
    steps: [
      'Lidhni Flame: G→GND, +→5V, D0→D2 (opsional A0→A0).',
      'Lidhni Buzzer: S→D8, −→GND.',
      'Rregulloni potenciometrin e ndjeshmërisë në KY-026.',
      'Testoni me burim të sigurt IR (p.sh. flakë e kontrolluar / çakmak në distancë të sigurt).',
    ],
    wiring: ['Flame D0 → D2', 'Buzzer S → D8'],
    code: `const int flameD = 2;
const int buzzer = 8;

void setup() {
  pinMode(flameD, INPUT);
  pinMode(buzzer, OUTPUT);
}

void loop() {
  bool fire = digitalRead(flameD) == LOW; // shpesh aktive LOW
  digitalWrite(buzzer, fire ? HIGH : LOW);
}`,
    notes: [
      'Disa module Flame janë aktive HIGH - kontrolloni me Serial.',
      'Mos përdorni zjarr të hapur pranë pajisjeve elektronike.',
    ],
    sourceNote: 'Projekt i sugjeruar edukativ, jo nga Excel.',
  },
  {
    id: 'line-follower-basics',
    title: 'Bazat e line follower',
    level: 'Mesatar',
    duration: '60 min',
    summary:
      'Lexoni KY-033 Tracking mbi vijë të zezë/bardhë dhe sinjalizoni me LED.',
    objective: 'Të kuptoni reflektimin IR për robotë ndjekës vije.',
    sensors: ['KY-033 Tracking', 'KY-011 Two-Color'],
    components: ['Arduino Uno', 'KY-033', 'KY-011', 'Sipërfaqe me vijë të zezë'],
    steps: [
      'Lidhni Tracking: S→D2, V+→5V, G→GND.',
      'Lidhni Two-Color për status (e gjelbër = vijë, e kuqe = jashtë).',
      'Kalibroni mbi letër të bardhë dhe shirit të zi.',
      'Shikoni ndryshimin e digitalRead në Serial Monitor.',
    ],
    wiring: ['Tracking S → D2', 'LED R→D9, G→D10'],
    code: `const int track = 2;
const int red = 9;
const int green = 10;

void setup() {
  pinMode(track, INPUT);
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  bool onLine = digitalRead(track) == LOW;
  digitalWrite(green, onLine);
  digitalWrite(red, !onLine);
}`,
    notes: ['Për robot të plotë nevojiten dy/tre sensorë dhe motorë.'],
    sourceNote: 'Projekt i sugjeruar. KY-033 lidhja sipas Excel.',
  },
  {
    id: 'telekomande-ir',
    title: 'Kontroll me telekomandë IR',
    level: 'Mesatar',
    duration: '60–75 min',
    summary:
      'Merrni kodet e telekomandës me KY-022 dhe ndizni LED ose buzzer.',
    objective: 'Të përdorni protokolle IR dhe librarinë IRremote.',
    sensors: ['KY-022 IR Receiver', 'KY-016 RGB LED'],
    components: ['Arduino Uno', 'KY-022', 'KY-016', 'Telekomandë TV', 'IRremote'],
    steps: [
      'Lidhni marrësin: S→D11, middle→5V, −→GND.',
      'Printoni kodet HEX në Serial Monitor.',
      'Maponi një kod te ndezja e LED.',
      'Opsionale: dërgoni me KY-005 IR Emission.',
    ],
    wiring: ['IR Receiver S → D11'],
    code: `#include <IRremote.hpp>
const int RECV_PIN = 11;
const int led = 9;

void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  IrReceiver.begin(RECV_PIN, ENABLE_LED_FEEDBACK);
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
    digitalWrite(led, !digitalRead(led));
    IrReceiver.resume();
  }
}`,
    notes: ['Zëvendësoni logjikën me krahasim të kodit konkret të butonit tuaj.'],
    sourceNote: 'Projekt i sugjeruar. Pinout KY-022 nga Excel.',
  },
  {
    id: 'joystick-rgb',
    title: 'Joystick që kontrollon ngjyrën RGB',
    level: 'I avancuar',
    duration: '60–90 min',
    summary:
      'Boshti X/Y i joystick-ut kontrollon kanalet e LED RGB; butoni fik/ndez.',
    objective: 'Të kombinoni dy hyrje analoge me tre dalje PWM.',
    sensors: ['KY-023 Joystick', 'KY-016 RGB LED'],
    components: ['Arduino Uno', 'KY-023', 'KY-016', 'Jumpera'],
    steps: [
      'Lidhni Joystick: GND, 5V, VRx→A0, VRy→A1, SW→D2.',
      'Lidhni RGB në pina PWM.',
      'Maponi 0–1023 të joystick-ut në 0–255 PWM.',
      'Përdorni butonin për të fikur ngjyrën.',
    ],
    wiring: ['VRx→A0, VRy→A1, SW→D2', 'R→D9, G→D10, B→D11'],
    code: `const int VRx = A0, VRy = A1, SW = 2;
const int R = 9, G = 10, B = 11;

void setup() {
  pinMode(SW, INPUT_PULLUP);
  pinMode(R, OUTPUT); pinMode(G, OUTPUT); pinMode(B, OUTPUT);
}

void loop() {
  if (digitalRead(SW) == LOW) {
    analogWrite(R, 0); analogWrite(G, 0); analogWrite(B, 0);
    return;
  }
  analogWrite(R, map(analogRead(VRx), 0, 1023, 0, 255));
  analogWrite(G, map(analogRead(VRy), 0, 1023, 0, 255));
  analogWrite(B, 80);
}`,
    notes: ['Mapimi është shembull - eksperimentoni me ngjyra.'],
    sourceNote: 'Projekt i sugjeruar edukativ.',
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

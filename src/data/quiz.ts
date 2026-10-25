export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  relatedSensor?: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  category: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Çfarë kthen analogRead() në Arduino Uno?',
    options: ['0 ose 1', '0 deri 255', '0 deri 1023', 'Tekst ASCII'],
    correctIndex: 2,
    explanation: 'ADC 10-bit i Uno jep vlera 0–1023 për 0–5V (zakonisht).',
  },
  {
    id: 'q2',
    question: 'Cili modul mat temperaturën dhe lagështinë?',
    options: ['KY-018', 'KY-015 DHT11', 'KY-012', 'KY-023'],
    correctIndex: 1,
    explanation: 'KY-015 Temp and Humidity (DHT11) mat T dhe RH.',
    relatedSensor: 'ky-015-temp-and-humidity-dht11',
  },
  {
    id: 'q3',
    question: 'Joystick KY-023 zakonisht lidh VRx dhe VRy në…',
    options: ['Pina digjitale', 'Pina analoge A0/A1', 'USB', 'SPI'],
    correctIndex: 1,
    explanation: 'Sipas Excel: VRx→A0, VRy→A1, SW→pin digjital.',
    relatedSensor: 'ky-023-joystick',
  },
  {
    id: 'q4',
    question: 'Buzzer aktiv KY-012 ndryshe nga pasivi…',
    options: [
      'Kërkon tone() për çdo frekuencë',
      'Ka oscilator të brendshëm dhe ton me digitalWrite',
      'Punon vetëm me 3.3V',
      'Nuk ka nevojë për GND',
    ],
    correctIndex: 1,
    explanation: 'Aktiv: oscilator i brendshëm. Pasiv (KY-006): tone()/PWM.',
    relatedSensor: 'ky-012-buzzer-aktiv',
  },
  {
    id: 'q5',
    question: 'DS18B20 (KY-001) komunikon me…',
    options: ['I2C', 'SPI', '1-Wire', 'UART'],
    correctIndex: 2,
    explanation: 'Excel: protokolli 1-Wire; libraritë OneWire + DallasTemperature.',
    relatedSensor: 'ky-001-ds18b20-temp',
  },
  {
    id: 'q6',
    question: 'Për çfarë përdoret KY-033 Tracking?',
    options: [
      'Matje lagështie',
      'Robotë ndjekës vije (line follower)',
      'Emëtim lazer',
      'Matje pulsi',
    ],
    correctIndex: 1,
    explanation: 'Sensor IR reflektues TCRT5000 për vijë të zezë/bardhë.',
    relatedSensor: 'ky-033-tracking',
  },
  {
    id: 'q7',
    question: 'Pse është e rëndësishme lidhja GND e përbashkët?',
    options: [
      'Për të rritur tensionin',
      'Për referencë të përbashkët të sinjalit',
      'Për të çaktivizuar USB',
      'Nuk është e nevojshme',
    ],
    correctIndex: 1,
    explanation: 'Pa GND të përbashkët, tensionet e sinjalit nuk kanë referencë të qëndrueshme.',
  },
  {
    id: 'q8',
    question: 'KY-019 Relay mund të komutojë…',
    options: [
      'Vetëm LED 5V',
      'Ngarkesa më të mëdha (deri ~10A/250VAC) - me kujdes',
      'Vetëm sinjale I2C',
      'Bateri LiPo direkt në A0',
    ],
    correctIndex: 1,
    explanation: 'Excel: rele 5V deri 10A/250VAC. Kujdes me 230V!',
    relatedSensor: 'ky-019-relay',
  },
  {
    id: 'q9',
    question: 'Dalja e KY-018 Photoresistor lexohet tipikisht me…',
    options: ['digitalWrite', 'analogRead', 'tone', 'SPI.transfer'],
    correctIndex: 1,
    explanation: 'Excel: S→A0 … analogRead() (0–1023).',
    relatedSensor: 'ky-018-photoresistor',
  },
  {
    id: 'q10',
    question: 'KY-022 IR Receiver zakonisht punon në frekuencë…',
    options: ['2.4 GHz', '38 kHz', '433 MHz', '60 Hz'],
    correctIndex: 1,
    explanation: 'Marrës IR 38 kHz (VS1838B) për telekomanda.',
    relatedSensor: 'ky-022-ir-receiver',
  },
]

export const flashcards: Flashcard[] = [
  {
    id: 'f1',
    front: 'KY-026 Flame',
    back: 'Detekton IR të flakës 760–1100 nm; A0 + D0. Përdorim: alarm zjarri.',
    category: 'Sensor drite / zjarri',
  },
  {
    id: 'f2',
    front: 'analogWrite vs digitalWrite',
    back: 'digitalWrite: HIGH/LOW. analogWrite: PWM 0–255 në pina ~.',
    category: 'Arduino',
  },
  {
    id: 'f3',
    front: 'KY-040 Rotary Encoder',
    back: 'CLK, DT, SW - rrotullim + klik. Navigim meny / volum.',
    category: 'Hyrje / Kontroll',
  },
  {
    id: 'f4',
    front: 'Hall vs Reed',
    back: 'Hall: efekt elektronik magnetik. Reed: kontakt mekanik në qelq që mbyllet pranë magnetit.',
    category: 'Sensor magnetik',
  },
  {
    id: 'f5',
    front: 'KY-032 Avoidance',
    back: 'IR shmangie pengesash 2–40 cm; potenciometra për distancë/frekuencë.',
    category: 'Sensor pengese',
  },
  {
    id: 'f6',
    front: 'DHT11 diapazoni',
    back: 'Temp 0–50°C (±2°C), lagështi 20–90% (±5%) sipas Excel.',
    category: 'Sensor temperature / lagështie',
  },
  {
    id: 'f7',
    front: 'INPUT_PULLUP',
    back: 'Aktivizon rezistorin e brendshëm pull-up; butoni shpesh lidhet me GND dhe lexohet LOW kur shtypet.',
    category: 'Arduino',
  },
  {
    id: 'f8',
    front: 'KY-008 Laser',
    back: 'Lazer 650 nm, 5 mW. Mos e drejto në sy! S→pin digjital.',
    category: 'Dalje / Dritë',
  },
  {
    id: 'f9',
    front: 'LM393 në module KY',
    back: 'Krahasues që kthen sinjal analog në prag digjital (D0), shpesh me potenciometër.',
    category: 'Elektronikë',
  },
  {
    id: 'f10',
    front: 'KY-010 Light Blocking',
    back: 'Photo-interrupter në formë U - numërim, RPM, end-stop.',
    category: 'Sensor optik',
  },
]

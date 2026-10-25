export interface LearnSection {
  id: string
  title: string
  summary: string
  content: string[]
  bullets?: string[]
}

export const learnSections: LearnSection[] = [
  {
    id: 'iot',
    title: 'Çfarë është IoT?',
    summary: 'Internet of Things lidh objekte fizike me rrjetin për matje dhe kontroll.',
    content: [
      'IoT (Internet of Things) është rrjeti i pajisjeve fizike - sensorë, aktuatorë, mikrokontrollues - që mbledhin të dhëna dhe shpesh i dërgojnë në cloud ose në një server lokal.',
      'Në këtë laboratori, Arduino është “truri” lokal: lexon sensorët e kitit 37 Sensor Kit dhe reagon me LED, buzzer, rele ose komunikim IR.',
      'Zinxhiri tipik IoT: bota fizike → sensor → mikrokontrollues → (opsionale) rrjet → vendimmarrje → aktuator.',
    ],
    bullets: [
      'Sensori mat (temperaturë, dritë, lëvizje…)',
      'Arduino përpunon dhe vendos',
      'Aktuatori vepron (dritë, zë, motor, rele)',
    ],
  },
  {
    id: 'arduino',
    title: 'Bazat e Arduino Uno',
    summary: 'Uno është mikrokontrollues miqësor për fillestarë me pina digjitale dhe analoge.',
    content: [
      'Arduino Uno bazuar në ATmega328P ka pina digjitale (0–13), pina analoge (A0–A5), 5V, 3.3V dhe GND.',
      'Pina me shenjën ~ mbështesin PWM (analogWrite) - të dobishme për LED RGB dhe buzzer pasiv.',
      'Programet kanë dy funksione kryesore: setup() (një herë) dhe loop() (përsëritet vazhdimisht).',
    ],
    bullets: [
      'digitalRead / digitalWrite - HIGH ose LOW',
      'analogRead - 0 deri 1023 (ADC 10-bit)',
      'analogWrite - 0 deri 255 (PWM)',
    ],
  },
  {
    id: 'sensors',
    title: 'Si mbledhin të dhëna sensorët?',
    summary: 'Sensorët shndërrojnë madhësi fizike në sinjal elektrik.',
    content: [
      'Një sensor analog ndryshon tensionin; Arduino e lexon me analogRead(). Shembuj nga kiti: LDR, termistor, joystick, Hall analog.',
      'Një sensor digjital jep HIGH/LOW ose komunikim me protokoll (1-Wire për DS18B20, bus për DHT11, IR për telekomanda).',
      'Shumë module KY kanë LM393 dhe potenciometër: ju rregulloni pragun e daljes digjitale (D0) ndërsa A0 mbetet analog.',
    ],
    bullets: [
      'Analoge → nivele të vazhdueshme',
      'Digjitale → gjendje ose mesazhe',
      'Kalibrimi është pjesë e eksperimentit',
    ],
  },
  {
    id: 'wiring',
    title: 'Rregulla të arta të lidhjes',
    summary: 'Polariteti, GND i përbashkët dhe rryma e sigurt janë kritike.',
    content: [
      'Lidhni gjithmonë GND e modulit me GND e Arduino. Pa tokë të përbashkët, leximet janë të paqëndrueshme.',
      'Shumica e moduleve KY punojnë me 5V. Kontrolloni Excel-in për çdo sensor: S, A0, D0, middle, + / −.',
      'Rele, lazer dhe 230V kërkojnë kujdes të veçantë. Filloni gjithmonë me teste me tension të ulët.',
    ],
    bullets: [
      'Mos lidhni 5V në pin digjital si hyrje pa skemë',
      'Përdorni rezistorë kur moduli i kërkon',
      'Verifikoni polaritetin para se të jepni energji',
    ],
  },
  {
    id: 'projects-path',
    title: 'Nga leximi te projekti real',
    summary: 'Filloni me Serial Monitor, pastaj shtoni aktuatorë dhe logjikë.',
    content: [
      'Hapi 1: lexoni një sensor dhe printoni vlerën. Hapi 2: shtoni prag (if). Hapi 3: lidhni LED/buzzer/rele. Hapi 4: kombinoni dy sensorë.',
      'Projekte reale: stacion moti, alarm dhome, ndriçim automatik, robot që shmang pengesa, kontroll me telekomandë.',
      'Dokumentoni kalibrimin: çfarë vlere kishit në dritë të plotë? Çfarë pragu zgjodhët për alarm?',
    ],
  },
]

export const learningPath = [
  { step: 1, title: 'Lexoni hyrjen IoT & Arduino', href: '/learn' },
  { step: 2, title: 'Eksploroni 37 sensorët', href: '/sensors' },
  { step: 3, title: 'Hapni një faqe detaji + kod', href: '/sensors' },
  { step: 4, title: 'Provoni një mini-projekt', href: '/projects' },
  { step: 5, title: 'Testoni veten me quiz & flashcards', href: '/learn/quiz' },
]

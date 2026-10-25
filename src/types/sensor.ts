export interface PinMapping {
  module: string
  arduino: string
  role: string
}

export interface CodeExample {
  language: string
  title: string
  code: string
  notes: string[]
  verified: boolean
  disclaimer: string
}

export interface Sensor {
  id: number
  slug: string
  code: string
  name: string
  category: string
  description: string
  purpose: string
  wiring: string
  shortDescription: string
  icon: string
  accent: string
  outputType: string
  power: string
  pins: PinMapping[]
  principle: string
  applications: string[]
  components: string[]
  safety: string | null
  codeExample: CodeExample | null
  tags: string[]
  /** Local photo cropped from the kit reference chart */
  image: string | null
}

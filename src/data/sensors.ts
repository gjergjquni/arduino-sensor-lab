import type { Sensor } from '../types/sensor'
import raw from './sensors.json'

export const sensors: Sensor[] = raw as Sensor[]

export const categories = Array.from(
  new Set(sensors.map((s) => s.category)),
).sort((a, b) => a.localeCompare(b, 'sq'))

export function getSensorBySlug(slug: string): Sensor | undefined {
  return sensors.find((s) => s.slug === slug)
}

export function getSensorById(id: number): Sensor | undefined {
  return sensors.find((s) => s.id === id)
}

export function searchSensors(query: string, category: string): Sensor[] {
  const q = query.trim().toLowerCase()
  return sensors.filter((s) => {
    const catOk = category === 'all' || s.category === category
    if (!catOk) return false
    if (!q) return true
    const hay = [
      s.name,
      s.code,
      s.category,
      s.description,
      s.purpose,
      s.wiring,
      s.outputType,
      ...s.tags,
      ...s.applications,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

export const SENSOR_COUNT = sensors.length

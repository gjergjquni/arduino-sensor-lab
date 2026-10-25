import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Sensor } from '../../types/sensor'
import { SensorIcon } from '../icons/SensorIcon'

export function SensorCard({ sensor, index = 0 }: { sensor: Sensor; index?: number }) {
  return (
    <article
      className="sensor-card"
      style={
        {
          '--accent': sensor.accent,
          animationDelay: `${Math.min(index, 12) * 0.04}s`,
        } as CSSProperties
      }
    >
      <div className="sensor-card-art">
        {sensor.image ? (
          <img
            className="sensor-photo"
            src={sensor.image}
            alt={sensor.name}
            loading="lazy"
            width={400}
            height={400}
          />
        ) : (
          <div className="sensor-glyph">
            <SensorIcon name={sensor.icon} />
          </div>
        )}
      </div>
      <div className="sensor-card-body">
        <span className="badge">{sensor.category}</span>
        <h3>{sensor.name}</h3>
        <p className="muted" style={{ margin: 0, flex: 1 }}>
          {sensor.shortDescription}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            {sensor.outputType}
          </span>
          <Link className="btn btn-secondary btn-sm" to={`/sensors/${sensor.slug}`}>
            Mëso më shumë
          </Link>
        </div>
      </div>
    </article>
  )
}

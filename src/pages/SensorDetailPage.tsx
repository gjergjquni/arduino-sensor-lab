import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSensorBySlug, sensors } from '../data/sensors'
import { WiringDiagram } from '../components/sensors/WiringDiagram'
import { CodeBlock } from '../components/sensors/CodeBlock'
import { SensorIcon } from '../components/icons/SensorIcon'
import { useProgress } from '../hooks/useProgress'

export function SensorDetailPage() {
  const { slug } = useParams()
  const sensor = slug ? getSensorBySlug(slug) : undefined
  const { markSensorViewed } = useProgress()

  useEffect(() => {
    if (sensor) markSensorViewed(sensor.slug)
  }, [sensor, markSensorViewed])

  if (!sensor) {
    return (
      <div className="container page-title">
        <div className="panel empty">
          <h1>Sensori nuk u gjet</h1>
          <p>Slug-i <code>{slug}</code> nuk përputhet me asnjë nga 37 modulet.</p>
          <Link className="btn btn-primary" to="/sensors">
            Kthehu te biblioteka
          </Link>
        </div>
      </div>
    )
  }

  const related = sensors
    .filter((s) => s.category === sensor.category && s.id !== sensor.id)
    .slice(0, 3)

  return (
    <div className="container detail-hero">
      <p className="breadcrumbs">
        <Link to="/sensors">Sensorët</Link> / {sensor.code}
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="detail-photo-wrap">
          {sensor.image ? (
            <img
              className="detail-photo"
              src={sensor.image}
              alt={sensor.name}
              width={280}
              height={280}
            />
          ) : (
            <div
              className="sensor-glyph"
              style={{
                width: 120,
                height: 120,
                color: sensor.accent,
                background: 'white',
                border: '1px solid var(--line)',
              }}
            >
              <SensorIcon name={sensor.icon} size={48} />
            </div>
          )}
          <p className="muted" style={{ fontSize: '0.75rem', margin: '0.4rem 0 0', textAlign: 'center' }}>
            Foto moduli (background i hequr)
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <span className="badge" style={{ ['--accent' as string]: sensor.accent }}>
            {sensor.category}
          </span>
          <h1 style={{ marginTop: '0.4rem' }}>{sensor.name}</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            {sensor.description}
          </p>
          <div className="meta-row">
            <span className="badge" style={{ ['--accent' as string]: '#00878F' }}>
              {sensor.outputType}
            </span>
            <span className="badge" style={{ ['--accent' as string]: '#d97706' }}>
              {sensor.power}
            </span>
            <span className="badge" style={{ ['--accent' as string]: '#64748b' }}>
              #{sensor.id} / 37
            </span>
          </div>
        </div>
      </div>

      <div className="detail-layout" style={{ marginTop: '1.25rem' }}>
        <div>
          <section className="panel">
            <h2>Nga Excel - përshkrimi</h2>
            <p>{sensor.description}</p>
            <h3 style={{ fontSize: '1rem' }}>Qëllimi pse përdoret</h3>
            <p>{sensor.purpose}</p>
            <h3 style={{ fontSize: '1rem' }}>Mënyra e lidhjes me Arduino</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{sensor.wiring}</p>
          </section>

          <section className="panel">
            <h2>Parimi i punës</h2>
            <p>{sensor.principle}</p>
            <h3 style={{ fontSize: '1rem' }}>Aplikime praktike</h3>
            <ul className="list-check">
              {sensor.applications.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>Komponentët e nevojshëm</h2>
            <ul className="list-check">
              {sensor.components.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {sensor.safety && <div className="warning">{sensor.safety}</div>}
          </section>

          {sensor.codeExample && (
            <section className="panel">
              <h2>{sensor.codeExample.title}</h2>
              <div className="disclaimer">{sensor.codeExample.disclaimer}</div>
              <CodeBlock code={sensor.codeExample.code} title="sketch.ino (edukativ)" />
              {sensor.codeExample.notes.length > 0 && (
                <>
                  <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>Rreshta të rëndësishëm</h3>
                  <ul className="list-check">
                    {sensor.codeExample.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
        </div>

        <aside>
          <section className="panel">
            <h2>Pinat & lidhja</h2>
            <table className="pin-table">
              <thead>
                <tr>
                  <th>Modul</th>
                  <th>Arduino</th>
                  <th>Roli</th>
                </tr>
              </thead>
              <tbody>
                {sensor.pins.map((p, i) => (
                  <tr key={`${p.module}-${i}`}>
                    <td>{p.module}</td>
                    <td>{p.arduino}</td>
                    <td>{p.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '1rem' }}>
              <WiringDiagram sensor={sensor} />
            </div>
          </section>

          <section className="panel">
            <h2>Specifikime të shpejta</h2>
            <div className="kv">
              <div className="kv-row">
                <span>Kodi</span>
                <span>{sensor.code}</span>
              </div>
              <div className="kv-row">
                <span>Kategoria</span>
                <span>{sensor.category}</span>
              </div>
              <div className="kv-row">
                <span>Dalja</span>
                <span>{sensor.outputType}</span>
              </div>
              <div className="kv-row">
                <span>Energjia</span>
                <span>{sensor.power}</span>
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="panel">
              <h2>Të ngjashëm</h2>
              <ul className="list-check">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link to={`/sensors/${r.slug}`}>{r.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

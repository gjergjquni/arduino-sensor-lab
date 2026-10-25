import { Link } from 'react-router-dom'
import { sensors, SENSOR_COUNT, categories } from '../data/sensors'
import { SensorCard } from '../components/sensors/SensorCard'
import { learningPath } from '../data/learn'
import { projects } from '../data/projects'
import { useProgress } from '../hooks/useProgress'

export function HomePage() {
  const featured = sensors.slice(0, 6)
  const { percent, progress } = useProgress()

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Laborator edukativ IoT</p>
            <h1 className="hero-brand">
              Arduino
              <br />
              Sensor <span>Lab</span>
            </h1>
            <p className="hero-lead">
              Eksploro 37 sensorët e Arduino Sensor Kit, lidhjen me Arduino Uno, shembujt e
              kodit dhe projektet praktike për lëndën IoT (Internet of Things).
            </p>
            <div className="hero-actions">
              <Link className="btn btn-copper" to="/sensors">
                Eksploro të gjithë sensorët
              </Link>
              <Link className="btn btn-secondary" to="/learn">
                Hyrje në IoT
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="board">
              <div className="board-top">
                <span>37 Sensor Kit · Uno</span>
                <span>Progresi yt: {percent}%</span>
              </div>
              <div className="chip-row">
                <div className="mini-chip">
                  <strong>{SENSOR_COUNT}</strong>
                  <span>Sensorë</span>
                </div>
                <div className="mini-chip">
                  <strong>{categories.length}</strong>
                  <span>Kategori</span>
                </div>
                <div className="mini-chip">
                  <strong>{projects.length}</strong>
                  <span>Projekte</span>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div className="progress-bar" aria-hidden>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: '0.65rem 0 0' }}>
                  {progress.viewedSensors.length}/{SENSOR_COUNT} sensorë të parë · quiz më i mirë{' '}
                  {progress.quizBest}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Pse ky lab?</p>
              <h2>Nga Excel te eksperimenti në tavolinë</h2>
            </div>
            <p>
              Çdo sensor ruan emrin, përshkrimin, qëllimin dhe mënyrën e lidhjes nga skedari
              burimor - pastaj shtohen shpjegime, diagrame dhe kod për mësim.
            </p>
          </div>
          <div className="feature-grid">
            {[
              {
                t: 'Bibliotekë e plotë',
                d: `Të ${SENSOR_COUNT} modulet KY me kërkim dhe filtra sipas kategorisë.`,
                i: '37',
              },
              {
                t: 'Lidhje & pinout',
                d: 'Udhëzime lidhjeje me Arduino Uno, tip daljeje dhe kërkesa energjie.',
                i: 'I/O',
              },
              {
                t: 'Kod fillestar',
                d: 'Shembuj Arduino me theks sintakse dhe buton kopjimi - të etiketuara si të neverifikuara.',
                i: '{ }',
              },
              {
                t: 'Quiz & progres',
                d: 'Flashcards, pyetje dhe tregues progresi për të forcuar njohuritë.',
                i: 'Q',
              },
            ].map((f) => (
              <article key={f.t} className="feature">
                <div className="feature-icon" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {f.i}
                </div>
                <h3 style={{ fontSize: '1.1rem' }}>{f.t}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {f.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">IoT në 30 sekonda</p>
              <h2>Si lidhen sensorët me botën reale</h2>
            </div>
            <Link className="btn btn-secondary btn-sm" to="/learn">
              Lexo udhëzuesin
            </Link>
          </div>
          <div className="panel">
            <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {learningPath.map((s) => (
                <li key={s.step} style={{ marginBottom: '0.55rem' }}>
                  <strong>
                    {s.step}. {s.title}
                  </strong>{' '}
                  - <Link to={s.href}>hap</Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Nga biblioteka</p>
              <h2>Sensorë të veçuar</h2>
            </div>
            <Link className="btn btn-primary btn-sm" to="/sensors">
              Shiko të gjithë
            </Link>
          </div>
          <div className="card-grid">
            {featured.map((s, i) => (
              <SensorCard key={s.id} sensor={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

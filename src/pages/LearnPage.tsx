import { Link } from 'react-router-dom'
import { learnSections, learningPath } from '../data/learn'
import { useProgress } from '../hooks/useProgress'
import { SENSOR_COUNT } from '../data/sensors'

export function LearnPage() {
  const { percent, progress } = useProgress()

  return (
    <div className="container page-title">
      <p className="eyebrow">Mësim i strukturuar</p>
      <h1>IoT, Arduino dhe sensorët</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Një udhëzues fillestar për të kuptuar si funksionon kiti, si mblidhen të dhënat
        dhe si kaloni te projektet reale.
      </p>

      <div className="panel" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <strong>Progresi i të nxënit</strong>
            <p className="muted" style={{ margin: '0.25rem 0 0' }}>
              {progress.viewedSensors.length}/{SENSOR_COUNT} sensorë · quiz {progress.quizBest}/10 ·
              flashcards {progress.flashcardsSeen.length}/10
            </p>
          </div>
          <strong style={{ color: 'var(--teal-700)' }}>{percent}%</strong>
        </div>
        <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link className="btn btn-primary btn-sm" to="/learn/quiz">
            Nis quiz
          </Link>
          <Link className="btn btn-secondary btn-sm" to="/learn/flashcards">
            Flashcards
          </Link>
        </div>
      </div>

      <div className="feature-grid" style={{ marginBottom: '1.5rem' }}>
        {learningPath.map((s) => (
          <Link key={s.step} to={s.href} className="feature">
            <div className="feature-icon">{s.step}</div>
            <h3 style={{ fontSize: '1.05rem' }}>{s.title}</h3>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {learnSections.map((section) => (
          <article key={section.id} id={section.id} className="panel">
            <p className="eyebrow">{section.id.toUpperCase()}</p>
            <h2>{section.title}</h2>
            <p className="muted">{section.summary}</p>
            {section.content.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="list-check">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useProgress } from '../hooks/useProgress'

export function ProjectsPage() {
  const { progress, toggleProject } = useProgress()

  return (
    <div className="container page-title">
      <p className="eyebrow">Praktikë</p>
      <h1>Mini-projekte me kitin</h1>
      <p className="muted" style={{ maxWidth: 640 }}>
        Këto projekte janë <strong>të sugjeruara për mësim</strong> dhe nuk janë pjesë e
        skedarit Excel. Lidhjet e moduleve bazohen te Excel; logjika e projektit është shtesë.
      </p>

      <div className="card-grid">
        {projects.map((p) => {
          const done = progress.completedProjects.includes(p.id)
          return (
            <article key={p.id} className="sensor-card" style={{ ['--accent' as string]: '#00878F' }}>
              <div className="sensor-card-art" style={{ height: 90 }}>
                <span className="badge">{p.level}</span>
              </div>
              <div className="sensor-card-body">
                <h3>{p.title}</h3>
                <p className="muted" style={{ margin: 0, flex: 1 }}>
                  {p.summary}
                </p>
                <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>
                  {p.duration} · {p.sensors.join(', ')}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link className="btn btn-primary btn-sm" to={`/projects/${p.id}`}>
                    Hap projektin
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleProject(p.id)}
                  >
                    {done ? '✓ Përfunduar' : 'Shëno si bërë'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

import { Link, useParams } from 'react-router-dom'
import { getProjectById } from '../data/projects'
import { CodeBlock } from '../components/sensors/CodeBlock'
import { useProgress } from '../hooks/useProgress'

export function ProjectDetailPage() {
  const { id } = useParams()
  const project = id ? getProjectById(id) : undefined
  const { progress, toggleProject } = useProgress()

  if (!project) {
    return (
      <div className="container page-title">
        <div className="panel empty">
          <h1>Projekti nuk u gjet</h1>
          <Link className="btn btn-primary" to="/projects">
            Kthehu te projektet
          </Link>
        </div>
      </div>
    )
  }

  const done = progress.completedProjects.includes(project.id)

  return (
    <div className="container detail-hero">
      <p className="breadcrumbs">
        <Link to="/projects">Projekte</Link> / {project.title}
      </p>
      <span className="badge">{project.level}</span>
      <h1>{project.title}</h1>
      <p className="muted">{project.summary}</p>
      <div className="disclaimer">{project.sourceNote}</div>

      <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleProject(project.id)}>
        {done ? '✓ Shënuar si përfunduar' : 'Shëno si përfunduar'}
      </button>

      <div className="detail-layout" style={{ marginTop: '1.25rem' }}>
        <div>
          <section className="panel">
            <h2>Objektivi</h2>
            <p>{project.objective}</p>
            <h3 style={{ fontSize: '1rem' }}>Hapat</h3>
            <ol>
              {project.steps.map((s) => (
                <li key={s} style={{ marginBottom: '0.4rem' }}>
                  {s}
                </li>
              ))}
            </ol>
          </section>

          {project.code && (
            <section className="panel">
              <h2>Shembull kodi</h2>
              <div className="disclaimer">
                Kod edukativ i sugjeruar - verifikojeni me hardware-in tuaj para përdorimit.
              </div>
              <CodeBlock code={project.code} title="project.ino" />
            </section>
          )}
        </div>

        <aside>
          <section className="panel">
            <h2>Komponentët</h2>
            <ul className="list-check">
              {project.components.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2>Sensorët e kitit</h2>
            <ul className="list-check">
              {project.sensors.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2>Udhëzim lidhjeje</h2>
            <ul className="list-check">
              {project.wiring.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </section>
          {project.notes.length > 0 && (
            <section className="panel">
              <h2>Shënime</h2>
              <ul className="list-check">
                {project.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

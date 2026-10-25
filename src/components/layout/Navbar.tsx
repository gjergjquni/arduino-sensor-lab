import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'

const links = [
  { to: '/', label: 'Kryefaqja', end: true },
  { to: '/sensors', label: 'Sensorët' },
  { to: '/learn', label: 'Mëso' },
  { to: '/projects', label: 'Projekte' },
  { to: '/learn/quiz', label: 'Quiz' },
  { to: '/creators', label: 'Creators' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { percent } = useProgress()

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/University_of_Prishtina_logo.svg" alt="Universiteti i Prishtinës" />
          </span>
          <span>
            Arduino Sensor <span style={{ color: 'var(--teal-600)' }}>Lab</span>
          </span>
        </Link>

        <span className="progress-chip" title="Progresi i të nxënit">
          Progresi {percent}%
        </span>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Hap menynë"
          onClick={() => setOpen((v) => !v)}
        >
          Meny
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Navigimi kryesor">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/sensors" className="nav-cta" onClick={() => setOpen(false)}>
            Eksploro
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

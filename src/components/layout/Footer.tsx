import { Link } from 'react-router-dom'
import { SENSOR_COUNT } from '../../data/sensors'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>Arduino Sensor Lab</strong>
          <p style={{ margin: '0.4rem 0 0', maxWidth: 420, opacity: 0.85 }}>
            Uebfaqe edukative për kitin me {SENSOR_COUNT} sensore. Të dhënat kryesore
            vijnë nga <em>37_Sensor_Kit_Arduino.xlsx</em>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/sensors">Biblioteka</Link>
          <Link to="/learn">IoT & Arduino</Link>
          <Link to="/projects">Mini-projekte</Link>
          <Link to="/learn/flashcards">Flashcards</Link>
          <Link to="/creators">Creators</Link>
        </div>
      </div>
    </footer>
  )
}

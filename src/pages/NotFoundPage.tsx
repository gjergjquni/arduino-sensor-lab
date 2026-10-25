import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container page-title">
      <div className="panel empty">
        <h1>404 - Faqja nuk u gjet</h1>
        <p>Kontrolloni URL-në ose kthehuni te biblioteka e sensorëve.</p>
        <Link className="btn btn-primary" to="/">
          Kryefaqja
        </Link>
      </div>
    </div>
  )
}

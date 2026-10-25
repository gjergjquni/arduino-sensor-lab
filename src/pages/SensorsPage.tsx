import { useMemo, useState } from 'react'
import { searchSensors, SENSOR_COUNT } from '../data/sensors'
import { SensorCard } from '../components/sensors/SensorCard'
import { SensorToolbar } from '../components/sensors/SensorToolbar'

export function SensorsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const results = useMemo(
    () => searchSensors(query, category),
    [query, category],
  )

  return (
    <div className="container page-title">
      <p className="eyebrow">Biblioteka</p>
      <h1>Të {SENSOR_COUNT} sensorët e kitit</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Kërko sipas emrit KY, funksionit, kategorisë ose aplikimit. Të dhënat bazë
        vijnë nga Excel; detajet shtesë janë për mësim.
      </p>

      <SensorToolbar
        query={query}
        category={category}
        onQuery={setQuery}
        onCategory={setCategory}
        count={results.length}
      />

      {results.length === 0 ? (
        <div className="empty panel">
          <h2>Nuk u gjet asnjë sensor</h2>
          <p>Provoni një fjalë tjetër ose rivendosni filtrin e kategorisë.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
          >
            Pastro filtrat
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {results.map((s, i) => (
            <SensorCard key={s.id} sensor={s} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

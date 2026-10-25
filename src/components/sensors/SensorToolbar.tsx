import { categories } from '../../data/sensors'

interface Props {
  query: string
  category: string
  onQuery: (v: string) => void
  onCategory: (v: string) => void
  count: number
}

export function SensorToolbar({ query, category, onQuery, onCategory, count }: Props) {
  const popular = ['all', ...categories.slice(0, 8)]

  return (
    <>
      <div className="toolbar">
        <label className="sr-only" htmlFor="sensor-search">
          Kërko sensorë
        </label>
        <input
          id="sensor-search"
          className="search-input"
          type="search"
          placeholder="Kërko sipas emrit, funksionit, tipit ose aplikimit…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <label className="sr-only" htmlFor="sensor-category">
          Filtro sipas kategorisë
        </label>
        <select
          id="sensor-category"
          className="select-input"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
        >
          <option value="all">Të gjitha kategoritë</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="chip-filters" role="group" aria-label="Filtra të shpejta">
        {popular.map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'active' : undefined}
            onClick={() => onCategory(c)}
          >
            {c === 'all' ? 'Të gjitha' : c}
          </button>
        ))}
      </div>

      <p className="results-meta">
        {count} sensor{count === 1 ? '' : 'ë'} {query || category !== 'all' ? 'të filtruar' : 'në bibliotekë'}
      </p>
    </>
  )
}

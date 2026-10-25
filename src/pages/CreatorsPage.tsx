const students = [
  'Gjergj Çuni',
  'Jeta Krasniqi',
  'Ledion Rrahimi',
  'Arjanit Gojani',
  'Olta Ismajli',
  'Armelë Thaçi',
  'Eliona Mulaj',
]

export function CreatorsPage() {
  return (
    <div className="container page-title">
      <p className="eyebrow">Ekipi</p>
      <h1>Krijuesit</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Arduino Sensor Lab u krijua nga studentët e lëndës IoT (Internet of Things),
        nën udhëheqjen e profesoreshës.
      </p>

      <div className="detail-layout" style={{ marginTop: '1.5rem' }}>
        <section className="panel">
          <h2>Studentët</h2>
          <ul className="creators-list">
            {students.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        <aside className="panel creators-professor">
          <p className="eyebrow">Profesoresha</p>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
            Prof. Ass. Krenare Nuqi-Pireva
          </h2>
          <p className="muted" style={{ margin: 0 }}>
            Mentore e projektit për lëndën IoT.
          </p>
        </aside>
      </div>
    </div>
  )
}

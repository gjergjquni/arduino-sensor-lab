import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizQuestions } from '../data/quiz'
import { useProgress } from '../hooks/useProgress'

export function QuizPage() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { setQuizBest, progress } = useProgress()

  useEffect(() => {
    if (done) setQuizBest(score)
  }, [done, score, setQuizBest])

  const q = quizQuestions[index]
  const total = quizQuestions.length

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  function next() {
    if (index + 1 >= total) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function finish() {
    setDone(true)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="container page-title">
        <div className="panel" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow">Rezultati</p>
          <h1>
            {score}/{total}
          </h1>
          <p className="muted">
            Rekordi yt lokal: {Math.max(progress.quizBest, score)}/{total}
          </p>
          <div className="progress-bar" style={{ margin: '1rem 0' }}>
            <span style={{ width: `${(score / total) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={restart}>
              Provo përsëri
            </button>
            <Link className="btn btn-secondary" to="/learn/flashcards">
              Flashcards
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container page-title">
      <p className="eyebrow">Knowledge check</p>
      <h1>Quiz i sensorëve</h1>
      <p className="muted">
        Pyetja {index + 1} nga {total} · pikë deri tani: {score}
      </p>
      <div className="progress-bar" style={{ marginBottom: '1.25rem' }}>
        <span style={{ width: `${((index + (selected !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <div className="panel" style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: '1.25rem' }}>{q.question}</h2>
        {q.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (selected !== null) {
            if (i === q.correctIndex) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              disabled={selected !== null}
              onClick={() => choose(i)}
            >
              {opt}
            </button>
          )
        })}
        {selected !== null && (
          <div className="disclaimer" style={{ marginTop: '0.75rem' }}>
            {q.explanation}
            {q.relatedSensor && (
              <>
                {' '}
                <Link to={`/sensors/${q.relatedSensor}`}>Shiko sensorin →</Link>
              </>
            )}
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          {selected !== null &&
            (index + 1 >= total ? (
              <button type="button" className="btn btn-primary" onClick={finish}>
                Përfundo
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={next}>
                Pyetja tjetër
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

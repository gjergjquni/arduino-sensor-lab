import { useState } from 'react'
import { Link } from 'react-router-dom'
import { flashcards } from '../data/quiz'
import { useProgress } from '../hooks/useProgress'

export function FlashcardsPage() {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { markFlashcard, progress } = useProgress()
  const card = flashcards[index]

  function flip() {
    setFlipped((f) => !f)
    markFlashcard(card.id)
  }

  function go(delta: number) {
    setFlipped(false)
    setIndex((i) => (i + delta + flashcards.length) % flashcards.length)
  }

  return (
    <div className="container page-title">
      <p className="eyebrow">Përsëritje</p>
      <h1>Flashcards</h1>
      <p className="muted">
        Karta {index + 1}/{flashcards.length} · të para {progress.flashcardsSeen.length}/
        {flashcards.length}
      </p>

      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Kthe kartën"
        style={{ maxWidth: 520, margin: '1.5rem auto' }}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face front">
            <div>
              <p className="eyebrow">{card.category}</p>
              <h2 style={{ fontSize: '1.45rem' }}>{card.front}</h2>
              <p className="muted">Kliko për përgjigjen</p>
            </div>
          </div>
          <div className="flashcard-face back">
            <div>
              <p className="eyebrow">Përgjigje</p>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>{card.back}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-secondary" onClick={() => go(-1)}>
          ← Para
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => go(1)}>
          Tjetër →
        </button>
        <Link className="btn btn-primary" to="/learn/quiz">
          Quiz
        </Link>
      </div>
    </div>
  )
}

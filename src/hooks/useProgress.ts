import { useCallback, useEffect, useState } from 'react'

const KEY = 'asl-progress-v1'

export interface ProgressState {
  viewedSensors: string[]
  quizBest: number
  flashcardsSeen: string[]
  completedProjects: string[]
}

const defaultState: ProgressState = {
  viewedSensors: [],
  quizBest: 0,
  flashcardsSeen: [],
  completedProjects: [],
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return defaultState
  }
}

function save(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(defaultState)

  useEffect(() => {
    setProgress(load())
  }, [])

  const update = useCallback((fn: (p: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  const markSensorViewed = useCallback(
    (slug: string) => {
      update((p) =>
        p.viewedSensors.includes(slug)
          ? p
          : { ...p, viewedSensors: [...p.viewedSensors, slug] },
      )
    },
    [update],
  )

  const setQuizBest = useCallback(
    (score: number) => {
      update((p) => ({ ...p, quizBest: Math.max(p.quizBest, score) }))
    },
    [update],
  )

  const markFlashcard = useCallback(
    (id: string) => {
      update((p) =>
        p.flashcardsSeen.includes(id)
          ? p
          : { ...p, flashcardsSeen: [...p.flashcardsSeen, id] },
      )
    },
    [update],
  )

  const toggleProject = useCallback(
    (id: string) => {
      update((p) => {
        const has = p.completedProjects.includes(id)
        return {
          ...p,
          completedProjects: has
            ? p.completedProjects.filter((x) => x !== id)
            : [...p.completedProjects, id],
        }
      })
    },
    [update],
  )

  const percent = Math.min(
    100,
    Math.round(
      (progress.viewedSensors.length / 37) * 50 +
        (progress.quizBest / 10) * 25 +
        (progress.flashcardsSeen.length / 10) * 15 +
        (progress.completedProjects.length / 6) * 10,
    ),
  )

  return {
    progress,
    percent,
    markSensorViewed,
    setQuizBest,
    markFlashcard,
    toggleProject,
  }
}

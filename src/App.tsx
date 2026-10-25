import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { SensorsPage } from './pages/SensorsPage'
import { SensorDetailPage } from './pages/SensorDetailPage'
import { LearnPage } from './pages/LearnPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { QuizPage } from './pages/QuizPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { CreatorsPage } from './pages/CreatorsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="sensors" element={<SensorsPage />} />
          <Route path="sensors/:slug" element={<SensorDetailPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/quiz" element={<QuizPage />} />
          <Route path="learn/flashcards" element={<FlashcardsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="creators" element={<CreatorsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

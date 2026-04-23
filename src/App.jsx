import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewsDetailPage from './pages/NewsDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

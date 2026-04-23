import { useCallback, useState } from 'react'
import Header from '../components/Header'
import ControlsRow from '../components/ControlsRow'
import NewsGallery from '../components/NewsGallery'
import FavoritesSection from '../components/FavoritesSection'
import { fetchNews } from '../services/newsApi'

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadNews = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const payload = await fetchNews({
        query: searchTerm,
        from: selectedDate,
        pageSize: 12,
      })

      setArticles(Array.isArray(payload.articles) ? payload.articles : [])
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load news right now.')
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedDate])

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Header />
        <ControlsRow
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          isLoading={isLoading}
          onSearchTermChange={setSearchTerm}
          onDateChange={setSelectedDate}
          onLoadNews={loadNews}
        />
        <NewsGallery articles={articles} isLoading={isLoading} errorMessage={errorMessage} />
        <FavoritesSection />
      </div>
    </main>
  )
}

export default HomePage

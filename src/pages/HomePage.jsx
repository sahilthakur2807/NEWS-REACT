import { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import ControlsRow from '../components/ControlsRow'
import NewsGallery from '../components/NewsGallery'
import FavoritesSection from '../components/FavoritesSection'
import { fetchNews } from '../services/newsApi'
import { cacheArticles } from '../services/articleCache'
import useFavorites from '../hooks/useFavorites'

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [activeCategory, setActiveCategory] = useState('top stories')
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const {
    favorites,
    favoritesError,
    isLoadingFavorites,
    loadFavorites,
    saveFavorite,
    deleteFavorite,
    isFavorite,
  } = useFavorites()
  const hasLoadedInitialHeadlines = useRef(false)

  const loadNews = useCallback(async ({ category } = {}) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const payload = await fetchNews({
        category: category || activeCategory,
        query: searchTerm,
        from: selectedDate,
        pageSize: 12,
      })

      const nextArticles = Array.isArray(payload.articles) ? payload.articles : []
      setArticles(nextArticles)
      cacheArticles(nextArticles)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load news right now.')
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory, searchTerm, selectedDate])

  const handleCategoryChange = useCallback(
    (category) => {
      setActiveCategory(category)
      loadNews({ category })
    },
    [loadNews],
  )

  const handleAddFavorite = useCallback(
    async (article) => {
      try {
        await saveFavorite(article)
      } catch (error) {
        setErrorMessage(error.message || 'Failed to save favorite.')
      }
    },
    [saveFavorite],
  )

  useEffect(() => {
    if (hasLoadedInitialHeadlines.current) {
      return
    }

    hasLoadedInitialHeadlines.current = true
    loadNews({ category: 'top stories' })
  }, [loadNews])

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-4 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
        <Header activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        <ControlsRow
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          isLoading={isLoading}
          onSearchTermChange={setSearchTerm}
          onDateChange={setSelectedDate}
          onLoadNews={loadNews}
          onLoadFavorites={loadFavorites}
        />
        <NewsGallery
          articles={articles}
          isLoading={isLoading}
          errorMessage={errorMessage}
          isFavorite={isFavorite}
          onAddFavorite={handleAddFavorite}
        />
        <FavoritesSection
          favorites={favorites}
          isLoading={isLoadingFavorites}
          errorMessage={favoritesError}
          onRemoveFavorite={deleteFavorite}
        />
      </div>
    </main>
  )
}

export default HomePage

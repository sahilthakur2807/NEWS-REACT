import { useCallback, useMemo, useState } from 'react'
import { addFavorite, getFavorites, removeFavorite } from '../services/favoritesService'

function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  const [favoritesError, setFavoritesError] = useState('')

  const favoriteUrlSet = useMemo(() => new Set(favorites.map((item) => item.url)), [favorites])

  const loadFavorites = useCallback(async () => {
    setIsLoadingFavorites(true)
    setFavoritesError('')

    try {
      const list = await getFavorites()
      setFavorites(list)
      return list
    } catch (error) {
      setFavoritesError(error.message || 'Failed to load favorites.')
      return []
    } finally {
      setIsLoadingFavorites(false)
    }
  }, [])

  const saveFavorite = useCallback(async (article) => {
    if (!article?.url) {
      throw new Error('Cannot save article without URL.')
    }

    const favorite = await addFavorite({
      title: article.title || 'Untitled',
      url: article.url,
      source: article.source || 'Unknown Source',
    })

    setFavorites((prev) => {
      const deduped = prev.filter((item) => item.url !== favorite.url)
      return [favorite, ...deduped]
    })

    return favorite
  }, [])

  const deleteFavorite = useCallback(async (url) => {
    await removeFavorite(url)
    setFavorites((prev) => prev.filter((item) => item.url !== url))
  }, [])

  const isFavorite = useCallback((url) => favoriteUrlSet.has(url), [favoriteUrlSet])

  return {
    favorites,
    favoritesError,
    isLoadingFavorites,
    loadFavorites,
    saveFavorite,
    deleteFavorite,
    isFavorite,
  }
}

export default useFavorites

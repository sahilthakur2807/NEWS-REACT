const ARTICLES_CACHE_KEY = 'news_app_articles_cache_v1'

export function cacheArticles(articles = []) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const serialized = JSON.stringify(Array.isArray(articles) ? articles : [])
    window.localStorage.setItem(ARTICLES_CACHE_KEY, serialized)
  } catch {
    // Ignore cache write failures to avoid interrupting UI flows.
  }
}

export function getCachedArticles() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(ARTICLES_CACHE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getCachedArticleById(id) {
  if (!id) {
    return null
  }

  const articles = getCachedArticles()
  return articles.find((article) => article?.id === id) || null
}

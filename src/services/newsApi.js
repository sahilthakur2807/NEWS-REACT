const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

function hashString(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash).toString(36)
}

function createArticleId(article, index) {
  const seed = `${article.url || ''}|${article.title || ''}|${article.date || ''}|${index}`
  return `news-${hashString(seed)}`
}

function getEndpoint() {
  const normalizedBase = apiBaseUrl.replace(/\/$/, '')
  return normalizedBase ? `${normalizedBase}/api/news` : '/api/news'
}

export async function fetchNews({ category = '', query = '', from = '', pageSize = 12 } = {}) {
  const params = new URLSearchParams()
  const normalizedCategory = category.trim().toLowerCase()
  const normalizedQuery = query.trim()
  const usNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  usNow.setDate(usNow.getDate() - 1)
  const defaultDate = usNow.toISOString().slice(0, 10)
  const effectiveDate = from.trim() || defaultDate
  const effectiveQuery =
    normalizedQuery || (normalizedCategory && normalizedCategory !== 'top stories' ? normalizedCategory : '')

  if (effectiveQuery) {
    params.set('q', effectiveQuery)
  }

  params.set('from', effectiveDate)
  params.set('to', effectiveDate)

  params.set('pageSize', String(pageSize))

  const response = await fetch(`${getEndpoint()}?${params.toString()}`)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Failed to fetch news.')
  }

  const normalizedArticles = Array.isArray(payload.articles)
    ? payload.articles.map((article, index) => ({
        ...article,
        id: article.id || createArticleId(article, index),
        content: article.content || '',
        description: article.description || '',
      }))
    : []

  return {
    ...payload,
    articles: normalizedArticles,
  }
}

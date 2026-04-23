export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed.' })
    return
  }

  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    res.status(500).json({ message: 'Missing NEWS_API_KEY in environment.' })
    return
  }

  const query = String(req.query.q || 'latest').trim()
  const usNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  usNow.setDate(usNow.getDate() - 1)
  const defaultDate = usNow.toISOString().slice(0, 10)
  const from = String(req.query.from || defaultDate).trim()
  const to = String(req.query.to || from).trim()
  const pageSize = Math.min(Number(req.query.pageSize || 12), 30)

  const params = new URLSearchParams({
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(pageSize > 0 ? pageSize : 12),
    q: query || 'latest',
  })

  if (from) {
    params.set('from', from)
    params.set('to', to)
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    })

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}))
      res.status(response.status).json({
        message: errorPayload.message || 'Failed to fetch articles from NewsAPI.',
      })
      return
    }

    const payload = await response.json()
    const articles = Array.isArray(payload.articles)
      ? payload.articles
          .filter((article) => article?.title)
          .map((article) => ({
            title: article.title,
            source: article.source?.name || 'Unknown Source',
            date: article.publishedAt ? article.publishedAt.slice(0, 10) : '',
            image: article.urlToImage || '',
            url: article.url || '',
            description: article.description || '',
          }))
      : []

    res.status(200).json({
      articles,
      totalResults: payload.totalResults || 0,
    })
  } catch (_error) {
    res.status(500).json({ message: 'Unable to fetch news right now.' })
  }
}

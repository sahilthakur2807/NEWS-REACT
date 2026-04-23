import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import { deleteFavoriteByUrl, listFavorites, upsertFavorite } from './favoritesStore.js'

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDistPath = path.resolve(__dirname, '..', 'dist')

function getUsPreviousDate() {
  const usNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  usNow.setDate(usNow.getDate() - 1)
  return usNow.toISOString().slice(0, 10)
}

app.use(cors())
app.use(express.json())
app.use(express.static(clientDistPath))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/news', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    res.status(500).json({ message: 'Missing NEWS_API_KEY in environment.' })
    return
  }

  const query = String(req.query.q || 'latest').trim()
  const defaultDate = getUsPreviousDate()
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

    res.json({
      articles,
      totalResults: payload.totalResults || 0,
    })
  } catch (_error) {
    res.status(500).json({ message: 'Unable to fetch news right now.' })
  }
})

app.get('/api/favorites', async (_req, res) => {
  try {
    const favorites = await listFavorites()
    res.status(200).json({ favorites })
  } catch (_error) {
    res.status(500).json({ message: 'Failed to load favorites.' })
  }
})

app.post('/api/favorites', async (req, res) => {
  console.log('POST /api/favorites called');
  try {
    const article = req.body
    const favorite = await upsertFavorite(article)
    res.status(201).json({ favorite })
  } catch (error) {
    console.error('Failed to save favorite:', error)
    res.status(500).json({ message: 'Failed to save favorite.' })
  }
})

app.delete('/api/favorites', async (req, res) => {
  try {
    const { url } = req.query
    if (!url) {
      return res.status(400).json({ message: 'Missing URL query parameter.' })
    }
    await deleteFavoriteByUrl(url)
    res.status(204).send()
  } catch (error) {
    console.error('Failed to delete favorite:', error)
    res.status(500).json({ message: 'Failed to delete favorite.' })
  }
})

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

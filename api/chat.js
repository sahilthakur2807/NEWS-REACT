import { createArticleMessage, listArticleMessages } from '../server/chatStore.js'

function parseLimit(value, fallback = 50) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }
  return Math.min(Math.max(Math.floor(parsed), 1), 100)
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const articleId = String(req.query?.articleId || '').trim()
    const limit = parseLimit(req.query?.limit, 50)

    if (!articleId) {
      res.status(400).json({ message: 'articleId is required.' })
      return
    }

    try {
      const messages = await listArticleMessages(articleId, limit)
      res.status(200).json({ messages })
      return
    } catch (_error) {
      res.status(500).json({ message: 'Failed to load chat history.' })
      return
    }
  }

  if (req.method === 'POST') {
    const articleId = String(req.body?.articleId || '').trim()
    const userId = String(req.body?.userId || '').trim()
    const message = String(req.body?.message || '').trim()

    if (!articleId || !userId || !message) {
      res.status(400).json({ message: 'articleId, userId, and message are required.' })
      return
    }

    try {
      const created = await createArticleMessage({ articleId, userId, message })
      res.status(201).json({ message: created })
      return
    } catch (error) {
      res.status(400).json({ message: error?.message || 'Failed to save message.' })
      return
    }
  }

  res.status(405).json({ message: 'Method not allowed.' })
}


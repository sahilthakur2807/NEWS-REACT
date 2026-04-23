import { deleteFavoriteByUrl, listFavorites, upsertFavorite } from '../server/favoritesStore.js'
import { requireAuth } from '../server/auth.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { uid } = await requireAuth(req)
      const favorites = await listFavorites(uid)
      res.status(200).json({ favorites })
      return
    } catch (_error) {
      res.status(_error?.statusCode || 500).json({
        message:
          _error?.statusCode === 401
            ? 'Login required.'
            : _error?.message || 'Failed to load favorites.',
      })
      return
    }
  }

  if (req.method === 'POST') {
    const title = String(req.body?.title || '').trim()
    const url = String(req.body?.url || '').trim()
    const source = String(req.body?.source || '').trim()

    if (!title || !url || !source) {
      res.status(400).json({ message: 'title, url, and source are required.' })
      return
    }

    try {
      const { uid } = await requireAuth(req)
      const favorite = await upsertFavorite({ userId: uid, title, url, source })
      res.status(200).json({ favorite })
      return
    } catch (_error) {
      res.status(_error?.statusCode || 500).json({
        message:
          _error?.statusCode === 401
            ? 'Login required.'
            : _error?.message || 'Failed to save favorite.',
      })
      return
    }
  }

  if (req.method === 'DELETE') {
    const url = String(req.body?.url || '').trim()

    if (!url) {
      res.status(400).json({ message: 'url is required.' })
      return
    }

    try {
      const { uid } = await requireAuth(req)
      const deleted = await deleteFavoriteByUrl({ userId: uid, url })

      if (!deleted) {
        res.status(404).json({ message: 'Favorite not found.' })
        return
      }

      res.status(200).json({ ok: true })
      return
    } catch (_error) {
      res.status(_error?.statusCode || 500).json({
        message:
          _error?.statusCode === 401
            ? 'Login required.'
            : _error?.message || 'Failed to delete favorite.',
      })
      return
    }
  }

  res.status(405).json({ message: 'Method not allowed.' })
}

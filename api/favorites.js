import { deleteFavoriteByUrl, listFavorites, upsertFavorite } from '../server/favoritesStore.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const favorites = await listFavorites()
      res.status(200).json({ favorites })
      return
    } catch (_error) {
      res.status(500).json({ message: 'Failed to load favorites.' })
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
      const favorite = await upsertFavorite({ title, url, source })
      res.status(200).json({ favorite })
      return
    } catch (_error) {
      res.status(500).json({ message: 'Failed to save favorite.' })
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
      const deleted = await deleteFavoriteByUrl(url)

      if (!deleted) {
        res.status(404).json({ message: 'Favorite not found.' })
        return
      }

      res.status(200).json({ ok: true })
      return
    } catch (_error) {
      res.status(500).json({ message: 'Failed to delete favorite.' })
      return
    }
  }

  res.status(405).json({ message: 'Method not allowed.' })
}

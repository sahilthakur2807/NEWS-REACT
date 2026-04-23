import { dbQuery } from './db.js'

export async function listFavorites(userId) {
  const safeUserId = String(userId || '').trim()
  if (!safeUserId) {
    throw new Error('Missing user id.')
  }
  const result = await dbQuery(
    'SELECT id, title, url, source, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
    [safeUserId],
  )
  return result.rows
}

export async function upsertFavorite({ userId, title, url, source }) {
  const safeUserId = String(userId || '').trim()
  const result = await dbQuery(
    `
      INSERT INTO favorites (user_id, title, url, source)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, url)
      DO UPDATE SET
        title = EXCLUDED.title,
        source = EXCLUDED.source
      RETURNING id, title, url, source, created_at;
    `,
    [safeUserId, title, url, source],
  )

  return result.rows[0]
}

export async function deleteFavoriteByUrl({ userId, url }) {
  const safeUserId = String(userId || '').trim()
  const safeUrl = String(url || '').trim()
  const result = await dbQuery('DELETE FROM favorites WHERE user_id = $1 AND url = $2', [safeUserId, safeUrl])
  return result.rowCount > 0
}

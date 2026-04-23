import { dbQuery } from './db.js'

export async function listFavorites() {
  const result = await dbQuery(
    'SELECT id, title, url, source, created_at FROM favorites ORDER BY created_at DESC',
  )
  return result.rows
}

export async function upsertFavorite({ title, url, source }) {
  const result = await dbQuery(
    `
      INSERT INTO favorites (title, url, source)
      VALUES ($1, $2, $3)
      ON CONFLICT (url)
      DO UPDATE SET
        title = EXCLUDED.title,
        source = EXCLUDED.source
      RETURNING id, title, url, source, created_at;
    `,
    [title, url, source],
  )

  return result.rows[0]
}

export async function deleteFavoriteByUrl(url) {
  const result = await dbQuery('DELETE FROM favorites WHERE url = $1', [url])
  return result.rowCount > 0
}

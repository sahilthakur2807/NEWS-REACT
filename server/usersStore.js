import { dbQuery } from './db.js'

export async function upsertUser({ uid, email }) {
  const safeUid = String(uid || '').trim()
  const safeEmail = String(email || '').trim() || null

  if (!safeUid) {
    throw new Error('Missing uid.')
  }

  const result = await dbQuery(
    `
      INSERT INTO users (uid, email)
      VALUES ($1, $2)
      ON CONFLICT (uid)
      DO UPDATE SET email = COALESCE(EXCLUDED.email, users.email)
      RETURNING uid, email, created_at;
    `,
    [safeUid, safeEmail],
  )

  return result.rows[0]
}


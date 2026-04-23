import { dbQuery } from './db.js'

const MAX_MESSAGE_LENGTH = 800

export async function listArticleMessages(articleId, limit = 50) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100)

  const result = await dbQuery(
    `
      SELECT id, article_id, user_id, message, created_at
      FROM chat_messages
      WHERE article_id = $1
      ORDER BY created_at ASC
      LIMIT $2;
    `,
    [articleId, safeLimit],
  )

  return result.rows
}

export async function createArticleMessage({ articleId, userId, message }) {
  const normalizedMessage = String(message || '').trim()

  if (!normalizedMessage) {
    throw new Error('Message cannot be empty.')
  }

  if (normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`)
  }

  const result = await dbQuery(
    `
      INSERT INTO chat_messages (article_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING id, article_id, user_id, message, created_at;
    `,
    [articleId, userId, normalizedMessage],
  )

  return result.rows[0]
}

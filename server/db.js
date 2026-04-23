import { Pool } from 'pg'

let pool
let schemaReadyPromise

function getSslConfig() {
  const sslValue = String(process.env.PGSSL || '').toLowerCase()

  if (sslValue === 'false' || sslValue === '0') {
    return false
  }

  if (sslValue === 'true' || sslValue === '1' || process.env.POSTGRES_URL) {
    return { rejectUnauthorized: false }
  }

  return undefined
}

function getPool() {
  if (pool) {
    return pool
  }

  const connectionString = process.env.POSTGRES_URL || ''

  const config = connectionString
    ? {
        connectionString,
        ssl: getSslConfig(),
      }
    : {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        ssl: getSslConfig(),
      }

  pool = new Pool(config)
  return pool
}

export async function ensureDatabaseSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT 'legacy-user',
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE favorites
      ADD COLUMN IF NOT EXISTS user_id TEXT;

      UPDATE favorites
      SET user_id = 'legacy-user'
      WHERE user_id IS NULL OR user_id = '';

      ALTER TABLE favorites
      ALTER COLUMN user_id SET NOT NULL;

      ALTER TABLE favorites
      DROP CONSTRAINT IF EXISTS favorites_url_key;

      ALTER TABLE favorites
      ADD CONSTRAINT favorites_user_url_unique UNIQUE (user_id, url);

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        article_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_chat_messages_article_id ON chat_messages(article_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
    `)
  }

  await schemaReadyPromise
}

export async function ensureFavoritesTable() {
  await ensureDatabaseSchema()
}

export async function dbQuery(text, params = []) {
  await ensureDatabaseSchema()
  return getPool().query(text, params)
}

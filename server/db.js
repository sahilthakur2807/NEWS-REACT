import { Pool } from 'pg'

let pool
let tableReadyPromise

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

export async function ensureFavoritesTable() {
  if (!tableReadyPromise) {
    tableReadyPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  await tableReadyPromise
}

export async function dbQuery(text, params = []) {
  await ensureFavoritesTable()
  return getPool().query(text, params)
}

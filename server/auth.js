import { upsertUser } from './usersStore.js'
import { verifyFirebaseIdToken } from './firebaseAdmin.js'

function extractBearerToken(req) {
  const raw = req.headers?.authorization || req.headers?.Authorization || ''
  const value = Array.isArray(raw) ? raw[0] : raw
  const match = String(value).match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

export async function requireAuth(req) {
  const token = extractBearerToken(req)

  if (!token) {
    const error = new Error('Missing Authorization token.')
    error.statusCode = 401
    throw error
  }

  try {
    const decoded = await verifyFirebaseIdToken(token)
    const uid = decoded.uid
    const email = decoded.email || ''
    await upsertUser({ uid, email })
    return { uid, email }
  } catch (err) {
    const message = String(err?.message || '')

    if (message.startsWith('Missing Firebase Admin credentials')) {
      const error = new Error(message)
      error.statusCode = 500
      error.cause = err
      throw error
    }

    const error = new Error('Invalid or expired token.')
    error.statusCode = 401
    error.cause = err
    throw error
  }
}


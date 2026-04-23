import { requireAuth } from '../server/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed.' })
    return
  }

  try {
    const user = await requireAuth(req)
    res.status(200).json({ user })
  } catch (error) {
    res.status(error?.statusCode || 500).json({ message: error?.message || 'Unable to verify user.' })
  }
}


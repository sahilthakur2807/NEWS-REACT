import { auth } from '../auth/firebase'

export async function authFetch(input, init = {}) {
  const headers = new Headers(init.headers || {})

  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken(true)
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(input, {
    ...init,
    headers,
  })
}


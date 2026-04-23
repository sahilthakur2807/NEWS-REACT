const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

function getChatEndpoint() {
  const normalizedBase = apiBaseUrl.replace(/\/$/, '')
  return normalizedBase ? `${normalizedBase}/api/chat` : '/api/chat'
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Chat request failed.')
  }

  return payload
}

export async function getChatHistory({ articleId, limit = 50 } = {}) {
  const params = new URLSearchParams()
  if (articleId) params.set('articleId', articleId)
  if (limit) params.set('limit', String(limit))

  const response = await fetch(`${getChatEndpoint()}?${params.toString()}`)
  const payload = await parseResponse(response)
  return Array.isArray(payload.messages) ? payload.messages : []
}

export async function postChatMessage({ articleId, userId, message } = {}) {
  const response = await fetch(getChatEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ articleId, userId, message }),
  })

  const payload = await parseResponse(response)
  return payload.message
}


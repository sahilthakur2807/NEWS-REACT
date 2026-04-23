const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

function getEndpoint() {
  const normalizedBase = apiBaseUrl.replace(/\/$/, '')
  return normalizedBase ? `${normalizedBase}/api/news` : '/api/news'
}

export async function fetchNews({ query = '', from = '', pageSize = 12 } = {}) {
  const params = new URLSearchParams()

  if (query.trim()) {
    params.set('q', query.trim())
  }

  if (from.trim()) {
    params.set('from', from.trim())
  }

  params.set('pageSize', String(pageSize))

  const response = await fetch(`${getEndpoint()}?${params.toString()}`)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Failed to fetch news.')
  }

  return payload
}

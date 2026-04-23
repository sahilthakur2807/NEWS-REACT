const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

function getFavoritesEndpoint() {
  const normalizedBase = apiBaseUrl.replace(/\/$/, '')
  return normalizedBase ? `${normalizedBase}/api/favorites` : '/api/favorites'
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Favorites request failed.')
  }

  return payload
}

export async function getFavorites() {
  const response = await fetch(getFavoritesEndpoint())
  const payload = await parseResponse(response)
  return Array.isArray(payload.favorites) ? payload.favorites : []
}

export async function addFavorite(article) {
  const response = await fetch(getFavoritesEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: article.title,
      url: article.url,
      source: article.source,
    }),
  })

  const payload = await parseResponse(response)
  return payload.favorite
}

export async function removeFavorite(url) {
  const response = await fetch(getFavoritesEndpoint(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  await parseResponse(response)
}

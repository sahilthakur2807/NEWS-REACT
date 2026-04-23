function FavoritesSection({
  favorites = [],
  isLoading = false,
  errorMessage = '',
  onRemoveFavorite,
  loginHint = '',
}) {
  if (isLoading) {
    return (
      <section className="rounded-[28px] bg-zinc-200 p-4 shadow-sm ring-1 ring-zinc-300/70 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-900">Favorites</h2>
        <p className="mt-2 text-sm text-zinc-600">Loading favorites...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="rounded-[28px] bg-zinc-200 p-4 shadow-sm ring-1 ring-zinc-300/70 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-900">Favorites</h2>
        <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
      </section>
    )
  }

  return (
    <section className="rounded-[28px] bg-zinc-200 p-4 shadow-sm ring-1 ring-zinc-300/70 sm:p-6">
      <h2 className="text-xl font-semibold text-zinc-900">Favorites</h2>

      {loginHint ? <p className="mt-2 text-sm text-zinc-700">{loginHint}</p> : null}

      {favorites.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-600">No favorites saved yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {favorites.map((favorite) => (
            <article
              key={favorite.url}
              className="rounded-xl bg-white p-4 ring-1 ring-zinc-300"
            >
              <a
                href={favorite.url}
                target="_blank"
                rel="noreferrer"
                className="text-base font-semibold text-zinc-900 hover:underline"
              >
                {favorite.title}
              </a>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600">
                {favorite.source}
              </p>
              <button
                type="button"
                onClick={() => onRemoveFavorite?.(favorite.url)}
                className="mt-3 rounded-lg border border-zinc-400 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-200"
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesSection

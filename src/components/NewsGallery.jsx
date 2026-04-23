import NewsTile from './NewsTile'

function NewsGallery({
  articles = [],
  isLoading = false,
  errorMessage = '',
  isFavorite = () => false,
  onAddFavorite,
}) {
  if (isLoading) {
    return (
      <section className="space-y-5 border-y border-zinc-300 bg-zinc-100 py-5">
        <h2 className="text-4xl leading-none text-zinc-900">Latest News</h2>
        <p className="text-sm text-zinc-600">Loading articles...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="space-y-5 border-y border-zinc-300 bg-zinc-100 py-5">
        <h2 className="text-4xl leading-none text-zinc-900">Latest News</h2>
        <p className="text-sm text-red-700">{errorMessage}</p>
      </section>
    )
  }

  return (
    <section className="space-y-5 border-y border-zinc-300 bg-zinc-50 py-6">
      <h2 className="text-5xl leading-none text-zinc-900">Latest News</h2>

      {articles.length === 0 ? (
        <p className="text-sm text-zinc-600">
          No articles loaded yet. Use search and then click Load News.
        </p>
      ) : null}

      {articles.length > 0 ? (
        <>
          <div className="grid gap-5 border-t border-zinc-300 pt-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <NewsTile
                article={articles[0]}
                variant="feature"
                onAddFavorite={onAddFavorite}
                isSaved={isFavorite(articles[0]?.url || '')}
              />
            </div>

            <div className="space-y-4 border border-zinc-300 bg-white p-4 lg:col-span-4">
              {articles.slice(1, 4).map((article, index) => (
                <NewsTile
                  key={`${article.title}-${index}`}
                  article={article}
                  variant="compact"
                  onAddFavorite={onAddFavorite}
                  isSaved={isFavorite(article?.url || '')}
                />
              ))}
            </div>
          </div>

          {articles.length > 4 ? (
            <div className="grid gap-4 border-t border-zinc-300 pt-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(4).map((article, index) => (
                <NewsTile
                  key={`${article.title}-${index + 4}`}
                  article={article}
                  onAddFavorite={onAddFavorite}
                  isSaved={isFavorite(article?.url || '')}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

export default NewsGallery

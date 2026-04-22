import NewsTile from './NewsTile'

function NewsGallery({ articles = [], isLoading = false, errorMessage = '' }) {
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
    <section className="space-y-5 border-y border-zinc-300 bg-zinc-100 py-5">
      <h2 className="text-4xl leading-none text-zinc-900">Latest News</h2>

      {articles.length === 0 ? (
        <p className="text-sm text-zinc-600">
          No articles loaded yet. Use search and then click Load News.
        </p>
      ) : null}

      <div className="grid grid-flow-dense grid-cols-1 auto-rows-[140px] gap-3 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((article, index) => (
          <NewsTile key={`${article.title}-${index}`} article={article} index={index} />
        ))}
      </div>
    </section>
  )
}

export default NewsGallery

import { Link } from 'react-router-dom'

function NewsTile({ article, variant = 'standard', onAddFavorite, isSaved = false }) {
  const { id, title, source, date, image, url } = article
  const fallbackImage =
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'

  const handleAddFavorite = () => {
    if (!url || !onAddFavorite || isSaved) {
      return
    }

    onAddFavorite({ title, source, url })
  }

  const renderNewsImage = (className) => (
    <div className={`group relative overflow-hidden border-zinc-300 bg-zinc-100 ${className}`}>
      <img
        src={image || fallbackImage}
        alt={title}
        className="m-center h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />

      <button
        type="button"
        onClick={handleAddFavorite}
        disabled={!url || isSaved}
        className="absolute right-2 top-2 rounded-full border border-zinc-200 bg-zinc-900/85 px-2.5 py-1 text-[11px] font-medium text-zinc-50 opacity-0 transition duration-200 group-hover:opacity-100"
      >
        {isSaved ? 'Saved' : 'Add to Favorites'}
      </button>
    </div>
  )

  const CardTitle = (
    <>
      {id ? (
        <Link
          to={`/news/${id}`}
          state={{ article }}
          className="break-words text-zinc-900 transition hover:underline"
        >
          {title}
        </Link>
      ) : (
        <p className="break-words text-zinc-900">{title}</p>
      )}
    </>
  )

  if (variant === 'compact') {
    return (
      <article className="flex items-start gap-3 border-b border-zinc-300 pb-4 last:border-b-0 last:pb-0">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-3xl leading-tight">{CardTitle}</h3>
          <p className="text-xs uppercase tracking-wide text-zinc-600">
            {source} • {date}
          </p>
        </div>

        {renderNewsImage('h-24 w-24 border')}
      </article>
    )
  }

  if (variant === 'feature') {
    return (
      <article className="border border-zinc-300 bg-white">
        {renderNewsImage('h-64 w-full border-b md:h-[430px]')}

        <div className="space-y-3 p-5">
          <h3 className="text-5xl leading-tight">{CardTitle}</h3>
          <p className="text-xs uppercase tracking-wide text-zinc-600">
            {source} • {date}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col border border-zinc-300 bg-white transition hover:bg-zinc-50">
      {renderNewsImage('h-44 w-full border-b')}

      <div className="space-y-3 p-4">
        <h3 className="text-4xl leading-tight">{CardTitle}</h3>
        <p className="text-xs uppercase tracking-wide text-zinc-600">
          {source} • {date}
        </p>
      </div>
    </article>
  )
}

export default NewsTile

function getTileSpanClasses(index) {
  const mod = index % 6

  if (mod === 0) {
    return 'md:col-span-2 md:row-span-3'
  }

  if (mod === 3) {
    return 'col-span-1 row-span-1'
  }

  return 'col-span-1 row-span-2'
}

function getImageHeightClass(index) {
  const mod = index % 6

  if (mod === 0) {
    return 'h-56 md:h-72'
  }

  if (mod === 3) {
    return 'h-28 md:h-32'
  }

  return 'h-40 md:h-44'
}

function NewsTile({ article, index }) {
  const { title, source, date, image } = article

  return (
    <article
      className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-zinc-300 bg-zinc-50 ${getTileSpanClasses(index)}`}
    >
      <div className={`relative overflow-hidden ${getImageHeightClass(index)}`}>
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          className="absolute right-3 top-3 rounded-full border border-zinc-200 bg-zinc-900/85 px-3 py-1.5 text-xs font-medium text-zinc-50 opacity-0 transition duration-200 group-hover:opacity-100"
        >
          Add to Favorites
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <p className="line-clamp-4 text-xl leading-tight text-zinc-900">{title}</p>
        <p className="text-xs uppercase tracking-wide text-zinc-600">
          {source} • {date}
        </p>
      </div>
    </article>
  )
}

export default NewsTile
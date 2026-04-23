function ControlsRow({
  searchTerm,
  selectedDate,
  isLoading,
  onSearchTermChange,
  onDateChange,
  onLoadNews,
  onLoadFavorites,
}) {
  const buttonLabel = isLoading ? 'Loading...' : 'Load News'

  return (
    <section className="border border-zinc-300 bg-zinc-50 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Search</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search news"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              className="w-full border border-zinc-400 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-700"
            />
            <button
              type="button"
              onClick={onLoadNews}
              disabled={isLoading}
              className="border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-800"
            >
              Search
            </button>
          </div>
        </label>

        <label className="flex min-w-0 w-full flex-col gap-2 md:w-auto md:min-w-52">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full border border-zinc-400 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-700"
          />
        </label>

        <div className="flex w-full gap-2 md:w-auto">
          <button
            type="button"
            onClick={onLoadNews}
            disabled={isLoading}
            className="flex-1 border border-zinc-400 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 md:flex-none"
          >
            {buttonLabel}
          </button>

          <button
            type="button"
            onClick={onLoadFavorites}
            className="flex-1 border border-zinc-400 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 md:flex-none"
          >
            Load Favorites
          </button>
        </div>
      </div>
    </section>
  )
}

export default ControlsRow

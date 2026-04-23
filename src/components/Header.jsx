const categories = [
  'Top Stories',
  'Science',
  'Health',
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
]

function Header({ activeCategory = 'top stories', onCategoryChange }) {
  const handleCategoryClick = (event, value) => {
    event.preventDefault()
    onCategoryChange?.(value)
  }

  return (
    <header className="border border-zinc-300 bg-zinc-50">
      <div className="flex items-center justify-between border-b border-zinc-300 px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600 sm:px-6">
        <div className="flex items-center gap-3">
          <span>Menu</span>
          <span className="hidden sm:inline">Briefing</span>
        </div>
      </div>

      <div className="border-b border-zinc-300 px-4 py-5 text-center sm:px-6">
        <h1 className="font-hedvig text-5xl leading-none tracking-tight text-zinc-950 sm:text-6xl">
          Today&apos;s New's
        </h1>
        <p className="mt-2 text-sm text-zinc-600 sm:text-base">
          Stay updated with the latest global headlines
        </p>
      </div>

      <nav
        aria-label="News categories"
        className="flex gap-5 overflow-x-auto px-4 py-3 text-sm font-medium text-zinc-700 sm:flex-wrap sm:overflow-visible sm:px-6"
      >
        {categories.map((category) => {
          const value = category.toLowerCase()
          const isActive = activeCategory === value

          return (
            <a
              key={value}
              href="#"
              data-category={value}
              onClick={(event) => handleCategoryClick(event, value)}
              className={`shrink-0 border-b pb-1 transition hover:border-zinc-900 hover:text-zinc-950 ${
                isActive
                  ? 'border-zinc-900 text-zinc-950'
                  : 'border-transparent text-zinc-700'
              }`}
            >
              {category}
            </a>
          )
        })}
      </nav>
    </header>
  )
}

export default Header

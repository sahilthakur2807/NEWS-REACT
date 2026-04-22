const categories = [
  'Science',
  'Health',
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
]

function Header() {
  return (
    <header className="rounded-[32px] bg-zinc-200 px-5 py-6 text-zinc-900 shadow-sm ring-1 ring-zinc-300/70 sm:px-8 sm:py-8">
      <nav
        aria-label="News categories"
        className="-mx-1 mb-6 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
      >
        {categories.map((category) => {
          const value = category.toLowerCase()

          return (
            <a
              key={value}
              href="#"
              data-category={value}
              className="shrink-0 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300 hover:text-zinc-950"
            >
              {category}
            </a>
          )
        })}
      </nav>

      <div className="space-y-3">
        <h1 className="font-hedvig text-4xl tracking-tight text-zinc-950 sm:text-5xl">
          Today&apos;s News
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
          Stay updated with the latest global headlines
        </p>
      </div>
    </header>
  )
}

export default Header

import NewsTile from './NewsTile'

const placeholderArticles = [
  {
    title: 'Marine researchers map hidden current systems under polar ice',
    source: 'Global Science Wire',
    date: '2026-04-22',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'A new vaccine pipeline speeds up regional outbreak response',
    source: 'Health Desk',
    date: '2026-04-22',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Markets react as renewable infrastructure spending rises',
    source: 'Business Brief',
    date: '2026-04-22',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Space agency confirms timeline for next orbital telescope',
    source: 'Technology Monitor',
    date: '2026-04-21',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Championship semi-final draws record global viewership',
    source: 'Sports Network',
    date: '2026-04-21',
    image:
      'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Festival circuit spotlights independent voices in cinema',
    source: 'Culture Today',
    date: '2026-04-21',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Urban climate lab debuts heat-safe materials for city roofs',
    source: 'Science Daily',
    date: '2026-04-20',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Public health analytics cut emergency response times',
    source: 'Medical Journal',
    date: '2026-04-20',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'EV battery recycling pilot scales across three major ports',
    source: 'Industry Outlook',
    date: '2026-04-20',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  },
]

function NewsGallery({ articles = [] }) {
  const displayArticles = articles.length > 0 ? articles : placeholderArticles

  return (
    <section className="space-y-5 border-y border-zinc-300 bg-zinc-100 py-5">
      <h2 className="text-4xl leading-none text-zinc-900">Latest News</h2>
      <div className="grid grid-flow-dense grid-cols-1 auto-rows-[140px] gap-3 md:grid-cols-2 lg:grid-cols-4">
        {displayArticles.map((article, index) => (
          <NewsTile key={`${article.title}-${index}`} article={article} index={index} />
        ))}
      </div>
    </section>
  )
}

export default NewsGallery

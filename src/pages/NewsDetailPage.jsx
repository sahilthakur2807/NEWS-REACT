import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getCachedArticleById } from '../services/articleCache'

function getArticleBody(article) {
  if (!article) {
    return []
  }

  const explicitContent = article.content?.trim()

  if (explicitContent) {
    return explicitContent
      .split(/\n+/)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
  }

  const description = article.description?.trim()
  const title = article.title?.trim() || 'Untitled story'
  const source = article.source?.trim() || 'Unknown source'
  const date = article.date?.trim() || 'Unknown date'

  return [
    description || `${title} has been trending across major outlets today.`,
    `Published by ${source} on ${date}, this report highlights the latest updates and context around the story.`,
    'Open the original source link below for complete reporting, quotes, and full editorial coverage.',
  ]
}

function NewsDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const article = useMemo(() => {
    if (location.state?.article) {
      return location.state.article
    }

    return getCachedArticleById(id)
  }, [id, location.state])

  const paragraphs = useMemo(() => getArticleBody(article), [article])

  if (!article) {
    return (
      <main className="min-h-screen bg-zinc-100 px-3 py-6 text-zinc-900 sm:px-5 lg:px-7">
        <div className="mx-auto w-full max-w-4xl space-y-4 border border-zinc-300 bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-600">Article unavailable</p>
          <h1 className="text-4xl leading-tight text-zinc-900">We could not find this story.</h1>
          <p className="text-sm text-zinc-700">
            Load the latest news from the home page first, then open this article again.
          </p>
          <Link
            to="/"
            className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-wide text-zinc-50 transition hover:bg-zinc-800"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-3 py-6 text-zinc-900 sm:px-5 lg:px-7">
      <article className="mx-auto w-full max-w-5xl border border-zinc-300 bg-white">
        <div className="border-b border-zinc-300 p-5 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-zinc-600">
            <span>{article.source || 'Unknown Source'}</span>
            <span>•</span>
            <span>{article.date || 'Unknown Date'}</span>
          </div>

          <h1 className="text-4xl leading-tight sm:text-5xl">{article.title}</h1>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="h-72 w-full border border-zinc-300 object-cover sm:h-[420px]"
            />
          ) : null}

          <div className="space-y-4 text-base leading-relaxed text-zinc-800 sm:text-lg">
            {paragraphs.map((paragraph, index) => (
              <p key={`${article.id || article.title}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-zinc-300 pt-5">
            <Link
              to="/"
              className="inline-flex items-center border border-zinc-900 px-4 py-2 text-xs uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
            >
              Back to Home
            </Link>

            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-wide text-zinc-50 transition hover:bg-zinc-800"
              >
                Read Original Source
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  )
}

export default NewsDetailPage

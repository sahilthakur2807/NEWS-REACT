import { useState } from 'react'
import AuthModal from '../auth/AuthModal'
import { useAuth } from '../auth/AuthProvider'

function formatChatTimestamp(value) {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ArticleChat({
  messages,
  error,
  isLoadingHistory,
  onSendMessage,
  modeLabel = 'Database',
  requireAuth = true,
}) {
  const [draftMessage, setDraftMessage] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthReady } = useAuth()
  const isAuthed = Boolean(user)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (requireAuth && isAuthReady && !isAuthed) {
      setIsAuthModalOpen(true)
      return
    }

    const sent = onSendMessage(draftMessage)

    if (sent) {
      setDraftMessage('')
    }
  }

  return (
    <section className="space-y-4 border border-zinc-300 bg-zinc-50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl leading-tight text-zinc-900">Live Article Chat</h2>
        <span className="text-xs uppercase tracking-wide text-zinc-600">{modeLabel}</span>
      </div>

      {isLoadingHistory ? <p className="text-sm text-zinc-600">Loading chat history...</p> : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="max-h-80 space-y-3 overflow-y-auto border border-zinc-300 bg-white p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-600">No messages yet. Start this article conversation.</p>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="border-b border-zinc-200 pb-2 last:border-b-0 last:pb-0">
              <p className="text-sm text-zinc-900">{message.message}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500">
                {message.user_id} {message.created_at ? `• ${formatChatTimestamp(message.created_at)}` : ''}
              </p>
            </article>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {requireAuth && isAuthReady && !isAuthed ? (
          <div className="border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">Login required</p>
            <p className="mt-1 text-amber-800">
              Please log in to start or continue this conversation.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-3 inline-flex items-center border border-amber-900 bg-amber-900 px-3 py-1.5 text-xs uppercase tracking-wide text-amber-50 transition hover:bg-amber-800"
            >
              Login
            </button>
          </div>
        ) : null}

        <textarea
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          rows={3}
          placeholder="Type your message"
          disabled={requireAuth && isAuthReady && !isAuthed}
          className="w-full resize-y border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
        />

        <button
          type="submit"
          disabled={requireAuth && isAuthReady && !isAuthed}
          className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-wide text-zinc-50 transition hover:bg-zinc-800"
        >
          Send Message
        </button>
      </form>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  )
}

export default ArticleChat

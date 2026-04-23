import { useMemo, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function normalizeFirebaseError(error) {
  const code = String(error?.code || '')

  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
    return 'Incorrect email or password.'
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'That email is already in use. Try logging in instead.'
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Use at least 6 characters.'
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email.'
  }

  return error?.message || 'Authentication failed.'
}

export default function AuthModal({ isOpen, mode = 'login', onClose }) {
  const [activeMode, setActiveMode] = useState(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(() => (activeMode === 'signup' ? 'Create account' : 'Log in'), [activeMode])

  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (activeMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password)
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      }
      onClose?.()
    } catch (err) {
      setError(normalizeFirebaseError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setError('')
    setActiveMode((current) => (current === 'signup' ? 'login' : 'signup'))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div className="w-full max-w-md border border-zinc-300 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl leading-tight text-zinc-950">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {activeMode === 'signup'
                ? 'Create an account to save favorites and chat.'
                : 'Log in to access favorites and chat.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="border border-zinc-300 px-3 py-1 text-xs uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
          >
            Close
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="w-full border border-zinc-400 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-700"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={activeMode === 'signup' ? 'new-password' : 'current-password'}
              className="w-full border border-zinc-400 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-700"
              required
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait…' : activeMode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-zinc-700">
          <button
            type="button"
            onClick={switchMode}
            className="underline decoration-zinc-400 underline-offset-4 hover:decoration-zinc-900"
          >
            {activeMode === 'signup' ? 'Already have an account? Log in' : 'New here? Create an account'}
          </button>
        </div>
      </div>
    </div>
  )
}


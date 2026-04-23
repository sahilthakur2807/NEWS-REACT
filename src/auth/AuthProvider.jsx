import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // If persistence cannot be set, Firebase will fall back to in-memory.
    })

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsAuthReady(true)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthReady,
      async signOut() {
        await firebaseSignOut(auth)
      },
      async getIdToken() {
        if (!auth.currentUser) return ''
        return await auth.currentUser.getIdToken()
      },
    }),
    [user, isAuthReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}


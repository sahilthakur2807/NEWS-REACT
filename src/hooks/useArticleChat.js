import { useCallback, useEffect, useMemo, useState } from 'react'
import { getChatSocket, isRealtimeChatEnabled } from '../services/chatSocket'
import { getChatHistory, postChatMessage } from '../services/chatService'

const CHAT_USER_ID_KEY = 'news_app_chat_user_id'

function createAnonymousUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `guest-${crypto.randomUUID().slice(0, 8)}`
  }

  const randomValue = Math.random().toString(36).slice(2, 10)
  return `guest-${randomValue}`
}

function getOrCreateChatUserId() {
  if (typeof window === 'undefined') {
    return 'guest-server'
  }

  const existingId = window.localStorage.getItem(CHAT_USER_ID_KEY)

  if (existingId) {
    return existingId
  }

  const nextId = createAnonymousUserId()
  window.localStorage.setItem(CHAT_USER_ID_KEY, nextId)
  return nextId
}

export default function useArticleChat(articleId) {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  const userId = useMemo(() => getOrCreateChatUserId(), [])
  const realtimeEnabled = useMemo(() => isRealtimeChatEnabled(), [])

  useEffect(() => {
    if (!articleId) {
      return undefined
    }

    if (!realtimeEnabled) {
      let isActive = true
      setIsLoadingHistory(true)
      setError('')

      getChatHistory({ articleId })
        .then((history) => {
          if (!isActive) return
          setMessages(history)
          setIsLoadingHistory(false)
        })
        .catch((err) => {
          if (!isActive) return
          setError(err?.message || 'Unable to load chat right now.')
          setIsLoadingHistory(false)
        })

      return () => {
        isActive = false
      }
    }

    const socket = getChatSocket()

    if (!socket) {
      return undefined
    }

    const handleHistory = (payload = {}) => {
      if (payload.articleId !== articleId) {
        return
      }

      setMessages(Array.isArray(payload.messages) ? payload.messages : [])
      setError('')
      setIsLoadingHistory(false)
    }

    const handleIncomingMessage = (message) => {
      if (message?.article_id !== articleId) {
        return
      }

      setMessages((currentMessages) => [...currentMessages, message])
    }

    const handleError = (payload = {}) => {
      setError(payload.message || 'Unable to load chat right now.')
      setIsLoadingHistory(false)
    }

    socket.on('chat_history', handleHistory)
    socket.on('chat_message', handleIncomingMessage)
    socket.on('chat_error', handleError)
    socket.on('connect_error', handleError)

    socket.emit('join_article', { articleId, userId })

    return () => {
      socket.off('chat_history', handleHistory)
      socket.off('chat_message', handleIncomingMessage)
      socket.off('chat_error', handleError)
      socket.off('connect_error', handleError)
    }
  }, [articleId, userId, realtimeEnabled])

  const sendMessage = useCallback(
    (content) => {
      const message = String(content || '').trim()

      if (!articleId || !message) {
        return false
      }

      if (!realtimeEnabled) {
        setError('')
        postChatMessage({ articleId, userId, message })
          .then((created) => {
            setMessages((currentMessages) => [...currentMessages, created])
          })
          .catch((err) => {
            setError(err?.message || 'Unable to send message right now.')
          })
        return true
      }

      const socket = getChatSocket()

      if (!socket) {
        setError('Realtime chat is currently unavailable.')
        return false
      }

      socket.emit('send_message', {
        articleId,
        userId,
        message,
      })

      return true
    },
    [articleId, userId, realtimeEnabled],
  )

  return {
    messages,
    error,
    userId,
    isLoadingHistory,
    sendMessage,
    realtimeEnabled,
  }
}

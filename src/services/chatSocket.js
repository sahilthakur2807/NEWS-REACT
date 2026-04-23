import { io } from 'socket.io-client'

let socket

function toBoolean(value) {
  return String(value || '').toLowerCase() === 'true'
}

function isVercelDevHost() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.port === '3000'
}

export function isRealtimeChatEnabled() {
  const explicitToggle = import.meta.env.VITE_ENABLE_REALTIME_CHAT
  const explicitSocketUrl = import.meta.env.VITE_CHAT_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || ''

  if (explicitToggle !== undefined) {
    return toBoolean(explicitToggle)
  }

  // Under `vercel dev` (commonly :3000), disable implicit socket attempts unless explicitly configured.
  if (isVercelDevHost() && !explicitSocketUrl) {
    return false
  }

  return true
}

function getSocketUrl() {
  const configuredBase =
    import.meta.env.VITE_CHAT_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || ''

  if (!configuredBase) {
    return undefined
  }

  return configuredBase.replace(/\/$/, '')
}

export function getChatSocket() {
  if (!isRealtimeChatEnabled()) {
    return null
  }

  if (!socket) {
    socket = io(getSocketUrl(), {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
  }

  return socket
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect()
    socket = undefined
  }
}

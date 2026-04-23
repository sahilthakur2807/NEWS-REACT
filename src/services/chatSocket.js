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
  const explicitSocketUrl = import.meta.env.VITE_CHAT_SOCKET_URL || ''

  if (explicitToggle !== undefined) {
    return toBoolean(explicitToggle) && Boolean(explicitSocketUrl)
  }

  // Only enable realtime when a dedicated socket URL is configured.
  // This avoids timeouts under `vercel dev` where no Socket.IO server exists.
  return Boolean(explicitSocketUrl) && !isVercelDevHost()
}

function getSocketUrl() {
  const configuredBase = import.meta.env.VITE_CHAT_SOCKET_URL || ''

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

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableRealtimeChat = String(env.VITE_ENABLE_REALTIME_CHAT || '').toLowerCase() === 'true'

  const proxy = {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  }

  if (enableRealtimeChat) {
    proxy['/socket.io'] = {
      target: 'http://localhost:5000',
      ws: true,
      changeOrigin: true,
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy,
    },
  }
})

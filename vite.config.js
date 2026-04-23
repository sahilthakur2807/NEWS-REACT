import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableRealtimeChat = String(env.VITE_ENABLE_REALTIME_CHAT || '').toLowerCase() === 'true'
  const isVercelDev = String(env.VERCEL || process.env.VERCEL || '').toLowerCase() === '1'

  const proxy = {}

  // When running `vercel dev`, API routes are served by Vercel locally.
  // Avoid proxying /api to the legacy Express server.
  if (!isVercelDev) {
    proxy['/api'] = {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }

  if (enableRealtimeChat) {
    if (!isVercelDev) {
      proxy['/socket.io'] = {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy,
    },
  }
})

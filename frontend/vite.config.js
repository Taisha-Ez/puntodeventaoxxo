import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Todo lo que empiece con /api se reenvía al backend indicado en el .env
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (ruta) => ruta.replace(/^\/api/, ''),
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      },
    },
  }
})
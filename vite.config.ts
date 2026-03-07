import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['oai.yaylabs.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/16\\..*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

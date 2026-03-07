import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['oai.yaylabs.dev'],
    proxy: {
      '/api': {
        target: 'https://api.yaylabs.dev',  // was http://localhost:3000
        changeOrigin: true,
      },
      '^/16\\..*': {
        target: 'https://api.yaylabs.dev',  // was http://localhost:3000
        changeOrigin: true,
      },
    },
  },
})

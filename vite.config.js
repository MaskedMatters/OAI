import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        allowedHosts: [
            'oai.yaylabs.dev'
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            },
            '^/16\\..*': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      protocol: 'wss',
      host: 'profy.top'
    }
  },
  base: '/webapp/',
  build: {
    outDir: 'dist'
  }
})
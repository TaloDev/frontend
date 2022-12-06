import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup-tests.js',
    css: false
  }
})

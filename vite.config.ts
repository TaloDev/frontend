/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup-tests.js',
    css: false,
    coverage: {
      reporter: 'lcov',
      exclude: [
        'src/api',
        'src/entities',
        'src/constants',
        'src/utils/canViewPage.js',
        '**/__tests__'
      ]
    }
  }
})

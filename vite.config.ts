import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 8080,
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
        'src/utils/canViewPage.ts',
        '**/__tests__',
      ],
    },
  },
})

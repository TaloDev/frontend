import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
    css: false,
    coverage: {
      provider: 'c8',
      reporter: 'lcov',
      exclude: [
        'src/api',
        'src/constants',
        'src/utils/canViewPage.js',
        '**/__tests__'
      ]
    }
  }
})

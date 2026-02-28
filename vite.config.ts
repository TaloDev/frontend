import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  test: {
    watch: false,
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
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: './setup-tests.ts',
          include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
          exclude: ['src/utils/__tests__/convertDateToUTC.test.ts'],
        },
      },
      {
        test: {
          name: 'tz',
          globals: true,
          environment: 'jsdom',
          setupFiles: './setup-tests.ts',
          include: ['src/utils/__tests__/convertDateToUTC.test.ts'],
          env: { TZ: 'America/Los_Angeles' },
        },
      },
    ],
  },
})

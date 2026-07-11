import * as Sentry from '@sentry/react'
import React from 'react'
import '@daypicker/react/style.css'
import './styles/index.css'
import 'tippy.js/dist/tippy.css'
import '@xyflow/react/dist/base.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import ToastProvider from './components/toast/ToastProvider'
import { getEnv } from './utils/env'

const dsn = getEnv('VITE_SENTRY_DSN')
if (dsn?.startsWith('http')) {
  Sentry.init({
    dsn,
    environment: getEnv('VITE_SENTRY_ENV'),
  })
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>,
)

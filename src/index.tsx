import * as Sentry from '@sentry/react'
import React from 'react'
import './styles/index.css'
import 'tippy.js/dist/tippy.css'
import 'react-day-picker/dist/style.css'
import '@xyflow/react/dist/base.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import App from './App'
import ToastProvider from './components/toast/ToastProvider'

if (import.meta.env.VITE_SENTRY_DSN?.startsWith('http')) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENV,
  })
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </RecoilRoot>
  </React.StrictMode>,
)

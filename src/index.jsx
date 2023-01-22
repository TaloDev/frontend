import React from 'react'
import { createRoot } from 'react-dom/client';
import './styles/index.css'
import 'tippy.js/dist/tippy.css'
import 'react-day-picker/dist/style.css'
import App from './App'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import ToastProvider from './components/toast/ToastProvider'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENV
})

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </RecoilRoot>
  </React.StrictMode>
)

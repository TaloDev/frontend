import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import 'tippy.js/dist/tippy.css'
import App from './App'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import ToastProvider from './components/toast/ToastProvider'

Sentry.init({
  dsn: import.meta.env.SNOWPACK_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.SNOWPACK_PUBLIC_SENTRY_ENV
})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)

if (import.meta.hot) {
  import.meta.hot.accept()
}

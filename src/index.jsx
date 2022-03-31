import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import 'tippy.js/dist/tippy.css'
import App from './App'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  environment: import.meta.env.SENTRY_ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)

if (import.meta.hot) {
  import.meta.hot.accept()
}

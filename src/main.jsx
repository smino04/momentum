import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  const RELOAD_COUNT_KEY = 'moment-sw-reload-count'
  const MAX_RELOADS = 3

  function reloadOnceGuarded() {
    const count = parseInt(sessionStorage.getItem(RELOAD_COUNT_KEY) || '0', 10)
    if (count >= MAX_RELOADS) return
    sessionStorage.setItem(RELOAD_COUNT_KEY, String(count + 1))
    window.location.reload()
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (installing.state === 'activated') {
              reloadOnceGuarded()
            }
          })
        })
      })
      .catch(() => {})
  })

  navigator.serviceWorker.addEventListener('controllerchange', reloadOnceGuarded)
}

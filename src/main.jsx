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
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (installing.state === 'activated') {
              window.location.reload()
            }
          })
        })
      })
      .catch(() => {})
  })

  let reloadedOnce = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadedOnce) return
    reloadedOnce = true
    window.location.reload()
  })
}

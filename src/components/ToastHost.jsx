import { useEffect, useRef, useState } from 'react'
import { subscribeToast } from '../utils/toast'

export default function ToastHost() {
  const [message, setMessage] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return subscribeToast((msg) => {
      setMessage(msg)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setMessage(null), 1800)
    })
  }, [])

  if (!message) return null

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[998] flex justify-center"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}
    >
      <div
        key={message + Date.now()}
        className="animate-fade-in rounded-full px-4 py-2.5 text-sm font-medium shadow-lg"
        style={{ background: 'var(--text)', color: 'var(--bg)' }}
      >
        {message}
      </div>
    </div>
  )
}

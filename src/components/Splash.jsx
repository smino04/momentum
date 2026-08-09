import { useEffect, useState } from 'react'

export default function Splash() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700)
    const hideTimer = setTimeout(() => setVisible(false), 1000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-300"
      style={{ background: 'var(--bg)', opacity: fading ? 0 : 1 }}
    >
      <img
        src="./icon-512.png"
        alt=""
        className="h-28 w-28 rounded-[26px]"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
      />
    </div>
  )
}

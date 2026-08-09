import { useState } from 'react'

export default function PageHeader({ title, onClick }) {
  const [pulseTick, setPulseTick] = useState(0)

  if (onClick) {
    return (
      <button
        onClick={() => {
          setPulseTick((n) => n + 1)
          onClick()
        }}
        className="text-left"
      >
        <h1
          key={pulseTick}
          className="animate-tap-pulse text-[32px] font-extrabold leading-none"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h1>
      </button>
    )
  }

  return (
    <h1 className="text-[32px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
      {title}
    </h1>
  )
}

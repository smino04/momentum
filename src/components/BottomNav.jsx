import { useState } from 'react'
import { Home, TrendingUp, CalendarDays, Settings } from 'lucide-react'

const TABS = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'progress', label: '진행상황', icon: TrendingUp },
  { id: 'calendar', label: '출타 달력', icon: CalendarDays },
  { id: 'settings', label: '설정', icon: Settings },
]

export default function BottomNav({ active, onChange }) {
  const [pulse, setPulse] = useState({ id: null, tick: 0 })

  function handleClick(tabId) {
    setPulse((prev) => ({ id: tabId, tick: prev.tick + 1 }))
    onChange(tabId)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderColor: 'var(--border)',
        background: 'var(--nav-bg)',
      }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          const pulseKey = pulse.id === tab.id ? pulse.tick : 'idle'
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className="flex flex-1 flex-col items-center gap-1 py-3 active:opacity-60"
            >
              <span key={pulseKey} className={pulse.id === tab.id ? 'animate-tap-pulse' : ''}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={isActive ? 'text-accent' : ''}
                  style={isActive ? undefined : { color: 'var(--text-3)' }}
                />
              </span>
              <span
                className={`text-[10px] tracking-wide ${isActive ? 'font-medium' : ''}`}
                style={{ color: isActive ? 'var(--text)' : 'var(--text-3)' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

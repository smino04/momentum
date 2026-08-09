import { Home, TrendingUp, User } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'HOME', icon: Home },
  { id: 'progress', label: 'PROGRESS', icon: TrendingUp },
  { id: 'profile', label: 'PROFILE', icon: User },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-1 flex-col items-center gap-1 py-3 active:opacity-60"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? 'text-accent' : 'text-white/40'}
              />
              <span
                className={`text-[10px] tracking-wide ${
                  isActive ? 'text-white font-medium' : 'text-white/40'
                }`}
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

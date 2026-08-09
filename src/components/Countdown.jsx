import { formatShortDate } from '../utils/date'

export default function Countdown({ date, dday, label = '휴가' }) {
  if (!date || !dday) {
    return (
      <div className="pt-2">
        <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
          🌅 다음 {label}
        </p>
        <p className="mt-2 text-4xl font-bold" style={{ color: 'var(--text)' }}>
          일정을 등록하세요
        </p>
      </div>
    )
  }

  if (dday.expired) {
    return (
      <div className="pt-2">
        <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
          🌅 다음 {label}
        </p>
        <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--text)' }}>
          일정을 업데이트하세요
        </p>
      </div>
    )
  }

  const totalSpan = 60
  const progress = Math.min(100, Math.max(0, ((totalSpan - dday.diff) / totalSpan) * 100))

  return (
    <div className="pt-2">
      <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        🌅 다음 {label}
      </p>
      <p className="mt-2 text-[64px] font-bold leading-none tracking-tight" style={{ color: 'var(--text)' }}>
        {dday.isToday ? '디데이' : `D-${dday.diff}`}
      </p>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-2)' }}>
        {formatShortDate(date)}
      </p>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

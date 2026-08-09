import { lastNDays } from '../utils/date'

export default function HabitHeatmap({ dailyLogs, habitId, endKey, days = 91, columns = 13 }) {
  const dayKeys = lastNDays(days, endKey)

  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {dayKeys.map((d) => {
        const done = Boolean(dailyLogs[d]?.[habitId])
        return (
          <div
            key={d}
            className="aspect-square rounded-[2px]"
            style={{ background: done ? 'var(--color-accent)' : 'var(--surface-soft)' }}
          />
        )
      })}
    </div>
  )
}

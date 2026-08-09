import { lastNDays } from '../utils/date'

const DAYS = 91
const COLUMNS = 13

export default function HabitHeatmap({ dailyLogs, habitId, endKey }) {
  const days = lastNDays(DAYS, endKey)

  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}>
      {days.map((d) => {
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

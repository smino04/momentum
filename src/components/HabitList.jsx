import HabitRow from './HabitRow'

export default function HabitList({ habits, log, onToggle, dailyLogs, today }) {
  const active = habits
    .filter((h) => h.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  if (active.length === 0) {
    return (
      <p className="py-6 text-sm" style={{ color: 'var(--text-3)' }}>
        관리 항목이 없습니다. 설정에서 추가해보세요.
      </p>
    )
  }

  return (
    <div className="mt-4">
      {active.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          checked={Boolean(log?.[habit.id])}
          onToggle={onToggle}
          dailyLogs={dailyLogs}
          today={today}
        />
      ))}
    </div>
  )
}

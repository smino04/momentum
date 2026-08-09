import HabitRow from './HabitRow'

export default function HabitList({ habits, log, onToggle }) {
  const enabled = habits.filter((h) => h.enabled)
  const groups = []
  for (const h of enabled) {
    let group = groups.find((g) => g.name === h.group)
    if (!group) {
      group = { name: h.group, items: [] }
      groups.push(group)
    }
    group.items.push(h)
  }

  if (enabled.length === 0) {
    return (
      <p className="py-6 text-sm" style={{ color: 'var(--text-3)' }}>
        관리 항목이 없습니다. 설정에서 추가해보세요.
      </p>
    )
  }

  return (
    <div>
      {groups.map((group) => (
        <div key={group.name} className="mb-2">
          <p
            className="pb-1 pt-4 text-[11px] font-semibold tracking-widest"
            style={{ color: 'var(--text-4)' }}
          >
            {group.name}
          </p>
          {group.items.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              checked={Boolean(log?.[habit.id])}
              onToggle={onToggle}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

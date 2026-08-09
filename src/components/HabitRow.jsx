import { Check } from 'lucide-react'
import HabitHeatmap from './HabitHeatmap'

export default function HabitRow({ habit, checked, onToggle, dailyLogs, today, onOpenDetail }) {
  return (
    <div className="mb-2 rounded-2xl p-3" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(habit)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-base"
            style={{ background: 'var(--surface-soft)' }}
          >
            {habit.emoji}
          </div>
          <span
            className="truncate text-sm font-medium transition-colors"
            style={{ color: checked ? 'var(--text-4)' : 'var(--text)' }}
          >
            {habit.label}
          </span>
        </button>
        <button
          onClick={() => onToggle(habit.id)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-colors"
          style={{
            borderColor: checked ? 'var(--color-accent)' : 'var(--border)',
            background: checked ? 'var(--color-accent)' : 'transparent',
          }}
        >
          {checked && <Check size={16} strokeWidth={3} className="animate-check text-black" />}
        </button>
      </div>

      <div className="mt-2.5">
        <HabitHeatmap dailyLogs={dailyLogs} habitId={habit.id} endKey={today} days={112} columns={28} />
      </div>
    </div>
  )
}

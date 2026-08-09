import { Check } from 'lucide-react'
import HabitHeatmap from './HabitHeatmap'

export default function HabitRow({ habit, checked, onToggle, dailyLogs, today }) {
  return (
    <div className="mb-3 rounded-[20px] p-4" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl"
            style={{ background: 'var(--surface-soft)' }}
          >
            {habit.emoji}
          </div>
          <span
            className="truncate text-[15px] font-medium transition-colors"
            style={{ color: checked ? 'var(--text-4)' : 'var(--text)' }}
          >
            {habit.label}
          </span>
        </div>
        <button
          onClick={() => onToggle(habit.id)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition-colors"
          style={{
            borderColor: checked ? 'var(--color-accent)' : 'var(--border)',
            background: checked ? 'var(--color-accent)' : 'transparent',
          }}
        >
          {checked && <Check size={20} strokeWidth={3} className="animate-check text-black" />}
        </button>
      </div>

      <div className="mt-4">
        <HabitHeatmap dailyLogs={dailyLogs} habitId={habit.id} endKey={today} />
      </div>
    </div>
  )
}

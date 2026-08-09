import { Check } from 'lucide-react'

export default function HabitRow({ habit, checked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(habit.id)}
      className="flex w-full items-center justify-between border-b py-4 text-left"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <span
        className="flex items-center gap-2.5 text-[17px] transition-colors"
        style={{ color: checked ? 'var(--text-4)' : 'var(--text)' }}
      >
        <span className="text-lg">{habit.emoji}</span>
        {habit.label}
      </span>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: checked ? 'var(--color-accent)' : 'var(--check-off-border)',
          background: checked ? 'var(--color-accent)' : 'transparent',
        }}
      >
        {checked && <Check size={16} strokeWidth={3} className="animate-check text-black" />}
      </span>
    </button>
  )
}

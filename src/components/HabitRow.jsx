import { Check } from 'lucide-react'

export default function HabitRow({ habit, checked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(habit.id)}
      className="flex w-full items-center justify-between border-b border-white/5 py-4 text-left active:bg-white/5"
    >
      <span className={`flex items-center gap-2.5 text-[17px] transition-colors ${checked ? 'text-white/35' : 'text-white'}`}>
        <span className="text-lg">{habit.emoji}</span>
        {habit.label}
      </span>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
          checked ? 'border-accent bg-accent' : 'border-white/20'
        }`}
      >
        {checked && <Check size={16} strokeWidth={3} className="animate-check text-black" />}
      </span>
    </button>
  )
}

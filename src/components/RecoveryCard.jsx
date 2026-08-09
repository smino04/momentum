import { Check } from 'lucide-react'
import { RECOVERY_ITEMS } from '../utils/constants'

export default function RecoveryCard({ recoveryLog, onToggle }) {
  const doneCount = RECOVERY_ITEMS.filter((item) => recoveryLog?.[item.id]).length
  const complete = doneCount >= 2

  return (
    <div
      className="mt-4 animate-fade-in rounded-[20px] border p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
    >
      <p className="text-[15px] font-medium" style={{ color: 'var(--text)' }}>
        {complete ? '🌱 회복 완료' : '🌤️ 오늘은 아직 끝나지 않았습니다.'}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-3)' }}>
        회복 루틴
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {RECOVERY_ITEMS.map((item) => {
          const checked = Boolean(recoveryLog?.[item.id])
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'var(--surface-soft)' }}
            >
              <span
                className="flex items-center gap-2 text-sm"
                style={{ color: checked ? 'var(--text-4)' : 'var(--text)' }}
              >
                <span>{item.emoji}</span>
                {item.label}
              </span>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border"
                style={{
                  borderColor: checked ? 'var(--color-accent)' : 'var(--check-off-border)',
                  background: checked ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {checked && <Check size={14} strokeWidth={3} className="animate-check text-black" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

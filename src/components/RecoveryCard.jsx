import { Check } from 'lucide-react'
import { RECOVERY_ITEMS } from '../utils/constants'

export default function RecoveryCard({ recoveryLog, onToggle }) {
  const doneCount = RECOVERY_ITEMS.filter((item) => recoveryLog?.[item.id]).length
  const complete = doneCount >= 2

  return (
    <div className="mt-4 animate-fade-in rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[15px] font-medium text-white">
        {complete ? 'Recovery complete' : '오늘은 아직 끝나지 않았습니다.'}
      </p>
      <p className="mt-1 text-xs text-white/40">회복 루틴</p>
      <div className="mt-3 flex flex-col gap-2">
        {RECOVERY_ITEMS.map((item) => {
          const checked = Boolean(recoveryLog?.[item.id])
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 active:bg-white/10"
            >
              <span className={`text-sm ${checked ? 'text-white/35' : 'text-white'}`}>
                {item.label}
              </span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  checked ? 'border-accent bg-accent' : 'border-white/20'
                }`}
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

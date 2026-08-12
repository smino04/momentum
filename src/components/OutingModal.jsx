import { useEffect, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import Modal from './Modal'
import { OUTING_TYPES } from '../utils/constants'
import { formatShortDate, todayKey } from '../utils/date'
import { defaultEndDate } from '../utils/outings'
import { isHabitDueOn } from '../utils/momentum'

export default function OutingModal({
  open,
  anchorDate,
  existing,
  habits,
  dailyLogs,
  onToggleHabit,
  onClose,
  onSave,
  onDelete,
}) {
  const [type, setType] = useState(OUTING_TYPES[0].id)
  const [endDate, setEndDate] = useState(anchorDate)

  useEffect(() => {
    if (existing) {
      setType(existing.type)
      setEndDate(existing.endDate)
    } else if (anchorDate) {
      setType(OUTING_TYPES[0].id)
      setEndDate(defaultEndDate(OUTING_TYPES[0].id, anchorDate))
    }
  }, [existing, anchorDate, open])

  if (!anchorDate) return null

  const startDate = existing?.startDate ?? anchorDate
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'

  const showHabitChecklist = habits && dailyLogs && anchorDate <= todayKey()
  const dueHabits = showHabitChecklist
    ? habits
        .filter((h) => h.active !== false && (!h.createdAt || h.createdAt <= anchorDate))
        .filter((h) => isHabitDueOn(h, anchorDate))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []
  const dayLog = dailyLogs?.[anchorDate] || {}

  function handleTypeChange(t) {
    setType(t)
    setEndDate(defaultEndDate(t, startDate))
  }

  function handleSave() {
    onSave({ type, startDate, endDate: type === '휴가' ? endDate : defaultEndDate(type, startDate) })
  }

  return (
    <Modal open={open} onClose={onClose} title={formatShortDate(startDate)}>
      {showHabitChecklist && dueHabits.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            이 날의 관리항목
          </p>
          <div className="flex flex-col gap-1.5">
            {dueHabits.map((h) => {
              const checked = Boolean(dayLog[h.id])
              return (
                <button
                  key={h.id}
                  onClick={() => onToggleHabit(anchorDate, h.id)}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
                  style={{ background: 'var(--surface-soft)' }}
                >
                  <span className="text-base">{h.emoji}</span>
                  <span
                    className="flex-1 text-left text-sm font-medium"
                    style={{ color: checked ? 'var(--text-4)' : 'var(--text)' }}
                  >
                    {h.label}
                  </span>
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border"
                    style={{
                      borderColor: checked ? 'var(--color-accent)' : 'var(--border)',
                      background: checked ? 'var(--color-accent)' : 'transparent',
                    }}
                  >
                    {checked && <Check size={13} strokeWidth={3} className="text-black" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
        일정 종류
      </p>
      <div className="flex gap-2">
        {OUTING_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTypeChange(t.id)}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl border py-3.5"
            style={{
              borderColor: type === t.id ? 'var(--color-accent)' : 'var(--border)',
              background:
                type === t.id ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'var(--surface-soft)',
            }}
          >
            <span className="text-xl">{t.emoji}</span>
            <span className="text-xs font-medium" style={{ color: type === t.id ? 'var(--color-accent)' : 'var(--text-2)' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {type === '휴가' && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs" style={{ color: 'var(--text-4)' }}>
            종료일
          </p>
          <input
            type="date"
            min={startDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
            style={{ colorScheme: isLight ? 'light' : 'dark' }}
          />
        </div>
      )}

      {type === '외박' && (
        <p className="mt-3 text-xs" style={{ color: 'var(--text-3)' }}>
          🌙 1박 2일로 자동 설정돼요 · {formatShortDate(startDate)} ~ {formatShortDate(defaultEndDate('외박', startDate))}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        {existing && (
          <button
            onClick={onDelete}
            className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400"
          >
            <Trash2 size={18} />
          </button>
        )}
        <button
          onClick={handleSave}
          className="flex-1 rounded-2xl bg-accent py-4 font-semibold text-white"
        >
          {existing ? '수정' : '등록'}
        </button>
      </div>
    </Modal>
  )
}

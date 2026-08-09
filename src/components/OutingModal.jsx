import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import { OUTING_TYPES } from '../utils/constants'
import { formatShortDate } from '../utils/date'
import { defaultEndDate } from '../utils/outings'

export default function OutingModal({ open, anchorDate, existing, onClose, onSave, onDelete }) {
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

  function handleTypeChange(t) {
    setType(t)
    setEndDate(defaultEndDate(t, startDate))
  }

  function handleSave() {
    onSave({ type, startDate, endDate: type === '휴가' ? endDate : defaultEndDate(type, startDate) })
  }

  return (
    <Modal open={open} onClose={onClose} title={formatShortDate(startDate)}>
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

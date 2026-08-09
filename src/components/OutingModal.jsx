import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import { OUTING_TYPES } from '../utils/constants'
import { formatShortDate } from '../utils/date'

export default function OutingModal({ open, date, existing, onClose, onSave, onDelete }) {
  const [type, setType] = useState(existing?.type ?? OUTING_TYPES[0].id)

  useEffect(() => {
    setType(existing?.type ?? OUTING_TYPES[0].id)
  }, [existing, date])

  if (!date) return null

  return (
    <Modal open={open} onClose={onClose} title={formatShortDate(date)}>
      <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
        일정 종류
      </p>
      <div className="flex gap-2">
        {OUTING_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
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
          onClick={() => onSave(type)}
          className="flex-1 rounded-2xl bg-accent py-4 font-semibold text-white"
        >
          {existing ? '수정' : '등록'}
        </button>
      </div>
    </Modal>
  )
}

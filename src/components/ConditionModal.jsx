import { useState } from 'react'
import Modal from './Modal'
import { CONDITION_FIELDS, CONDITION_SCALE } from '../utils/constants'

export default function ConditionModal({ open, onClose, initial, onSave }) {
  const [values, setValues] = useState(initial ?? {})

  function pick(fieldId, value) {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  function save() {
    onSave(values)
    onClose()
  }

  const canSave = CONDITION_FIELDS.every((f) => values[f.id])

  return (
    <Modal open={open} onClose={onClose} title="오늘 컨디션">
      {CONDITION_FIELDS.map((field) => (
        <div key={field.id} className="mb-5">
          <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            {field.label}
          </p>
          <div className="flex justify-between gap-1.5">
            {CONDITION_SCALE.map((s) => {
              const selected = values[field.id] === s.value
              return (
                <button
                  key={s.value}
                  onClick={() => pick(field.id, s.value)}
                  className="flex h-12 flex-1 items-center justify-center rounded-xl border text-2xl transition-colors"
                  style={{
                    borderColor: selected ? 'var(--color-accent)' : 'var(--border)',
                    background: selected
                      ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)'
                      : 'var(--surface-soft)',
                  }}
                >
                  {s.emoji}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <button
        onClick={save}
        disabled={!canSave}
        className="w-full rounded-2xl bg-accent py-4 font-semibold text-white disabled:opacity-30"
      >
        저장
      </button>
    </Modal>
  )
}

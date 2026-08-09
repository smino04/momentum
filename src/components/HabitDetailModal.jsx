import { useState } from 'react'
import { X, Pencil, Trash2, ChevronLeft, ChevronRight, Flame, CheckCircle2 } from 'lucide-react'
import HabitHeatmap from './HabitHeatmap'
import { HABIT_EMOJI_CHOICES } from '../utils/constants'
import { todayKey, daysInMonth, firstWeekdayMonIndex, dateKeyFor } from '../utils/date'
import { calcHabitStreak, calcHabitTotalCompletions } from '../utils/momentum'
import { useBackClose } from '../utils/useBackClose'

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export default function HabitDetailModal({ habit, dailyLogs, onClose, onSave, onDelete }) {
  useBackClose(Boolean(habit), onClose)
  const today = todayKey()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(habit?.label ?? '')
  const [emoji, setEmoji] = useState(habit?.emoji ?? HABIT_EMOJI_CHOICES[0])
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  if (!habit) return null

  const { streak } = calcHabitStreak(dailyLogs, habit, today)
  const total = calcHabitTotalCompletions(dailyLogs, habit.id)

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  function changeMonth(delta) {
    let y = viewYear
    let m = viewMonth + delta
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth())) return
    setViewYear(y)
    setViewMonth(m)
  }

  const totalCells = daysInMonth(viewYear, viewMonth)
  const leadBlanks = firstWeekdayMonIndex(viewYear, viewMonth)
  const cells = [...Array(leadBlanks).fill(null), ...Array.from({ length: totalCells }, (_, i) => i + 1)]

  function saveEdit() {
    const trimmed = label.trim()
    if (!trimmed) return
    onSave({ label: trimmed, emoji })
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-fade-in max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[24px] p-6"
        style={{ background: 'var(--bg)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{ background: 'var(--surface)' }}
            >
              {habit.emoji}
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                {habit.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                {habit.group ?? '관리 항목'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <HabitHeatmap dailyLogs={dailyLogs} habitId={habit.id} endKey={today} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium tabular-nums"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <Flame size={14} className="text-accent" />
            {streak}일 연속
          </span>
          <span
            className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium tabular-nums"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            <CheckCircle2 size={14} className="text-accent" />
            총 {total}회
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setEditing((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input-field"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {HABIT_EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border text-lg"
                  style={{
                    borderColor: emoji === e ? 'var(--color-accent)' : 'var(--border)',
                    background:
                      emoji === e ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'transparent',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <button onClick={saveEdit} className="mt-3 w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white">
              저장
            </button>
          </div>
        )}

        {deleteConfirm && (
          <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              이 관리항목을 삭제할까요? 기존 기록은 유지됩니다.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 rounded-2xl border py-3 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
              >
                취소
              </button>
              <button
                onClick={onDelete}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {viewYear}년 {viewMonth + 1}월
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => changeMonth(1)}
                disabled={isCurrentMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30"
                style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-y-2 text-center">
            {WEEKDAY_LABELS.map((w) => (
              <p key={w} className="text-[11px]" style={{ color: 'var(--text-4)' }}>
                {w}
              </p>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={`b${i}`} />
              const dateKey = dateKeyFor(viewYear, viewMonth, day)
              const checked = Boolean(dailyLogs[dateKey]?.[habit.id])
              const isToday = dateKey === today
              const isFuture = dateKey > today
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                    style={{
                      color: isFuture ? 'var(--text-4)' : 'var(--text)',
                      background: isToday ? 'var(--surface)' : 'transparent',
                      border: isToday ? '1px solid var(--color-accent)' : 'none',
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {day}
                  </div>
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: checked ? 'var(--color-accent)' : 'transparent' }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

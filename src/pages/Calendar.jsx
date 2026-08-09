import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import OutingModal from '../components/OutingModal'
import {
  todayKey,
  addDays,
  daysInMonth,
  firstWeekdayMonIndex,
  dateKeyFor,
  formatShortDate,
} from '../utils/date'
import { getNextOuting, sortOutingsAsc, outingDday } from '../utils/outings'
import { OUTING_TYPES } from '../utils/constants'

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

function typeEmoji(type) {
  return OUTING_TYPES.find((t) => t.id === type)?.emoji ?? '📌'
}

function rangeLabel(o) {
  return o.startDate === o.endDate
    ? formatShortDate(o.startDate)
    : `${formatShortDate(o.startDate)} ~ ${formatShortDate(o.endDate)}`
}

export default function Calendar({ data, update, onRefresh }) {
  const today = todayKey()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const outingsByDate = useMemo(() => {
    const map = new Map()
    for (const o of data.outings) {
      let cursor = o.startDate
      while (cursor <= o.endDate) {
        map.set(cursor, { outing: o, isStart: cursor === o.startDate })
        cursor = addDays(cursor, 1)
      }
    }
    return map
  }, [data.outings])

  const nextOuting = useMemo(() => getNextOuting(data.outings, today), [data.outings, today])
  const nextDday = outingDday(nextOuting, today)
  const upcoming = useMemo(
    () => sortOutingsAsc(data.outings).filter((o) => o.endDate >= today),
    [data.outings, today]
  )

  const selectedExisting = selectedDate ? outingsByDate.get(selectedDate)?.outing ?? null : null

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
    setViewYear(y)
    setViewMonth(m)
  }

  const totalCells = daysInMonth(viewYear, viewMonth)
  const leadBlanks = firstWeekdayMonIndex(viewYear, viewMonth)
  const cells = [...Array(leadBlanks).fill(null), ...Array.from({ length: totalCells }, (_, i) => i + 1)]

  function saveOuting(outingData) {
    update((prev) => {
      const existingId = selectedExisting?.id
      const others = prev.outings.filter((o) => o.id !== existingId)
      const id = existingId ?? `outing-${outingData.startDate}`
      return { ...prev, outings: [...others, { id, ...outingData }] }
    })
    setSelectedDate(null)
  }

  function deleteOuting() {
    update((prev) => ({ ...prev, outings: prev.outings.filter((o) => o.id !== selectedExisting?.id) }))
    setSelectedDate(null)
  }

  function removeOuting(id) {
    update((prev) => ({ ...prev, outings: prev.outings.filter((o) => o.id !== id) }))
  }

  return (
    <div className="page-shell">
      <PageHeader title="캘린더" onClick={onRefresh} />

      {nextOuting ? (
        <div className="mt-6 rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
          <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
            {typeEmoji(nextOuting.type)} 다음 {nextOuting.type}
          </p>
          <div className="mt-1 flex items-end justify-between">
            <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              {nextDday?.isToday ? '디데이' : `D-${nextDday?.diff}`}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              {rangeLabel(nextOuting)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            등록된 일정이 없어요. 날짜를 눌러 휴가·외출·외박을 등록해보세요.
          </p>
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
              className="flex h-8 w-8 items-center justify-center rounded-full"
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
            const covering = outingsByDate.get(dateKey)
            const isToday = dateKey === today
            const isNextStart = nextOuting?.startDate === dateKey
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateKey)}
                className="flex flex-col items-center gap-0.5 py-0.5"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                  style={{
                    color: 'var(--text)',
                    background: isNextStart
                      ? 'var(--color-accent)'
                      : covering
                        ? 'color-mix(in srgb, var(--color-accent) 16%, transparent)'
                        : isToday
                          ? 'var(--surface)'
                          : 'transparent',
                    border: isToday && !isNextStart ? '1px solid var(--color-accent)' : 'none',
                    fontWeight: isToday || isNextStart ? 700 : 400,
                  }}
                >
                  {day}
                </div>
                <span className="text-xs leading-none">
                  {covering?.isStart ? typeEmoji(covering.outing.type) : covering ? '·' : ' '}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
            📋 다가오는 일정
          </p>
          <div className="flex flex-col gap-2">
            {upcoming.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border px-4 py-3"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{typeEmoji(o.type)}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {o.type}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                      {rangeLabel(o)}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeOuting(o.id)} style={{ color: 'var(--text-4)' }}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <OutingModal
        open={Boolean(selectedDate)}
        anchorDate={selectedDate}
        existing={selectedExisting}
        onClose={() => setSelectedDate(null)}
        onSave={saveOuting}
        onDelete={deleteOuting}
      />
    </div>
  )
}

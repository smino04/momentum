import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import OutingModal from '../components/OutingModal'
import {
  todayKey,
  addDays,
  daysInMonth,
  firstWeekdayMonIndex,
  dateKeyFor,
  formatShortDate,
  leaveDDay,
} from '../utils/date'
import { getNextOuting, outingDday } from '../utils/outings'
import { OUTING_TYPES, OUTING_TYPE_COLORS, DISCHARGE_COLOR } from '../utils/constants'

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
  const dischargeDday = leaveDDay(data.dischargeDate, today)

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

  return (
    <div className="page-shell">
      <PageHeader title="출타 달력" onClick={onRefresh} />

      {data.dischargeDate && dischargeDday && !dischargeDday.expired && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums"
          style={{ background: 'var(--surface)', color: 'var(--text-2)' }}
        >
          🎖️ 전역 {dischargeDday.isToday ? 'D-DAY' : `D-${dischargeDday.diff}`}
        </div>
      )}

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

        <div className="mt-3 grid grid-cols-7 gap-x-1 gap-y-1.5 text-center">
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
            const isDischarge = dateKey === data.dischargeDate
            const typeColor = covering ? OUTING_TYPE_COLORS[covering.outing.type] : null
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateKey)}
                className="flex flex-col items-center gap-1 rounded-xl py-1"
                style={{ border: isToday ? '1.5px solid var(--color-accent)' : '1.5px solid transparent' }}
              >
                <span
                  className="text-[11px]"
                  style={{ color: isToday ? 'var(--color-accent)' : 'var(--text-3)', fontWeight: isToday ? 700 : 400 }}
                >
                  {day}
                </span>
                {isDischarge ? (
                  <span
                    className="flex h-[20px] w-full items-center justify-center rounded-md text-[9px] font-bold"
                    style={{ background: DISCHARGE_COLOR, color: '#241a00' }}
                  >
                    ⭐전역⭐
                  </span>
                ) : covering ? (
                  <span
                    className="flex h-[20px] w-full items-center justify-center rounded-md text-[10px] font-bold text-white"
                    style={{ background: typeColor }}
                  >
                    {covering.outing.type}
                  </span>
                ) : (
                  <span className="h-[20px] w-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

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

import { daysInMonth, firstWeekdayMonIndex, dateKeyFor } from '../utils/date'

export default function MiniMonthGrid({ year, month, today, isCurrentMonth, onSelect }) {
  const totalCells = daysInMonth(year, month)
  const leadBlanks = firstWeekdayMonIndex(year, month)
  const cells = [...Array(leadBlanks).fill(null), ...Array.from({ length: totalCells }, (_, i) => i + 1)]

  return (
    <button onClick={() => onSelect(month)} className="text-left">
      <p
        className="mb-1 text-[13px] font-bold"
        style={{ color: isCurrentMonth ? 'var(--color-accent)' : 'var(--text)' }}
      >
        {month + 1}월
      </p>
      <div className="grid grid-cols-7 gap-y-[1px]">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />
          const dateKey = dateKeyFor(year, month, day)
          const isToday = dateKey === today
          return (
            <div key={day} className="flex h-[15px] w-[15px] items-center justify-center">
              <span
                className="flex h-[13px] w-[13px] items-center justify-center rounded-full text-[7px] leading-none"
                style={{
                  color: isToday ? '#fff' : 'var(--text-2)',
                  background: isToday ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </button>
  )
}

import { lastNDays, formatMonthDay } from '../utils/date'
import { CONDITION_SCALE } from '../utils/constants'

export default function ConditionChart({ conditionLogs, fieldId, endKey }) {
  const days = lastNDays(30, endKey)
  const byDate = new Map(conditionLogs.map((c) => [c.date, c[fieldId]]))
  const dated = days.map((d) => ({ d, v: byDate.get(d) })).filter((p) => typeof p.v === 'number')

  if (dated.length < 2) {
    return (
      <div
        className="flex h-20 items-center justify-center rounded-2xl"
        style={{ background: 'var(--surface-soft)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-4)' }}>
          2회 이상 기록하면 추이가 표시됩니다.
        </p>
      </div>
    )
  }

  const width = 320
  const height = 72
  const padding = 8
  const min = 1
  const max = 5
  const range = max - min

  const coords = dated.map((p, i) => {
    const x = padding + (i / (dated.length - 1)) * (width - padding * 2)
    const y = height - padding - ((p.v - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const lastValue = dated[dated.length - 1].v
  const lastEmoji = CONDITION_SCALE.find((s) => s.value === lastValue)?.emoji ?? ''

  return (
    <div className="rounded-2xl p-3" style={{ background: 'var(--surface-soft)' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="#FF7A45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill="#FF7A45" />
      </svg>
      <div className="mt-1 flex items-center justify-between text-[10px]" style={{ color: 'var(--text-4)' }}>
        <span>{formatMonthDay(dated[0].d)}</span>
        <span>
          최근 {lastEmoji}
        </span>
        <span>{formatMonthDay(dated[dated.length - 1].d)}</span>
      </div>
    </div>
  )
}

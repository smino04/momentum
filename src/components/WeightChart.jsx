import { lastNDays, formatMonthDay } from '../utils/date'

export default function WeightChart({ weightLogs, endKey }) {
  const days = lastNDays(30, endKey)
  const byDate = new Map(weightLogs.map((w) => [w.date, w.weight]))
  const points = days.map((d) => byDate.get(d)).filter((v) => typeof v === 'number')

  if (points.length < 2) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[20px] bg-white/[0.03]">
        <p className="text-sm text-white/30">체중을 2회 이상 기록하면 그래프가 표시됩니다.</p>
      </div>
    )
  }

  const width = 320
  const height = 120
  const padding = 8
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const dated = days
    .map((d, i) => ({ d, w: byDate.get(d) }))
    .filter((p) => typeof p.w === 'number')

  const coords = dated.map((p, i) => {
    const x = padding + (i / (dated.length - 1)) * (width - padding * 2)
    const y = height - padding - ((p.w - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <div className="rounded-[20px] bg-white/[0.03] p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill="#3B82F6" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-white/30">
        <span>{formatMonthDay(dated[0].d)}</span>
        <span>{formatMonthDay(dated[dated.length - 1].d)}</span>
      </div>
    </div>
  )
}

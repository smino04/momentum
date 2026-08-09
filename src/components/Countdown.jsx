import { formatShortDate } from '../utils/date'

export default function Countdown({ leaveDate, dday }) {
  if (!leaveDate || !dday) {
    return (
      <div className="pt-2">
        <p className="text-xs font-medium tracking-widest text-white/40">NEXT LEAVE</p>
        <p className="mt-2 text-4xl font-bold text-white">휴가를 설정하세요</p>
      </div>
    )
  }

  if (dday.expired) {
    return (
      <div className="pt-2">
        <p className="text-xs font-medium tracking-widest text-white/40">NEXT LEAVE</p>
        <p className="mt-2 text-3xl font-bold text-white">휴가 날짜를 업데이트하세요</p>
      </div>
    )
  }

  const totalSpan = 60
  const progress = Math.min(100, Math.max(0, ((totalSpan - dday.diff) / totalSpan) * 100))

  return (
    <div className="pt-2">
      <p className="text-xs font-medium tracking-widest text-white/40">NEXT LEAVE</p>
      <p className="mt-2 text-[64px] font-bold leading-none tracking-tight text-white">
        {dday.isToday ? 'D-DAY' : `D-${dday.diff}`}
      </p>
      <p className="mt-2 text-sm text-white/50">{formatShortDate(leaveDate)}</p>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default function MomentumCard({ momentum, delta }) {
  const trendLabel = delta > 0 ? '상승 중' : delta < 0 ? '하락 중' : '유지 중'
  const deltaLabel =
    delta === null || delta === undefined
      ? null
      : `${delta > 0 ? '+' : ''}${delta}% this month`

  return (
    <div className="rounded-[20px] bg-white/[0.04] p-5">
      <p className="text-xs font-medium tracking-widest text-white/40">MOMENTUM</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-5xl font-bold leading-none text-white">{momentum}</p>
        <div className="pb-1 text-right">
          {deltaLabel && <p className="text-sm font-medium text-accent">{deltaLabel}</p>}
          <p className="text-xs text-white/40">{trendLabel}</p>
        </div>
      </div>
    </div>
  )
}

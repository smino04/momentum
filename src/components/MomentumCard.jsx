export default function MomentumCard({ momentum, delta }) {
  const trendEmoji = delta > 0 ? '🔥' : delta < 0 ? '🌧️' : '🌱'
  const trendLabel = delta > 0 ? '상승 중' : delta < 0 ? '하락 중' : '유지 중'
  const deltaLabel =
    delta === null || delta === undefined ? null : `이번 달 ${delta > 0 ? '+' : ''}${delta}%`

  return (
    <div className="rounded-[20px] p-5" style={{ background: 'var(--surface)' }}>
      <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        모멘텀
      </p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-5xl font-bold leading-none tabular-nums" style={{ color: 'var(--text)' }}>
          {momentum} <span className="text-3xl align-middle">{trendEmoji}</span>
        </p>
        <div className="pb-1 text-right">
          {deltaLabel && <p className="text-sm font-medium text-accent">{deltaLabel}</p>}
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            {trendLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

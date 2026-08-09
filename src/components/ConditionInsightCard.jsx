import { josa } from '../utils/korean'

export default function ConditionInsightCard({ field, insight }) {
  if (!insight) return null

  const habitNames = insight.groupHabits.map((h) => h.label).join(', ')
  const gwaWa = josa(habitNames, '과', '와')
  const eulReul = josa(habitNames, '을', '를')

  if (!insight.ready) {
    return (
      <div className="rounded-2xl border border-dashed p-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          {field.emoji} {habitNames}{gwaWa} {field.label}의 연관성을 보려면 컨디션을 조금 더 기록해보세요.
        </p>
        <p className="mt-1 text-[11px]" style={{ color: 'var(--text-4)' }}>
          지켰을 때 {insight.goodCount}회 · 안 지켰을 때 {insight.badCount}회 기록됨 (최소 {insight.needed}회씩 필요)
        </p>
      </div>
    )
  }

  const { diffPct, goodAvg, badAvg } = insight
  const positive = diffPct >= 0

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
      <p className="text-sm" style={{ color: 'var(--text)' }}>
        {field.emoji} <span className="font-semibold">{habitNames}</span>{eulReul} 지킨 날,{' '}
        {field.label}이 평균{' '}
        <span className="font-bold text-accent">
          {positive ? '+' : ''}
          {diffPct}%
        </span>{' '}
        {positive ? '더 좋았어요' : '더 낮았어요'}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="mb-1 text-[10px]" style={{ color: 'var(--text-4)' }}>
            지킨 날 ({insight.goodCount}회)
          </p>
          <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${(goodAvg / 5) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="mb-1 text-[10px]" style={{ color: 'var(--text-4)' }}>
            안 지킨 날 ({insight.badCount}회)
          </p>
          <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{ width: `${(badAvg / 5) * 100}%`, background: 'var(--text-4)' }} />
          </div>
        </div>
      </div>

      <p className="mt-2 text-[10px]" style={{ color: 'var(--text-4)' }}>
        참고용 데이터예요 · 인과관계를 보장하진 않아요
      </p>
    </div>
  )
}

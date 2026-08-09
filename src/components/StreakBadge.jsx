export default function StreakBadge({ streak, todayDone }) {
  const atRisk = streak > 0 && !todayDone

  return (
    <div
      className="flex items-center justify-between rounded-2xl border px-4 py-3"
      style={{
        borderColor: atRisk ? 'var(--color-accent)' : 'var(--border)',
        background: atRisk
          ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
          : 'var(--surface-soft)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className={`text-xl ${streak > 0 ? '' : 'grayscale opacity-40'}`}>🔥</span>
        <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          {streak}일 연속
        </span>
      </div>
      {atRisk ? (
        <span className="text-xs font-medium text-accent">오늘 안 하면 끊겨요</span>
      ) : streak > 0 ? (
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          오늘도 지켰어요
        </span>
      ) : (
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          오늘부터 시작해보세요
        </span>
      )}
    </div>
  )
}

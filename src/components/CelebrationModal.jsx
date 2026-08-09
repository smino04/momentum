export default function CelebrationModal({ open, onClose, kind, streak, milestoneMessage }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-8"
      onClick={onClose}
    >
      <div
        className="animate-fade-in w-full max-w-xs rounded-[24px] p-8 text-center"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {kind === 'loss' ? (
          <>
            <p className="text-4xl">💤</p>
            <p className="mt-4 text-lg font-bold" style={{ color: 'var(--text)' }}>
              스트릭이 끊겼습니다.
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-2)' }}>
              다시 시작하세요.
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-3)' }}>
              지금까지의 기록이 사라진 것은 아닙니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl animate-check">🔥</p>
            <p className="mt-3 text-xs font-semibold tracking-widest text-accent">DAY COMPLETE</p>
            <p className="mt-2 text-4xl font-bold" style={{ color: 'var(--text)' }}>
              {streak}일 연속
            </p>
            {milestoneMessage && (
              <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                {milestoneMessage}
              </p>
            )}
          </>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white"
        >
          확인
        </button>
      </div>
    </div>
  )
}

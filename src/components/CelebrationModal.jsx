import { useEffect } from 'react'
import { useBackClose } from '../utils/useBackClose'
import { hapticMilestone, hapticSuccess } from '../utils/haptics'
import { playCelebrationSound } from '../utils/sound'

const CONFETTI_COLORS = ['#ff7a45', '#ffb347', '#ffd23f', '#4ecdc4', '#f7f4f1']
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * 360 + (i % 2 === 0 ? 8 : -8)
  const radius = 90 + (i % 5) * 22
  const rad = (angle * Math.PI) / 180
  return {
    id: i,
    tx: Math.cos(rad) * radius,
    ty: Math.sin(rad) * radius - 40,
    rotate: (i * 47) % 360,
    delay: (i % 6) * 18,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }
})

export default function CelebrationModal({ open, onClose, kind, streak, milestoneMessage }) {
  useBackClose(open, onClose)

  useEffect(() => {
    if (!open) return
    if (kind === 'loss') {
      hapticSuccess()
    } else {
      hapticMilestone()
      playCelebrationSound()
    }
  }, [open, kind])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-8"
      onClick={onClose}
    >
      <div
        className="animate-fade-in relative w-full max-w-xs rounded-[24px] p-8 text-center"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {kind !== 'loss' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[24px]">
            {CONFETTI_PIECES.map((p) => (
              <span
                key={p.id}
                className="confetti-piece"
                style={{
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  '--rot': `${p.rotate}deg`,
                  animationDelay: `${p.delay}ms`,
                  background: p.color,
                }}
              />
            ))}
          </div>
        )}
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
            <p className="mt-2 text-4xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
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

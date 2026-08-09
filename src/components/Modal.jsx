import { useBackClose } from '../utils/useBackClose'

export default function Modal({ open, onClose, children, title }) {
  useBackClose(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-fade-in w-full max-w-md rounded-t-[24px] p-6 pb-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)', background: 'var(--bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ background: 'var(--border)' }} />
        {title && (
          <p className="mb-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

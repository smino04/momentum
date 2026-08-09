export default function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-fade-in w-full max-w-md rounded-t-[24px] bg-[#111114] p-6 pb-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />
        {title && <p className="mb-4 text-lg font-semibold text-white">{title}</p>}
        {children}
      </div>
    </div>
  )
}

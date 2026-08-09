export default function PageHeader({ title, onClick }) {
  if (onClick) {
    return (
      <button onClick={onClick} className="text-left active:opacity-60">
        <h1 className="text-[32px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
      </button>
    )
  }

  return (
    <h1 className="text-[32px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
      {title}
    </h1>
  )
}

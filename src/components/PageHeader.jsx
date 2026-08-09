export default function PageHeader({ title }) {
  return (
    <h1 className="text-[32px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
      {title}
    </h1>
  )
}

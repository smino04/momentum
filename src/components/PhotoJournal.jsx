import { useRef, useState } from 'react'
import { Camera, Plus } from 'lucide-react'
import { todayKey } from '../utils/date'
import { compressImageFile } from '../utils/image'
import { showToast } from '../utils/toast'

const ANGLES = [
  { id: 'face', label: '얼굴' },
  { id: 'body', label: '전신' },
]

function weekLabel(index) {
  return `${index + 1}주차`
}

export default function PhotoJournal({ photos, onAdd }) {
  const fileInputRef = useRef(null)
  const pendingAngle = useRef('face')
  const [processing, setProcessing] = useState(false)

  const weeks = groupByWeek(photos)

  function pickFile(angle) {
    pendingAngle.current = angle
    fileInputRef.current?.click()
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setProcessing(true)
    try {
      const dataUrl = await compressImageFile(file)
      onAdd({
        id: Date.now().toString(),
        angle: pendingAngle.current,
        date: todayKey(),
        dataUrl,
      })
    } catch {
      showToast('사진을 불러오지 못했어요')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        📸 사진 기록
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-4)' }}>
        주 1회 기록을 권장합니다.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {ANGLES.map((a) => (
          <button
            key={a.id}
            onClick={() => pickFile(a.id)}
            disabled={processing}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed py-5 disabled:opacity-40"
            style={{ borderColor: 'var(--border)' }}
          >
            <Camera size={18} style={{ color: 'var(--text-3)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-2)' }}>
              {processing ? '처리 중...' : a.label}
            </span>
          </button>
        ))}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {weeks.length > 0 && (
        <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {weeks.map((week, i) => (
            <div key={i} className="flex-shrink-0">
              <p className="mb-2 text-[10px] tracking-widest" style={{ color: 'var(--text-4)' }}>
                {weekLabel(i)}
              </p>
              <div className="flex gap-1.5">
                {week.map((p) => (
                  <img
                    key={p.id}
                    src={p.dataUrl}
                    alt={p.angle}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {weeks.length === 0 && (
        <div className="mt-4 flex items-center gap-2" style={{ color: 'var(--text-4)' }}>
          <Plus size={14} />
          <span className="text-xs">사진을 추가하면 주차별로 비교할 수 있어요.</span>
        </div>
      )}
    </div>
  )
}

function groupByWeek(photos) {
  if (!photos || photos.length === 0) return []
  const sorted = [...photos].sort((a, b) => a.date.localeCompare(b.date))
  const first = new Date(sorted[0].date)
  const buckets = new Map()
  for (const p of sorted) {
    const d = new Date(p.date)
    const weekIndex = Math.floor((d - first) / (7 * 24 * 60 * 60 * 1000))
    if (!buckets.has(weekIndex)) buckets.set(weekIndex, [])
    buckets.get(weekIndex).push(p)
  }
  return [...buckets.keys()].sort((a, b) => a - b).map((k) => buckets.get(k))
}

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import WeightChart from '../components/WeightChart'
import PhotoJournal from '../components/PhotoJournal'
import Modal from '../components/Modal'
import { todayKey, addDays } from '../utils/date'
import { calcMomentum, activeDaysCount } from '../utils/momentum'

export default function Progress({ data, update }) {
  const today = todayKey()
  const [weightModalOpen, setWeightModalOpen] = useState(false)
  const [weightInput, setWeightInput] = useState('')

  const momentum = useMemo(() => calcMomentum(data.dailyLogs, data.habits, today), [data.dailyLogs, data.habits])
  const activeDays = useMemo(() => activeDaysCount(data.dailyLogs, data.habits, today), [data.dailyLogs, data.habits])
  const completionRate = Math.round(momentum)

  const sortedWeights = [...data.weightLogs].sort((a, b) => a.date.localeCompare(b.date))
  const currentWeight = sortedWeights[sortedWeights.length - 1]?.weight
  const monthAgoWeights = sortedWeights.filter((w) => w.date <= addDays(today, -25))
  const baseline = monthAgoWeights[monthAgoWeights.length - 1]?.weight ?? sortedWeights[0]?.weight
  const weightChange =
    typeof currentWeight === 'number' && typeof baseline === 'number'
      ? Math.round((currentWeight - baseline) * 10) / 10
      : null

  function saveWeight() {
    const value = parseFloat(weightInput)
    if (Number.isNaN(value)) return
    update((prev) => {
      const others = prev.weightLogs.filter((w) => w.date !== today)
      return { ...prev, weightLogs: [...others, { date: today, weight: value }] }
    })
    setWeightInput('')
    setWeightModalOpen(false)
  }

  function addPhoto(photo) {
    update((prev) => ({ ...prev, photos: [...prev.photos, photo] }))
  }

  return (
    <div className="px-6 pb-28 pt-8">
      <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
        📈 내 변화
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatBlock emoji="🔥" label="모멘텀" value={momentum} />
        <StatBlock emoji="📅" label="관리일" value={`${activeDays}일`} />
        <StatBlock emoji="✅" label="완료율" value={`${completionRate}%`} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-widest" style={{ color: 'var(--text-3)' }}>
            💪 체중
          </p>
          <button
            onClick={() => setWeightModalOpen(true)}
            className="flex items-center gap-1 text-xs text-accent"
          >
            <Plus size={14} /> 체중 기록
          </button>
        </div>

        <div className="mt-3 flex items-end gap-3">
          <p className="text-4xl font-bold" style={{ color: 'var(--text)' }}>
            {typeof currentWeight === 'number' ? `${currentWeight} kg` : '—'}
          </p>
          {weightChange !== null && (
            <p
              className="pb-1 text-sm font-medium"
              style={{ color: weightChange <= 0 ? 'var(--color-accent)' : 'var(--text-2)' }}
            >
              {weightChange > 0 ? '+' : ''}
              {weightChange} kg
            </p>
          )}
        </div>

        <div className="mt-4">
          <WeightChart weightLogs={data.weightLogs} endKey={today} />
        </div>
      </div>

      <div className="mt-10">
        <PhotoJournal photos={data.photos} onAdd={addPhoto} />
      </div>

      <Modal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} title="오늘 체중">
        <div className="flex items-end gap-2">
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            placeholder="77.2"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="input-field py-4 text-3xl font-bold"
          />
          <span className="pb-4 text-lg" style={{ color: 'var(--text-3)' }}>
            kg
          </span>
        </div>
        <button
          onClick={saveWeight}
          className="mt-5 w-full rounded-2xl bg-accent py-4 font-semibold text-white"
        >
          저장
        </button>
      </Modal>
    </div>
  )
}

function StatBlock({ emoji, label, value }) {
  return (
    <div className="rounded-[18px] px-3 py-4 text-center" style={{ background: 'var(--surface)' }}>
      <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
        {value}
      </p>
      <p className="mt-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
        {emoji} {label}
      </p>
    </div>
  )
}

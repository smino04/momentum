import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import { useAppData } from './utils/useAppData'

export default function App() {
  const { data, update, reset } = useAppData()
  const [tab, setTab] = useState('home')

  if (!data.onboarded) {
    return (
      <Onboarding
        onComplete={({ leaveDate, habits, profile, weightLogs }) => {
          update((prev) => ({
            ...prev,
            onboarded: true,
            leaveDate,
            habits,
            profile: { ...prev.profile, ...profile },
            weightLogs,
          }))
        }}
      />
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md">
      {tab === 'home' && <Home data={data} update={update} />}
      {tab === 'progress' && <Progress data={data} update={update} />}
      {tab === 'profile' && <Profile data={data} update={update} onReset={reset} />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

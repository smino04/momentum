import { useEffect, useState, useCallback } from 'react'
import { loadData, saveData, resetData } from './storage'

export function useAppData() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const update = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    resetData()
    setData(loadData())
  }, [])

  return { data, update, reset }
}

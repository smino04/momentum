import { useEffect, useState, useCallback } from 'react'
import { loadData, saveData, resetData } from './storage'
import { showToast } from './toast'

export function useAppData() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    if (!saveData(data)) {
      showToast('저장 공간이 부족해요. 사진을 정리해보세요.')
    }
  }, [data])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme === 'light' ? 'light' : 'dark')
  }, [data.theme])

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

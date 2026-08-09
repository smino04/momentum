import { useEffect, useRef } from 'react'

// Shared across all useBackClose instances so a single back-button press
// only closes the topmost open modal/subview, not every open one at once.
const stack = []
let pendingProgrammaticBacks = 0
let listenerInstalled = false

function ensureListener() {
  if (listenerInstalled) return
  listenerInstalled = true
  window.addEventListener('popstate', () => {
    if (pendingProgrammaticBacks > 0) {
      pendingProgrammaticBacks -= 1
      return
    }
    const onClose = stack.pop()
    if (onClose) onClose()
  })
}

export function useBackClose(isOpen, onClose) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const pushedHandlerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    ensureListener()
    const handler = () => onCloseRef.current()
    stack.push(handler)
    pushedHandlerRef.current = handler
    window.history.pushState({ __modal: true }, '')

    return () => {
      const handlerToRemove = pushedHandlerRef.current
      pushedHandlerRef.current = null
      if (!handlerToRemove) return
      const idx = stack.lastIndexOf(handlerToRemove)
      if (idx === -1) return
      stack.splice(idx, 1)
      pendingProgrammaticBacks += 1
      window.history.back()
    }
  }, [isOpen])
}

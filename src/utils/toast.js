const listeners = new Set()

export function showToast(message) {
  listeners.forEach((fn) => fn(message))
}

export function subscribeToast(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

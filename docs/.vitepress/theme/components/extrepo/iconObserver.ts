import { ICON_ROOT_MARGIN } from './constants'

const callbacks = new Map<Element, () => void>()
let observer: IntersectionObserver | undefined

function ensureObserver(): IntersectionObserver | undefined {
  if (
    observer || typeof window === 'undefined' ||
    !('IntersectionObserver' in window)
  ) return observer
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const cb = callbacks.get(entry.target)
      if (cb) {
        callbacks.delete(entry.target)
        observer?.unobserve(entry.target)
        cb()
      }
    }
  }, { rootMargin: ICON_ROOT_MARGIN })
  return observer
}

// Shared observer for all lazy icons; calls cb once when visible.
export function observeIcon(el: Element, cb: () => void): () => void {
  const io = ensureObserver()
  if (!io) {
    cb()
    return () => {}
  }
  callbacks.set(el, cb)
  io.observe(el)
  return () => {
    callbacks.delete(el)
    io.unobserve(el)
  }
}

// Remembers load results per src so repeated icons skip the queue.
export const iconResultCache = new Map<string, boolean>()

import { MAX_CONCURRENT_DESKTOP, MAX_CONCURRENT_MOBILE } from './constants'

let limit = MAX_CONCURRENT_DESKTOP
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(max-width: 767px)')
  const sync = () => {
    limit = mq.matches ? MAX_CONCURRENT_MOBILE : MAX_CONCURRENT_DESKTOP
  }
  sync()
  mq.addEventListener('change', sync)
}

let active = 0
const queue: (() => Promise<void>)[] = []

function pump() {
  while (active < limit && queue.length) {
    const job = queue.shift()!
    active++
    job().finally(() => {
      active--
      pump()
    })
  }
}

// Returns a cancel fn that drops the job if it hasn't started yet.
export function scheduleIconLoad(load: () => Promise<void>): () => void {
  let cancelled = false
  queue.push(() => cancelled ? Promise.resolve() : load())
  pump()
  return () => {
    cancelled = true
  }
}

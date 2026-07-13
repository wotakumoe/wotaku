const MAX_CONCURRENT_MOBILE = 6
const MAX_CONCURRENT_DESKTOP = 24

function maxConcurrent(): number {
  if (typeof window === 'undefined') return MAX_CONCURRENT_DESKTOP
  return window.matchMedia('(max-width: 767px)').matches ? MAX_CONCURRENT_MOBILE : MAX_CONCURRENT_DESKTOP
}

let active = 0
const queue: (() => Promise<void>)[] = []

function pump() {
  while (active < maxConcurrent() && queue.length) {
    const job = queue.shift()!
    active++
    job().finally(() => {
      active--
      pump()
    })
  }
}

export function scheduleIconLoad(load: () => Promise<void>) {
  queue.push(load)
  pump()
}

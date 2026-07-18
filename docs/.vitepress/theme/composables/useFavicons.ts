import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { FaviconsStorageKey } from '../constants'

export function useFavicons() {
  const favicons = useStorage(FaviconsStorageKey, 'off')
  const faviconsEnabled = computed(() => favicons.value === 'on')

  return { favicons, faviconsEnabled }
}

const FAVICON_BASE_URL = 'https://wfav.pages.dev/'
let faviconManifestPromise: Promise<Record<string, string>> | null = null
let faviconObserver: IntersectionObserver | null = null

function getFaviconManifest() {
  if (!faviconManifestPromise) {
    faviconManifestPromise = fetch(`${FAVICON_BASE_URL}manifest.json`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
      .then((data) => (data.icons ?? {}) as Record<string, string>)
      .catch(() => ({}) as Record<string, string>)
  }
  return faviconManifestPromise
}

function showGlobeFallback(el: HTMLElement) {
  const span = document.createElement('span')
  span.className = 'wk-favicon wk-favicon-fallback i-lucide:globe'
  span.setAttribute('aria-hidden', 'true')
  el.replaceWith(span)
}

async function loadFavicon(img: HTMLImageElement, domain: string) {
  const icons = await getFaviconManifest()
  const path = icons[domain]
  if (!path) {
    showGlobeFallback(img)
    return
  }
  img.onerror = () => showGlobeFallback(img)
  img.src = `${FAVICON_BASE_URL}${path}`
}

function ensureFaviconObserver() {
  if (faviconObserver) return faviconObserver
  faviconObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const img = entry.target as HTMLImageElement
      const domain = img.dataset.domain
      if (domain) loadFavicon(img, domain)
      observer.unobserve(img)
    }
  }, { rootMargin: '200px' })
  return faviconObserver
}

// Only plain `[text](url)` prose links
export function applyFavicons(root: ParentNode) {
  const origin = window.location.origin
  const observer = ensureFaviconObserver()

  root
    .querySelectorAll<HTMLAnchorElement>('.vp-doc a[href]:not([data-favicon-applied])')
    .forEach((link) => {
      const href = link.getAttribute('href') ?? ''
      if (!/^https?:\/\//i.test(href) || href.startsWith(origin)) return
      if (link.querySelector('.highlight-pill, .icon-tip, img, svg')) return
      if (!link.textContent?.trim()) return

      let hostname: string
      try {
        hostname = new URL(href).hostname
      } catch {
        return
      }

      link.dataset.faviconApplied = '1'
      const img = document.createElement('img')
      img.className = 'wk-favicon'
      img.alt = ''
      img.width = 14
      img.height = 14
      img.decoding = 'async'
      img.dataset.domain = hostname
      link.prepend(img)
      observer.observe(img)
    })
}

export function removeFavicons() {
  faviconObserver?.disconnect()
  faviconObserver = null
  document.querySelectorAll('.wk-favicon').forEach((el) => el.remove())
  document
    .querySelectorAll<HTMLElement>('.vp-doc a[data-favicon-applied]')
    .forEach((link) => { delete link.dataset.faviconApplied })
}

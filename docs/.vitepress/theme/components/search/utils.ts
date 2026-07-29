import type { SearchResult } from 'minisearch'
import type { SearchSortMode } from '../../searchState'
import type { Result, UrlResult } from './types'

// @ts-ignore
import { escapeRegExp } from 'vitepress/dist/client/shared'

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function highlightUrl(url: string, query: string) {
  const needle = query.trim()
  if (!needle) return escapeHtml(url)

  const lowerUrl = url.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  let out = ''
  let cursor = 0
  let index = lowerUrl.indexOf(lowerNeedle)

  while (index !== -1) {
    out += escapeHtml(url.slice(cursor, index))
    out += `<mark class="url-highlight">${
      escapeHtml(url.slice(index, index + needle.length))
    }</mark>`
    cursor = index + needle.length
    index = lowerUrl.indexOf(lowerNeedle, cursor)
  }

  return out + escapeHtml(url.slice(cursor))
}

export function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map((term) => `(${escapeRegExp(term)})`)
      .join('|'),
    'gi'
  )
}

export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export function toHistoryPathHtml(html: string): string {
  const stripped = decodeHtml(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
  if (stripped) return escapeHtml(stripped)
  return html.trim()
}

export function hasExcerptPreview(html?: string) {
  if (!html) return false
  for (let i = 0; i < html.length; i++) {
    const ch = html[i]
    if (ch === '<') {
      const close = html.indexOf('>', i + 1)
      if (close === -1) return false
      i = close
      continue
    }
    if (ch === '&') {
      const entity = html.slice(i, i + 6).toLowerCase()
      if (entity === '&nbsp;' || entity === '&#160;') {
        i += 5
        continue
      }
      return true
    }
    if (!/\s/.test(ch)) return true
  }
  return false
}

export function getPageKey(id: string) {
  return getDocId(id).replace(/\/$/, '')
}

export function getDocId(id: string) {
  const hashIndex = id.indexOf('#')
  return hashIndex === -1 ? id : id.slice(0, hashIndex)
}

export function getDocAnchor(id: string) {
  const hashIndex = id.indexOf('#')
  return hashIndex === -1 ? '' : id.slice(hashIndex + 1)
}

export function getPageLabel(key: string, pageMeta: Map<string, { label: string; order: number }>) {
  return pageMeta.get(key)?.label ?? key.replace(/^\//, '')
}

export function getPageOrder(key: string, pageMeta: Map<string, { label: string; order: number }>) {
  return pageMeta.get(key)?.order ?? Number.MAX_SAFE_INTEGER
}

export function buildResultHref(pageId: string, tabs?: string[], anchor = '') {
  const params: string[] = []
  if (tabs?.length) {
    params.push(`t=${tabs.map((tab) => encodeURIComponent(tab)).join(',')}`)
  }

  let hash = ''
  if (anchor.startsWith('collapsible-')) {
    const collapsible = anchor.slice('collapsible-'.length)
    if (collapsible) params.push(`c=${encodeURIComponent(collapsible)}`)
  } else {
    const lastTab = tabs?.length ? tabs[tabs.length - 1] : ''
    const isRedundantTabHeading = Boolean(anchor) && anchor === `tab-${lastTab}`
    if (anchor && !isRedundantTabHeading) {
      hash = `#${encodeURIComponent(anchor)}`
    }
  }

  const query = params.length ? `?${params.join('&')}` : ''
  return `${pageId}${query}${hash}`
}

export function getSearchResultHref(item: SearchResult & Result) {
  const id = String(item.id)
  const hashIndex = id.indexOf('#')
  if (hashIndex < 0) return buildResultHref(id, item.tabs)

  return buildResultHref(
    id.slice(0, hashIndex),
    item.tabs,
    id.slice(hashIndex + 1)
  )
}

export function cycleSearchMode(searchMode: { value: SearchSortMode }) {
  const modes = ['exact', 'fuzzy', 'url'] as const
  const idx = modes.indexOf(searchMode.value as 'exact' | 'fuzzy' | 'url')
  searchMode.value = modes[(idx + 1) % modes.length] as SearchSortMode
}

export function stripNonCloneable(value: unknown): unknown {
  if (typeof value === 'function' || typeof value === 'symbol') return undefined
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) {
    return value
      .map((item) => stripNonCloneable(item))
      .filter((item) => item !== undefined)
  }

  const out: Record<string, unknown> = {}
  for (const [key, nestedValue] of Object.entries(value)) {
    const cloneable = stripNonCloneable(nestedValue)
    if (cloneable !== undefined) out[key] = cloneable
  }
  return out
}

export function getPageOrderEntries(pageMeta: Map<string, { label: string; order: number }>): [string, number][] {
  return [...pageMeta.entries()].map(([key, meta]) => [key, meta.order])
}

export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

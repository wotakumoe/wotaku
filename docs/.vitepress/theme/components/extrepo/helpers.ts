import {
  LANG_FLAG_FALLBACK,
  LANG_FLAG_ICONS
} from '../../../configs/markdown/langFlags'
import type { Rating } from './types'

const flagCache = new Map<string, string>()
const labelCache = new Map<string, string>()
const stripCache = new Map<string, string>()
const contentTypeCache = new Map<string, string>()

const langDisplayNames = new Intl.DisplayNames(['en'], { type: 'language' })

export function langFlagClass(lang: string = 'all'): string {
  const key = lang.toLowerCase()
  let hit = flagCache.get(key)
  if (hit === undefined) {
    hit = `i-twemoji-${
      LANG_FLAG_ICONS[key] ?? LANG_FLAG_ICONS[key.split('-')[0]] ??
        LANG_FLAG_FALLBACK
    }`
    flagCache.set(key, hit)
  }
  return hit
}

export function langLabel(lang: string = 'all'): string {
  const key = lang.toLowerCase()
  let hit = labelCache.get(key)
  if (hit === undefined) {
    if (key === 'all') hit = 'Multi-language'
    else {
      try {
        hit = langDisplayNames.of(lang) ?? lang
      } catch {
        hit = lang
      }
    }
    labelCache.set(key, hit)
  }
  return hit
}

export function stripHtml(html: string): string {
  let hit = stripCache.get(html)
  if (hit === undefined) {
    hit = html.replace(/<[^>]*>/g, '').trim()
    if (stripCache.size > 2000) stripCache.clear()
    stripCache.set(html, hit)
  }
  return hit
}

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, c => ESCAPE_MAP[c])
}

export function ratingIcon(rating: Rating): string {
  return rating === 'nsfw'
    ? 'i-twemoji-no-one-under-eighteen'
    : 'i-twemoji-warning'
}

export function ratingTitle(rating: Rating): string {
  return rating === 'nsfw' ? 'NSFW' : 'Mature'
}

export function contentTypeLabel(type: string): string {
  let hit = contentTypeCache.get(type)
  if (hit === undefined) {
    hit = type.toLowerCase().split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    contentTypeCache.set(type, hit)
  }
  return hit
}

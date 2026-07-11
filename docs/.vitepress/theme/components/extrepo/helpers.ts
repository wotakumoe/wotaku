import { LANG_FLAG_FALLBACK, LANG_FLAG_ICONS } from '../../../configs/markdown/langFlags'
import type { Rating } from './types'

export function langFlagClass(lang: string): string {
  const key = lang.toLowerCase()
  const icon = LANG_FLAG_ICONS[key] ?? LANG_FLAG_ICONS[key.split('-')[0]] ?? LANG_FLAG_FALLBACK
  return `i-twemoji-${icon}`
}

const langDisplayNames = new Intl.DisplayNames(['en'], { type: 'language' })

export function langLabel(lang: string): string {
  if (lang.toLowerCase() === 'all') return 'Multi-language'
  try {
    return langDisplayNames.of(lang) ?? lang
  } catch {
    return lang
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export function ratingIcon(rating: Rating): string {
  return rating === 'nsfw' ? 'i-twemoji-no-one-under-eighteen' : 'i-twemoji-warning'
}

export function ratingTitle(rating: Rating): string {
  return rating === 'nsfw' ? 'NSFW' : 'Mature'
}

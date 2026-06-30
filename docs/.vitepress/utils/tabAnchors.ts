const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[\u0300-\u036F]/g

export interface ParsedTabLabel {
  anchor?: string
  label: string
}

export function stripHeadingMarkup(value: string) {
  return value
    .replace(/\{[^}]*\}\s*$/, '')
    .replace(/<[^>]*>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]/g, '')
    .trim()
}

export function slugifyAnchor(value: string) {
  return stripHeadingMarkup(value)
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

export function parseTabLabel(value: string): ParsedTabLabel {
  const trimmed = value.trim()
  const match = trimmed.match(/\s+\{#([^}\s]+)\}\s*$/)
  if (!match) return { label: trimmed }

  return {
    anchor: match[1],
    label: trimmed.slice(0, match.index).trim()
  }
}

export function getUniqueAnchor(base: string, counts: Map<string, number>) {
  const fallback = 'tab'
  const slug = slugifyAnchor(base) || fallback
  const count = counts.get(slug) ?? 0
  counts.set(slug, count + 1)
  return count === 0 ? slug : `${slug}-${count}`
}

export function getTabAnchor(
  rawLabel: string,
  counts: Map<string, number>
) {
  const parsed = parseTabLabel(rawLabel)
  return parsed.anchor || getUniqueAnchor(parsed.label, counts)
}

export function getTabHeadingAnchor(tabAnchor: string) {
  return `tab-${tabAnchor}`
}

export function getCollapsibleHeadingAnchor(collapsibleAnchor: string) {
  return `collapsible-${collapsibleAnchor}`
}

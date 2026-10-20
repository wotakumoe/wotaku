import { computed, ref } from 'vue'

import { homeCards } from '../configs/constants'

export interface RandomPageRow {
  key: string
  pageId: string
  title: string
  icon: string
  children: RandomPageRow[]
}

const STORAGE_KEY = 'wotaku-random-links-disabled'

const disabledPageIds = ref<string[]>([])
let loaded = false

export const disabledPages = computed(
  () => new Set(disabledPageIds.value.map(normalizePageId))
)

export function normalizePageId(pageId: string) {
  const trimmed = pageId.replace(/\/+$/, '')
  return trimmed || '/'
}

function toRow(card: (typeof homeCards)[number]): RandomPageRow {
  return {
    key: card.id,
    pageId: normalizePageId(card.link),
    title: card.title,
    icon: card.icon,
    children: []
  }
}

function buildGroups(): RandomPageRow[] {
  return homeCards
    .filter((card) => !card.section)
    .map((card) => {
      const row = toRow(card)
      row.children = homeCards
        .filter((child) => child.section === card.title)
        .map(toRow)
      return row
    })
}

export const randomPageGroups = buildGroups()

const DEFAULT_ENABLED_KEYS = new Set([
  'websites',
  'software',
  'misc',
  'tools',
  'art',
  'merch',
  'music',
  'comms',
  'vtuber',
  'games'
])

function defaultDisabledPageIds() {
  return randomPageGroups
    .filter((group) => !DEFAULT_ENABLED_KEYS.has(group.key))
    .flatMap(groupPageIds)
}

export function ensureDisabledPagesLoaded() {
  if (loaded || typeof window === 'undefined') return
  loaded = true

  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    disabledPageIds.value = defaultDisabledPageIds()
    return
  }

  if (!raw) {
    disabledPageIds.value = defaultDisabledPageIds()
    persist()
    return
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      disabledPageIds.value = defaultDisabledPageIds()
      persist()
      return
    }
    disabledPageIds.value = [
      ...new Set(
        parsed
          .filter((pageId): pageId is string => typeof pageId === 'string')
          .map(normalizePageId)
      )
    ]
  } catch {
    disabledPageIds.value = defaultDisabledPageIds()
    persist()
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(disabledPageIds.value))
  } catch {
  }
}

function setPagesDisabled(pageIds: string[], disabled: boolean) {
  const next = new Set(disabledPageIds.value)

  for (const pageId of pageIds) {
    const normalized = normalizePageId(pageId)
    if (disabled) next.add(normalized)
    else next.delete(normalized)
  }

  disabledPageIds.value = [...next]
  persist()
}

export function groupPageIds(group: RandomPageRow) {
  return [group.pageId, ...group.children.map((child) => child.pageId)]
}

export function isGroupDisabled(group: RandomPageRow) {
  return groupPageIds(group).every((pageId) => disabledPages.value.has(pageId))
}

export function toggleGroup(group: RandomPageRow) {
  ensureDisabledPagesLoaded()
  setPagesDisabled(groupPageIds(group), !isGroupDisabled(group))
}

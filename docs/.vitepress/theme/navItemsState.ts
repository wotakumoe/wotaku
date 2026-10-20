import { ref } from 'vue'

import { AnnouncementsEnabledKey } from './constants'

export type NavItemKey = 'announcements' | 'bookmarks' | 'random' | 'social'
type HideableNavItemKey = Exclude<NavItemKey, 'announcements'>

const HIDDEN_ITEMS_KEY = 'wotaku-nav-items-hidden'
const DEFAULT_HIDDEN_ITEMS: HideableNavItemKey[] = ['random']
const HIDEABLE_ITEMS = new Set<HideableNavItemKey>([
  'bookmarks',
  'random',
  'social'
])

export const announcementsEnabled = ref(true)
const hiddenItems = ref<HideableNavItemKey[]>([...DEFAULT_HIDDEN_ITEMS])
let loaded = false

function isHideableKey(value: unknown): value is HideableNavItemKey {
  return typeof value === 'string' &&
    HIDEABLE_ITEMS.has(value as HideableNavItemKey)
}

export function ensureNavItemsLoaded() {
  if (loaded || typeof window === 'undefined') return
  loaded = true

  try {
    announcementsEnabled.value =
      localStorage.getItem(AnnouncementsEnabledKey) !== 'off'

    const raw = localStorage.getItem(HIDDEN_ITEMS_KEY)
    if (!raw) {
      hiddenItems.value = [...DEFAULT_HIDDEN_ITEMS]
      persistHiddenItems()
      return
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return
    hiddenItems.value = [...new Set(parsed.filter(isHideableKey))]
  } catch {
  }
}

function persistHiddenItems() {
  try {
    localStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify(hiddenItems.value))
  } catch {
  }
}

export function isNavItemEnabled(key: NavItemKey) {
  if (key === 'announcements') return announcementsEnabled.value
  return !hiddenItems.value.includes(key)
}

export function toggleNavItem(key: NavItemKey) {
  ensureNavItemsLoaded()

  if (key === 'announcements') {
    announcementsEnabled.value = !announcementsEnabled.value
    try {
      localStorage.setItem(
        AnnouncementsEnabledKey,
        announcementsEnabled.value ? 'on' : 'off'
      )
    } catch {
    }
    return
  }

  const next = new Set(hiddenItems.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)

  hiddenItems.value = [...next]
  persistHiddenItems()
}

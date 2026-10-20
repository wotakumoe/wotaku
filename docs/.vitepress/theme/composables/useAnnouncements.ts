import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { data as announcements } from '../announcements.data'
import { AnnouncementsReadKey } from '../constants'
import { announcementsEnabled, ensureNavItemsLoaded } from '../navItemsState'

export type { Announcement, AnnouncementType } from '../announcements.data'

export function useAnnouncements() {
  ensureNavItemsLoaded()

  const enabled = computed(() => announcementsEnabled.value)

  const readIds = useStorage<string[]>(AnnouncementsReadKey, [])
  const readSet = computed(() => new Set(readIds.value))

  function isRead(id: string): boolean {
    return readSet.value.has(id)
  }

  function markRead(id: string): void {
    if (!readSet.value.has(id)) readIds.value = [...readIds.value, id]
  }

  function markAllRead(): void {
    readIds.value = announcements.map((a) => a.id)
  }

  const unreadCount = computed(
    () => announcements.filter((a) => !readSet.value.has(a.id)).length
  )
  const hasUnread = computed(() => enabled.value && unreadCount.value > 0)

  return {
    announcements,
    enabled,
    isRead,
    markRead,
    markAllRead,
    unreadCount,
    hasUnread
  }
}

import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { data as announcements } from '../announcements.data'
import { AnnouncementsEnabledKey, AnnouncementsReadKey } from '../constants'

export type { Announcement, AnnouncementType } from '../announcements.data'

export function useAnnouncements() {
  // on by default
  const enabledPref = useStorage(AnnouncementsEnabledKey, 'on')
  const enabled = computed(() => enabledPref.value !== 'off')

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
    enabledPref,
    enabled,
    isRead,
    markRead,
    markAllRead,
    unreadCount,
    hasUnread
  }
}

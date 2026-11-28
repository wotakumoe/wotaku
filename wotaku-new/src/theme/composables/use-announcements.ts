/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { data as announcements } from '../../build/data/announcements.data.ts'
import { AnnouncementsEnabledKey, AnnouncementsReadKey } from '../shared/constants'

export type {
  Announcement,
  AnnouncementType
} from '../../build/data/announcements.data.ts'

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

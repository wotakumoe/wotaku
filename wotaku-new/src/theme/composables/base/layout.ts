/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { inBrowser, onContentUpdated, useRoute } from '@/theme/shared/client'
import type * as DefaultTheme from '@/shared/types/default-theme'
import { computed, shallowReadonly, shallowRef, watch } from 'vue'
import { getSidebar, getSidebarGroups } from '../../shared/base/sidebar'
import { useData } from './data'
import { getHeaders } from './outline'
import { useCloseSidebarOnEscape } from './sidebar'

const headers = shallowRef<DefaultTheme.OutlineItem[]>([])
const sidebar = shallowRef<DefaultTheme.SidebarItem[]>([])

const is960 = shallowRef(false)

export function useLayout() {
  const { frontmatter, theme } = useData()

  const isHome = computed(() => {
    return !!(frontmatter.value.isHome ?? frontmatter.value.layout === 'home')
  })

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.sidebar !== false && sidebar.value.length > 0 && !isHome.value
    )
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)

  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : []
  })

  const hasAside = computed(() => {
    if (isHome.value) return false

    if (frontmatter.value.aside != null) return !!frontmatter.value.aside

    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (!hasAside.value) return false

    return frontmatter.value.aside == null
      ? theme.value.aside === 'left'
      : frontmatter.value.aside === 'left'
  })

  const hasLocalNav = computed(() => {
    return headers.value.length > 0
  })

  return {
    isHome,
    sidebar: shallowReadonly(sidebar),
    sidebarGroups,
    hasSidebar,
    isSidebarEnabled,
    hasAside,
    leftAside,
    headers: shallowReadonly(headers),
    hasLocalNav
  }
}

interface RegisterWatchersOptions {
  closeSidebar: () => void
}

export function registerWatchers({ closeSidebar }: RegisterWatchersOptions) {
  const { frontmatter, page, theme } = useData()

  watch(
    () => [page.value.relativePath, theme.value.sidebar] as const,
    ([relativePath, sidebarConfig]) => {
      const newSidebar = sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []

      if (JSON.stringify(newSidebar) !== JSON.stringify(sidebar.value)) {
        sidebar.value = newSidebar
      }
    },
    { immediate: true, deep: true, flush: 'sync' }
  )

  onContentUpdated(() => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
  })

  if (inBrowser) {
    is960.value = window.innerWidth >= 960
    window.addEventListener(
      'resize',
      () => {
        is960.value = window.innerWidth >= 960
      },
      { passive: true }
    )
  }

  const route = useRoute()
  watch(() => route.path, closeSidebar)

  useCloseSidebarOnEscape(closeSidebar)
}

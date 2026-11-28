/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { useMediaQuery, useMounted, useStorage } from '@vueuse/core'
import { computed } from 'vue'

export function useMobileNavigation() {
  const mobile = useMediaQuery('(max-width: 767px)')
  const mounted = useMounted()
  const style = useStorage<'island' | 'classic'>('preference-mobile-navigation', 'island')
  const presentation = useStorage<'underlay' | 'floating' | 'fullscreen'>(
    'preference-mobile-menu-presentation',
    'underlay'
  )
  const tabs = useStorage('preference-mobile-menu-tabs', false)
  const island = computed(() => mounted.value && mobile.value && style.value === 'island')
  return { mobile, mounted, style, presentation, tabs, island }
}

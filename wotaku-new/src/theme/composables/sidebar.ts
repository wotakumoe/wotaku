/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type * as DefaultTheme from '@/shared/types/default-theme'
import { useSidebarItemControl as useUpstreamSidebarItemControl } from './base/sidebar'
import type { Ref } from 'vue'
import { watch } from 'vue'

export function useSidebarItemControl(item: Ref<DefaultTheme.SidebarItem>) {
  const control = useUpstreamSidebarItemControl(item)

  watch(control.hasActiveLink, (hasActiveLink) => {
    if (!hasActiveLink && control.collapsible.value) {
      control.collapsed.value = !!item.value.collapsed
    }
  })

  return control
}

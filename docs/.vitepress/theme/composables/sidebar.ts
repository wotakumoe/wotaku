import type { DefaultTheme } from 'vitepress'
import {
  useSidebarItemControl as useUpstreamSidebarItemControl
} from 'vitepress/dist/client/theme-default/composables/sidebar'
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

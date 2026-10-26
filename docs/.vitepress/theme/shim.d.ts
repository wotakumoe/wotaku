declare module 'mark.js/dist/mark.es6.js' {
  import type Mark from 'mark.js'
  const mark: typeof Mark
  export default mark
}

declare module 'vitepress/dist/client/theme-default/composables/sidebar' {
  import type { DefaultTheme } from 'vitepress'
  import type { ComputedRef, Ref } from 'vue'

  export function useSidebarItemControl(
    item: Ref<DefaultTheme.SidebarItem>
  ): {
    collapsed: Ref<boolean>
    collapsible: ComputedRef<boolean>
    isLink: ComputedRef<boolean>
    isActiveLink: Ref<boolean>
    hasActiveLink: ComputedRef<boolean>
    hasChildren: ComputedRef<boolean>
    toggle: () => void
  }
}

declare const __GIT_COMMIT__: string
declare const __GIT_COMMIT_TS__: number

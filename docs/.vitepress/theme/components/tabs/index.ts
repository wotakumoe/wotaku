import type { App } from 'vue'
import PluginTabs from './PluginTabs.vue'
import PluginTabsTab from './PluginTabsTab.vue'
import { provideTabsSharedState } from './state'

export interface EnhanceTabsOptions {
  renderAll?: boolean
}

export function enhanceAppWithTabs(
  app: App,
  options: EnhanceTabsOptions = {}
) {
  provideTabsSharedState(app, Boolean(options.renderAll))
  app.component('PluginTabs', PluginTabs)
  app.component('PluginTabsTab', PluginTabsTab)
}

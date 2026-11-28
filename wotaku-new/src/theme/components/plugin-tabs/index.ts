/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { App } from 'vue'
import PluginTabs from './PluginTabs.vue'
import PluginTabsTab from './PluginTabsTab.vue'
import { provideTabsSharedState } from '../../shared/plugin-tabs/state'

export interface EnhanceTabsOptions {
  renderAll?: boolean
}

export function enhanceAppWithTabs(app: App, options: EnhanceTabsOptions = {}) {
  provideTabsSharedState(app, Boolean(options.renderAll))
  app.component('PluginTabs', PluginTabs)
  app.component('PluginTabsTab', PluginTabsTab)
}

/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { setupDevToolsPlugin } from '@vue/devtools-api'
import type { App } from 'vue'
import type { WotakuData } from './data'
import type { Router } from './router'

const COMPONENT_STATE_TYPE = 'Wotaku'

export const setupDevtools = (app: App, router: Router, data: WotakuData): void => {
  setupDevToolsPlugin(
    {
      // fix recursive reference
      app: app as any,
      id: 'org.vuejs.wotaku',
      label: 'Wotaku',
      packageName: '@/theme/shared/client',
      homepage: 'https://wotaku.wiki',
      componentStateTypes: [COMPONENT_STATE_TYPE]
    },
    (api) => {
      api.on.inspectComponent((payload) => {
        payload.instanceData.state.push({
          type: COMPONENT_STATE_TYPE,
          key: 'route',
          value: router.route,
          editable: false
        })

        payload.instanceData.state.push({
          type: COMPONENT_STATE_TYPE,
          key: 'data',
          value: data,
          editable: false
        })
      })
    }
  )
}

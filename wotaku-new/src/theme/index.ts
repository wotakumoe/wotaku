/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { Theme } from '@/theme/shared/client'
import DefaultTheme from '@/theme/shared/base-theme'
import './styles/style.scss'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { createMediumZoomProvider } from './composables/medium-zoom'
import 'virtual:uno.css'
import Layout from './components/layout/Layout.vue'
import './styles/tooltip-hint.css'
import './styles/table-more.css'
import './styles/steps.css'
import { enhanceAppWithTabs } from './components/plugin-tabs/index'
import { registerGlobalComponents } from './shared/global-components'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router }) {
    app.use(FloatingVue, {
      themes: {
        hint: {
          $extend: 'tooltip',
          delay: { show: 0, hide: 0 },
          html: true
        },
        'wotaku-tooltip': {
          $extend: 'tooltip',
          $resetCss: true,
          triggers: ['click', 'touch'],
          autoHide: true
        }
      }
    })
    enhanceAppWithTabs(app)
    registerGlobalComponents(app)
    createMediumZoomProvider(app, router)
  }
} satisfies Theme

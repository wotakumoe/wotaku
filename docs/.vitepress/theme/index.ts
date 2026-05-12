/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/style.scss'
import { NolebasePagePropertiesPlugin } from '@nolebase/vitepress-plugin-page-properties/client'
import FloatingVue from 'floating-vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import '@nolebase/vitepress-plugin-page-properties/client/style.css'
import 'floating-vue/dist/style.css'
import Authors from './components/Authors.vue'
import Tooltip from './components/Tooltip.vue'
import { createMediumZoomProvider } from './composables/medium-zoom'
import 'virtual:uno.css'
import Feedback from './components/Feedback.vue'
import Collapsible from './components/Collapsible.vue'
import ScrapeTable from './components/ScrapeTable.vue'
import Layout from './Layout.vue'
import './styles/tooltip-hint.css'
import './styles/steps.css'
import Block from './components/Block.vue'
import LinkInline from './components/LinkInline.vue'
import Highlight from './components/Highlight.vue'

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
        'vp-tooltip': {
          $extend: 'tooltip',
          $resetCss: true,
          triggers: ['click', 'touch'],
          autoHide: true
        }
      }
    })
    enhanceAppWithTabs(app)
    app.component('LinkInline', LinkInline)
    app.component('hl', Highlight)
    app.component('Block', Block)
    app.component('Authors', Authors)
    app.component('Tooltip', Tooltip)
    app.component('Feedback', Feedback)
    app.component('Collapsible', Collapsible)
    app.component('ScrapeTable', ScrapeTable)
    createMediumZoomProvider(app, router)
    app.use(
      NolebasePagePropertiesPlugin<{ tags: string[]; progress: number }>(),
      [
        {
          locales: {
            en: [
              {
                key: 'tags',
                type: 'tags',
                title: 'Tags'
              },
              {
                key: 'createdAt',
                type: 'datetime',
                title: 'Created at',
                formatAsFrom: true,
                dateFnsLocaleName: 'enUS'
              },
              {
                key: 'updatedAt',
                type: 'datetime',
                title: 'Updated at',
                formatAsFrom: true,
                dateFnsLocaleName: 'enUS'
              },
              {
                key: 'wordsCount',
                type: 'dynamic',
                title: 'Word count',
                options: {
                  type: 'wordsCount'
                }
              },
              {
                key: 'readingTime',
                type: 'dynamic',
                title: 'Reading time',
                options: {
                  type: 'readingTime',
                  dateFnsLocaleName: 'enUS'
                }
              }
            ]
          }
        }
      ]
    )
  }
} satisfies Theme
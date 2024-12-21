/**
 *  Copyright (c) 2024 taskylizard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import './style.css'
import './ep.styl'
import FloatingVue from 'floating-vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import { NolebasePagePropertiesPlugin } from '@nolebase/vitepress-plugin-page-properties/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import '@nolebase/vitepress-plugin-page-properties/client/style.css'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import 'floating-vue/dist/style.css'
import { createMediumZoomProvider } from './composables'
import Button from './components/Button.vue'
import Tooltip from './components/Tooltip.vue'
import Authors from './components/Authors.vue'
import Components from '@fmhy/components'
import 'virtual:uno.css'
import Feedback from './components/Feedback.vue'
import Layout from './Layout.vue'
import PreferenceRadio from './components/PreferenceRadio.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'element-plus/theme-chalk/dark/css-vars.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(VueQueryPlugin)
    app.use(FloatingVue, {
      themes: {
        'vp-tooltip': {
          $extend: 'tooltip',
          $resetCss: true,
          triggers: ['click', 'touch'],
          autoHide: true
        }
      }
    })
    // createScienceProvider()
    enhanceAppWithTabs(app)
    app.component('Button', Button)
    app.component('Authors', Authors)
    app.component('Tooltip', Tooltip)
    app.component('Feedback', Feedback)
    app.component('PreferenceRadio', PreferenceRadio)
    createMediumZoomProvider(app, router)
    app.use(Components)
    app.use(NolebaseGitChangelogPlugin, {
      commitsRelativeTime: true,
      hideChangelogHeader: true,
      mapAuthors: [
        {
          name: 'taskylizard',
          username: 'taskylizard',
          avatar: 'https://github.com/taskylizard.png'
        },
        {
          name: 'Duck',
          username: 'woducku',
          avatar: 'https://github.com/woducku.png'
        }
      ]
    })
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

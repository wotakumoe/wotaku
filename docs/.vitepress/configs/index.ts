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
import type { DefaultTheme, Plugin, UserConfig } from 'vitepress'
import { generateImages, generateMeta } from './hooks'
import { defs, movePlugin, aliases } from './markdown/emoji'
import {
  PageProperties,
  PagePropertiesMarkdownSection
} from '@nolebase/vitepress-plugin-page-properties/vite'
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import Devtools from 'vite-plugin-vue-devtools'
import { configureMarkdown } from './markdown'
import { GIT_COMMIT, hostname, nav, sidebar, siteConfig } from './constants'

export const shared: UserConfig<DefaultTheme.Config> = {
  ...siteConfig,
  transformHead: async (context) => generateMeta(context, hostname),
  buildEnd: async (context) => {
    generateImages(context)
  },
  markdown: {
    emoji: { defs, shortcuts: aliases },
    config(md) {
      configureMarkdown(md)
    }
  },
  themeConfig: {
    search: {
      options: {
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            // @ts-ignore
            boostDocument: (
              _,
              term,
              storedFields: Record<string, string | string[]>
            ) => {
              const titles = (storedFields?.titles as string[])
                .filter((t) => Boolean(t))
                .map((t) => t.toLowerCase())
              // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
              const titleIndex =
                titles
                  .map((t, i) => (t?.includes(term) ? i : -1))
                  .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex

              return 1
            }
          }
        },
        detailedView: true
      },
      provider: 'local'
    },
    logo: { src: '/asset/fav.png' },
    sidebar,
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wotakumoe/Wotaku' },
      { icon: 'discord', link: 'https://discord.gg/vShRGx8ZBC' },
      {
        icon: 'bluesky',
        link: 'https://bsky.app/profile/wotaku.wiki'
      }
    ],
    footer: {
      message: `<a href="https://github.com/wotakumoe">The Wotaku Team</a> <span class="divider">|</span> <a href="https://github.com/wotakumoe/Wotaku/commit/${GIT_COMMIT}">${GIT_COMMIT.slice(
        0,
        7
      )}</a>`,
      copyright: 'made with love and eepy energy'
    }
  },
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-git-changelog/client',
        '@nolebase/vitepress-plugin-page-properties/client'
      ]
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-page-properties',
        '@nolebase/vitepress-plugin-git-changelog',
        '@nolebase/ui',
        '@fmhy/components'
      ]
    },
    plugins: [
      Devtools(),
      PageProperties(),
      PagePropertiesMarkdownSection(),
      GitChangelog({
        maxGitLogCount: 20,
        repoURL: 'https://github.com/wotakumoe/Wotaku'
      }),
      GitChangelogMarkdownSection({ sections: { disableContributors: true } }),
      UnoCSS({
        configFile: '../unocss.config.ts'
      }),
      {
        name: 'custom:adjust-order',
        configResolved(c) {
          movePlugin(
            c.plugins as unknown as Plugin[],
            'vitepress',
            'before',
            'unocss:transformers:pre'
          )
          movePlugin(
            c.plugins as unknown as Plugin[],
            'custom:tooltip-loader',
            'before',
            'vitepress'
          )
        }
      }
    ],
    resolve: {
      alias: [
        {
          find: /^.*\/VPBadge\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/Badge.vue', import.meta.url)
          )
        },
        {
          find: /^.*VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL(
              '../theme/components/VPSwitchAppearance.vue',
              import.meta.url
            )
          )
        }
      ]
    }
  }
}

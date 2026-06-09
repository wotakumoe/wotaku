/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import {
  PageProperties,
  PagePropertiesMarkdownSection
} from '@nolebase/vitepress-plugin-page-properties/vite'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import Devtools from 'vite-plugin-vue-devtools'
import type { DefaultTheme, Plugin, UserConfig } from 'vitepress'
import { hostname, sidebar, siteConfig } from './constants'
import { generateImages, generateMeta } from './hooks'
import { configureMarkdown } from './markdown'
import { aliases, defs, movePlugin } from './markdown/emoji'
import { indexMeiliSearch } from '../plugins/meiliSearchPlugin'
import { writeUrlSearchIndex } from '../plugins/urlSearchPlugin'

const GIT_COMMIT = process.env.NODE_ENV === 'development'
  ? 'dev'
  : (process.env.GITHUB_SHA ??
    (await (await import('tinyexec'))
      .x('git', ['rev-parse', 'HEAD'])
      .then((result) => result.stdout.trim())) ??
    'dev')

export const shared: UserConfig<DefaultTheme.Config> = {
  ...siteConfig,
  transformHead: async (context) => generateMeta(context, hostname),
  buildEnd: async (context) => {
    const indexedSearch = await indexMeiliSearch(context)
    if (indexedSearch) writeUrlSearchIndex(context.outDir)
    if (process.env.CI) {
      await generateImages(context)
    }
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
        detailedView: true
      },
      provider: 'local'
    },
    logo: { src: '/asset/fav.svg' },
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wotakumoe/Wotaku' },
      { icon: 'discord', link: 'https://discord.gg/vShRGx8ZBC' }
    ],
    footer: {
      message:
        `<a href="https://github.com/wotakumoe">The Wotaku Team</a> <span class="divider">|</span> <a href="https://github.com/wotakumoe/Wotaku/commit/${GIT_COMMIT}">${
          GIT_COMMIT.slice(0, 7)
        }</a>`,
      copyright: 'made with love and eepy energy'
    }
  },
  vite: {
    experimental: {
      enableNativePlugin: true
    },
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-page-properties/client'
      ]
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-page-properties',
        '@nolebase/ui',
        '@fmhy/components'
      ]
    },
    plugins: [
      Devtools(),
      PageProperties(),
      PagePropertiesMarkdownSection(),
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
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/NavBarSearch.vue', import.meta.url)
          )
        }
      ]
    }
  }
}

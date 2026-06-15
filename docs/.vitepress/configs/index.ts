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
import { createLogger } from 'vite'
import Devtools from 'vite-plugin-vue-devtools'
import type { DefaultTheme, Plugin, UserConfig } from 'vitepress'
import { hostname, sidebar, siteConfig } from './constants'
import { generateImages, generateMeta } from './hooks'
import { configureMarkdown } from './markdown'
import { aliases, defs, movePlugin } from './markdown/emoji'
import { collectPageLinks, urlSearchDevPlugin, writeUrlSearchIndex } from '../plugins/urlSearchPlugin'

const logger = createLogger()
const warn = logger.warn
const warnOnce = logger.warnOnce

function shouldSuppressWarning(message: string) {
  return message.includes('[lightningcss minify] Unknown at rule: @property') ||
    message.includes('Some chunks are larger than')
}

logger.warn = (message, options) => {
  if (shouldSuppressWarning(message)) return
  warn(message, options)
}

logger.warnOnce = (message, options) => {
  if (shouldSuppressWarning(message)) return
  warnOnce(message, options)
}

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
    writeUrlSearchIndex(context.outDir)
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
              const titleIndex = titles
                .map((t, i) => (t?.includes(term) ? i : -1))
                .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex
              return 1
            }
          }
        },
        _render(src, env, md) {
          collectPageLinks(src, env.relativePath)
          return md.render(src, env)
        },
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
    customLogger: logger,
    experimental: {
      enableNativePlugin: true
    },
    build: {
      cssMinify: 'lightningcss'
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
      urlSearchDevPlugin(),
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

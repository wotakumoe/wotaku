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

const GIT_COMMIT = process.env.NODE_ENV === 'development'
  ? 'dev'
  /** Github actions commit hash */
  : (process.env.GITHUB_SHA ??
    /** Commit hash from git */
    (await (await import('tinyexec'))
      .x('git', ['rev-parse', 'HEAD'])
      .then((result) => result.stdout.trim())) ??
    'dev')

// Default term splitter, used for every field except the whole-URL `urls` field.
const SPACE_OR_PUNCT = /[\n\r\p{Z}\p{P}]+/u

export const shared: UserConfig<DefaultTheme.Config> = {
  ...siteConfig,
  transformHead: async (context) => generateMeta(context, hostname),
  buildEnd: async (context) => {
    await generateImages(context)
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
          // Dedicated `urls` field: each URL is one whole token so a pasted
          // URL matches exactly. Other fields keep default behaviour.
          options: {
            fields: ['title', 'titles', 'text', 'urls'],
            storeFields: ['title', 'titles'],

            extractField(document, fieldName) {
              if (fieldName === 'urls') {
                const html = document.text ?? ''
                const out = []
                const re = /data-search-urls="([^"]*)"/g
                let m
                while ((m = re.exec(html))) {
                  out.push(
                    m[1]
                      .replace(/&#10;/g, '\n')
                      .replace(/&quot;/g, '"')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&')
                  )
                }
                return out.join('\n')
              }
              return document[fieldName] ?? ''
            },

            tokenize(text, fieldName) {
              if (fieldName === 'urls') {
                return text.split('\n').map((u) => u.trim()).filter(Boolean)
              }
              return text.split(SPACE_OR_PUNCT).filter(Boolean)
            },

            processTerm(term, fieldName) {
              if (fieldName === 'urls') return term || false
              return term.toLowerCase() || false
            }
          },

          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            boost: { title: 4, titles: 2, text: 1, urls: 5 },
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
              const titleIndex = titles
                .map((t, i) => (t?.includes(term) ? i : -1))
                .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex

              return 1
            }
          }
        },
        detailedView: true,

        // Inject every URL from the page source into the rendered HTML so the
        // `urls` field above can index them. Build-time only.
        // Note: defining _render makes us responsible for the `search: false`
        // frontmatter opt-out, checked after renderAsync (env isn't ready before).
        async _render(src, env, md) {
          const html = await md.renderAsync(src, env)
          if (env.frontmatter?.search === false) return ''

          const urls = new Set<string>()
          const re = /https?:\/\/[^\s)<>'"`\]]+/g
          let m: RegExpExecArray | null
          while ((m = re.exec(src))) {
            urls.add(m[0].replace(/[).,]+$/, ''))
          }
          if (!urls.size) return html

          const blob = [...urls]
            .join('\n')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '&#10;')

          return `${html}\n<span class="search-url-index" data-search-urls="${blob}" hidden></span>`
        }
      },
      provider: 'local'
    },
    logo: { src: '/asset/fav.svg' },
    sidebar,
    // nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wotakumoe/Wotaku' },
      { icon: 'discord', link: 'https://discord.gg/vShRGx8ZBC' }
    ],
    footer: {
      message:
        `<a href="https://github.com/wotakumoe">The Wotaku Team</a> <span class="divider">|</span> <a href="https://github.com/wotakumoe/Wotaku/commit/${GIT_COMMIT}">${
          GIT_COMMIT.slice(
            0,
            7
          )
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
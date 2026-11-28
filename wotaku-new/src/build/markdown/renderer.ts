/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { componentPlugin, type ComponentPluginOptions } from '@mdit-vue/plugin-component'
import {
  frontmatterPlugin,
  type FrontmatterPluginOptions
} from '@mdit-vue/plugin-frontmatter'
import { headersPlugin, type HeadersPluginOptions } from '@mdit-vue/plugin-headers'
import { sfcPlugin, type SfcPluginOptions } from '@mdit-vue/plugin-sfc'
import { titlePlugin } from '@mdit-vue/plugin-title'
import { tocPlugin, type TocPluginOptions } from '@mdit-vue/plugin-toc'
import { slugify as defaultSlugify } from '@mdit-vue/shared'
import {
  MarkdownExit,
  type MarkdownExitOptions as Options,
  type StateCore,
  type Token
} from 'markdown-exit'
import anchorPlugin from 'markdown-it-anchor'
import attrsPlugin from 'markdown-it-attrs'
import mditCjkFriendly from 'markdown-it-cjk-friendly'
import { full as emojiPlugin } from 'markdown-it-emoji'
import type { LanguageInput, ShikiTransformer, ThemeRegistrationAny } from 'shiki'
import type { BuiltinLanguage, BuiltinTheme, Highlighter } from 'shiki'
import type { Logger } from 'vite'
import type { Awaitable } from '../../shared/client.ts'
import { compatiblePlugin } from './plugins/compatibility.ts'
import { type ContainerOptions, containerPlugin } from './plugins/containers.ts'
import { gitHubAlertsPlugin } from './plugins/github-alerts.ts'
import { highlight as createHighlighter } from './plugins/highlight.ts'
import { highlightLinePlugin } from './plugins/highlight-lines.ts'
import { imagePlugin, type Options as ImageOptions } from './plugins/image.ts'
import { lineNumberPlugin } from './plugins/line-numbers.ts'
import { linkPlugin } from './plugins/link.ts'
import { preWrapperPlugin } from './plugins/pre-wrapper.ts'
import { restoreEntities } from './plugins/restore-entities.ts'
import { snippetPlugin } from './plugins/snippet.ts'

export type ThemeOptions =
  | ThemeRegistrationAny
  | BuiltinTheme
  | {
      light: ThemeRegistrationAny | BuiltinTheme
      dark: ThemeRegistrationAny | BuiltinTheme
    }

export interface MarkdownOptions extends Options {
  /** Runs before plugins are applied. */
  preConfig?: (md: MarkdownExit) => Awaitable<void>
  /** Runs after plugins are applied. */
  config?: (md: MarkdownExit) => Awaitable<void>
  cache?: boolean
  externalLinks?: Record<string, string>

  theme?: ThemeOptions
  /** Custom languages or built-in languages to preload. */
  languages?: (LanguageInput | BuiltinLanguage)[]
  languageAlias?: Record<string, string>
  /**
   * @default false
   */
  lineNumbers?: boolean
  /** Fallback when the specified language is unavailable. */
  defaultHighlightLang?: string
  codeTransformers?: ShikiTransformer[]
  shikiSetup?: (shiki: Highlighter) => void | Promise<void>
  /**
   * @default 'Copy Code'
   */
  codeCopyButtonTitle?: string

  anchor?: anchorPlugin.AnchorOptions
  attrs?: {
    leftDelimiter?: string
    rightDelimiter?: string
    allowedAttributes?: Array<string | RegExp>
    disable?: boolean
  }
  emoji?: {
    defs?: Record<string, string>
    enabled?: string[]
    shortcuts?: Record<string, string | string[]>
  }
  frontmatter?: FrontmatterPluginOptions
  headers?: HeadersPluginOptions | boolean
  sfc?: SfcPluginOptions
  toc?: TocPluginOptions
  component?: ComponentPluginOptions
  container?: ContainerOptions
  image?: ImageOptions
  /**
   * @default true
   */
  gfmAlerts?: boolean
  /**
   * Supports emphasis in Japanese, Chinese, and Korean text.
   * @default true
   */
  cjkFriendly?: boolean
}

export type { MarkdownExit as MarkdownRenderer } from 'markdown-exit'

const disposers = new Map<MarkdownExit, () => void>()

export function disposeMarkdownRenderer(renderer?: MarkdownExit) {
  if (renderer) {
    disposers.get(renderer)?.()
    disposers.delete(renderer)
  } else {
    for (const dispose of disposers.values()) dispose()

    disposers.clear()
  }
}

export async function createMarkdownRenderer(
  srcDir: string,
  options: MarkdownOptions = {},
  base = '/',
  logger: Pick<Logger, 'warn'> = console
): Promise<MarkdownExit> {
  const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }
  const codeCopyButtonTitle = options.codeCopyButtonTitle || 'Copy Code'

  const [highlight, dispose] = options.highlight
    ? [options.highlight, () => {}]
    : await createHighlighter(theme, options, logger)
  const asyncHighlight: NonNullable<Options['highlight']> = highlight

  // Wotaku plugins and Wotaku's SFC/custom plugins wrap the synchronous
  // render path. Defer only the asynchronous highlighter, rather than bypassing
  // those wrappers with MarkdownExit's native asynchronous token renderer.
  // The temporary code also preserves Wotaku's source-based line numbering.
  const pending = new Map<string, Promise<string>>()
  let nextHighlight = 0
  const wrappedHighlight: Options['highlight'] = (str, lang, attrs, env) => {
    const result = asyncHighlight(str, lang, attrs, env)

    if (typeof result === 'string') return result

    const id = String(nextHighlight++)
    pending.set(id, Promise.resolve(result))
    const code = str
      .replace(/\n$/, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    return `<pre><!--::wotaku-highlight::${id}::--><code>${code}</code></pre>`
  }
  const md = new MarkdownExit({
    html: true,
    linkify: true,
    ...options,
    highlight: wrappedHighlight
  })
  disposers.set(md, dispose)

  // markdown-exit removes two legacy markdown-it helpers still consumed by
  // markdown-it-emoji and Wotaku's multimd-table plugin. Keep compatibility
  // local to this parser instance; the imported utils namespace is read-only.
  md.utils = Object.assign({}, md.utils, {
    assign: Object.assign,
    has: (object: object, key: PropertyKey) =>
      Object.prototype.hasOwnProperty.call(object, key)
  })

  md.linkify.set({ fuzzyLink: false })
  md.use(restoreEntities)

  if (options.preConfig) {
    await options.preConfig(md)
  }

  const slugify = options.anchor?.slugify?.bind(options.anchor) ?? defaultSlugify

  md.use(compatiblePlugin(componentPlugin), { ...options.component })
    .use(highlightLinePlugin)
    .use(preWrapperPlugin, { codeCopyButtonTitle })
    .use(snippetPlugin, srcDir)
    .use(containerPlugin, options.container)
    .use(imagePlugin, options.image)
    .use(
      linkPlugin,
      { target: '_blank', rel: 'noreferrer', ...options.externalLinks },
      base,
      slugify
    )
    .use(lineNumberPlugin, options.lineNumbers)

  const tableOpen = md.renderer.rules.table_open
  md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]

    if (token.attrIndex('tabindex') < 0) token.attrPush(['tabindex', '0'])

    return tableOpen
      ? tableOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  if (options.gfmAlerts !== false) {
    md.use(gitHubAlertsPlugin, options.container)
  }

  if (!options.attrs?.disable) {
    md.use(compatiblePlugin(attrsPlugin), options.attrs)
  }

  md.use(compatiblePlugin(emojiPlugin), { ...options.emoji })

  md.use(compatiblePlugin(anchorPlugin), {
    slugify,
    getTokensText: (tokens: Token[]) => {
      return tokens
        .filter((t) => !['html_inline', 'emoji'].includes(t.type))
        .map((t) => t.content)
        .join('')
    },
    permalink: (slug: string, _: unknown, state: StateCore, idx: number) => {
      const title =
        state.tokens[idx + 1]?.children
          ?.filter((token) => ['text', 'code_inline'].includes(token.type))
          .reduce((acc, t) => acc + t.content, '')
          .trim() || ''

      const linkTokens = [
        Object.assign(new state.Token('text', '', 0), { content: ' ' }),
        Object.assign(new state.Token('link_open', 'a', 1), {
          attrs: [
            ['class', 'header-anchor'],
            ['href', `#${slug}`],
            ['aria-label', `Permalink to “${title}”`]
          ]
        }),
        Object.assign(new state.Token('html_inline', '', 0), {
          content: '&#8203;',
          meta: { isPermalinkSymbol: true }
        }),
        new state.Token('link_close', 'a', -1)
      ]

      state.tokens[idx + 1].children?.push(...linkTokens)
    },
    ...options.anchor
  } as anchorPlugin.AnchorOptions).use(compatiblePlugin(frontmatterPlugin), {
    ...options.frontmatter
  })

  if (options.headers) {
    md.use(compatiblePlugin(headersPlugin), {
      level: [2, 3, 4, 5, 6],
      slugify,
      ...(typeof options.headers === 'boolean' ? undefined : options.headers)
    })
  }

  md.use(compatiblePlugin(sfcPlugin), { ...options.sfc })
    .use(compatiblePlugin(titlePlugin))
    .use(compatiblePlugin(tocPlugin), {
      slugify,
      ...options.toc,
      format: (s) => {
        const title = s.replaceAll('&amp;', '&') // encoded twice because of restoreEntities
        return options.toc?.format?.(title) ?? title
      }
    })

  if (options.cjkFriendly !== false) {
    md.use(compatiblePlugin(mditCjkFriendly))
  }

  if (options.config) {
    await options.config(md)
  }

  md.renderAsync = async (src, env) => {
    try {
      const html = md.render(src, env)
      const results = new Map<string, string>()
      await Promise.all(
        [...pending].map(async ([id, promise]) => {
          results.set(id, await promise)
        })
      )
      return html.replace(
        /<pre><!--::wotaku-highlight::(\d+)::--><code>[\s\S]*?<\/code><\/pre>/g,
        (_, id) => results.get(id)!
      )
    } finally {
      pending.clear()
    }
  }

  return md
}

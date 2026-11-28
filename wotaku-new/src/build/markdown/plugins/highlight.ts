/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import {
  transformerCompactLineOptions,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  type TransformerCompactLineOption
} from '@shikijs/transformers'
import { customAlphabet } from 'nanoid'
import c from 'picocolors'
import type { BundledLanguage, ShikiTransformer } from 'shiki'
import { createHighlighter, guessEmbeddedLanguages, isSpecialLang } from 'shiki'
import type { Logger } from 'vite'
import type { MarkdownOptions, ThemeOptions } from '../renderer.ts'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

/** Expand fence ranges such as {4,7-13} into highlighted line options. */
function attrsToLines(attrs: string): TransformerCompactLineOption[] {
  attrs = attrs.replace(/^(?:\[.*?\])?.*?([\d,-]+).*/, '$1').trim()
  const result: number[] = []

  if (!attrs) {
    return []
  }

  attrs
    .split(',')
    .map((v) => v.split('-').map((v) => parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(...Array.from({ length: end - start + 1 }, (_, i) => start + i))
      } else {
        result.push(start)
      }
    })
  return result.map((v) => ({
    line: v,
    classes: ['highlighted']
  }))
}

export async function highlight(
  theme: ThemeOptions,
  options: MarkdownOptions,
  logger: Pick<Logger, 'warn'> = console
): Promise<[(str: string, lang: string, attrs: string) => Promise<string>, () => void]> {
  const {
    defaultHighlightLang: defaultLang = 'txt',
    codeTransformers: userTransformers = []
  } = options

  const highlighter = await createHighlighter({
    themes:
      typeof theme === 'object' && 'light' in theme && 'dark' in theme
        ? [theme.light, theme.dark]
        : [theme],
    langs: [...(options.languages || []), ...Object.values(options.languageAlias || {})],
    langAlias: options.languageAlias
  })

  await options?.shikiSetup?.(highlighter)

  const transformers: ShikiTransformer[] = [
    transformerNotationDiff(),
    transformerNotationFocus({
      classActiveLine: 'has-focus',
      classActivePre: 'has-focused-lines'
    }),
    transformerNotationHighlight(),
    transformerNotationErrorLevel(),
    {
      name: 'wotaku:add-dir',
      pre(node) {
        node.properties.dir = 'ltr'
      }
    }
  ]

  const vueRE = /-vue(?=:|$)/
  const lineNoStartRE = /=(\d*)/
  const lineNoRE = /:(no-)?line-numbers(=\d*)?$/
  const mustacheRE = /\{\{.*?\}\}/g

  return [
    async (str: string, lang: string, attrs: string) => {
      const vPre = vueRE.test(lang) ? '' : 'v-pre'
      lang =
        lang
          .replace(lineNoStartRE, '')
          .replace(lineNoRE, '')
          .replace(vueRE, '')
          .toLowerCase() || defaultLang

      try {
        // https://github.com/shikijs/shiki/issues/952
        if (!isSpecialLang(lang) && !highlighter.getLoadedLanguages().includes(lang)) {
          await highlighter.loadLanguage(lang as any)
        }
      } catch {
        logger.warn(
          c.yellow(
            `\nThe language '${lang}' is not loaded, falling back to '${defaultLang}' for syntax highlighting.`
          )
        )
        lang = defaultLang
      }

      const lineOptions = attrsToLines(attrs)
      const mustaches = new Map<string, string>()

      const removeMustache = (s: string) => {
        if (vPre) return s

        return s.replace(mustacheRE, (match) => {
          let marker = mustaches.get(match)

          if (!marker) {
            marker = nanoid()
            mustaches.set(match, marker)
          }

          return marker
        })
      }

      const restoreMustache = (s: string) => {
        mustaches.forEach((marker, match) => {
          s = s.replaceAll(marker, match)
        })
        return s
      }

      str = removeMustache(str).trimEnd()

      const embeddedLang = guessEmbeddedLanguages(str, lang, highlighter)
      await highlighter.loadLanguage(...(embeddedLang as BundledLanguage[]))

      const highlighted = highlighter.codeToHtml(str, {
        lang,
        transformers: [
          ...transformers,
          transformerCompactLineOptions(lineOptions),
          {
            name: 'wotaku:v-pre',
            pre(node) {
              if (vPre) node.properties['v-pre'] = ''
            }
          },
          {
            name: 'wotaku:empty-line',
            code(hast) {
              hast.children.forEach((span) => {
                if (
                  span.type === 'element' &&
                  span.tagName === 'span' &&
                  Array.isArray(span.properties.class) &&
                  span.properties.class.includes('line') &&
                  span.children.length === 0
                ) {
                  span.children.push({
                    type: 'element',
                    tagName: 'wbr',
                    properties: {},
                    children: []
                  })
                }
              })
            }
          },
          ...userTransformers
        ],
        meta: { __raw: attrs },
        colorReplacements: {
          'github-dark': { '#6a737d': 'var(--wotaku-c-text-3)' }
        },
        ...(typeof theme === 'object' && 'light' in theme && 'dark' in theme
          ? { themes: theme, defaultColor: false }
          : { theme })
      })

      return restoreMustache(highlighted)
    },
    highlighter.dispose
  ]
}

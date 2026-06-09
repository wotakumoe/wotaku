/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import MdMTables from 'markdown-it-multimd-table'
// @ts-expect-error
import { align } from '@mdit/plugin-align'
import { attrs } from '@mdit/plugin-attrs'
import { figure } from '@mdit/plugin-figure'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { imgSize } from '@mdit/plugin-img-size'
import MdReg from 'markdown-it-regexp'
import type { MarkdownRenderer } from 'vitepress'
import {
  getTabAnchor,
  getTabHeadingAnchor,
  parseTabLabel
} from '../../utils/tabAnchors'
import { getTooltip } from '../../utils/tooltips'
import { headersPlugin } from '../markdown/headers'
import { emojiRender } from './emoji'
import { nestedContainersPlugin } from './nestedContainers'
import { scrapeTablePlugin } from './scrapeTablePlugin'
import markdownSteps from './steps'
import { tabsMarkdownPlugin } from './tabs'

export function configureMarkdown(md: MarkdownRenderer) {
  md.use(emojiRender)
  md.use(imgLazyload)
  md.use(align)
  md.use(figure)
  md.use(tabsMarkdownPlugin)
  md.use(nestedContainersPlugin)
  md.use(imgSize)
  md.use(headersPlugin)
  md.use(MdMTables, {
    multiline: true,
    rowspan: true,
    headerless: true,
    multibody: true,
    aotolabel: true
  })
  md.use(attrs)
  renderTooltip(md)
  renderInlineTooltip(md)
  md.use(markdownSteps)
  md.use(scrapeTablePlugin)
  renderHighlight(md)
}

function renderInlineTooltip(md: MarkdownRenderer) {
  md.use(
    MdReg(
      /\^\[(.*?)\]\((.+?)\)/,
      ([, cont, hint]: string[]) =>
        '<VTooltip theme="hint">' +
        span(md.renderInline(cont)) +
        '<template v-slot:popper>' +
        md.renderInline(hint) +
        '</template></VTooltip>'
    )
  )
}

function renderTooltip(md: MarkdownRenderer) {
  md.use(
    MdReg(/==(.+?)==/, ([, cont]: string[]) => {
      const item = getTooltip(cont)
      if (!item) return `No tooltip found for ${cont}`

      const icon = item.frontmatter.icon
        ? `icon="${item.frontmatter.icon}"`
        : ''

      const title = item.frontmatter.title
        ? `title="${item.frontmatter.title}"`
        : item.id
        ? `title="${item.id}"`
        : '' /** Impossible */
      const props = icon + title
      const renderedContent = md.render(item.content)

      return `<Tooltip ${props}>` + renderedContent + '</Tooltip>'
    })
  )
}

function span(
  content: string,
  attrs: Record<string, unknown> | undefined = undefined
) {
  let html = '<span'
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      html += ` ${key}="${value}"`
    }
  }
  html += `>${content}</span>`
  return html
}

function renderHighlight(md: MarkdownRenderer) {
  const original = md.render.bind(md)
  md.render = (src, env) => {
    const withSearchHeadings = injectSearchHeadings(src)

    // Replace [||text||](url) — linked pill
    let replaced = withSearchHeadings.replace(
      /\[([!x]?)\|\|(.+?)\|\|\]\((.+?)\)/g,
      (_, prefix, cont, url) => {
        const variant = prefix === '!'
          ? 'warning'
          : prefix === 'x'
          ? 'danger'
          : 'default'
        const inner = md.renderInline(cont, env)
        return `<a href="${url}" target="_blank" rel="noopener noreferrer"><hl variant="${variant}" linked="true">${inner}</hl></a>`
      }
    )
    // Replace standalone ||text||
    replaced = replaced.replace(/([!x]?)\|\|(.+?)\|\|/g, (_, prefix, cont) => {
      const variant = prefix === '!'
        ? 'warning'
        : prefix === 'x'
        ? 'danger'
        : 'default'
      return `<hl variant="${variant}">${md.renderInline(cont, env)}</hl>`
    })
    return original(replaced, env)
  }
}

interface SearchHeading {
  level: number
  title: string
}

function getHeadingTitle(value: string) {
  return value.replace(/\s+\{[^}]*\}\s*$/, '').trim()
}

function injectSearchHeadings(src: string) {
  const lines = src.split('\n')
  const containerStack: string[] = []
  const headingStack: (SearchHeading | undefined)[] = []
  const tabResetStack: (SearchHeading | undefined)[] = []
  const tabAnchorCounts = new Map<string, number>()
  const getCurrentHeading = () => {
    for (let i = headingStack.length - 1; i >= 0; i--) {
      if (headingStack[i]) return headingStack[i]
    }
  }
  const isHeadingLine = (line: string | undefined) =>
    /^#{1,6}\s+/.test(line?.trim() ?? '')

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^(#{1,6})\s+(.+)/)
    if (headingMatch && !containerStack.includes('tabs')) {
      const level = headingMatch[1].length
      const title = getHeadingTitle(headingMatch[2])
      if (title) {
        headingStack[level - 1] = { level, title }
        headingStack.length = level
      }
    }

    const containerOpenMatch = lines[i].match(
      /^\s*:{3,}\s*([A-Za-z][\w-]*)\b/
    )
    if (containerOpenMatch) {
      const containerName = containerOpenMatch[1].toLowerCase()
      containerStack.push(containerName)
      if (containerName === 'tabs') tabResetStack.push(getCurrentHeading())
    } else if (/^\s*:{3,}\s*$/.test(lines[i])) {
      const closed = containerStack.pop()
      if (closed === 'tabs') {
        const resetHeading = tabResetStack.pop()
        let nextLine = i + 1
        while (nextLine < lines.length && lines[nextLine].trim() === '') {
          nextLine++
        }

        if (
          resetHeading && nextLine < lines.length &&
          !isHeadingLine(lines[nextLine])
        ) {
          const indent = lines[i].match(/^(\s*):{3,}\s*$/)?.[1] ?? ''
          lines.splice(
            i + 1,
            0,
            '',
            `${indent}${
              '#'.repeat(resetHeading.level)
            } ${resetHeading.title} {.tab-search-heading .ignore-header}`,
            ''
          )
          i += 3
        }
      }
      continue
    }

    const tabMatch = lines[i].match(/^(\s*)==\s+(.+)$/)
    if (tabMatch && containerStack.includes('tabs')) {
      const [, indent, title] = tabMatch
      const parsed = parseTabLabel(title)
      const headingTitle = parsed.label
      if (!headingTitle) continue
      const anchor = getTabAnchor(title, tabAnchorCounts)
      const headingAnchor = getTabHeadingAnchor(anchor)

      lines.splice(
        i + 1,
        0,
        '',
        `${indent}### ${headingTitle} {#${headingAnchor} .tab-search-heading .ignore-header}`,
        ''
      )
      i += 3
      continue
    }

    const match = lines[i].match(
      /^(\s*)<Collapsible\b(?=[^>]*\btitle=(['"])(.*?)\2)[^>]*>\s*$/i
    )
    if (!match) continue

    let nextLine = i + 1
    while (nextLine < lines.length && lines[nextLine].trim() === '') {
      nextLine++
    }

    if (/^#{1,6}\s+/.test(lines[nextLine]?.trim() ?? '')) continue

    const [, indent, , title] = match
    const headingTitle = title.trim()
    if (!headingTitle) continue
    const headingLevel = containerStack.includes('tabs') ? 4 : 3

    lines.splice(
      i + 1,
      0,
      '',
      `${indent}${
        '#'.repeat(headingLevel)
      } ${headingTitle} {.collapsible-search-heading}`,
      ''
    )
    i += 3
  }

  return lines.join('\n')
}

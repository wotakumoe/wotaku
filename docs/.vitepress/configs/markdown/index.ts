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
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { getTooltip } from '../../utils/tooltips'
import { headersPlugin } from '../markdown/headers'
import { emojiRender } from './emoji'
import { scrapeTablePlugin } from './scrapeTablePlugin'
import markdownSteps from './steps'

export function configureMarkdown(md: MarkdownRenderer) {
  md.use(emojiRender)
  md.use(imgLazyload)
  md.use(align)
  md.use(figure)
  md.use(tabsMarkdownPlugin)
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
    const withCollapsibleHeadings = injectCollapsibleSearchHeadings(src)

    // Replace [||text||](url) — linked pill
    let replaced = withCollapsibleHeadings.replace(
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

function injectCollapsibleSearchHeadings(src: string) {
  const lines = src.split('\n')

  for (let i = 0; i < lines.length; i++) {
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

    lines.splice(
      i + 1,
      0,
      '',
      `${indent}### ${headingTitle} {.collapsible-search-heading}`,
      ''
    )
    i += 3
  }

  return lines.join('\n')
}

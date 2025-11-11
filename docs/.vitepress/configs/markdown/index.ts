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

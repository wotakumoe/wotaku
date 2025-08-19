import MdMTables from 'markdown-it-multimd-table'
// @ts-expect-error
import MdReg from 'markdown-it-regexp'
import type { MarkdownRenderer } from 'vitepress'
import { headersPlugin } from '../markdown/headers'
import { figure } from '@mdit/plugin-figure'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { align } from '@mdit/plugin-align'
import { imgSize } from '@mdit/plugin-img-size'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { emojiRender } from './emoji'
import { getTooltip } from '../../utils/tooltips'

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
  renderTooltip(md)
  renderInlineTooltip(md)
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
  if (attrs)
    for (const [key, value] of Object.entries(attrs)) {
      html += ` ${key}="${value}"`
    }
  html += `>${content}</span>`
  return html
}

/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import markdownItContainer from 'markdown-it-container'
import type { MarkdownExit, RenderRule, Token } from 'markdown-exit'
import { compatiblePlugin } from './compatibility.ts'
import { extractTitle } from './pre-wrapper.ts'

const container = compatiblePlugin(markdownItContainer)

export const containerPlugin = (md: MarkdownExit, options?: ContainerOptions) => {
  md.use(...createContainer('tip', options?.tipLabel || 'TIP', md))
    .use(...createContainer('info', options?.infoLabel || 'INFO', md))
    .use(...createContainer('warning', options?.warningLabel || 'WARNING', md))
    .use(...createContainer('danger', options?.dangerLabel || 'DANGER', md))
    .use(...createContainer('details', options?.detailsLabel || 'Details', md))
    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
    })
    .use(container, 'raw', {
      render: (tokens: Token[], idx: number) =>
        tokens[idx].nesting === 1 ? `<div class="wotaku-raw">\n` : `</div>\n`
    })
    .use(...createCodeGroup(md))
}

type ContainerArgs = [
  typeof container,
  string,
  { render: (...args: Parameters<RenderRule>) => string }
]

function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownExit
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options, env) {
        const token = tokens[idx]

        if (token.nesting === 1) {
          token.attrJoin('class', `${klass} custom-block`)
          const attrs = md.renderer.renderAttrs(token)
          const info = token.info.trim().slice(klass.length).trim()
          const title = md.renderInline(info || defaultTitle, {
            references: env.references
          })
          const titleClass =
            'custom-block-title' + (info ? '' : ' custom-block-title-default')

          if (klass === 'details') {
            return `<details ${attrs}><summary>${title}</summary>\n`
          }

          return `<div ${attrs}><p class="${titleClass}">${title}</p>\n`
        } else return klass === 'details' ? `</details>\n` : `</div>\n`
      }
    }
  ]
}

function createCodeGroup(md: MarkdownExit): ContainerArgs {
  return [
    container,
    'code-group',
    {
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          let tabs = ''
          let checked = 'checked'

          for (
            let i = idx + 1;
            !(
              tokens[i].nesting === -1 && tokens[i].type === 'container_code-group_close'
            );
            ++i
          ) {
            const isHtml = tokens[i].type === 'html_block'

            if ((tokens[i].type === 'fence' && tokens[i].tag === 'code') || isHtml) {
              const title = extractTitle(
                isHtml ? tokens[i].content : tokens[i].info,
                isHtml
              )

              if (title) {
                tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(
                  title
                )}" for="tab-${i}">${title}</label>`

                if (checked && !isHtml) tokens[i].info += ' active'

                checked = ''
              }
            }
          }

          return `<div class="wotaku-code-group"><div class="tabs">${tabs}</div><div class="blocks">\n`
        }

        return `</div></div>\n`
      }
    }
  ]
}

export interface ContainerOptions {
  infoLabel?: string
  noteLabel?: string
  tipLabel?: string
  warningLabel?: string
  dangerLabel?: string
  detailsLabel?: string
  importantLabel?: string
  cautionLabel?: string
}

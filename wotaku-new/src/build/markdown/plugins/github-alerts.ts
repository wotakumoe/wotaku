/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { MarkdownExit } from 'markdown-exit'
import type { ContainerOptions } from './containers.ts'

const markerRE = /^\[!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\]([^\n\r]*)/i

export const gitHubAlertsPlugin = (md: MarkdownExit, options?: ContainerOptions) => {
  const titleMark = {
    tip: options?.tipLabel || 'TIP',
    note: options?.noteLabel || 'NOTE',
    info: options?.infoLabel || 'INFO',
    important: options?.importantLabel || 'IMPORTANT',
    warning: options?.warningLabel || 'WARNING',
    caution: options?.cautionLabel || 'CAUTION',
    danger: options?.dangerLabel || 'DANGER'
  } as Record<string, string>

  md.core.ruler.after('block', 'github-alerts', (state) => {
    const tokens = state.tokens

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_open') {
        const startIndex = i
        const open = tokens[startIndex]
        let endIndex = i + 1

        while (
          endIndex < tokens.length &&
          (tokens[endIndex].type !== 'blockquote_close' ||
            tokens[endIndex].level !== open.level)
        ) {
          endIndex++
        }

        if (endIndex === tokens.length) continue

        const close = tokens[endIndex]
        const firstContent = tokens
          .slice(startIndex, endIndex + 1)
          .find((token) => token.type === 'inline')

        if (!firstContent) continue

        const match = firstContent.content.match(markerRE)

        if (!match) continue

        const type = match[1].toLowerCase()
        const title = match[2].trim() || titleMark[type] || capitalize(type)
        firstContent.content = firstContent.content.slice(match[0].length).trimStart()
        open.type = 'github_alert_open'
        open.tag = 'div'
        open.meta = {
          title,
          type
        }
        close.type = 'github_alert_close'
        close.tag = 'div'
      }
    }
  })
  md.renderer.rules.github_alert_open = function (tokens, idx) {
    const { title, type } = tokens[idx].meta
    const attrs = ''
    return `<div class="${type} custom-block github-alert"${attrs}><p class="custom-block-title">${title}</p>\n`
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

// Normalize fence line attributes for highlight.ts.

import type { MarkdownExit } from 'markdown-exit'

const RE = /{([\d,-]+)}/

export const highlightLinePlugin = (md: MarkdownExit) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    // markdown-it-attrs converts {0} syntax into token attributes.
    const attr = token.attrs && token.attrs[0]

    let lines = null

    if (!attr) {
      // Read the fence info directly when markdown-it-attrs is disabled.
      const rawInfo = token.info

      if (!rawInfo || !RE.test(rawInfo)) {
        return fence(...args)
      }

      const langName = rawInfo.replace(RE, '').trim()

      token.info = langName

      lines = RE.exec(rawInfo)![1]
    }

    if (!lines) {
      lines = attr![0]

      if (!lines || !/[\d,-]+/.test(lines)) {
        return fence(...args)
      }
    }

    token.info += ' ' + lines
    return fence(...args)
  }
}

/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

// Must run after preWrapperPlugin to insert numbers inside the code wrapper.

import type { MarkdownExit, RenderRule } from 'markdown-exit'

export const lineNumberPlugin = (md: MarkdownExit, enable = false) => {
  // The renderer defers async highlighting, so the wrapped fence stays synchronous.
  const fence = md.renderer.rules.fence! as (...args: Parameters<RenderRule>) => string
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args)

    const [tokens, idx] = args
    const info = tokens[idx].info

    if (
      (!enable && !/:line-numbers($| |=)/.test(info)) ||
      (enable && /:no-line-numbers($| )/.test(info))
    ) {
      return rawCode
    }

    let startLineNumber = 1
    const matchStartLineNumber = info.match(/=(\d*)/)

    if (matchStartLineNumber && matchStartLineNumber[1]) {
      startLineNumber = parseInt(matchStartLineNumber[1])
    }

    const code = rawCode.slice(rawCode.indexOf('<code>'), rawCode.indexOf('</code>'))

    const lines = code.split('\n')

    const lineNumbersCode = [...Array(lines.length)]
      .map(
        (_, index) => `<span class="line-number">${index + startLineNumber}</span><br>`
      )
      .join('')

    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`

    const finalCode = rawCode
      .replace(/<\/div>$/, `${lineNumbersWrapperCode}</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 line-numbers-mode"')

    return finalCode
  }
}

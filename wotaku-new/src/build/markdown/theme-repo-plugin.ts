/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { MarkdownExit as MarkdownRenderer } from 'markdown-exit'
import type { ThemeRepoEntry } from '../../shared/theme-repos/types.ts'

const MARKER = ':'
const MIN_MARKERS = 3
const NAME = 'themerepo'

function parseEntries(bodyLines: string[]): ThemeRepoEntry[] {
  const entries: ThemeRepoEntry[] = []
  let current: ThemeRepoEntry | null = null

  for (const rawLine of bodyLines) {
    const line = rawLine.trim()

    if (!line) continue

    const headingMatch = line.match(/^==\s+(.+)$/)

    if (headingMatch) {
      if (current) entries.push(current)

      current = { name: headingMatch[1].trim() }
      continue
    }

    const fieldMatch = line.match(/^-\s*([a-zA-Z]+)\s*:\s*(.+)$/)

    if (fieldMatch && current) {
      const key = fieldMatch[1].toLowerCase()
      const value = fieldMatch[2].trim()

      if (key === 'url' || key === 'src' || key === 'raw') {
        current[key] = value
      }
    }
  }

  if (current) entries.push(current)

  return entries
}

export function themeRepoPlugin(md: MarkdownRenderer): void {
  md.block.ruler.before(
    'fence',
    'theme_repo',
    (state, startLine, endLine, silent) => {
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]

      let markerCount = 0

      while (pos < max && state.src[pos] === MARKER) {
        pos++
        markerCount++
      }

      if (markerCount < MIN_MARKERS) return false

      const params = state.src.slice(pos, max).trim()

      if (params.split(/\s+/)[0].toLowerCase() !== NAME) return false

      if (silent) return true

      let nextLine = startLine + 1
      let found = false

      while (nextLine < endLine) {
        let p = state.bMarks[nextLine] + state.tShift[nextLine]
        const m = state.eMarks[nextLine]

        if (p < m && state.sCount[nextLine] < state.blkIndent) break

        let cnt = 0

        while (p < m && state.src[p] === MARKER) {
          p++
          cnt++
        }

        if (cnt >= markerCount && state.src.slice(p, m).trim() === '') {
          found = true
          break
        }

        nextLine++
      }

      const body = state.getLines(startLine + 1, nextLine, state.blkIndent, false)
      const entries = parseEntries(body.split('\n'))
      const attrs = entries.length
        ? ` :themes='${JSON.stringify(entries).replace(/'/g, '&#39;')}'`
        : ''

      const token = state.push('html_block', '', 0)
      token.map = [startLine, nextLine]
      token.content = `<ThemeRepos${attrs} />\n`

      state.line = found ? nextLine + 1 : nextLine
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  )
}

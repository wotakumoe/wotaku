import type MarkdownIt from 'markdown-it'

const MARKER_RE = /^<more\s*\/?>$/i

const ROW_TOKEN_TYPES = new Set([
  'tr_open',
  'tr_close',
  'td_open',
  'td_close',
  'th_open',
  'th_close',
  'inline'
])

function buildToggleHtml(cols: number): string {
  return `<tbody class="table-more-toggle">\n` +
    `<tr class="table-more-toggle-row">\n` +
    `<td colspan="${cols}">\n` +
    `<label class="table-more-label">\n` +
    `<input type="checkbox" class="table-more-checkbox" aria-label="Toggle more rows">\n` +
    `<span class="table-more-text table-more-text--more">Show more</span>\n` +
    `<span class="table-more-text table-more-text--less">Show less</span>\n` +
    `<span class="table-more-icon i-mdi-chevron-down" aria-hidden="true"></span>\n` +
    `</label>\n</td>\n</tr>\n</tbody>\n`
}

function getLine(state: any, n: number): string {
  return state.src.slice(
    state.bMarks[n] + state.tShift[n],
    state.eMarks[n]
  )
}

function isPipeLine(line: string): boolean {
  return line.trim().startsWith('|')
}

function splitCells(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1)
  return s.split(/(?<!\\)\|/).map((c) =>
    c.replace(/\\\|/g, '|').replace(/\\\\/g, '\\')
  )
}

function isDelimiterRow(line: string): boolean {
  const cells = splitCells(line)
  return cells.length > 0 &&
    cells.every((c) => /^:?-+:?$/.test(c.trim()))
}

function findTableClose(tokens: any[], from: number): number {
  let depth = 0
  for (let j = from; j < tokens.length; j++) {
    if (tokens[j].type === 'table_open') depth++
    else if (tokens[j].type === 'table_close') {
      depth--
      if (depth === 0) return j
    }
  }
  return -1
}

function countCells(
  tokens: any[],
  from: number,
  to: number,
  type: string
): number {
  let count = 0
  for (let k = from; k < to; k++) {
    if (tokens[k].type === type) count++
  }
  return count
}

function findTableOpen(tokens: any[], tableCloseIdx: number): number {
  let depth = 0
  for (let k = tableCloseIdx; k >= 0; k--) {
    if (tokens[k].type === 'table_close') depth++
    else if (tokens[k].type === 'table_open') {
      if (depth <= 1) return k
      depth--
    }
  }
  return -1
}

function countTableCols(tokens: any[], tableCloseIdx: number): number {
  const openIdx = findTableOpen(tokens, tableCloseIdx)
  if (openIdx === -1) return 0
  let theadOpen = -1
  let theadClose = -1
  for (let k = openIdx; k < tableCloseIdx; k++) {
    if (tokens[k].type === 'thead_open' && theadOpen === -1) {
      theadOpen = k
    }
    if (tokens[k].type === 'thead_close') {
      theadClose = k
      break
    }
  }
  if (theadOpen !== -1 && theadClose !== -1) {
    return countCells(tokens, theadOpen, theadClose, 'th_open')
  }
  return 0
}

function stampTableAnchor(state: any, tokens: any[], tableCloseIdx: number) {
  const openIdx = findTableOpen(tokens, tableCloseIdx)
  if (openIdx === -1) return
  const n = state.env.__tableMoreCount ?? 0
  state.env.__tableMoreCount = n + 1
  tokens[openIdx].attrJoin('data-table-more', String(n))
}

export function tableMorePlugin(md: MarkdownIt): void {
  md.block.ruler.before(
    'html_block',
    'table_more_marker',
    (state, startLine, endLine, silent) => {
      const pos = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]
      if (!MARKER_RE.test(state.src.slice(pos, max).trim())) {
        return false
      }
      // Only a marker directly after a table; otherwise literal text.
      const prev = state.tokens[state.tokens.length - 1]
      if (!prev || prev.type !== 'table_close') return false
      if (silent) return true

      // Full table follows: let the table parser handle it, merge later.
      let line = startLine + 1
      while (line < endLine && getLine(state, line).trim() === '') line++
      const next1 = line < endLine ? getLine(state, line) : ''
      const next2 = line + 1 < endLine ? getLine(state, line + 1) : ''
      const fullTableFollows = isPipeLine(next1) && isDelimiterRow(next2)

      const marker = state.push('table_more', '', 0)
      marker.map = [startLine, startLine + 1]
      marker.content = ''

      if (fullTableFollows) {
        state.line = startLine + 1
        return true
      }

      let rows = 0
      while (line < endLine && isPipeLine(getLine(state, line))) {
        const cells = splitCells(getLine(state, line))
        const trOpen = state.push('tr_open', 'tr', 1)
        trOpen.map = [line, line + 1]
        let openTd: any = null
        let span = 1
        const flush = () => {
          if (openTd && span > 1) openTd.attrJoin('colspan', String(span))
          openTd = null
          span = 1
        }
        for (const raw of cells) {
          if (raw === '' && openTd) {
            span++
            continue
          }
          flush()
          const td = state.push('td_open', 'td', 1)
          td.attrs = []
          const inline = state.push('inline', '', 0)
          inline.content = raw.trim()
          inline.map = [line, line + 1]
          inline.children = []
          state.push('td_close', 'td', -1)
          openTd = td
        }
        flush()
        state.push('tr_close', 'tr', -1)
        rows++
        line++
      }

      if (rows > 0) {
        const closer = state.push('html_block', '', 0)
        closer.map = [line, line]
        closer.content = '</tbody>\n'
      }
      state.line = line
      return true
    }
  )

  // Unmatched markers (no second table) render as nothing.
  md.renderer.rules.table_more = () => ''

  md.core.ruler.after('block', 'table_more_merge', (state: any) => {
    const tokens = state.tokens as any[]
    let i = 0
    while (i < tokens.length) {
      if (
        tokens[i].type !== 'table_close' ||
        tokens[i + 1]?.type !== 'table_more'
      ) {
        i++
        continue
      }

      // full second table follows the marker.
      if (tokens[i + 2]?.type === 'table_open') {
        const openIdx = i + 2
        const closeIdx = findTableClose(tokens, openIdx)
        if (closeIdx === -1) {
          i++
          continue
        }

        let theadOpen = -1
        let theadClose = -1
        for (let k = openIdx; k < closeIdx; k++) {
          if (tokens[k].type === 'thead_open' && theadOpen === -1) {
            theadOpen = k
          }
          if (tokens[k].type === 'thead_close') {
            theadClose = k
            break
          }
        }
        const bodyStart = theadClose !== -1 ? theadClose + 1 : openIdx + 1
        const kept = tokens.slice(bodyStart, closeIdx)

        let cols = theadOpen !== -1 && theadClose !== -1
          ? countCells(tokens, theadOpen, theadClose, 'th_open')
          : 0
        if (cols <= 0) cols = countTableCols(tokens, i)
        if (cols <= 0) cols = 1

        const hidden = kept.filter((t) => t.type === 'tr_open').length
        if (hidden === 0) {
          i = closeIdx + 1
          continue
        }

        for (const t of kept) {
          if (t.type === 'tbody_open') t.attrJoin('class', 'table-more-hidden')
        }

        stampTableAnchor(state, tokens, i)

        // Toggle + hidden rows go inside the first table, before its close.
        const marker = tokens[i + 1]
        marker.type = 'html_block'
        marker.tag = ''
        marker.nesting = 0
        marker.attrs = null
        marker.children = null
        marker.info = ''
        marker.markup = ''
        marker.content = buildToggleHtml(cols)

        const merged = tokens.slice(0, i)
        merged.push(marker)
        merged.push(...kept)
        merged.push(tokens[i])
        merged.push(...tokens.slice(closeIdx + 1))
        tokens.splice(0, tokens.length, ...merged)
        i += 2 + kept.length
        continue
      }

      // bare continuation rows follow the marker.
      if (tokens[i + 2]?.type === 'tr_open') {
        let j = i + 2
        while (j < tokens.length && ROW_TOKEN_TYPES.has(tokens[j].type)) j++
        const closer = tokens[j]
        if (
          !closer || closer.type !== 'html_block' ||
          !closer.content.includes('</tbody>')
        ) {
          i++
          continue
        }
        const kept = tokens.slice(i + 2, j)
        const hidden = kept.filter((t) => t.type === 'tr_open').length
        if (hidden === 0) {
          tokens.splice(i + 1, j - i)
          continue
        }

        let cols = countTableCols(tokens, i)
        if (cols <= 0) {
          const firstTr = kept.findIndex((t) => t.type === 'tr_open')
          const end = kept.findIndex(
            (t, idx) => idx > firstTr && t.type === 'tr_close'
          )
          cols = countCells(
            kept,
            firstTr,
            end === -1 ? kept.length : end,
            'td_open'
          )
        }
        if (cols <= 0) cols = 1

        stampTableAnchor(state, tokens, i)

        const marker = tokens[i + 1]
        marker.type = 'html_block'
        marker.tag = ''
        marker.nesting = 0
        marker.attrs = null
        marker.children = null
        marker.info = ''
        marker.markup = ''
        marker.content = buildToggleHtml(cols) +
          '<tbody class="table-more-hidden">\n'

        // Move the toggle + bare rows inside the first table.
        const segment = tokens.slice(i + 1, j + 1)
        const merged = tokens.slice(0, i)
        merged.push(...segment)
        merged.push(tokens[i])
        merged.push(...tokens.slice(j + 1))
        tokens.splice(0, tokens.length, ...merged)
        i += segment.length + 1
        continue
      }

      i++
    }
  })
}

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

function colspanOf(td: any): number {
  const cols = td ? Number(td.attrGet('colspan')) : NaN
  return Number.isFinite(cols) && cols > 0 ? Math.floor(cols) : 1
}

function rowspanOf(td: any): number {
  const rs = td ? Number(td.attrGet('rowspan')) : NaN
  return Number.isFinite(rs) && rs > 0 ? Math.floor(rs) : 1
}

function prevRowCells(tokens: any[]): any[] {
  let end = tokens.length - 1
  while (end >= 0 && tokens[end].type === 'table_close') end--
  if (end < 0 || tokens[end].type !== 'tbody_close') return []
  let open = end
  let depth = 0
  while (open >= 0) {
    if (tokens[open].type === 'tbody_close') depth++
    else if (tokens[open].type === 'tbody_open') {
      depth--
      if (depth === 0) break
    }
    open--
  }
  if (open < 0) return []
  const rows: any[][] = []
  let cur: any[] | null = null
  for (let k = open + 1; k < end; k++) {
    const t = tokens[k]
    if (t.type === 'tr_open') cur = []
    else if (t.type === 'tr_close') {
      if (cur) rows.push(cur)
      cur = null
    } else if (
      cur && (t.type === 'td_open' || t.type === 'th_open')
    ) {
      cur.push(t)
    }
  }
  const remaining: number[] = []
  const holder: any[] = []
  let owners: any[] = []
  for (const row of rows) {
    const next: any[] = []
    let c = 0
    for (const td of row) {
      while ((remaining[c] ?? 0) > 0) {
        next[c] = holder[c]
        c++
      }
      const w = colspanOf(td)
      for (let k = 0; k < w; k++) next[c + k] = td
      const rs = rowspanOf(td)
      if (rs > 1) {
        for (let k = 0; k < w; k++) {
          remaining[c + k] = rs
          holder[c + k] = td
        }
      }
      c += w
    }
    while ((remaining[c] ?? 0) > 0) {
      next[c] = holder[c]
      c++
    }
    for (let k = 0; k < remaining.length; k++) {
      if (remaining[k] > 0) remaining[k]--
    }
    owners = next
  }
  return owners
}

function cloneCellContent(state: any, owner: any) {
  const tokens = state.tokens
  const idx = tokens.indexOf(owner)
  if (idx === -1) return
  const end = tokens.length
  let depth = 1
  for (let k = idx + 1; k < end && depth > 0; k++) {
    const t = tokens[k]
    const isOpen = (t.type === 'td_open' || t.type === 'th_open') &&
      t.nesting === 1
    const isClose = (t.type === 'td_close' || t.type === 'th_close') &&
      t.nesting === -1
    if (isOpen) {
      depth++
    } else if (isClose) {
      depth--
      if (depth === 0) break
    } else {
      const cp = state.push(t.type, t.tag, t.nesting)
      cp.attrs = t.attrs ? t.attrs.map((a: any) => [a[0], a[1]]) : t.attrs
      cp.content = t.content
      cp.map = t.map ? t.map.slice() : t.map
      cp.children = []
      cp.block = t.block
      cp.info = t.info
      cp.markup = t.markup
      cp.meta = t.meta ? { ...t.meta } : t.meta
    }
  }
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

      let up: any[] = prevRowCells(state.tokens)
      const emitted = new Set(state.tokens)
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
        const cur: any[] = []
        let c = 0
        let openTd: any = null
        let openStart = 0
        let span = 1
        const flush = () => {
          if (openTd) {
            if (span > 1) openTd.attrSet('colspan', span)
            for (let k = 0; k < span; k++) cur[openStart + k] = openTd
            openTd = null
            span = 1
          }
        }
        for (const raw of cells) {
          if (raw.trim() === '^^' && c < up.length && up[c]) {
            flush()
            const above = up[c]
            const w = colspanOf(above)
            if (emitted.has(above)) {
              const td = state.push(
                above.tag === 'th' ? 'th_open' : 'td_open',
                above.tag,
                1
              )
              td.attrs = above.attrs
                ? above.attrs
                  .filter((a: any) => a[0] !== 'rowspan')
                  .map((a: any) => [a[0], a[1]])
                : []
              if (w > 1) td.attrSet('colspan', w)
              cloneCellContent(state, above)
              state.push(
                above.tag === 'th' ? 'th_close' : 'td_close',
                above.tag,
                -1
              )
              for (let k = 0; k < w; k++) cur[c + k] = td
            } else {
              const rs = rowspanOf(above)
              above.attrSet('rowspan', rs + 1)
              for (let k = 0; k < w; k++) cur[c + k] = above
            }
            c += w
            continue
          }
          if (raw === '' && openTd) {
            span++
            c++
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
          openStart = c
          c++
        }
        flush()
        state.push('tr_close', 'tr', -1)
        up = cur
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

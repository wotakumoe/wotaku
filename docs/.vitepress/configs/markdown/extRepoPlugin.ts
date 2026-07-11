import type MarkdownIt from 'markdown-it'

// Types

interface ParsedRepoRow {
  name: string
  indexUrl: string
  note?: string
}

interface ParsedRepoEntry {
  name: string
  url?: string
  src?: string
  raw?: string
  note?: string
}

// Parser

function parseAttrs(info: string): Record<string, string> {
  const match = info.match(/\{([^}]*)\}/)
  if (!match) return {}
  const attrs: Record<string, string> = {}
  for (const pair of match[1].split(/\s+/).filter(Boolean)) {
    const [key, value] = pair.split('=')
    if (key && value) attrs[key] = value.replace(/^["']|["']$/g, '')
  }
  return attrs
}

const FIELD_KEYS = new Set(['url', 'src', 'raw', 'note'])

function parseEntries(bodyLines: string[]): ParsedRepoEntry[] {
  const entries: ParsedRepoEntry[] = []
  let current: ParsedRepoEntry | null = null

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
      if (FIELD_KEYS.has(key)) current[key as 'url' | 'src' | 'raw' | 'note'] = fieldMatch[2].trim()
    }
  }
  if (current) entries.push(current)

  return entries
}

function nameMarkdown(entry: ParsedRepoEntry): string {
  const label = entry.url ? `[${entry.name}](${entry.url})` : entry.name
  return entry.src ? `${label} [:src:](${entry.src})` : label
}

// Plugin

export function extRepoPlugin(md: MarkdownIt): void {
  const MARKER = ':'
  const MIN_MARKERS = 3
  const NAME = 'extrepo'

  md.block.ruler.before(
    'fence',
    'ext_repo',
    (state, startLine, endLine, silent) => {
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      let max = state.eMarks[startLine]

      let markerCount = 0
      while (pos < max && state.src[pos] === MARKER) {
        pos++
        markerCount++
      }
      if (markerCount < MIN_MARKERS) return false

      const params = state.src.slice(pos, max).trim()
      if (!params.toLowerCase().startsWith(NAME)) return false

      if (silent) return true

      let nextLine = startLine + 1
      let found = false
      while (nextLine < endLine) {
        let p = state.bMarks[nextLine] + state.tShift[nextLine]
        const m = state.eMarks[nextLine]
        if (p < m && state.sCount[nextLine] < state.blkIndent) break

        let cnt = 0
        while (p < m && state.src[p] === MARKER) { p++; cnt++ }
        if (cnt >= markerCount && state.src.slice(p, m).trim() === '') {
          found = true
          break
        }
        nextLine++
      }

      const bodyLines: string[] = []
      for (let i = startLine + 1; i < nextLine; i++) {
        bodyLines.push(state.src.slice(state.bMarks[i], state.eMarks[i]))
      }

      const attrs = parseAttrs(params)
      const scheme = attrs.scheme || 'tachiyomi'

      const rows: ParsedRepoRow[] = []
      for (const entry of parseEntries(bodyLines)) {
        if (!entry.raw) continue
        rows.push({
          name: md.renderInline(nameMarkdown(entry), state.env),
          indexUrl: entry.raw,
          note: entry.note ? md.render(entry.note) : undefined
        })
      }

      const reposJson = JSON.stringify(rows).replace(/'/g, '&#39;')

      const token = state.push('html_block', '', 0)
      token.map = [startLine, nextLine]
      token.content = `<ExtensionRepos scheme="${scheme}" :repos='${reposJson}' />\n`

      state.line = found ? nextLine + 1 : nextLine
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  )
}

import type MarkdownIt from 'markdown-it'

// Types

interface ParsedEntry {
  source: string
  metadata: string[]
}

interface ParsedSite {
  name: string
  entries: ParsedEntry[]
}

interface ParsedBlock {
  cornerLabel: string | null
  sites: ParsedSite[]
}

// Parser

function parseCornerLabel(info: string): string | null {
  const match = info.match(/\{([^}]*)\}/)
  return match ? match[1].trim() || null : null
}

function parseEntry(raw: string): ParsedEntry | null {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('(') || !trimmed.endsWith(')')) return null
  const inner = trimmed.slice(1, -1)
  const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
  if (parts.length === 0) return null
  const [source, ...metadata] = parts
  return { source, metadata }
}

function parseSiteRow(line: string): ParsedSite | null {
  const match = line.match(/^-\s+(.+)$/)
  if (!match) return null
  const rest = match[1]
  const colonIdx = rest.indexOf(':')
  if (colonIdx === -1) return null
  const siteName = rest.slice(0, colonIdx).trim()
  if (!siteName) return null
  const entryStr = rest.slice(colonIdx + 1).replace(/;\s*$/, '').trim()

  const rawEntries = entryStr
    .split(/\)\s*,\s*(?=\()/)
    .map(s => s.trim())
    .filter(Boolean)
    .map((s, i, arr) => (i < arr.length - 1 && !s.endsWith(')') ? s + ')' : s))

  const entries: ParsedEntry[] = []
  for (const raw of rawEntries) {
    const entry = parseEntry(raw)
    if (entry) entries.push(entry)
  }
  return { name: siteName, entries }
}

function parseBlock(info: string, body: string): ParsedBlock {
  const cornerLabel = parseCornerLabel(info)
  const sites: ParsedSite[] = []
  for (const line of body.split('\n')) {
    const site = parseSiteRow(line.trim())
    if (site) sites.push(site)
  }
  return { cornerLabel, sites }
}

// Code generator

function escStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function generateComponent(block: ParsedBlock): string {
  const sitesJson = JSON.stringify(
    block.sites.map(site => {
      const scrapes: Record<string, string | { name: string; metadata: string[] }> = {}
      for (const entry of site.entries) {
        const [playerName, ...tags] = entry.metadata
        if (!playerName) {
          scrapes[entry.source] = ""
        } else if (tags.length === 0) {
          scrapes[entry.source] = playerName
        } else {
          scrapes[entry.source] = { name: playerName, metadata: tags }
        }
      }
      return { name: site.name, scrapes }
    }),
    null,
    0,
  )

  const cornerProp = block.cornerLabel
    ? ` corner-label="${escStr(block.cornerLabel)}"`
    : ''

  return `<ScrapeTable${cornerProp} :sites='${sitesJson.replace(/'/g, "\\'")}' />\n`
}

// Plugin

export function scrapeTablePlugin(md: MarkdownIt): void {

  const MARKER = ':'
  const MIN_MARKERS = 3
  const NAME = 'scrapetable'

  md.block.ruler.before(
    'fence',
    'scrape_table',
    (state, startLine, endLine, silent) => {
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      let max = state.eMarks[startLine]

      // Count opening colons
      let markerCount = 0
      while (pos < max && state.src[pos] === MARKER) {
        pos++
        markerCount++
      }
      if (markerCount < MIN_MARKERS) return false

      // Must be followed by optional space then "scrapetable"
      const markup = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], pos)
      const params = state.src.slice(pos, max).trim()
      if (!params.toLowerCase().startsWith(NAME)) return false

      if (silent) return true

      // Find closing fence (same or more colons)
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

      // Collect body lines
      const bodyLines: string[] = []
      for (let i = startLine + 1; i < nextLine; i++) {
        bodyLines.push(state.src.slice(state.bMarks[i], state.eMarks[i]))
      }
      const body = bodyLines.join('\n')
      const block = parseBlock(params, body)

      const token = state.push('html_block', '', 0)
      token.map = [startLine, nextLine]
      token.content = generateComponent(block)

      state.line = found ? nextLine + 1 : nextLine
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  )
}
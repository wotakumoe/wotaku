import type MarkdownIt from 'markdown-it'

// Types

interface ParsedRepoVariant {
  label: string
  mangaUrl?: string
  animeUrl?: string
  novelUrl?: string
}

interface ParsedRepoRow {
  name: string
  indexUrl: string
  note?: string
  repoName?: string
  repoUrl?: string
  variants?: ParsedRepoVariant[]
}

interface ParsedRepoBuild {
  label: string
  raw?: string
}

interface ParsedRepoEntry {
  name: string
  url?: string
  src?: string
  raw?: string
  note?: string
  manga?: string
  anime?: string
  novel?: string
  // Arbitrary named sub-entries under a `-- Label` line (e.g. several unrelated forks
  // grouped under one row), as opposed to `manga`/`anime`/`novel` which are fixed content-
  // type variants of a single project (see buildVariants below).
  builds?: ParsedRepoBuild[]
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

const FIELD_KEYS = new Set(['url', 'src', 'raw', 'note', 'manga', 'anime', 'novel'])

function parseEntries(bodyLines: string[]): ParsedRepoEntry[] {
  const entries: ParsedRepoEntry[] = []
  let current: ParsedRepoEntry | null = null
  let currentBuild: ParsedRepoBuild | null = null

  for (const rawLine of bodyLines) {
    const line = rawLine.trim()
    if (!line) continue

    const headingMatch = line.match(/^==\s+(.+)$/)
    if (headingMatch) {
      if (current) entries.push(current)
      current = { name: headingMatch[1].trim() }
      currentBuild = null
      continue
    }

    const buildMatch = line.match(/^--\s+(.+)$/)
    if (buildMatch && current) {
      currentBuild = { label: buildMatch[1].trim() }
      current.builds ??= []
      current.builds.push(currentBuild)
      continue
    }

    const fieldMatch = line.match(/^-\s*([a-zA-Z]+)\s*:\s*(.+)$/)
    if (fieldMatch && current) {
      const key = fieldMatch[1].toLowerCase()
      const value = fieldMatch[2].trim()
      if (currentBuild) {
        if (key === 'raw') currentBuild.raw = value
        continue
      }
      if (FIELD_KEYS.has(key)) current[key as 'url' | 'src' | 'raw' | 'note' | 'manga' | 'anime' | 'novel'] = value
    }
  }
  if (current) entries.push(current)

  return entries
}

function nameMarkdown(entry: ParsedRepoEntry): string {
  const label = entry.url ? `[${entry.name}](${entry.url})` : entry.name
  return entry.src ? `${label} [:src:](${entry.src})` : label
}

function buildVariants(entry: ParsedRepoEntry): ParsedRepoVariant[] | undefined {
  const typeCount = [entry.manga, entry.anime, entry.novel].filter(Boolean).length
  if (typeCount === 0) return undefined

  const variants: ParsedRepoVariant[] = []
  if (typeCount > 1) {
    variants.push({ label: 'All-in-One', mangaUrl: entry.manga, animeUrl: entry.anime, novelUrl: entry.novel })
  }
  if (entry.manga) variants.push({ label: 'Manga', mangaUrl: entry.manga })
  if (entry.anime) variants.push({ label: 'Anime', animeUrl: entry.anime })
  if (entry.novel) variants.push({ label: 'Novel', novelUrl: entry.novel })
  return variants
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
        const name = md.renderInline(nameMarkdown(entry), state.env)
        const note = entry.note ? md.render(entry.note) : undefined

        // Grouped entries (e.g. several unrelated Kotatsu forks bundled under one row)
        // carry a list of arbitrary-labeled `-- Label` / `raw:` sub-entries. Reuses the
        // variant rendering (nested, independently collapsible rows) but with no
        // combined/"All-in-One" header, since these builds have nothing in common to combine.
        if (entry.builds?.length) {
          const groupVariants: ParsedRepoVariant[] = entry.builds
            .filter((b): b is Required<ParsedRepoBuild> => Boolean(b.raw))
            .map(b => ({ label: b.label, mangaUrl: b.raw }))
          if (groupVariants.length) {
            rows.push({ name, indexUrl: groupVariants[0].mangaUrl!, note, variants: groupVariants })
          }
          continue
        }

        // Multi-json entries (e.g. mangayomi) carry manga/anime/novel index urls instead
        // of a single `raw` field — they render as a nested list of install variants.
        const variants = buildVariants(entry)
        if (variants) {
          rows.push({
            name,
            indexUrl: entry.manga ?? entry.anime ?? entry.novel ?? '',
            note,
            repoName: entry.name,
            repoUrl: entry.url,
            variants
          })
          continue
        }

        if (!entry.raw) continue
        rows.push({ name, indexUrl: entry.raw, note })
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

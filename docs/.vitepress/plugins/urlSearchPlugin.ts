import matter from 'gray-matter'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderEmojiShortcodes } from '../configs/markdown/emoji'
import {
  getCollapsibleHeadingAnchor,
  getTabAnchor,
  getTabHeadingAnchor,
  getUniqueAnchor,
  parseTabLabel,
  slugifyAnchor,
  stripHeadingMarkup
} from '../utils/tabAnchors'

export interface PageLink {
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
  tabs?: string[]
  tables?: string[]
  mirror?: string
}

export interface TabTarget {
  pageId: string
  anchor: string
  tabs: string[]
}

interface PageSearchMetadata {
  links: PageLink[]
  tabTargets: TabTarget[]
}

interface TableMoreBlock {
  anchor: string
  startLine: number
  endLine: number
}

const isPipeLine = (line: string) => line.trim().startsWith('|')

function splitTableCells(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1)
  return s.split(/(?<!\\)\|/)
}

function isDelimiterRow(line: string): boolean {
  const cells = splitTableCells(line)
  return cells.length > 0 &&
    cells.every((cell) => /^:?-+:?$/.test(cell.trim()))
}

const isMoreMarker = (line: string) => /^<more\s*\/?>$/i.test(line.trim())

// Find `<more>` table blocks and their `data-table-more` anchors in
// document order, mirroring tableMorePlugin: the marker must directly
// follow a (delimiter-row) table and hidden rows must follow the marker.
function findTableMoreBlocks(lines: string[]): TableMoreBlock[] {
  const blocks: TableMoreBlock[] = []
  const n = lines.length
  let count = 0
  let i = 0

  while (i < n) {
    if (!isMoreMarker(lines[i])) {
      i++
      continue
    }
    // Walk back over blanks: must sit directly after a table run.
    let t = i - 1
    while (t >= 0 && lines[t].trim() === '') t--
    if (t < 0 || !isPipeLine(lines[t])) {
      i++
      continue
    }
    let runStart = t
    while (runStart - 1 >= 0 && isPipeLine(lines[runStart - 1])) runStart--
    let hasDelimiter = false
    for (let k = runStart; k <= t; k++) {
      if (isDelimiterRow(lines[k])) {
        hasDelimiter = true
        break
      }
    }
    if (!hasDelimiter) {
      i++
      continue
    }
    // Hidden rows after the marker: bare pipe lines or a full table.
    let h = i + 1
    while (h < n && lines[h].trim() === '') h++
    let hiddenEnd = -1
    if (h < n && isPipeLine(lines[h])) {
      if (
        h + 1 < n && isPipeLine(lines[h + 1]) && isDelimiterRow(lines[h + 1])
      ) {
        // Full second table: needs at least one body row.
        if (h + 2 < n && isPipeLine(lines[h + 2])) {
          let e = h + 2
          while (e + 1 < n && isPipeLine(lines[e + 1])) e++
          hiddenEnd = e
        }
      } else {
        let e = h
        while (e + 1 < n && isPipeLine(lines[e + 1])) e++
        hiddenEnd = e
      }
    }
    if (hiddenEnd === -1) {
      i++
      continue
    }
    blocks.push({ anchor: String(count++), startLine: runStart, endLine: hiddenEnd })
    i = hiddenEnd + 1
  }

  return blocks
}

function extractSearchMetadataFromMarkdown(
  src: string,
  pageId: string
): PageSearchMetadata {
  const links: PageLink[] = []
  const seenLinks = new Map<string, PageLink>()
  const tabTargets = new Map<string, TabTarget>()
  const headingStack: string[] = []
  const slugCounts = new Map<string, number>()
  const tabAnchorCounts = new Map<string, number>()
  const collapsibleAnchorCounts = new Map<string, number>()
  const containerStack: string[] = []
  const tabPath: string[] = []
  const tabResetStack: {
    anchor: string
    headings: string[]
  }[] = []
  const collapsibleStack: {
    anchor: string
    headings: string[]
  }[] = []
  let currentAnchor = ''
  let extrepoEntryName: string | null = null

  const mirrorCache = new Map<
    string,
    { src: string; mirrors: string[]; title: string } | null
  >()

  const getMirrorUrls = (id: string) => {
    if (mirrorCache.has(id)) return mirrorCache.get(id)
    // Direct URL form: ==m:https://example.com/== (no mirror file needed)
    if (/^https?:\/\/\S+$/i.test(id)) {
      let title = id
      try {
        title = new URL(id).hostname.replace(/^www\./i, '')
      } catch {
        /* keep raw */
      }
      const entry = { src: id, mirrors: [] as string[], title }
      mirrorCache.set(id, entry)
      return entry
    }
    try {
      const filePath = join(
        process.cwd(),
        'docs/.vitepress/mirrors',
        `${id}.md`
      )
      if (!existsSync(filePath)) {
        mirrorCache.set(id, null)
        return null
      }
      const fileContent = readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      const src = typeof data.src === 'string' ? data.src.trim() : ''
      const title = typeof data.title === 'string' && data.title.trim()
        ? data.title.trim()
        : id
      const urls: string[] = []
      const seen = new Set<string>()
      for (const m of content.matchAll(/https?:\/\/[^\s<>"')\]]+/g)) {
        const url = m[0].replace(/[.,;:!?]+$/, '')
        if (!seen.has(url) && url !== src) {
          seen.add(url)
          urls.push(url)
        }
      }
      const entry = { src, mirrors: urls, title }
      mirrorCache.set(id, entry)
      return entry
    } catch {
      mirrorCache.set(id, null)
      return null
    }
  }

  const getMirrorMainLabel = (line: string, fallback: string) => {
    const linkRE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g
    let m: RegExpExecArray | null
    while ((m = linkRE.exec(line)) !== null) {
      const label = m[1].trim()
      if (!label || /^:.*:$/.test(label)) continue
      return renderEmojiShortcodes(label)
    }
    return fallback
  }

  const body = src.startsWith('---')
    ? src.replace(/^---[\s\S]*?---\n?/, '')
    : src
  const lines = body.split('\n')

  const getAnchor = (text: string) => {
    const slug = slugifyAnchor(text)
    const count = slugCounts.get(slug) ?? 0
    slugCounts.set(slug, count + 1)
    return count === 0 ? slug : `${slug}-${count}`
  }

  const getCurrentTabPath = () => tabPath.filter(Boolean)

  const recordTabTarget = (anchor: string) => {
    const tabs = getCurrentTabPath()
    if (!anchor || !tabs.length) return
    tabTargets.set(anchor, { pageId, anchor, tabs })
  }

  const setHeading = (level: number, text: string, anchor?: string) => {
    const title = stripHeadingMarkup(text)
    if (!title) return

    headingStack[level] = title
    headingStack.length = level + 1
    currentAnchor = anchor || getAnchor(title)
    recordTabTarget(currentAnchor)
  }

  const getTitles = () => headingStack.filter(Boolean)

  const restoreHeadingState = (state: {
    anchor: string
    headings: string[]
  }) => {
    currentAnchor = state.anchor
    headingStack.length = 0
    headingStack.push(...state.headings)
  }

  const getTabsDepth = () =>
    containerStack.filter((name) => name === 'tabs').length

  // Mirror-part-1 helper: table-more (`<more>`) blocks in document order.
  // Anchor numbers must match the renderer's `data-table-more` counter,
  // which stamps qualifying blocks sequentially in a single page render.
  const tableMoreBlocks = findTableMoreBlocks(lines)

  const tablesForLine = (idx: number): string[] => {
    const out: string[] = []
    for (const block of tableMoreBlocks) {
      if (idx >= block.startLine && idx <= block.endLine) out.push(block.anchor)
    }
    return out
  }

  const pushLink = (
    href: string,
    linkText: string,
    lineIdx: number,
    extra?: { mirror?: string }
  ) => {
    const tabs = getCurrentTabPath()
    const tables = tablesForLine(lineIdx)
    const key = [
      href,
      currentAnchor,
      tabs.join('/')
    ].join('\x00')
    const existing = seenLinks.get(key)
    if (existing) {
      if (tables.length) {
        const merged = [...existing.tables ?? []]
        for (const anchor of tables) {
          if (!merged.includes(anchor)) merged.push(anchor)
        }
        existing.tables = merged
      }
      if (extra?.mirror && !existing.mirror) existing.mirror = extra.mirror
      return
    }

    const link: PageLink = {
      href,
      linkText,
      pageId,
      anchor: currentAnchor,
      titles: getTitles(),
      ...(tabs.length ? { tabs } : {}),
      ...(tables.length ? { tables } : {}),
      ...(extra?.mirror ? { mirror: extra.mirror } : {})
    }
    seenLinks.set(key, link)
    links.push(link)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const containerOpenMatch = line.match(/^\s*:{3,}\s*([A-Za-z][\w-]*)\b/)
    if (containerOpenMatch) {
      const containerName = containerOpenMatch[1].toLowerCase()
      containerStack.push(containerName)
      if (containerName === 'tabs') {
        tabResetStack.push({
          anchor: currentAnchor,
          headings: [...headingStack]
        })
      }
    } else if (/^\s*:{3,}\s*$/.test(line)) {
      const closed = containerStack.pop()
      if (closed === 'tabs') {
        tabPath.length = getTabsDepth()
        const resetState = tabResetStack.pop()
        if (resetState) restoreHeadingState(resetState)
      } else if (closed === 'extrepo') {
        extrepoEntryName = null
      }
    }

    if (
      containerStack.includes('extrepo') && !containerStack.includes('tabs')
    ) {
      const extrepoHeadingMatch = line.match(/^\s*==\s+(.+)$/)
      if (extrepoHeadingMatch) {
        extrepoEntryName = extrepoHeadingMatch[1].trim()
        continue
      }

      if (extrepoEntryName) {
        const fieldMatch = line.match(
          /^\s*-\s*(?:url|raw|src|manga|anime|novel)\s*:\s*(\S+)/
        )
        if (fieldMatch) {
          pushLink(fieldMatch[1].trim(), extrepoEntryName, i)
          continue
        }
      }
    }

    const tabMatch = line.match(/^\s*==\s+(.+)$/)
    if (tabMatch && containerStack.includes('tabs')) {
      const rawTitle = tabMatch[1]
      const parsed = parseTabLabel(rawTitle)
      if (parsed.label) {
        const depth = getTabsDepth()
        const anchor = getTabAnchor(rawTitle, tabAnchorCounts)
        const headingAnchor = getTabHeadingAnchor(anchor)
        tabPath[depth - 1] = anchor
        tabPath.length = depth

        // The markdown renderer injects a hidden H3 for each tab label.
        // Mirror that heading so search can deep-link to the selected tab.
        setHeading(2, parsed.label, headingAnchor)
      }
      continue
    }

    const collapsibleMatch = line.match(
      /^\s*<Collapsible\b(?=[^>]*\btitle=(['"])(.*?)\1)[^>]*>\s*$/i
    )
    if (collapsibleMatch) {
      collapsibleStack.push({
        anchor: currentAnchor,
        headings: [...headingStack]
      })

      const parsed = parseTabLabel(collapsibleMatch[2])
      const collapsibleAnchor = parsed.anchor ||
        getUniqueAnchor(parsed.label, collapsibleAnchorCounts)

      let nextLine = i + 1
      while (nextLine < lines.length && lines[nextLine].trim() === '') {
        nextLine++
      }

      // The markdown renderer injects searchable headings for collapsibles
      // that don't already start with a heading. Mirror that anchor so URL
      // search can deep-link into and auto-open those collapsibles.
      if (!/^#{1,6}\s+/.test(lines[nextLine]?.trim() ?? '')) {
        setHeading(
          containerStack.includes('tabs') ? 3 : 2,
          parsed.label,
          getCollapsibleHeadingAnchor(collapsibleAnchor)
        )
      }
      continue
    }

    if (/^\s*<\/Collapsible>\s*$/i.test(line)) {
      const previous = collapsibleStack.pop()
      if (previous) restoreHeadingState(previous)
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length - 1
      setHeading(level, headingMatch[2].trim())
      continue
    }

    const linkRE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g
    let m: RegExpExecArray | null
    while ((m = linkRE.exec(line)) !== null) {
      pushLink(m[2].trim(), renderEmojiShortcodes(m[1].trim()), i)
    }

    const bareRE = /<(https?:\/\/[^>]+)>/g
    while ((m = bareRE.exec(line)) !== null) {
      const href = m[1].trim()
      pushLink(href, href, i)
    }

    const mirrorRE = /==m:(.+?)==/g
    let pm: RegExpExecArray | null
    while ((pm = mirrorRE.exec(line)) !== null) {
      const id = pm[1].trim()
      if (!id) continue
      const mirror = getMirrorUrls(id)
      if (!mirror) continue
      const label = getMirrorMainLabel(line, mirror.title)
      for (const href of [mirror.src, ...mirror.mirrors]) {
        if (!href) continue
        pushLink(href.trim(), label, i, { mirror: id })
      }
    }
  }

  return { links, tabTargets: [...tabTargets.values()] }
}

const collectedByPage = new Map<string, PageSearchMetadata>()

function getPageId(page: string) {
  return '/' + page.replace(/\.md$/, '').replace(/\/index$/, '/')
}

function getDedupedLinks() {
  const seen = new Map<string, number>()
  const deduped: PageLink[] = []

  for (const metadata of collectedByPage.values()) {
    for (const link of metadata.links) {
      const key = [
        link.href,
        link.pageId,
        link.anchor,
        link.tabs?.join('/') ?? '',
        link.tables?.join('/') ?? ''
      ].join('\x00')
      const idx = seen.get(key)
      if (idx !== undefined) {
        // Keep the mirror-tagged entry so the indicator survives.
        if (link.mirror && !deduped[idx].mirror) deduped[idx] = link
        continue
      }
      seen.set(key, deduped.length)
      deduped.push(link)
    }
  }

  return deduped
}

function getDedupedTabTargets() {
  const seen = new Set<string>()
  const deduped: TabTarget[] = []

  for (const metadata of collectedByPage.values()) {
    for (const target of metadata.tabTargets) {
      const key = [
        target.pageId,
        target.anchor,
        target.tabs.join('/')
      ].join('\x00')
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(target)
    }
  }

  return deduped
}

export function collectPageLinks(src: string, page: string) {
  const pageId = getPageId(page)
  collectedByPage.set(pageId, extractSearchMetadataFromMarkdown(src, pageId))
}

export function writeUrlSearchIndex(outDir: string) {
  const links = getDedupedLinks()
  const linksPath = join(outDir, 'url-search-index.json')
  writeFileSync(linksPath, JSON.stringify(links), 'utf-8')
  console.log(`[url-search] wrote ${links.length} links -> ${linksPath}`)

  const tabTargets = getDedupedTabTargets()
  const tabTargetsPath = join(outDir, 'tab-search-index.json')
  writeFileSync(tabTargetsPath, JSON.stringify(tabTargets), 'utf-8')
  console.log(
    `[url-search] wrote ${tabTargets.length} tab targets -> ${tabTargetsPath}`
  )
}

export function urlSearchDevPlugin() {
  return {
    name: 'url-search-dev',
    configureServer(server: any) {
      server.middlewares.use(
        '/url-search-index.json',
        (_req: any, res: any) => {
          const deduped = getDedupedLinks()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(deduped))
        }
      )
      server.middlewares.use(
        '/tab-search-index.json',
        (_req: any, res: any) => {
          const deduped = getDedupedTabTargets()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(deduped))
        }
      )
    }
  }
}

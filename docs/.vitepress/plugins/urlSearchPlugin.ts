import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderEmojiShortcodes } from '../configs/markdown/emoji'
import {
  getTabAnchor,
  getTabHeadingAnchor,
  parseTabLabel,
  slugifyAnchor,
  stripHeadingMarkup
} from '../utils/tabAnchors'

export interface PageLink {
  objectID: string
  id: string
  href: string
  hrefSearch: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
  tabs?: string[]
}

export interface TabTarget {
  pageId: string
  anchor: string
  tabs: string[]
}

export interface PageSearchDocument {
  objectID: string
  id: string
  pageId: string
  anchor: string
  title: string
  titles: string[]
  text: string
  sectionOrder: number
  tabs?: string[]
}

interface PageSearchMetadata {
  documents: PageSearchDocument[]
  links: PageLink[]
  tabTargets: TabTarget[]
}

function extractSearchMetadataFromMarkdown(
  src: string,
  pageId: string,
  html = ''
): PageSearchMetadata {
  const links: PageLink[] = []
  const seenLinks = new Set<string>()
  const tabTargets = new Map<string, TabTarget>()
  const headingStack: string[] = []
  const slugCounts = new Map<string, number>()
  const tabAnchorCounts = new Map<string, number>()
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

  const pushLink = (href: string, linkText: string) => {
    const tabs = getCurrentTabPath()
    const key = [
      href,
      currentAnchor,
      tabs.join('/')
    ].join('\x00')
    if (seenLinks.has(key)) return

    seenLinks.add(key)
    links.push({
      objectID: createObjectID([pageId, key].join('\x00')),
      id: createLinkId(pageId, currentAnchor, href, tabs),
      href,
      hrefSearch: getSearchableUrl(href),
      linkText,
      pageId,
      anchor: currentAnchor,
      titles: getTitles(),
      ...(tabs.length ? { tabs } : {})
    })
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
          collapsibleMatch[2].trim()
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
      pushLink(m[2].trim(), renderEmojiShortcodes(m[1].trim()))
    }

    const bareRE = /<(https?:\/\/[^>]+)>/g
    while ((m = bareRE.exec(line)) !== null) {
      const href = m[1].trim()
      pushLink(href, href)
    }
  }

  return {
    documents: extractSearchDocumentsFromHtml(
      html,
      pageId,
      tabTargets
    ),
    links,
    tabTargets: [...tabTargets.values()]
  }
}

const collectedByPage = new Map<string, PageSearchMetadata>()

function getPageId(page: string) {
  return '/' + page.replace(/\.md$/, '').replace(/\/index$/, '/')
}

function createLinkId(
  pageId: string,
  anchor: string,
  href: string,
  tabs: string[]
) {
  return encodeURIComponent([
    pageId,
    anchor,
    href,
    tabs.join('/')
  ].join('\x00'))
}

function createObjectID(value: string) {
  const normalized = value
    .replace(/[^\dA-Za-z_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 420)
  return `${normalized || 'doc'}_${getStableHash(value)}`
}

function getStableHash(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function getSearchableUrl(value: string) {
  return decodeURIComponent(value)
    .replace(/^https?:\/\//i, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const headingRegex = /<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi
const headingContentRegex = /(.*)<a.*? href="#(.*?)".*?>.*?<\/a>/i

function clearHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, '')
}

function extractSearchDocumentsFromHtml(
  html: string,
  pageId: string,
  tabTargets: Map<string, TabTarget>
) {
  const documents: PageSearchDocument[] = []
  if (!html) return documents

  const result = html.split(headingRegex)
  result.shift()

  let parentTitles: string[] = []
  let sectionOrder = 0
  for (let i = 0; i < result.length; i += 3) {
    const level = Number.parseInt(result[i]) - 1
    const heading = result[i + 1]
    const headingResult = headingContentRegex.exec(heading)
    const title = clearHtmlTags(headingResult?.[1] ?? '').trim()
    const anchor = headingResult?.[2] ?? ''
    const text = clearHtmlTags(result[i + 2] ?? '').trim()
    if (!title || !text) continue

    let titles = parentTitles.slice(0, level)
    titles[level] = title
    titles = titles.filter(Boolean)

    const tabs = tabTargets.get(anchor)?.tabs
    documents.push({
      objectID: createObjectID(anchor ? `${pageId}#${anchor}` : pageId),
      id: anchor ? `${pageId}#${anchor}` : pageId,
      pageId: pageId.replace(/\/$/, ''),
      anchor,
      title: titles.at(-1) ?? title,
      titles: titles.slice(0, -1),
      text,
      sectionOrder: sectionOrder++,
      ...(tabs?.length ? { tabs } : {})
    })

    if (level === 0) {
      parentTitles = [title]
    } else {
      parentTitles[level] = title
    }
  }

  return documents
}

function getDedupedLinks() {
  const seen = new Set<string>()
  const deduped: PageLink[] = []

  for (const metadata of collectedByPage.values()) {
    for (const link of metadata.links) {
      const key = [
        link.href,
        link.pageId,
        link.anchor,
        link.tabs?.join('/') ?? ''
      ].join('\x00')
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(link)
    }
  }

  return deduped
}

function getDedupedSearchDocuments() {
  const seen = new Set<string>()
  const deduped: PageSearchDocument[] = []

  for (const metadata of collectedByPage.values()) {
    for (const document of metadata.documents) {
      if (seen.has(document.id)) continue
      seen.add(document.id)
      deduped.push(document)
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

export function collectPageSearchMetadata(
  src: string,
  page: string,
  html: string
) {
  const pageId = getPageId(page)
  collectedByPage.set(
    pageId,
    extractSearchMetadataFromMarkdown(src, pageId, html)
  )
}

export function clearSearchMetadata() {
  collectedByPage.clear()
}

export function getSearchDocuments() {
  return getDedupedSearchDocuments()
}

export function getSearchLinks() {
  return getDedupedLinks()
}

export function getSearchTabTargets() {
  return getDedupedTabTargets()
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

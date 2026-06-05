import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderEmojiShortcodes } from '../configs/markdown/emoji'

export interface PageLink {
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
}

function extractLinksFromMarkdown(src: string, pageId: string): PageLink[] {
  const results: PageLink[] = []
  const seen = new Set<string>()
  const headingStack: string[] = []
  const slugCounts = new Map<string, number>()
  const collapsibleStack: {
    anchor: string
    headings: string[]
  }[] = []
  let currentAnchor = ''

  // Strip frontmatter
  const body = src.startsWith('---')
    ? src.replace(/^---[\s\S]*?---\n?/, '')
    : src
  const lines = body.split('\n')

  const slugify = (value: string) =>
    value
      .replace(/\{[^}]*\}\s*$/, '')
      .replace(/<[^>]*>/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const getAnchor = (text: string) => {
    const slug = slugify(text)
    const count = slugCounts.get(slug) ?? 0
    slugCounts.set(slug, count + 1)
    return count === 0 ? slug : `${slug}-${count}`
  }

  const setHeading = (level: number, text: string) => {
    headingStack[level] = text
    headingStack.length = level + 1
    currentAnchor = getAnchor(text)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

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

      // The markdown renderer injects a searchable H3 for collapsibles that
      // don't already start with a heading. Mirror that anchor so URL search
      // can deep-link into and auto-open those collapsibles.
      if (!/^#{1,6}\s+/.test(lines[nextLine]?.trim() ?? '')) {
        setHeading(2, collapsibleMatch[2].trim())
      }
      continue
    }

    if (/^\s*<\/Collapsible>\s*$/i.test(line)) {
      const previous = collapsibleStack.pop()
      if (previous) {
        currentAnchor = previous.anchor
        headingStack.length = 0
        headingStack.push(...previous.headings)
      }
      continue
    }

    // Heading: ## Title or === Title (setext-style ignored, ATX only)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length - 1
      const text = headingMatch[2].trim()
      setHeading(level, text)
      continue
    }

    // Markdown links: [text](https://...)
    const linkRE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g
    let m: RegExpExecArray | null
    while ((m = linkRE.exec(line)) !== null) {
      const linkText = renderEmojiShortcodes(m[1].trim())
      const href = m[2].trim()
      const key = href + '\x00' + currentAnchor
      if (seen.has(key)) continue
      seen.add(key)
      results.push({
        href,
        linkText,
        pageId,
        anchor: currentAnchor,
        titles: headingStack.filter(Boolean)
      })
    }

    // Bare angle-bracket URLs: <https://...>
    const bareRE = /<(https?:\/\/[^>]+)>/g
    while ((m = bareRE.exec(line)) !== null) {
      const href = m[1].trim()
      const key = href + '\x00' + currentAnchor
      if (seen.has(key)) continue
      seen.add(key)
      results.push({
        href,
        linkText: href,
        pageId,
        anchor: currentAnchor,
        titles: headingStack.filter(Boolean)
      })
    }
  }

  return results
}

const collectedByPage = new Map<string, PageLink[]>()

function getPageId(page: string) {
  return '/' + page.replace(/\.md$/, '').replace(/\/index$/, '/')
}

function getDedupedLinks() {
  const seen = new Set<string>()
  const deduped: PageLink[] = []

  for (const links of collectedByPage.values()) {
    for (const link of links) {
      const key = link.href + '\x00' + link.pageId + '\x00' + link.anchor
      if (seen.has(key)) continue
      seen.add(key)
      deduped.push(link)
    }
  }

  return deduped
}

export function collectPageLinks(src: string, page: string) {
  const pageId = getPageId(page)
  collectedByPage.set(pageId, extractLinksFromMarkdown(src, pageId))
}

export function writeUrlSearchIndex(outDir: string) {
  const deduped = getDedupedLinks()
  const outPath = join(outDir, 'url-search-index.json')
  writeFileSync(outPath, JSON.stringify(deduped), 'utf-8')
  console.log(`[url-search] wrote ${deduped.length} links → ${outPath}`)
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
    }
  }
}

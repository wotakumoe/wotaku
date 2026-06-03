import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

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
  let currentAnchor = ''

  // Strip frontmatter
  const body = src.startsWith('---')
    ? src.replace(/^---[\s\S]*?---\n?/, '')
    : src

  for (const line of body.split('\n')) {
    // Heading: ## Title or === Title (setext-style ignored, ATX only)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length - 1
      const text = headingMatch[2].trim()
      headingStack[level] = text
      headingStack.length = level + 1
      // Derive anchor the same way VitePress does: lowercase, spaces→hyphens, strip non-word
      currentAnchor = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      continue
    }

    // Markdown links: [text](https://...)
    const linkRE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g
    let m: RegExpExecArray | null
    while ((m = linkRE.exec(line)) !== null) {
      const linkText = m[1].trim()
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

const collected: PageLink[] = []

export function collectPageLinks(src: string, page: string) {
  const pageId = '/' + page.replace(/\.md$/, '').replace(/\/index$/, '/')
  collected.push(...extractLinksFromMarkdown(src, pageId))
}

export function writeUrlSearchIndex(outDir: string) {
  const seen = new Set<string>()
  const deduped = collected.filter((l) => {
    const key = l.href + '\x00' + l.pageId + '\x00' + l.anchor
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const outPath = join(outDir, 'url-search-index.json')
  writeFileSync(outPath, JSON.stringify(deduped), 'utf-8')
  console.log(`[url-search] wrote ${deduped.length} links → ${outPath}`)
}

export function urlSearchDevPlugin() {
  return {
    name: 'url-search-dev',
    configureServer(server: any) {
      server.middlewares.use('/url-search-index.json', (_req: any, res: any) => {
        const seen = new Set<string>()
        const deduped = collected.filter((l) => {
          const key = l.href + '\x00' + l.pageId + '\x00' + l.anchor
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(deduped))
      })
    }
  }
}
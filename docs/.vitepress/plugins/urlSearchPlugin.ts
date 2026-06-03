import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export interface PageLink {
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractLinks(html: string, pageId: string): PageLink[] {
  const results: PageLink[] = []
  const seen = new Set<string>()
  const headingStack: string[] = []
  let currentAnchor = ''

  const tagRE = /<(h[1-6]|a)\b([^>]*)>([^<]*)/gi
  let m: RegExpExecArray | null

  while ((m = tagRE.exec(html)) !== null) {
    const [, tag, attrs, text] = m
    const tagLower = tag.toLowerCase()

    if (/^h[1-6]$/.test(tagLower)) {
      const level = parseInt(tagLower[1]) - 1
      const idMatch = attrs.match(/\bid=["']([^"']*)["']/)
      if (idMatch) currentAnchor = idMatch[1]
      const rest = html.slice(tagRE.lastIndex)
      const closeIdx = rest.search(new RegExp(`</${tagLower}>`, 'i'))
      const headingHtml = text + (closeIdx >= 0 ? rest.slice(0, closeIdx) : '')
      headingStack[level] = decodeEntities(stripTags(headingHtml))
      headingStack.length = level + 1
      continue
    }

    if (tagLower === 'a') {
      const hrefMatch = attrs.match(/\bhref=["']([^"']*)["']/)
      if (!hrefMatch) continue
      const href = decodeEntities(hrefMatch[1])
      if (!/^https?:\/\//i.test(href)) continue
      const key = href + '\x00' + currentAnchor
      if (seen.has(key)) continue
      seen.add(key)
      const rest = html.slice(tagRE.lastIndex)
      const closeIdx = rest.search(/<\/a>/i)
      const linkHtml = text + (closeIdx >= 0 ? rest.slice(0, closeIdx) : '')
      results.push({
        href,
        linkText: decodeEntities(stripTags(linkHtml)),
        pageId,
        anchor: currentAnchor,
        titles: headingStack.filter(Boolean)
      })
    }
  }

  return results
}

const collected: PageLink[] = []

export function collectPageLinks(html: string, page: string) {
  // page is like "anime/watching.md" (relative to srcDir)
  const pageId = '/' + page.replace(/\.md$/, '').replace(/\/index$/, '/')
  collected.push(...extractLinks(html, pageId))
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
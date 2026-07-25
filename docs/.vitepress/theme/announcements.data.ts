import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

export type AnnouncementType = 'section' | 'component' | 'improvement'

export interface Announcement {
  id: string
  type: AnnouncementType
  title: string
  html: string
  link?: string // section type only
}

const THEME_DIR = dirname(fileURLToPath(import.meta.url))
const POST_DIR = join(THEME_DIR, '../post')

const VALID_TYPES: AnnouncementType[] = ['section', 'component', 'improvement']

const md = MarkdownIt({ html: true, linkify: true, breaks: false })

function orderOf(id: string): number {
  const m = id.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

function normalizeType(raw: unknown): AnnouncementType {
  const value = String(raw ?? '').toLowerCase()
  return (VALID_TYPES as string[]).includes(value)
    ? (value as AnnouncementType)
    : 'improvement'
}

function loadAnnouncements(): Announcement[] {
  let files: string[] = []
  try {
    files = readdirSync(POST_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  // highest number first (files numbered "1. name.md" with 1 = oldest)
  files.sort((a, b) => orderOf(b) - orderOf(a))

  return files.map((file) => {
    const raw = readFileSync(join(POST_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    // strip the "N. " prefix so read-state survives renumbering
    const id = file.replace(/\.md$/, '').replace(/^\d+\.\s*/, '')
    return {
      id,
      type: normalizeType(data.type),
      title: String(data.title ?? id),
      html: md.render(content),
      link: data.link ? String(data.link) : undefined
    }
  })
}

export declare const data: Announcement[]

export default {
  watch: ['../post/*.md'],
  load(): Announcement[] {
    return loadAnnouncements()
  }
}

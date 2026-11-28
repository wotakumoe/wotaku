/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import matter from 'gray-matter'
import { MarkdownExit } from 'markdown-exit'
import { contentRoot } from '../paths.ts'

export type AnnouncementType = 'section' | 'component' | 'improvement'

export interface Announcement {
  id: string
  type: AnnouncementType
  title: string
  html: string
  link?: string // section type only
}

const POST_DIR = join(contentRoot, 'post')

const VALID_TYPES: AnnouncementType[] = ['section', 'component', 'improvement']

const md = new MarkdownExit({ html: true, linkify: true, breaks: false })

function orderOf(id: string): number {
  const m = id.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

function normalizeType(raw: unknown): AnnouncementType {
  const value = typeof raw === 'string' ? raw.toLowerCase() : ''
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
  watch: [join(POST_DIR, '*.md')],
  load(): Announcement[] {
    return loadAnnouncements()
  }
}

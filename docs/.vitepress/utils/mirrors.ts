/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import matter from 'gray-matter'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, resolve } from 'pathe'

export interface MirrorData {
  id: string
  title: string
  src: string
  mirrors: string[]
  note: string
  noteType: string
  frontmatter: Record<string, string>
  content: string
}

const NOTE_TYPE_KEYS = ['danger', 'warning', 'tip', 'info'] as const

const URL_RE = /https?:\/\/[^\s<>"')\]]+/g

export function extractUrls(text: string): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const m of text.matchAll(URL_RE)) {
    const url = m[0].replace(/[.,;:!?]+$/, '')
    if (!seen.has(url)) {
      seen.add(url)
      out.push(url)
    }
  }
  return out
}

let mirrorsCache: MirrorData[] | null = null

export function loadMirrors(): MirrorData[] {
  if (mirrorsCache) return mirrorsCache

  const mirrorsDir = resolve(process.cwd(), 'docs/.vitepress/mirrors')
  const mirrors: MirrorData[] = []

  try {
    const files = readdirSync(mirrorsDir).filter((file) => file.endsWith('.md'))

    for (const file of files) {
      const filePath = join(mirrorsDir, file)
      const fileContent = readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      const id = basename(file, '.md')
      const src = typeof data.src === 'string' ? data.src.trim() : ''
      const title = typeof data.title === 'string' && data.title.trim()
        ? data.title.trim()
        : id
      const noteEntry = NOTE_TYPE_KEYS.map((t) => ({
        type: t,
        value: (data as Record<string, unknown>)[t]
      })).find((e) => typeof e.value === 'string' && e.value.trim())
      const note = noteEntry ? (noteEntry.value as string).trim() : ''
      const noteType = noteEntry ? noteEntry.type : 'warning'
      const cleanContent = content.trim()
      const mirrorsList = extractUrls(cleanContent).filter((u) => u !== src)

      mirrors.push({
        id,
        title,
        src,
        mirrors: mirrorsList,
        note,
        noteType,
        frontmatter: data as Record<string, string>,
        content: cleanContent
      })
    }
  } catch (error) {
    console.warn('Failed to load mirrors:', error)
  }

  mirrorsCache = mirrors
  return mirrors
}

export function getMirror(id: string): MirrorData | undefined {
  const mirrors = loadMirrors()
  return mirrors.find((mirror) => mirror.id === id)
}

export const mirrors = loadMirrors()

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseExtRepoAttrs } from './attrs'
import { assembleSchemeData, type ExtensionRepoData } from './parsers'

export type { ExtensionRepoData } from './parsers'

const IGNORED_DIRS = new Set(['node_modules', '.vitepress', '.git'])
const FETCH_TIMEOUT_MS = 15000
const CACHE_TTL_MS = 6 * 60 * 60 * 1000

const EXT_DIR = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = join(EXT_DIR, '..', '..')
const CACHE_DIR = join(EXT_DIR, '..', '..', '.vitepress/cache/extension-repos')
let cacheDirReady = false

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...findMarkdownFiles(join(dir, entry.name)))
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(join(dir, entry.name))
    }
  }
  return files
}

// Single scan of all md files, collecting urls for one scheme only.
function collectScheme(
  scheme: string
): { indexUrls: string[]; listUrls: string[] } {
  const indexUrls = new Set<string>()
  const listUrls = new Set<string>()
  const blockRe = /:::\s*extrepo([^\n]*)\n([\s\S]*?)\n\s*:::/g
  const rowRe =
    /^\s*-\s*(raw|manga|anime|novel|data)\s*:\s*(https?:\/\/\S+)\s*$/i
  const headingRe = /^\s*==\s+.+$/
  const buildRe = /^\s*--\s+.+$/

  function flushEntry(
    plainRaws: string[],
    variantUrls: string[],
    buildRaws: string[],
    dataUrls: string[]
  ): void {
    for (const url of variantUrls) indexUrls.add(url)
    for (const url of buildRaws) indexUrls.add(url)
    for (const url of dataUrls) indexUrls.add(url)
    if (dataUrls.length === 0) {
      for (const url of plainRaws) indexUrls.add(url)
    }
  }

  for (const file of findMarkdownFiles(DOCS_DIR)) {
    const src = readFileSync(file, 'utf-8')
    let block: RegExpExecArray | null
    blockRe.lastIndex = 0
    while ((block = blockRe.exec(src))) {
      const headerAttrs = parseBlockAttrs(block[1])
      if ((headerAttrs.scheme || 'mihon') !== scheme) continue
      if (headerAttrs.from) listUrls.add(headerAttrs.from)
      let plainRaws: string[] = []
      let variantUrls: string[] = []
      let buildRaws: string[] = []
      let dataUrls: string[] = []
      let inEntry = false
      let inBuild = false
      for (const line of block[2].split('\n')) {
        if (headingRe.test(line)) {
          if (inEntry) flushEntry(plainRaws, variantUrls, buildRaws, dataUrls)
          plainRaws = []
          variantUrls = []
          buildRaws = []
          dataUrls = []
          inEntry = true
          inBuild = false
          continue
        }
        if (buildRe.test(line)) {
          inBuild = true
          continue
        }
        const row = rowRe.exec(line)
        if (row && inEntry) {
          const key = row[1].toLowerCase()
          const url = row[2].trim()
          if (key === 'data') dataUrls.push(url)
          else if (key === 'raw') (inBuild ? buildRaws : plainRaws).push(url)
          else variantUrls.push(url)
        }
      }
      if (inEntry) flushEntry(plainRaws, variantUrls, buildRaws, dataUrls)
    }
  }
  return { indexUrls: [...indexUrls], listUrls: [...listUrls] }
}

function parseBlockAttrs(header: string): { scheme?: string; from?: string } {
  const attrs = parseExtRepoAttrs(header)
  return { scheme: attrs.scheme, from: attrs.from }
}

function cachePathFor(url: string): string {
  return join(CACHE_DIR, `${Buffer.from(url).toString('base64url')}.json`)
}

const inflight = new Map<string, Promise<unknown>>()

async function fetchOnce(url: string): Promise<unknown> {
  const cachePath = cachePathFor(url)
  if (
    existsSync(cachePath) &&
    Date.now() - statSync(cachePath).mtimeMs < CACHE_TTL_MS
  ) {
    return JSON.parse(readFileSync(cachePath, 'utf-8'))
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const json = await res.json()
    if (!cacheDirReady) {
      mkdirSync(CACHE_DIR, { recursive: true })
      cacheDirReady = true
    }
    const tmp = `${cachePath}.${process.pid}.tmp`
    writeFileSync(tmp, JSON.stringify(json))
    renameSync(tmp, cachePath)
    return json
  } finally {
    clearTimeout(timer)
  }
}

function fetchIndex(url: string): Promise<unknown> {
  const hit = inflight.get(url)
  if (hit) return hit
  const p = (async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await fetchOnce(url)
      } catch (err) {
        if (attempt === 1) {
          const cachePath = cachePathFor(url)
          if (existsSync(cachePath)) {
            return JSON.parse(readFileSync(cachePath, 'utf-8'))
          }
          console.warn(
            `[extrepo] failed to fetch ${url}: ${(err as Error).message}`
          )
          return []
        }
      }
    }
  })() as Promise<unknown>
  inflight.set(url, p)
  return p
}

export async function loadScheme(
  scheme: string
): Promise<ExtensionRepoData> {
  const { indexUrls, listUrls } = collectScheme(scheme)
  return assembleSchemeData(indexUrls, listUrls, fetchIndex)
}

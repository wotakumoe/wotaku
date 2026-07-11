import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const IGNORED_DIRS = new Set(['node_modules', '.vitepress', '.git'])

export type Rating = 'safe' | 'suggestive' | 'nsfw'

export interface RepoSite {
  name: string
  lang: string
  icon: string
  url: string
  rating: Rating
}

export interface RepoData {
  sites: RepoSite[]
}

interface MihonSource {
  name: string
  lang: string
  baseUrl: string
}

interface MihonExtension {
  pkg: string
  nsfw?: number
  sources?: MihonSource[]
}

interface AidokuSource {
  name: string
  iconURL: string
  languages?: string[]
  contentRating?: number
  baseURL: string
}

interface AidokuIndex {
  sources: AidokuSource[]
}

interface AidokuLegacySource {
  name: string
  icon: string
  lang: string
  nsfw?: number
}

interface PaperbackSource {
  id: string
  name: string
  icon: string
  language?: string
  contentRating?: string
  websiteBaseURL?: string
}

interface PaperbackIndex {
  sources: PaperbackSource[]
  builtWith?: { toolchain?: string }
}

interface CloudstreamRepo {
  pluginLists: string[]
}

interface CloudstreamPlugin {
  name: string
  iconUrl?: string
  language?: string
}

const EXT_DIR = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = join(EXT_DIR, '..')
const CACHE_DIR = join(EXT_DIR, '../.vitepress/cache/extension-repos')
const CACHE_TTL_MS = 6 * 60 * 60 * 1000

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) files.push(...findMarkdownFiles(join(dir, entry.name)))
    } else if (entry.name.endsWith('.md')) {
      files.push(join(dir, entry.name))
    }
  }
  return files
}

function collectIndexUrls(): string[] {
  const urls = new Set<string>()
  const blockRe = /:::\s*extrepo[^\n]*\n([\s\S]*?)\n\s*:::/g
  const rowRe = /^\s*-\s*raw\s*:\s*(https?:\/\/\S+)\s*$/gim

  for (const file of findMarkdownFiles(DOCS_DIR)) {
    const src = readFileSync(file, 'utf-8')

    let block: RegExpExecArray | null
    blockRe.lastIndex = 0
    while ((block = blockRe.exec(src))) {
      rowRe.lastIndex = 0
      let row: RegExpExecArray | null
      while ((row = rowRe.exec(block[1]))) urls.add(row[1].trim())
    }
  }
  return [...urls]
}

function cachePathFor(url: string): string {
  return join(CACHE_DIR, `${Buffer.from(url).toString('base64url')}.json`)
}

async function fetchIndex(url: string): Promise<unknown> {
  const cachePath = cachePathFor(url)
  if (existsSync(cachePath) && Date.now() - statSync(cachePath).mtimeMs < CACHE_TTL_MS) {
    return JSON.parse(readFileSync(cachePath, 'utf-8'))
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const json = await res.json()
    mkdirSync(CACHE_DIR, { recursive: true })
    writeFileSync(cachePath, JSON.stringify(json))
    return json
  } catch (err) {
    if (existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, 'utf-8'))
    console.warn(`[extrepo] failed to fetch ${url}: ${(err as Error).message}`)
    return []
  }
}

function ratingFromLevel(level: number): Rating {
  if (level >= 2) return 'nsfw'
  if (level >= 1) return 'suggestive'
  return 'safe'
}

const LANG_ALIASES: Record<string, string> = { jp: 'ja', english: 'en' }

function normalizeLang(lang: string): string {
  const key = LANG_ALIASES[lang.toLowerCase()] ?? lang.toLowerCase()
  return key === 'multi' ? 'all' : key
}

function toRepoDataMihon(iconBase: string, extensions: MihonExtension[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const ext of extensions) {
    const icon = `${iconBase}/icon/${ext.pkg}.png`
    for (const source of ext.sources ?? []) {
      const key = `${source.name}::${source.lang}::${source.baseUrl}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push({ name: source.name, lang: source.lang, icon, url: source.baseUrl, rating: ext.nsfw === 1 ? 'nsfw' : 'safe' })
    }
  }

  return sites
}

function toRepoDataAidoku(iconBase: string, index: AidokuIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const source of index.sources ?? []) {
    const icon = `${iconBase}/${source.iconURL}`
    const rating = ratingFromLevel(source.contentRating ?? 0)
    const langs = source.languages?.length ? source.languages : ['all']
    for (const rawLang of langs) {
      const lang = normalizeLang(rawLang)
      const key = `${source.name}::${lang}::${source.baseURL}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push({ name: source.name, lang, icon, url: source.baseURL, rating })
    }
  }

  return sites
}

function toRepoDataPaperback(iconBase: string, index: PaperbackIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  // Legacy 0.8.x toolchain builds serve icons under `<id>/includes/`; the
  // 1.0.0-alpha toolchain (used by both 0.9 and some relabeled 0.8 repos)
  // serves them under `<id>/static/`.
  const iconDir = index.builtWith?.toolchain?.startsWith('0.8') ? 'includes' : 'static'

  for (const source of index.sources ?? []) {
    const lang = normalizeLang(source.language ?? 'all')
    const key = `${source.id}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    const icon = `${iconBase}/${source.id}/${iconDir}/${source.icon}`
    const rating: Rating = source.contentRating === 'ADULT' ? 'nsfw' : source.contentRating === 'MATURE' ? 'suggestive' : 'safe'
    sites.push({ name: source.name, lang, icon, url: source.websiteBaseURL ?? '', rating })
  }

  return sites
}

function normalizeGoogleFaviconUrl(url: string): string {
  return url.replace('%size%', '64')
}

async function toRepoDataCloudstream(repo: CloudstreamRepo): Promise<RepoSite[]> {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  const lists = await Promise.all(repo.pluginLists.map(url => fetchIndex(url)))
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const plugin of list as CloudstreamPlugin[]) {
      if (seen.has(plugin.name)) continue
      seen.add(plugin.name)
      const lang = normalizeLang(plugin.language ?? 'all')
      const icon = plugin.iconUrl ? normalizeGoogleFaviconUrl(plugin.iconUrl) : ''
      sites.push({ name: plugin.name, lang, icon, url: '', rating: 'safe' })
    }
  }

  return sites
}

function toRepoDataAidokuLegacy(iconBase: string, sources: AidokuLegacySource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    const key = `${source.name}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    sites.push({ name: source.name, lang, icon: `${iconBase}/icons/${source.icon}`, url: '', rating: ratingFromLevel(source.nsfw ?? 0) })
  }

  return sites
}

async function toRepoData(indexUrl: string, json: unknown): Promise<RepoData> {
  const iconBase = indexUrl.slice(0, indexUrl.lastIndexOf('/'))
  let sites: RepoSite[]
  if (Array.isArray(json)) {
    sites = json.length > 0 && 'sources' in json[0]
      ? toRepoDataMihon(iconBase, json as MihonExtension[])
      : toRepoDataAidokuLegacy(iconBase, json as AidokuLegacySource[])
  } else if (Array.isArray((json as CloudstreamRepo).pluginLists)) {
    sites = await toRepoDataCloudstream(json as CloudstreamRepo)
  } else if ((json as AidokuIndex).sources?.length && 'iconURL' in (json as AidokuIndex).sources[0]) {
    sites = toRepoDataAidoku(iconBase, json as AidokuIndex)
  } else {
    sites = toRepoDataPaperback(iconBase, json as PaperbackIndex)
  }
  sites.sort((a, b) => a.name.localeCompare(b.name))
  return { sites }
}

export declare const data: Record<string, RepoData>

export default {
  watch: ['../**/*.md'],
  async load(): Promise<Record<string, RepoData>> {
    const urls = collectIndexUrls()
    const result: Record<string, RepoData> = {}
    await Promise.all(urls.map(async url => {
      result[url] = await toRepoData(url, await fetchIndex(url))
    }))
    return result
  }
}

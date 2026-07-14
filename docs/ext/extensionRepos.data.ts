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
  contentType?: string
  isBroken?: boolean
  installUrl?: string
}

export interface RepoData {
  sites: RepoSite[]
  suwatteV6?: boolean
  suwatteListUrl?: string
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

interface HayaseExtension {
  name: string
  icon?: string
  languages?: string[]
}

interface LegadoBookSource {
  bookSourceName: string
  bookSourceUrl: string
  bookSourceGroup?: string
}

interface LNReaderPlugin {
  name: string
  lang: string
  url: string
  iconUrl?: string
}

interface MangayomiSource {
  name: string
  lang: string
  baseUrl: string
  iconUrl?: string
  isNsfw?: boolean
}

interface IReaderSource {
  pkg: string
  apk: string
  name: string
  lang: string
  nsfw?: boolean
}

interface SuwatteCatalogSource {
  name: string
  website?: string
  languages?: string[]
  thumbnail?: string
  path?: string
}

interface SuwatteCatalogIndex {
  listUrl?: string
  catalogVersion?: number
  sources: SuwatteCatalogSource[]
}

// For kotatsu
interface KotatsuSite {
  name: string
  lang: string
  url: string
  icon: string
  contentType: string
  isBroken: boolean
}

interface KotatsuIndex {
  sites: KotatsuSite[]
}

interface SoraLibraryModule {
  sourceName: string
  iconUrl?: string
  iconURL?: string
  language?: string
  languageClean?: string
  baseUrl?: string
  scriptUrl?: string
  scriptURL?: string
  manifestUrl?: string
  jsonUrl?: string
}

interface SoraLibraryAuthor {
  author: string
  repo: string
  types: Record<string, SoraLibraryModule[]>
}

export interface SoraTypeGroup {
  label: string
  indexUrl: string
}

export interface SoraAuthorRepo {
  label: string
  repoUrl?: string
  types: SoraTypeGroup[]
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
  const rowRe = /^\s*-\s*(?:raw|manga|anime|novel)\s*:\s*(https?:\/\/\S+)\s*$/gim

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

const LANG_ALIASES: Record<string, string> = {
  jp: 'ja',
  english: 'en',
  'bahasa indonesia': 'id',
  español: 'es',
  français: 'fr',
  polski: 'pl',
  português: 'pt',
  'tiếng việt': 'vi',
  türkçe: 'tr',
  русский: 'ru',
  українська: 'uk',
  ไทย: 'th',
  العربية: 'ar',
  chinese: 'zh',
  japanese: 'ja',
  korean: 'ko',
  french: 'fr',
  german: 'de',
  greek: 'el',
  indonesian: 'id',
  italian: 'it',
  spanish: 'es',
  turkish: 'tr',
  polish: 'pl',
  russian: 'ru',
  portuguese: 'pt',
  arabic: 'ar',
  tamil: 'ta',
  ukrainian: 'uk',
  vietnamese: 'vi',
  thai: 'th',
  hindi: 'hi',
  malay: 'ms',
  serbian: 'sr'
}

const LANG_SUBSTRING_ALIASES: [RegExp, string][] = [
  [/中文|汉语|漢語/, 'zh'],
  [/日本語/, 'ja'],
  [/한국어|조선말/, 'ko']
]

function normalizeLang(lang: string): string {
  // Strip bidi control marks (e.g. U+200E/U+200F) some indices prepend to lang names.
  const cleaned = lang.replace(/[‎‏]/g, '').trim()
  if (cleaned === '') return 'all'
  const exact = LANG_ALIASES[cleaned.toLowerCase()]
  if (exact) return exact
  for (const [re, code] of LANG_SUBSTRING_ALIASES) {
    if (re.test(cleaned)) return code
  }
  const key = cleaned.toLowerCase()
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
  // Legacy 0.8.x toolchain builds serve icons under `<id>/includes/`
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

function toRepoDataHayase(extensions: HayaseExtension[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const ext of extensions) {
    const langs = ext.languages?.length ? ext.languages : ['all']
    for (const rawLang of langs) {
      const lang = normalizeLang(rawLang)
      const key = `${ext.name}::${lang}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push({ name: ext.name, lang, icon: ext.icon ?? '', url: '', rating: 'safe' })
    }
  }

  return sites
}

function toRepoDataLegado(sources: LegadoBookSource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const source of sources) {
    const lang = normalizeLang(source.bookSourceGroup ?? 'all')
    const key = `${source.bookSourceName}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    sites.push({ name: source.bookSourceName, lang, icon: '', url: source.bookSourceUrl, rating: 'safe' })
  }

  return sites
}

function toRepoDataMangayomi(sources: MangayomiSource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    const key = `${source.name}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    sites.push({ name: source.name, lang, icon: source.iconUrl ?? '', url: source.baseUrl, rating: source.isNsfw ? 'nsfw' : 'safe' })
  }

  return sites
}

function toRepoDataIReader(sources: IReaderSource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    const key = `${source.name}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    // No confirmed icon path convention in this repo's format — omit rather than guess wrong.
    sites.push({ name: source.name, lang, icon: '', url: '', rating: source.nsfw ? 'nsfw' : 'safe' })
  }

  return sites
}

function toRepoDataSuwatte(iconBase: string, index: SuwatteCatalogIndex): { sites: RepoSite[]; listUrl: string } {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  const listUrl = index.listUrl ?? iconBase
  const isV6 = index.catalogVersion === undefined

  for (const source of index.sources ?? []) {
    const langs = source.languages?.length ? source.languages : ['all']
    const icon = source.thumbnail
      ? (/^https?:\/\//i.test(source.thumbnail) ? source.thumbnail : `${iconBase}/assets/${source.thumbnail}`)
      : ''
    const installUrl = source.path
      ? (isV6
          ? `suwatte://runner?url=${listUrl}&runner=${source.path}`
          : `suwatte://AddSourceFromList?list=${listUrl}&source=${source.path}`)
      : undefined
    for (const rawLang of langs) {
      const lang = normalizeLang(rawLang)
      const key = `${source.name}::${lang}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push({ name: source.name, lang, icon, url: source.website ?? '', rating: 'safe', installUrl })
    }
  }

  return { sites, listUrl }
}

function toRepoDataKotatsu(index: KotatsuIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const site of index.sites) {
    const lang = normalizeLang(site.lang)
    const key = `${site.name}::${lang}::${site.url}`
    if (seen.has(key)) continue
    seen.add(key)
    const rating: Rating = site.contentType.includes('HENTAI') ? 'nsfw' : 'safe'
    sites.push({ name: site.name, lang, icon: site.icon, url: site.url, rating, contentType: site.contentType, isBroken: site.isBroken || undefined })
  }

  return sites
}

function isSoraLibrary(json: unknown): json is SoraLibraryAuthor[] {
  if (!Array.isArray(json) || json.length === 0) return false
  const first = json[0] as Record<string, unknown>
  return typeof first.author === 'string' && typeof first.repo === 'string' && typeof first.types === 'object'
}

function normalizeSoraLang(language: string | undefined): string {
  const stripped = (language ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (stripped.toLowerCase().startsWith('multi')) return 'all'
  return normalizeLang(stripped)
}

const SORA_TYPE_ORDER = ['anime', 'manga', 'novels', 'other']
const SORA_TYPE_LABELS: Record<string, string> = {
  anime: 'Anime',
  manga: 'Manga',
  novels: 'Novels',
  other: 'Other'
}

function soraModuleInstallUrl(mod: SoraLibraryModule): string | undefined {
  const explicit = mod.manifestUrl ?? mod.jsonUrl
  if (explicit) return explicit
  const script = mod.scriptUrl ?? mod.scriptURL
  return script?.replace(/\.js$/i, '.json')
}

function toRepoDataSoraModules(modules: SoraLibraryModule[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const mod of modules) {
    const lang = normalizeSoraLang(mod.languageClean ?? mod.language)
    const installUrl = soraModuleInstallUrl(mod)
    const key = `${mod.sourceName}::${lang}::${installUrl ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)
    sites.push({
      name: mod.sourceName,
      lang,
      icon: mod.iconUrl ?? mod.iconURL ?? '',
      url: mod.baseUrl ?? '',
      rating: 'safe',
      installUrl: installUrl ? `sora://module?url=${installUrl}` : undefined
    })
  }

  sites.sort((a, b) => a.name.localeCompare(b.name))
  return sites
}

function groupSoraLibrary(indexUrl: string, authors: SoraLibraryAuthor[]): { authorRepos: SoraAuthorRepo[]; sitesByType: Record<string, RepoData> } {
  const authorRepos: SoraAuthorRepo[] = []
  const sitesByType: Record<string, RepoData> = {}

  for (const entry of authors) {
    const types: SoraTypeGroup[] = []
    for (const typeKey of SORA_TYPE_ORDER) {
      const modules = entry.types[typeKey]
      if (!modules?.length) continue
      const typeIndexUrl = new URL(`${entry.author}/${typeKey}.json`, indexUrl).toString()
      sitesByType[typeIndexUrl] = { sites: toRepoDataSoraModules(modules) }
      types.push({ label: SORA_TYPE_LABELS[typeKey] ?? typeKey, indexUrl: typeIndexUrl })
    }
    if (!types.length) continue
    authorRepos.push({ label: entry.author, repoUrl: entry.repo.replace(/\.git$/, ''), types })
  }

  authorRepos.sort((a, b) => a.label.localeCompare(b.label))
  return { authorRepos, sitesByType }
}

function toRepoDataLNReader(plugins: LNReaderPlugin[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const plugin of plugins) {
    const lang = normalizeLang(plugin.lang)
    const key = `${plugin.name}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    sites.push({ name: plugin.name, lang, icon: plugin.iconUrl ?? '', url: plugin.url, rating: 'safe' })
  }

  return sites
}

async function toRepoData(indexUrl: string, json: unknown): Promise<RepoData> {
  const iconBase = indexUrl.slice(0, indexUrl.lastIndexOf('/'))
  let sites: RepoSite[]
  let suwatteV6: boolean | undefined
  let suwatteListUrl: string | undefined
  if (Array.isArray(json)) {
    const first = json[0] as Record<string, unknown> | undefined
    if (first && 'bookSourceUrl' in first) {
      sites = toRepoDataLegado(json as LegadoBookSource[])
    } else if (first && 'manifestVersion' in first) {
      sites = toRepoDataHayase(json as HayaseExtension[])
    } else if (first && 'iconUrl' in first && 'site' in first) {
      sites = toRepoDataLNReader(json as LNReaderPlugin[])
    } else if (isSoraLibrary(json)) {
      sites = toRepoDataSoraModules(json.flatMap(entry => Object.values(entry.types).flat()))
    } else if (first && 'sources' in first) {
      sites = toRepoDataMihon(iconBase, json as MihonExtension[])
    } else if (first && 'pkg' in first && 'apk' in first) {
      sites = toRepoDataIReader(json as IReaderSource[])
    } else if (first && 'iconUrl' in first && 'baseUrl' in first) {
      sites = toRepoDataMangayomi(json as MangayomiSource[])
    } else {
      sites = toRepoDataAidokuLegacy(iconBase, json as AidokuLegacySource[])
    }
  } else if (Array.isArray((json as CloudstreamRepo).pluginLists)) {
    sites = await toRepoDataCloudstream(json as CloudstreamRepo)
  } else if ((json as AidokuIndex).sources?.length && 'iconURL' in (json as AidokuIndex).sources[0]) {
    sites = toRepoDataAidoku(iconBase, json as AidokuIndex)
  } else if ((json as SuwatteCatalogIndex).sources?.length && 'thumbnail' in (json as SuwatteCatalogIndex).sources[0]) {
    const result = toRepoDataSuwatte(iconBase, json as SuwatteCatalogIndex)
    sites = result.sites
    suwatteListUrl = result.listUrl
    suwatteV6 = (json as SuwatteCatalogIndex).catalogVersion === undefined
  } else if (Array.isArray((json as KotatsuIndex).sites)) {
    sites = toRepoDataKotatsu(json as KotatsuIndex)
  } else {
    sites = toRepoDataPaperback(iconBase, json as PaperbackIndex)
  }
  sites.sort((a, b) => a.name.localeCompare(b.name))
  return { sites, suwatteV6, suwatteListUrl }
}

export interface ExtensionRepoData {
  sites: Record<string, RepoData>
  soraAuthors: Record<string, SoraAuthorRepo[]>
}

export declare const data: ExtensionRepoData

export default {
  watch: ['../**/*.md'],
  async load(): Promise<ExtensionRepoData> {
    const urls = collectIndexUrls()
    const sites: Record<string, RepoData> = {}
    const soraAuthors: Record<string, SoraAuthorRepo[]> = {}
    await Promise.all(urls.map(async url => {
      const json = await fetchIndex(url)
      sites[url] = await toRepoData(url, json)
      if (isSoraLibrary(json)) {
        const grouped = groupSoraLibrary(url, json)
        soraAuthors[url] = grouped.authorRepos
        Object.assign(sites, grouped.sitesByType)
      }
    }))
    return { sites, soraAuthors }
  }
}

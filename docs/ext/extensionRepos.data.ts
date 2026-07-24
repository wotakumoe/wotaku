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
  streamType?: string
  quality?: string
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

interface SoraRepoIndexEntry {
  slug: string
  name: string
  source: string
  path?: string
  totalSources?: number
  error?: string
}

interface SoraRepoIndex {
  repos: SoraRepoIndexEntry[]
}

interface SoraModule {
  sourceName: string
  iconUrl?: string
  iconURL?: string
  language?: string
  baseUrl?: string
  scriptUrl?: string
  scriptURL?: string
  wotaku_sourceName?: string
  wotaku_language?: string[]
  wotaku_type?: string[]
  wotaku_streamType?: string[]
  wotaku_quality?: string[]
}

export interface SoraAuthorRepo {
  label: string
  repoUrl?: string
  indexUrl: string
}

interface EchoExtension {
  id: string
  type: string
  name: string
  subtitle?: string
  iconUrl?: string
  url?: string
  updateUrl: string
}

export interface EchoAuthorRepo {
  label: string
  repoUrl?: string
  indexUrl: string
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
  [/日语原版/, 'ja'],
  [/中文|汉语|漢語|轻小说/, 'zh'],
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

function isSoraRepoIndex(json: unknown): json is SoraRepoIndex {
  return !!json && typeof json === 'object' && Array.isArray((json as SoraRepoIndex).repos)
}

function normalizeSoraLang(language: string | undefined): string {
  const stripped = (language ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (stripped.toLowerCase().startsWith('multi')) return 'all'
  return normalizeLang(stripped)
}

function toRepoDataSoraModules(modules: SoraModule[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const mod of modules) {
    const name = mod.wotaku_sourceName ?? mod.sourceName
    const langs = mod.wotaku_language?.length ? mod.wotaku_language : [mod.language]
    const scriptUrl = mod.scriptUrl ?? mod.scriptURL
    const installUrl = scriptUrl?.replace(/\.js$/i, '.json')
    for (const rawLang of langs) {
      const lang = normalizeSoraLang(rawLang)
      const key = `${name}::${lang}::${installUrl ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push({
        name,
        lang,
        icon: mod.iconUrl ?? mod.iconURL ?? '',
        url: mod.baseUrl ?? '',
        rating: 'safe',
        contentType: mod.wotaku_type?.[0],
        streamType: mod.wotaku_streamType?.[0],
        quality: mod.wotaku_quality?.[0],
        installUrl: installUrl ? `sora://module?url=${installUrl}` : undefined
      })
    }
  }

  sites.sort((a, b) => a.name.localeCompare(b.name))
  return sites
}

async function loadSoraRepoIndex(indexUrl: string, index: SoraRepoIndex): Promise<{ sites: RepoSite[]; authorRepos: SoraAuthorRepo[]; sitesByAuthor: Record<string, RepoData> }> {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  const authorRepos: SoraAuthorRepo[] = []
  const sitesByAuthor: Record<string, RepoData> = {}

  const entries = index.repos.filter(repo => repo.path && !repo.error)
  const fileUrls = entries.map(repo => new URL(repo.path!, indexUrl).toString())
  const moduleLists = await Promise.all(fileUrls.map(url => fetchIndex(url)))

  entries.forEach((repo, i) => {
    const modules = moduleLists[i]
    const authorSites = Array.isArray(modules) ? toRepoDataSoraModules(modules as SoraModule[]) : []
    const fileUrl = fileUrls[i]
    sitesByAuthor[fileUrl] = { sites: authorSites }
    authorRepos.push({ label: repo.name, repoUrl: repo.source?.replace(/\.git$/, ''), indexUrl: fileUrl })
    for (const site of authorSites) {
      const key = `${site.name}::${site.lang}::${site.installUrl ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push(site)
    }
  })

  authorRepos.sort((a, b) => a.label.localeCompare(b.label))
  sites.sort((a, b) => a.name.localeCompare(b.name))
  return { sites, authorRepos, sitesByAuthor }
}

function isEchoExtensionList(json: unknown): json is EchoExtension[] {
  if (!Array.isArray(json) || json.length === 0) return false
  const first = json[0] as Record<string, unknown>
  return typeof first.updateUrl === 'string' && typeof first.subtitle === 'string' && !('lang' in first) && !('baseUrl' in first)
}

function parseEchoRepo(updateUrl: string): { host: string; owner: string; repo: string; repoUrl: string; ownerUrl: string } | undefined {
  const githubMatch = updateUrl.match(/^https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/releases$/)
  if (githubMatch) {
    const [, owner, repo] = githubMatch
    return { host: 'github.com', owner, repo, repoUrl: `https://github.com/${owner}/${repo}`, ownerUrl: `https://github.com/${owner}` }
  }

  const gitlabMatch = updateUrl.match(/^https:\/\/(gitlab\.com)\/api\/v4\/projects\/([^/]+)\/releases\b/)
  if (gitlabMatch) {
    const [, host, encodedPath] = gitlabMatch
    const path = decodeURIComponent(encodedPath)
    const owner = path.slice(0, path.lastIndexOf('/'))
    const repo = path.slice(path.lastIndexOf('/') + 1)
    if (!owner || !repo) return undefined
    return { host, owner, repo, repoUrl: `https://${host}/${path}`, ownerUrl: `https://${host}/${owner}` }
  }

  return undefined
}

function toRepoDataEchoExtensions(extensions: EchoExtension[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []

  for (const ext of extensions) {
    const key = `${ext.id}::${ext.updateUrl}`
    if (seen.has(key)) continue
    seen.add(key)
    const repo = parseEchoRepo(ext.updateUrl)
    sites.push({
      name: ext.name,
      lang: 'all',
      icon: ext.iconUrl ?? '',
      url: ext.url ?? repo?.repoUrl ?? '',
      rating: 'safe',
      contentType: ext.type,
      installUrl: repo?.repoUrl
    })
  }

  sites.sort((a, b) => a.name.localeCompare(b.name))
  return sites
}

function loadEchoExtensionList(indexUrl: string, extensions: EchoExtension[]): { sites: RepoSite[]; authorRepos: EchoAuthorRepo[]; sitesByAuthor: Record<string, RepoData> } {
  const byAuthor = new Map<string, { label: string; ownerUrl?: string; exts: EchoExtension[] }>()
  for (const ext of extensions) {
    const repo = parseEchoRepo(ext.updateUrl)
    const key = repo ? `${repo.host}:${repo.owner}` : 'Unknown'
    const bucket = byAuthor.get(key)
    if (bucket) bucket.exts.push(ext)
    else byAuthor.set(key, { label: repo?.owner ?? 'Unknown', ownerUrl: repo?.ownerUrl, exts: [ext] })
  }

  const authorRepos: EchoAuthorRepo[] = []
  const sitesByAuthor: Record<string, RepoData> = {}
  for (const [key, { label, ownerUrl, exts }] of byAuthor) {
    const authorIndexUrl = `${indexUrl}#${key}`
    sitesByAuthor[authorIndexUrl] = { sites: toRepoDataEchoExtensions(exts) }
    authorRepos.push({ label, repoUrl: ownerUrl, indexUrl: authorIndexUrl })
  }

  authorRepos.sort((a, b) => a.label.localeCompare(b.label))
  return { sites: toRepoDataEchoExtensions(extensions), authorRepos, sitesByAuthor }
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
  echoAuthors: Record<string, EchoAuthorRepo[]>
}

export declare const data: ExtensionRepoData

export default {
  watch: ['../**/*.md'],
  async load(): Promise<ExtensionRepoData> {
    const urls = collectIndexUrls()
    const sites: Record<string, RepoData> = {}
    const soraAuthors: Record<string, SoraAuthorRepo[]> = {}
    const echoAuthors: Record<string, EchoAuthorRepo[]> = {}
    await Promise.all(urls.map(async url => {
      const json = await fetchIndex(url)
      if (isSoraRepoIndex(json)) {
        const result = await loadSoraRepoIndex(url, json)
        sites[url] = { sites: result.sites }
        soraAuthors[url] = result.authorRepos
        Object.assign(sites, result.sitesByAuthor)
        return
      }
      if (isEchoExtensionList(json)) {
        const result = loadEchoExtensionList(url, json)
        sites[url] = { sites: result.sites }
        echoAuthors[url] = result.authorRepos
        Object.assign(sites, result.sitesByAuthor)
        return
      }
      sites[url] = await toRepoData(url, json)
    }))
    return { sites, soraAuthors, echoAuthors }
  }
}

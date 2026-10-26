import type {
  Rating,
  RepoSite
} from '../../.vitepress/theme/components/extrepo/types'

interface MihonIndexSource {
  id: string
  name: string
  language: string
  homeUrl: string
  mirrorUrls?: string[]
}

interface MihonIndexExtension {
  name: string
  packageName: string
  resources: {
    apkUrl: string
    iconUrl: string
    jarUrl: string
  }
  extensionLib: string
  versionCode: string
  versionName: string
  contentWarning: string
  sources: MihonIndexSource[]
}

interface MihonIndex {
  name: string
  badgeLabel: string
  signingKey: string
  contact?: {
    website?: string
    discord?: string
  }
  extensionList: {
    extensions: MihonIndexExtension[]
  }
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
  name?: string
  pluginLists: string[]
}

interface CloudstreamRepoListItem {
  url: string
  verified?: boolean
}

export interface RepoListEntry {
  label: string
  indexUrl: string
  repoUrl?: string
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

interface ManaSource {
  id?: string
  name: string
  thumbnail?: string
  website?: string
  rating?: number
  supportedLanguages?: string[]
}

interface ManaIndex {
  repositoryName?: string
  sources: ManaSource[]
}

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
  name: string
  source: string
  path?: string
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
}

export interface SoraAuthorRepo {
  label: string
  repoUrl?: string
  indexUrl: string
}

interface StremioAddon {
  name?: string
  icon?: string | null
  manifestUrl: string
  types?: string[] | null
}

interface StremioCollection {
  addons?: StremioAddon[]
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

interface SeanimeMarketplaceEntry {
  id?: string
  name: string
  description?: string
  author?: string
  version?: string
  type?: string
  language?: string
  lang?: string
  icon?: string
  manifestURI: string
  payloadURI?: string
  website?: string
  workingTag?: boolean
  brokenTag?: boolean
  deprecatedTag?: boolean
}

const FETCH_TIMEOUT_MS = 15000
const FETCH_CONCURRENCY = 10

export type FetchJson = (url: string) => Promise<unknown | undefined>

export async function fetchJsonHttp(url: string): Promise<unknown | undefined> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return (await res.json()) as unknown
    } catch {
      if (attempt === 1) return undefined
    } finally {
      clearTimeout(timer)
    }
  }
  return undefined
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, i: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await fn(items[i], i)
      }
    }
  )
  await Promise.all(workers)
  return out
}

function isCloudstreamRepoList(
  json: unknown
): json is Array<string | CloudstreamRepoListItem> {
  if (!Array.isArray(json) || json.length === 0) return false
  return json.every((item) => {
    if (typeof item === 'string') return /^https?:\/\//.test(item)
    if (item && typeof item === 'object') {
      const rec = item as Record<string, unknown>
      if (
        'name' in rec || 'lang' in rec || 'baseUrl' in rec || 'baseURL' in rec
      ) return false
      return typeof rec.url === 'string' && /^https?:\/\//.test(rec.url)
    }
    return false
  })
}

function inferRepoUrl(rawUrl: string): string | undefined {
  try {
    const u = new URL(rawUrl)
    const parts = u.pathname.split('/').filter(Boolean)
    if (u.hostname === 'raw.githubusercontent.com' && parts.length >= 2) {
      return `https://github.com/${parts[0]}/${parts[1]}`
    }
    const dashRaw = u.pathname.indexOf('/-/raw/')
    if (dashRaw > 0) return `${u.origin}${u.pathname.slice(0, dashRaw)}`
    const rawSeg = parts.indexOf('raw')
    if (rawSeg > 1) return `${u.origin}/${parts.slice(0, rawSeg).join('/')}`
  } catch {
    return undefined
  }
  return undefined
}

function inferLabel(rawUrl: string): string {
  const repoUrl = inferRepoUrl(rawUrl)
  if (repoUrl) {
    try {
      const parts = new URL(repoUrl).pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
      }
      if (parts.length === 1) return decodeURIComponent(parts[0])
    } catch {
      // fall through below
    }
  }
  try {
    const parts = new URL(rawUrl).pathname.split('/').filter(Boolean)
    return decodeURIComponent(
      parts[parts.length - 2] ?? parts[parts.length - 1] ?? rawUrl
    )
  } catch {
    return rawUrl
  }
}

function repoListLabel(indexUrl: string, repoJson: unknown): string {
  if (repoJson && typeof repoJson === 'object' && !Array.isArray(repoJson)) {
    const name = (repoJson as { name?: unknown }).name
    if (typeof name === 'string' && name.trim() !== '') return name.trim()
  }
  return inferLabel(indexUrl)
}

function ratingFromLevel(level: number): Rating {
  if (level >= 2) return 'nsfw'
  if (level >= 1) return 'mixed'
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

const langCache = new Map<string, string>()

function normalizeLang(lang: string): string {
  const hit = langCache.get(lang)
  if (hit !== undefined) return hit
  const cleaned = lang.replace(/[\u200E\u200F]/g, '').trim()
  let out: string
  if (cleaned === '') out = 'all'
  else {
    const exact = LANG_ALIASES[cleaned.toLowerCase()]
    if (exact) out = exact
    else {
      out = cleaned.toLowerCase()
      for (const [re, code] of LANG_SUBSTRING_ALIASES) {
        if (re.test(cleaned)) {
          out = code
          break
        }
      }
      if (out === 'multi') out = 'all'
    }
  }
  if (langCache.size > 2000) langCache.clear()
  langCache.set(lang, out)
  return out
}

function sortSites(sites: RepoSite[]): RepoSite[] {
  return sites.sort((a, b) => a.name.localeCompare(b.name))
}

function addSite(
  seen: Set<string>,
  key: string,
  sites: RepoSite[],
  site: RepoSite
): void {
  if (seen.has(key)) return
  seen.add(key)
  sites.push(site)
}

function toRepoDataMihon(
  iconBase: string,
  extensions: MihonExtension[]
): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const ext of extensions) {
    const icon = `${iconBase}/icon/${ext.pkg}.png`
    for (const source of ext.sources ?? []) {
      addSite(
        seen,
        `${source.name}::${source.lang}::${source.baseUrl}`,
        sites,
        {
          name: source.name ?? ext.pkg,
          lang: source.lang ?? 'all',
          icon,
          url: source.baseUrl ?? '',
          rating: ext.nsfw === 1 ? 'nsfw' : 'safe'
        }
      )
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
      addSite(seen, `${source.name}::${lang}::${source.baseURL}`, sites, {
        name: source.name,
        lang,
        icon,
        url: source.baseURL,
        rating
      })
    }
  }
  return sites
}

function toRepoDataPaperback(
  iconBase: string,
  index: PaperbackIndex
): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  const iconDir = index.builtWith?.toolchain?.startsWith('0.8')
    ? 'includes'
    : 'static'
  for (const source of index.sources ?? []) {
    const lang = normalizeLang(source.language ?? 'all')
    const key = `${source.id}::${lang}`
    if (seen.has(key)) continue
    seen.add(key)
    const icon = `${iconBase}/${source.id}/${iconDir}/${source.icon}`
    const rating: Rating = source.contentRating === 'ADULT'
      ? 'nsfw'
      : source.contentRating === 'MATURE'
      ? 'suggestive'
      : 'safe'
    sites.push({
      name: source.name,
      lang,
      icon,
      url: source.websiteBaseURL ?? '',
      rating
    })
  }
  return sites
}

function normalizeGoogleFaviconUrl(url: string): string {
  return url.replace('%size%', '64')
}

async function toRepoDataCloudstream(
  repo: CloudstreamRepo,
  fetchJson: FetchJson
): Promise<RepoSite[]> {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  const lists = await mapLimit(
    repo.pluginLists,
    FETCH_CONCURRENCY,
    url => fetchJson(url)
  )
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const plugin of list as CloudstreamPlugin[]) {
      if (seen.has(plugin.name)) continue
      seen.add(plugin.name)
      const lang = normalizeLang(plugin.language ?? 'all')
      const icon = plugin.iconUrl
        ? normalizeGoogleFaviconUrl(plugin.iconUrl)
        : ''
      sites.push({ name: plugin.name, lang, icon, url: '', rating: 'safe' })
    }
  }
  return sites
}

function toRepoDataAidokuLegacy(
  iconBase: string,
  sources: AidokuLegacySource[]
): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    addSite(seen, `${source.name}::${lang}`, sites, {
      name: source.name,
      lang,
      icon: `${iconBase}/icons/${source.icon}`,
      url: '',
      rating: ratingFromLevel(source.nsfw ?? 0)
    })
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
      addSite(seen, `${ext.name}::${lang}`, sites, {
        name: ext.name,
        lang,
        icon: ext.icon ?? '',
        url: '',
        rating: 'safe'
      })
    }
  }
  return sites
}

function toRepoDataStremio(index: StremioCollection): RepoSite[] {
  return (index.addons ?? [])
    .filter((addon) => addon.manifestUrl)
    .map((addon): RepoSite => ({
      name: addon.name ?? addon.manifestUrl,
      lang: 'all',
      icon: addon.icon ?? '',
      url: '',
      rating: 'safe',
      contentTypes: addon.types?.length
        ? [...new Set(addon.types.filter(Boolean))]
        : undefined,
      installUrl: `stremio://${addon.manifestUrl.replace(/^[a-z]+:\/\//i, '')}`,
      copyUrl: addon.manifestUrl
    }))
}

function toRepoDataMangayomi(sources: MangayomiSource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    addSite(seen, `${source.name}::${lang}`, sites, {
      name: source.name,
      lang,
      icon: source.iconUrl ?? '',
      url: source.baseUrl,
      rating: source.isNsfw ? 'nsfw' : 'safe'
    })
  }
  return sites
}

function toRepoDataIReader(sources: IReaderSource[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const source of sources) {
    const lang = normalizeLang(source.lang)
    addSite(seen, `${source.name}::${lang}`, sites, {
      name: source.name,
      lang,
      icon: '',
      url: '',
      rating: source.nsfw ? 'nsfw' : 'safe'
    })
  }
  return sites
}

function toRepoDataSuwatte(
  iconBase: string,
  index: SuwatteCatalogIndex
): { sites: RepoSite[]; listUrl: string } {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  const listUrl = index.listUrl ?? iconBase
  const isV6 = index.catalogVersion === undefined
  for (const source of index.sources ?? []) {
    const langs = source.languages?.length ? source.languages : ['all']
    const icon = source.thumbnail
      ? (/^https?:\/\//i.test(source.thumbnail)
        ? source.thumbnail
        : `${iconBase}/assets/${source.thumbnail}`)
      : ''
    const installUrl = source.path
      ? (isV6
        ? `suwatte://runner?url=${listUrl}&runner=${source.path}`
        : `suwatte://AddSourceFromList?list=${listUrl}&source=${source.path}`)
      : undefined
    for (const rawLang of langs) {
      const lang = normalizeLang(rawLang)
      addSite(seen, `${source.name}::${lang}`, sites, {
        name: source.name,
        lang,
        icon,
        url: source.website ?? '',
        rating: 'safe',
        installUrl
      })
    }
  }
  return { sites, listUrl }
}

function toRepoDataMana(iconBase: string, index: ManaIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const source of index.sources ?? []) {
    if (!source?.name) continue
    const langs = source.supportedLanguages?.length
      ? source.supportedLanguages
      : ['all']
    const icon = source.thumbnail
      ? (/^https?:\/\//i.test(source.thumbnail)
        ? source.thumbnail
        : `${iconBase}/assets/${source.thumbnail}`)
      : ''
    const rating = ratingFromLevel(source.rating ?? 0)
    const repoParam = encodeURIComponent(iconBase)
    const installUrl = source.id
      ? `mana://install-source?repo=${repoParam}&id=${encodeURIComponent(source.id)}`
      : undefined
    for (const rawLang of langs) {
      const lang = normalizeLang(rawLang.split(/[_-]/)[0] ?? rawLang)
      addSite(seen, `${source.name}::${lang}`, sites, {
        name: source.name,
        lang,
        icon,
        url: source.website ?? '',
        rating,
        installUrl
      })
    }
  }
  return sites
}

function toRepoDataKotatsu(index: KotatsuIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const site of index.sites) {
    const lang = normalizeLang(site.lang ?? 'all')
    const contentType = site.contentType ?? ''
    const rating: Rating = contentType.includes('HENTAI') ? 'nsfw' : 'safe'
    addSite(seen, `${site.name}::${lang}::${site.url}`, sites, {
      name: site.name ?? 'Unknown',
      lang,
      icon: site.icon,
      url: site.url ?? '',
      rating,
      contentType,
      isBroken: site.isBroken || undefined
    })
  }
  return sites
}

function isEchoExtensionList(json: unknown): json is EchoExtension[] {
  if (!Array.isArray(json) || json.length === 0) return false
  const first = json[0] as Record<string, unknown>
  return typeof first.updateUrl === 'string' &&
    typeof first.subtitle === 'string' && !('lang' in first) &&
    !('baseUrl' in first)
}

function parseEchoRepo(
  updateUrl: string
): {
  host: string
  owner: string
  repo: string
  repoUrl: string
  ownerUrl: string
} | undefined {
  const githubMatch = updateUrl.match(
    /^https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/releases(?:\/|$)/
  )
  if (githubMatch) {
    const [, owner, repo] = githubMatch
    return {
      host: 'github.com',
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}`,
      ownerUrl: `https://github.com/${owner}`
    }
  }
  const gitlabMatch = updateUrl.match(
    /^https:\/\/(gitlab\.com)\/api\/v4\/projects\/([^/]+)\/releases(?:\/|$)/
  )
  if (gitlabMatch) {
    const [, host, encodedPath] = gitlabMatch
    const path = decodeURIComponent(encodedPath)
    const owner = path.slice(0, path.lastIndexOf('/'))
    const repo = path.slice(path.lastIndexOf('/') + 1)
    if (!owner || !repo) return undefined
    return {
      host,
      owner,
      repo,
      repoUrl: `https://${host}/${path}`,
      ownerUrl: `https://${host}/${owner}`
    }
  }
  return undefined
}

function toRepoDataEchoExtensions(extensions: EchoExtension[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const ext of extensions) {
    if (seen.has(`${ext.id}::${ext.updateUrl}`)) continue
    seen.add(`${ext.id}::${ext.updateUrl}`)
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
  return sortSites(sites)
}

function loadEchoExtensionList(
  indexUrl: string,
  extensions: EchoExtension[]
): {
  sites: RepoSite[]
  authorRepos: EchoAuthorRepo[]
  sitesByAuthor: Record<string, RepoData>
} {
  const byAuthor = new Map<
    string,
    { label: string; ownerUrl?: string; exts: EchoExtension[] }
  >()
  for (const ext of extensions) {
    const repo = parseEchoRepo(ext.updateUrl)
    const key = repo ? `${repo.host}:${repo.owner}` : 'Unknown'
    const bucket = byAuthor.get(key)
    if (bucket) bucket.exts.push(ext)
    else {byAuthor.set(key, {
        label: repo?.owner ?? 'Unknown',
        ownerUrl: repo?.ownerUrl,
        exts: [ext]
      })}
  }
  const authorRepos: EchoAuthorRepo[] = []
  const sitesByAuthor: Record<string, RepoData> = {}
  for (const [key, { label, ownerUrl, exts }] of byAuthor) {
    const authorIndexUrl = `${indexUrl}#${key}`
    sitesByAuthor[authorIndexUrl] = { sites: toRepoDataEchoExtensions(exts) }
    authorRepos.push({ label, repoUrl: ownerUrl, indexUrl: authorIndexUrl })
  }
  authorRepos.sort((a, b) => a.label.localeCompare(b.label))
  return {
    sites: toRepoDataEchoExtensions(extensions),
    authorRepos,
    sitesByAuthor
  }
}

function isSoraRepoIndex(json: unknown): json is SoraRepoIndex {
  return !!json && typeof json === 'object' &&
    Array.isArray((json as SoraRepoIndex).repos)
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
    const langs = mod.wotaku_language?.length
      ? mod.wotaku_language
      : [mod.language]
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
        installUrl: installUrl ? `sora://module?url=${installUrl}` : undefined
      })
    }
  }

  return sortSites(sites)
}

async function loadSoraRepoIndex(
  indexUrl: string,
  index: SoraRepoIndex,
  fetchJson: FetchJson
): Promise<{
  sites: RepoSite[]
  authorRepos: SoraAuthorRepo[]
  sitesByAuthor: Record<string, RepoData>
}> {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  const authorRepos: SoraAuthorRepo[] = []
  const sitesByAuthor: Record<string, RepoData> = {}

  const entries = index.repos.filter(repo => repo.path && !repo.error)
  const fileUrls = entries.map(repo => new URL(repo.path!, indexUrl).toString())
  const moduleLists = await mapLimit(
    fileUrls,
    FETCH_CONCURRENCY,
    url => fetchJson(url)
  )

  entries.forEach((repo, i) => {
    const modules = moduleLists[i]
    const authorSites = Array.isArray(modules)
      ? toRepoDataSoraModules(modules as SoraModule[])
      : []
    const fileUrl = fileUrls[i]
    sitesByAuthor[fileUrl] = { sites: authorSites }
    authorRepos.push({
      label: repo.name,
      repoUrl: repo.source?.replace(/\.git$/, ''),
      indexUrl: fileUrl
    })
    for (const site of authorSites) {
      const key = `${site.name}::${site.lang}::${site.installUrl ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      sites.push(site)
    }
  })

  authorRepos.sort((a, b) => a.label.localeCompare(b.label))
  return {
    sites: sortSites(sites),
    authorRepos,
    sitesByAuthor
  }
}

function toRepoDataLNReader(plugins: LNReaderPlugin[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const plugin of plugins) {
    const lang = normalizeLang(plugin.lang)
    addSite(seen, `${plugin.name}::${lang}`, sites, {
      name: plugin.name,
      lang,
      icon: plugin.iconUrl ?? '',
      url: plugin.url,
      rating: 'safe'
    })
  }
  return sites
}

const CONTENT_WARNING_RATING: Record<string, Rating> = {
  CONTENT_WARNING_NSFW: 'nsfw',
  CONTENT_WARNING_MIXED: 'mixed',
  CONTENT_WARNING_SAFE: 'safe'
}

function toRepoDataMihonNew(index: MihonIndex): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const ext of index.extensionList.extensions) {
    const icon = ext.resources.iconUrl
    const rating = CONTENT_WARNING_RATING[ext.contentWarning] ?? 'safe'
    for (const source of ext.sources) {
      addSite(
        seen,
        `${source.name}::${source.language}::${source.homeUrl}`,
        sites,
        {
          name: source.name ?? 'Unknown',
          lang: source.language ?? 'all',
          icon,
          url: source.homeUrl ?? '',
          rating
        }
      )
    }
  }
  return sortSites(sites)
}

function toRepoDataSeanime(entries: SeanimeMarketplaceEntry[]): RepoSite[] {
  const seen = new Set<string>()
  const sites: RepoSite[] = []
  for (const ext of entries) {
    if (!ext?.name || !ext?.manifestURI) continue
    if (seen.has(ext.manifestURI)) continue
    seen.add(ext.manifestURI)
    const author = ext.author?.trim()
    sites.push({
      name: ext.name,
      lang: normalizeLang(ext.lang ?? 'all'),
      icon: ext.icon ?? '',
      url: ext.website ?? '',
      rating: 'safe',
      contentType: ext.type ?? '',
      isBroken: ext.brokenTag || ext.deprecatedTag ? true : undefined,
      author: author || undefined,
      copyUrl: ext.manifestURI
    })
  }
  return sortSites(sites)
}

function isSeanimeMarketplaceList(
  json: unknown
): json is SeanimeMarketplaceEntry[] {
  if (!Array.isArray(json) || json.length === 0) return false
  const first = json[0]
  return Boolean(
    first && typeof first === 'object' &&
      typeof (first as Record<string, unknown>).manifestURI === 'string'
  )
}

async function toRepoData(
  indexUrl: string,
  json: unknown,
  fetchJson: FetchJson
): Promise<RepoData> {
  const iconBase = indexUrl.slice(0, indexUrl.lastIndexOf('/'))
  let sites: RepoSite[]
  let suwatteV6: boolean | undefined
  let suwatteListUrl: string | undefined

  if (
    json && typeof json === 'object' &&
    Array.isArray((json as StremioCollection).addons)
  ) {
    return { sites: toRepoDataStremio(json as StremioCollection) }
  }

  if (
    json && typeof json === 'object' && !Array.isArray(json) &&
    'extensionList' in (json as Record<string, unknown>)
  ) {
    return { sites: toRepoDataMihonNew(json as MihonIndex) }
  }

  if (Array.isArray(json)) {
    const first = json[0] as Record<string, unknown> | undefined
    if (isSeanimeMarketplaceList(json)) {
      sites = toRepoDataSeanime(json)
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
    sites = await toRepoDataCloudstream(json as CloudstreamRepo, fetchJson)
  } else if (
    (json as AidokuIndex).sources?.length &&
    'iconURL' in (json as AidokuIndex).sources[0]
  ) {
    sites = toRepoDataAidoku(iconBase, json as AidokuIndex)
  } else if (
    (json as ManaIndex).sources?.length &&
    ('supportedLanguages' in (json as ManaIndex).sources[0] ||
      'environment' in (json as ManaIndex).sources[0])
  ) {
    sites = toRepoDataMana(iconBase, json as ManaIndex)
  } else if (
    (json as SuwatteCatalogIndex).sources?.length &&
    'thumbnail' in (json as SuwatteCatalogIndex).sources[0]
  ) {
    const result = toRepoDataSuwatte(iconBase, json as SuwatteCatalogIndex)
    sites = result.sites
    suwatteListUrl = result.listUrl
    suwatteV6 = (json as SuwatteCatalogIndex).catalogVersion === undefined
  } else if (Array.isArray((json as KotatsuIndex).sites)) {
    sites = toRepoDataKotatsu(json as KotatsuIndex)
  } else {
    sites = toRepoDataPaperback(iconBase, json as PaperbackIndex)
  }
  return { sites: sortSites(sites), suwatteV6, suwatteListUrl }
}

export interface ExtensionRepoData {
  sites: Record<string, RepoData>
  soraAuthors: Record<string, SoraAuthorRepo[]>
  echoAuthors: Record<string, EchoAuthorRepo[]>
  repoLists: Record<string, RepoListEntry[]>
}

export async function assembleSchemeData(
  indexUrls: string[],
  listUrls: string[],
  fetchJson: FetchJson
): Promise<ExtensionRepoData> {
  const listUrlSet = new Set(listUrls)
  const sites: Record<string, RepoData> = {}
  const soraAuthors: Record<string, SoraAuthorRepo[]> = {}
  const echoAuthors: Record<string, EchoAuthorRepo[]> = {}
  const repoLists: Record<string, RepoListEntry[]> = {}
  const pendingByAuthor: Record<string, RepoData> = {}

  const listJsons = await mapLimit(
    listUrls,
    FETCH_CONCURRENCY,
    url => fetchJson(url)
  )
  const listIndexGroups: {
    indexUrls: string[]
    repoJsons: unknown[]
    failed: boolean
  }[] = await Promise.all(listJsons.map(async (json) => {
    if (json === undefined) {
      return { indexUrls: [], repoJsons: [], failed: true }
    }
    if (!isCloudstreamRepoList(json)) {
      return { indexUrls: [], repoJsons: [], failed: false }
    }
    const indexUrls = [
      ...new Set(
        json.map(item => typeof item === 'string' ? item : item.url)
      )
    ]
    const repoJsons = await mapLimit(
      indexUrls,
      FETCH_CONCURRENCY,
      url => fetchJson(url)
    )
    return { indexUrls, repoJsons, failed: false }
  }))
  listUrls.forEach((listUrl, li) => {
    const { indexUrls, repoJsons, failed } = listIndexGroups[li]
    if (failed) return
    if (indexUrls.length === 0) {
      repoLists[listUrl] = []
      return
    }
    const entries: RepoListEntry[] = indexUrls.map((indexUrl, i) => ({
      label: repoListLabel(indexUrl, repoJsons[i]),
      indexUrl,
      repoUrl: inferRepoUrl(indexUrl)
    }))
    entries.sort((a, b) => a.label.localeCompare(b.label))
    repoLists[listUrl] = entries
  })
  const listRepoPairs = listIndexGroups.filter(g => !g.failed).flatMap(g =>
    g.indexUrls.map((url, i) => ({ url, json: g.repoJsons[i] })).filter(p =>
      p.json !== undefined
    )
  )
  const listRepoResults = await mapLimit(
    listRepoPairs,
    FETCH_CONCURRENCY,
    async ({ url, json }) => ({
      url,
      data: await toRepoData(url, json, fetchJson)
    })
  )
  for (const { url, data } of listRepoResults) {
    if (!(url in sites)) sites[url] = data
  }

  const remaining = indexUrls.filter(url =>
    !listUrlSet.has(url) && !(url in sites)
  )
  const jsons = await mapLimit(
    remaining,
    FETCH_CONCURRENCY,
    url => fetchJson(url)
  )
  for (let i = 0; i < remaining.length; i++) {
    const url = remaining[i]
    const json = jsons[i]
    if (json === undefined) continue
    if (isSoraRepoIndex(json)) {
      const result = await loadSoraRepoIndex(url, json, fetchJson)
      sites[url] = { sites: result.sites }
      soraAuthors[url] = result.authorRepos
      Object.assign(pendingByAuthor, result.sitesByAuthor)
      continue
    }
    if (isEchoExtensionList(json)) {
      const result = loadEchoExtensionList(url, json)
      sites[url] = { sites: result.sites }
      echoAuthors[url] = result.authorRepos
      Object.assign(pendingByAuthor, result.sitesByAuthor)
      continue
    }
    sites[url] = await toRepoData(url, json, fetchJson)
  }
  Object.assign(sites, pendingByAuthor)
  return { sites, soraAuthors, echoAuthors, repoLists }
}

import MiniSearch, {
  type Options,
  type SearchOptions,
  type SearchResult
} from 'minisearch'

import type { PageLink } from '../../plugins/urlSearchPlugin'

interface Result {
  title: string
  titles: string[]
  text?: string
}

type SearchMode = 'exact' | 'fuzzy' | 'url'

type PlainRecord = Record<string, unknown>

interface SearchConfig {
  options?: PlainRecord
  searchOptions?: PlainRecord
  useDefaultBoostDocument?: boolean
}

interface PageGroupCount {
  key: string
  count: number
}

interface LoadIndexRequest {
  type: 'load-index'
  id: number
  localeIndex: string
  indexJson: unknown
  indexVersion: number
  config: SearchConfig
}

interface TextSearchRequest {
  type: 'text-search'
  id: number
  query: string
  mode: SearchMode
  pageOrderEntries: [string, number][]
}

interface UrlSearchRequest {
  type: 'url-search'
  id: number
  query: string
  pageOrderEntries: [string, number][]
}

type SearchWorkerRequest =
  | LoadIndexRequest
  | TextSearchRequest
  | UrlSearchRequest

type WorkerSearchResult = SearchResult & Result

let searchIndex: MiniSearch<Result> | null = null
let searchIndexKey = ''
let urlLinks: PageLink[] = []
let urlLinksPromise: Promise<void> | null = null
let pageOrder = new Map<string, number>()
let docOrder = new Map<string, number>()

function defaultBoostDocument(
  _: string,
  term: string,
  storedFields: Record<string, string | string[]>
) {
  const titles = ((storedFields?.titles as string[] | undefined) ?? [])
    .filter((t) => Boolean(t))
    .map((t) => t.toLowerCase())
  const titleIndex = titles
    .map((t, i) => (t?.includes(term) ? i : -1))
    .find((i) => i >= 0) ?? -1
  if (titleIndex >= 0) return 10000 - titleIndex
  return 1
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const object = value as Record<string, unknown>
  return `{${
    Object.keys(object).sort().map((key) =>
      `${JSON.stringify(key)}:${stableStringify(object[key])}`
    ).join(',')
  }}`
}

function setPageOrder(entries: [string, number][]) {
  pageOrder = new Map(entries)
}

function getPageKey(id: string) {
  return id.split('#')[0].replace(/\/$/, '')
}

function getPageOrder(key: string) {
  return pageOrder.get(key) ?? Number.MAX_SAFE_INTEGER
}

function getDocOrder(id: string) {
  return docOrder.get(id) ?? Number.MAX_SAFE_INTEGER
}

function compareByPageAndDoc(a: { id: unknown }, b: { id: unknown }) {
  const aId = String(a.id)
  const bId = String(b.id)
  const pageDiff = getPageOrder(getPageKey(aId)) - getPageOrder(getPageKey(bId))
  if (pageDiff !== 0) return pageDiff
  return getDocOrder(aId) - getDocOrder(bId)
}

function rebuildDocOrder(index: MiniSearch<Result>) {
  const map = new Map<string, number>()
  const ids = (index as any)._documentIds
  if (ids instanceof Map) {
    let i = 0
    for (const originalId of ids.values()) {
      map.set(String(originalId), i++)
    }
  } else if (ids && typeof ids === 'object') {
    const keys = Object.keys(ids)
      .map(Number)
      .sort((a, b) => a - b)
    let i = 0
    for (const key of keys) {
      map.set(String(ids[key]), i++)
    }
  }
  docOrder = map
}

async function loadSearchIndex(
  localeIndex: string,
  indexVersion: number,
  indexJson: unknown,
  config: SearchConfig
) {
  const key = `${localeIndex}\n${indexVersion}\n${stableStringify(config)}`
  if (searchIndex && searchIndexKey === key) return

  const searchOptions = {
    boost: { title: 10, titles: 4, text: 1 },
    ...(config.searchOptions ?? {}),
    ...(config.useDefaultBoostDocument
      ? { boostDocument: defaultBoostDocument }
      : {})
  } as SearchOptions

  searchIndex = MiniSearch.loadJSON<Result>(
    indexJson as any,
    {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions,
      ...(config.options ?? {})
    } as Options<Result>
  )
  searchIndexKey = key
  rebuildDocOrder(searchIndex)
}

async function textSearch(message: TextSearchRequest) {
  setPageOrder(message.pageOrderEntries)
  if (!searchIndex) throw new Error('Search index has not been loaded')

  const dynamicSearchOptions = {
    fuzzy: message.mode === 'fuzzy' ? (0.3 as number | false) : false,
    prefix: message.mode === 'fuzzy'
      ? (term: string) => term.length > 3
      : false,
    maxFuzzy: message.mode === 'fuzzy' ? 1 : 0,
    boost: { title: 10, titles: 4, text: 1 }
  } as SearchOptions

  const ranked = searchIndex.search(
    message.query,
    dynamicSearchOptions
  ) as WorkerSearchResult[]

  const top = ranked.slice(0, 50)
  const seen = new Set(top.map((r) => r.id))
  const titleHits = ranked.filter(
    (r) => !seen.has(r.id) && r.match && Object.keys(r.match).length > 0
  )
  const results = [...top, ...titleHits].sort(compareByPageAndDoc)
  const terms = new Set<string>()
  for (const result of results) {
    for (const term in result.match) terms.add(term)
  }

  return {
    results,
    terms: [...terms]
  }
}

async function ensureUrlLinks() {
  if (urlLinks.length > 0) return
  if (urlLinksPromise) {
    await urlLinksPromise
    return
  }

  urlLinksPromise = fetch('/url-search-index.json')
    .then((r) => r.json())
    .then((data: PageLink[]) => {
      data.sort((a, b) => getPageOrder(a.pageId) - getPageOrder(b.pageId))
      urlLinks = data
    })
    .catch(() => {
      urlLinks = []
    })
    .finally(() => {
      urlLinksPromise = null
    })
  await urlLinksPromise
}

async function urlSearch(message: UrlSearchRequest) {
  setPageOrder(message.pageOrderEntries)
  await ensureUrlLinks()

  const query = message.query.trim().toLowerCase()
  if (!query) return { matches: [], pageGroups: [] }

  const matches: PageLink[] = []
  const pageGroups = new Map<string, PageGroupCount>()
  for (const link of urlLinks) {
    if (!link.href.toLowerCase().includes(query)) continue

    matches.push(link)
    const existing = pageGroups.get(link.pageId)
    if (existing) existing.count++
    else pageGroups.set(link.pageId, { key: link.pageId, count: 1 })
  }

  return {
    matches,
    pageGroups: [...pageGroups.values()].sort(
      (a, b) => getPageOrder(a.key) - getPageOrder(b.key)
    )
  }
}

self.onmessage = async (event: MessageEvent<SearchWorkerRequest>) => {
  const message = event.data
  try {
    const payload = message.type === 'load-index'
      ? await loadSearchIndex(
        message.localeIndex,
        message.indexVersion,
        message.indexJson,
        message.config
      )
      : message.type === 'text-search'
      ? await textSearch(message)
      : await urlSearch(message)
    self.postMessage({
      type: `${message.type}:success`,
      id: message.id,
      payload
    })
  } catch (error) {
    self.postMessage({
      type: `${message.type}:error`,
      id: message.id,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

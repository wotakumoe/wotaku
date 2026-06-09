import { Meilisearch } from 'meilisearch'
import type {
  MatchingStrategies,
  SearchParams
} from 'meilisearch'

import type {
  PageLink,
  PageSearchDocument
} from '../../plugins/urlSearchPlugin'
import { toExactSearchText } from '../../utils/meiliSearchText'

interface Result {
  id: string
  match: Record<string, string[]>
  score?: number
  tabs?: string[]
  title: string
  titles: string[]
  text?: string
}

type SearchMode = 'exact' | 'fuzzy' | 'url'

interface PageGroupCount {
  key: string
  count: number
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

type SearchWorkerRequest = TextSearchRequest | UrlSearchRequest

type SearchablePageDocument = PageSearchDocument & {
  _rankingScore?: number
}

type SearchablePageLink = PageLink & {
  _rankingScore?: number
}

const env = import.meta.env as Record<string, string | undefined>
const meiliHost = env.VITE_MEILI_HOST || 'http://127.0.0.1:7700'
const meiliIndexPrefix = (env.VITE_MEILI_INDEX_PREFIX || 'wotaku')
  .replace(/[^\dA-Za-z_-]/g, '_')

const client = new Meilisearch({
  host: meiliHost,
  apiKey: env.VITE_MEILI_SEARCH_KEY
})

const indexes = {
  docs: `${meiliIndexPrefix}_docs`,
  links: `${meiliIndexPrefix}_links`
}

const exactSearchableAttributes = [
  'exactTitle',
  'exactTitles',
  'exactText'
]

const fuzzySearchableAttributes = [
  'fuzzyTitle',
  'fuzzyTitles',
  'fuzzyText'
]

let pageOrder = new Map<string, number>()

function setPageOrder(entries: [string, number][]) {
  pageOrder = new Map(entries)
}

function getPageKey(id: string) {
  return id.split('#')[0].replace(/\/$/, '')
}

function getPageOrder(key: string) {
  return pageOrder.get(key) ?? Number.MAX_SAFE_INTEGER
}

function compareByPageAndSection(
  a: { id: string; pageId?: string; sectionOrder?: number },
  b: { id: string; pageId?: string; sectionOrder?: number }
) {
  const aPage = (a.pageId || getPageKey(a.id)).replace(/\/$/, '')
  const bPage = (b.pageId || getPageKey(b.id)).replace(/\/$/, '')
  const pageDiff = getPageOrder(aPage) - getPageOrder(bPage)
  if (pageDiff !== 0) return pageDiff
  return (a.sectionOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.sectionOrder ?? Number.MAX_SAFE_INTEGER)
}

function getQueryTerms(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
}

function getMatchMap(query: string) {
  return Object.fromEntries(
    getQueryTerms(query).map((term) => [term, ['title', 'titles', 'text']])
  )
}

function getSearchOptions(
  limit: number,
  attributesToSearchOn: string[],
  matchingStrategy: MatchingStrategies = 'all'
): SearchParams {
  return {
    attributesToRetrieve: [
      'id',
      'pageId',
      'anchor',
      'title',
      'titles',
      'tabs',
      'sectionOrder'
    ],
    attributesToSearchOn,
    limit,
    matchingStrategy,
    showMatchesPosition: true,
    showRankingScore: true
  }
}

async function textSearch(message: TextSearchRequest) {
  setPageOrder(message.pageOrderEntries)

  const query = message.query.trim()
  if (!query) return { results: [], terms: [] }

  const isFuzzy = message.mode === 'fuzzy'
  const searchQuery = isFuzzy ? query : toExactSearchText(query)
  if (!searchQuery) return { results: [], terms: [] }

  const response = await client.index<SearchablePageDocument>(indexes.docs).search(
    searchQuery,
    getSearchOptions(
      1000,
      isFuzzy ? fuzzySearchableAttributes : exactSearchableAttributes
    )
  )

  const match = getMatchMap(query)
  const results: Result[] = response.hits
    .map((hit) => ({
      id: hit.id,
      match,
      score: hit._rankingScore,
      title: hit.title,
      titles: hit.titles ?? [],
      ...(hit.tabs?.length ? { tabs: hit.tabs } : {})
    }))
    .sort(compareByPageAndSection)

  return {
    results,
    terms: Object.keys(match)
  }
}

function getLinkSearchOptions(): SearchParams {
  return {
    attributesToRetrieve: [
      'objectID',
      'id',
      'href',
      'hrefSearch',
      'linkText',
      'pageId',
      'anchor',
      'titles',
      'tabs'
    ],
    attributesToSearchOn: ['href', 'hrefSearch', 'linkText', 'titles'],
    limit: 10000,
    matchingStrategy: 'all',
    showRankingScore: true
  }
}

async function urlSearch(message: UrlSearchRequest) {
  setPageOrder(message.pageOrderEntries)

  const query = message.query.trim()
  if (!query) return { matches: [], pageGroups: [] }

  const response = await client.index<SearchablePageLink>(indexes.links).search(
    query,
    getLinkSearchOptions()
  )

  const matches = response.hits
    .map((hit) => ({
      objectID: hit.objectID,
      id: hit.id,
      href: hit.href,
      hrefSearch: hit.hrefSearch,
      linkText: hit.linkText,
      pageId: hit.pageId,
      anchor: hit.anchor,
      titles: hit.titles ?? [],
      ...(hit.tabs?.length ? { tabs: hit.tabs } : {})
    }))
    .sort((a, b) =>
      getPageOrder(a.pageId.replace(/\/$/, '')) -
        getPageOrder(b.pageId.replace(/\/$/, ''))
    )

  const pageGroups = new Map<string, PageGroupCount>()
  for (const link of matches) {
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
    const payload = message.type === 'text-search'
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

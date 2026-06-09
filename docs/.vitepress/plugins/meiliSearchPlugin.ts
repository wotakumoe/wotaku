import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Meilisearch, type Settings } from 'meilisearch'
import {
  createMarkdownRenderer,
  type MarkdownEnv,
  type SiteConfig
} from 'vitepress'
import {
  clearSearchMetadata,
  collectPageSearchMetadata,
  getSearchDocuments,
  getSearchLinks,
  type PageSearchDocument
} from './urlSearchPlugin'
import { toExactSearchText } from '../utils/meiliSearchText'

const DEFAULT_MEILI_HOST = 'http://127.0.0.1:7700'
const DEFAULT_INDEX_PREFIX = 'wotaku'

function isSearchIndexingEnabled() {
  const value = process.env.SEARCH?.toLowerCase()
  return Boolean(process.env.CI || value === '1' || value === 'true')
}

function getMeiliHost() {
  return process.env.MEILI_HOST ?? DEFAULT_MEILI_HOST
}

function getMeiliApiKey() {
  return process.env.MEILI_ADMIN_KEY ?? process.env.MEILI_MASTER_KEY
}

function getIndexPrefix() {
  return (process.env.MEILI_INDEX_PREFIX ?? DEFAULT_INDEX_PREFIX)
    .replace(/[^\dA-Za-z_-]/g, '_')
}

export function getMeiliIndexNames(prefix = getIndexPrefix()) {
  return {
    docs: `${prefix}_docs`,
    links: `${prefix}_links`
  }
}

function getLegacyDocIndexNames(prefix = getIndexPrefix()) {
  return [
    `${prefix}_docs_exact`,
    `${prefix}_docs_fuzzy`
  ]
}

async function waitForTask(client: Meilisearch, task: { taskUid: number }) {
  const result = await client.tasks.waitForTask(task)
  if (result.status === 'failed') {
    throw new Error(result.error?.message ?? `Meilisearch task ${task.taskUid} failed`)
  }
}

async function ensureIndex(client: Meilisearch, uid: string) {
  try {
    const index = await client.getRawIndex(uid)
    if (index.primaryKey === 'objectID') return
    await waitForTask(client, await client.deleteIndex(uid))
  } catch {
    // Create below when the index is absent.
  }
  await waitForTask(client, await client.createIndex(uid, { primaryKey: 'objectID' }))
}

async function replaceIndexDocuments<T extends Record<string, unknown>>(
  client: Meilisearch,
  uid: string,
  settings: Settings,
  documents: T[]
) {
  await ensureIndex(client, uid)

  const index = client.index<T>(uid)
  await waitForTask(client, await index.updateSettings(settings))
  await waitForTask(client, await index.deleteAllDocuments())

  if (documents.length) {
    await waitForTask(client, await index.addDocuments(documents))
  }
}

async function deleteIndexIfExists(client: Meilisearch, uid: string) {
  try {
    await waitForTask(client, await client.deleteIndex(uid))
  } catch {
    // The index may not exist yet.
  }
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

type MeiliPageSearchDocument = PageSearchDocument & {
  exactTitle: string
  exactTitles: string
  exactText: string
  fuzzyTitle: string
  fuzzyTitles: string
  fuzzyText: string
}

function toMeiliPageSearchDocument(
  document: PageSearchDocument
): MeiliPageSearchDocument {
  return {
    ...document,
    exactTitle: toExactSearchText(document.title),
    exactTitles: toExactSearchText(document.titles),
    exactText: toExactSearchText(document.text),
    fuzzyTitle: document.title,
    fuzzyTitles: document.titles.join(' '),
    fuzzyText: document.text
  }
}

function getDocsSettings(): Settings {
  return {
    searchableAttributes: [
      ...exactSearchableAttributes,
      ...fuzzySearchableAttributes
    ],
    displayedAttributes: [
      'id',
      'objectID',
      'pageId',
      'anchor',
      'title',
      'titles',
      'tabs',
      'sectionOrder'
    ],
    filterableAttributes: ['pageId'],
    sortableAttributes: ['sectionOrder'],
    rankingRules: [
      'words',
      'typo',
      'attribute',
      'proximity',
      'exactness',
      'sort'
    ],
    pagination: { maxTotalHits: 5000 },
    prefixSearch: 'indexingTime',
    typoTolerance: {
      enabled: true,
      disableOnAttributes: exactSearchableAttributes
    }
  }
}

const linkSettings: Settings = {
  searchableAttributes: ['href', 'hrefSearch', 'linkText', 'titles'],
  displayedAttributes: [
    'id',
    'objectID',
    'href',
    'linkText',
    'pageId',
    'anchor',
    'titles',
    'tabs'
  ],
  filterableAttributes: ['pageId'],
  pagination: { maxTotalHits: 10000 },
  prefixSearch: 'indexingTime',
  typoTolerance: {
    enabled: false
  }
}

async function collectSearchData(siteConfig: SiteConfig) {
  clearSearchMetadata()

  const md = await createMarkdownRenderer(
    siteConfig.srcDir,
    siteConfig.markdown,
    siteConfig.site.base,
    siteConfig.logger
  )

  for (const page of siteConfig.pages) {
    const file = join(siteConfig.srcDir, page)
    const src = await readFile(file, 'utf-8')
    const env: MarkdownEnv = {
      path: file,
      relativePath: page,
      cleanUrls: siteConfig.cleanUrls
    }
    const html = md.render(src, env)

    if (env.frontmatter?.search === false) continue
    collectPageSearchMetadata(src, page, html)
  }
}

export async function indexMeiliSearch(siteConfig: SiteConfig) {
  if (!isSearchIndexingEnabled()) {
    console.log('[meilisearch] skipped indexing; set SEARCH=1 or run in CI to enable')
    return false
  }

  await collectSearchData(siteConfig)

  const documents = getSearchDocuments().map(toMeiliPageSearchDocument)
  const links = getSearchLinks()
  const host = getMeiliHost()
  const client = new Meilisearch({
    host,
    apiKey: getMeiliApiKey()
  })
  await client.health()

  const indexes = getMeiliIndexNames()
  await replaceIndexDocuments(
    client,
    indexes.docs,
    getDocsSettings(),
    documents
  )
  await replaceIndexDocuments(client, indexes.links, linkSettings, links)
  await Promise.all(
    getLegacyDocIndexNames().map((uid) => deleteIndexIfExists(client, uid))
  )

  console.log(
    `[meilisearch] indexed ${documents.length} sections and ${links.length} links into ${host}`
  )
  return true
}

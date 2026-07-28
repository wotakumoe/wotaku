<script lang="ts" setup>
import type { SearchResult } from 'minisearch'
import { dataSymbol, type DefaultTheme, inBrowser, useRouter } from 'vitepress'
import {
  computed,
  createApp,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
// @ts-ignore
import { pathToFile } from 'vitepress/dist/client/app/utils'

import {
  computedAsync,
  onKeyStroke,
  useEventListener,
  useScrollLock,
  useSessionStorage,
  watchDebounced
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { AnimatePresence } from 'motion-v'

// @ts-ignore
import localSearchIndex from '@localSearchIndex'

import {
  File,
  Hash,
  ArrowRight
} from 'lucide-vue-next'

import Mark from 'mark.js/dist/mark.es6.js'
import { sidebar } from '../../../configs/constants'
import type { PageLink } from '../../plugins/urlSearchPlugin'
import { LRUCache } from '../../composables/search/lru-cache'
import { createSearchTranslate } from '../../composables/search/translation'
import { useData } from '../../composables/search/use-data'
import { useEffects } from '../../composables/useEffects'
import { applyFavicons, useFavicons } from '../../composables/useFavicons'
import { registerGlobalComponents } from '../../globalComponents'
import {
  excerptPreload,
  saveHistoryEnabled,
  searchHistory,
  searchMode,
  searchResultHighlightMode,
  showDetailedList,
  type SearchHistoryEntry,
  type SearchSortMode
} from '../../searchState'
import { enhanceAppWithTabs } from '../tabs'

import type {
  FooterTranslations,
  ModalTranslations,
  Result,
  PageGroupCount,
  UrlResult,
  TextSearchWorkerPayload,
  UrlSearchWorkerPayload,
  SearchWorkerRequest
} from './types'

import {
  escapeHtml,
  highlightUrl,
  formMarkRegex,
  toHistoryPathHtml,
  hasExcerptPreview,
  getPageKey,
  getDocId,
  getDocAnchor,
  getPageLabel,
  getPageOrder,
  buildResultHref,
  getSearchResultHref,
  stripNonCloneable,
  getPageOrderEntries,
  nextFrame
} from './utils'

import { useSearchMotion } from './SearchMotion'

import SearchBar from './SearchBar.vue'
import SearchRibbon from './SearchRibbon.vue'
import SearchPagination from './SearchPagination.vue'
import SearchKeyboardShortcuts from './SearchKeyboardShortcuts.vue'
import SearchEmptyState from './SearchEmptyState.vue'
import SearchHistory from './SearchHistory.vue'
import SearchSettings from './SearchSettings.vue'

const showSearch = defineModel<boolean>()

const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()
const searchBarRef = ref<InstanceType<typeof SearchBar>>()
const ribbonRef = ref<InstanceType<typeof SearchRibbon>>()

/* Refs exposed by SearchBar */
const searchInput = computed(() => searchBarRef.value?.searchInput as HTMLInputElement | undefined)
const settingsButtonRef = computed(() => searchBarRef.value?.settingsButtonRef as HTMLButtonElement | undefined)

/* Search */
const searchIndexData = shallowRef(localSearchIndex)
const searchIndexVersion = ref(0)

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept('@localSearchIndex', (m) => {
    if (m) {
      searchIndexData.value = m.default
      searchIndexVersion.value++
    }
  })
}

const vitePressData = useData()
const { activate } = useFocusTrap(el, {
  immediate: true,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
  returnFocusOnDeactivate: false,
  initialFocus: () => searchInput.value
})
const { localeIndex, theme } = vitePressData

const disableQueryPersistence = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.disableQueryPersistence === true
  )
})

const filterText = disableQueryPersistence.value
  ? ref('')
  : useSessionStorage('vitepress:local-search-filter', '')

const { effectsEnabled: searchAnimationsEnabled } = useEffects()
const { faviconsEnabled } = useFavicons()
const showKeyboardShortcuts = computed(() => !filterText.value)

// Motion config
const {
  searchMotionDiv,
  searchMotionForm,
  searchMotionLi,
  backdropMotion,
  shellMotion,
  formMotion,
  ribbonMotion,
  emptyStateMotion,
  resultMotion,
  excerptMotion,
  footerMotion
} = useSearchMotion(searchAnimationsEnabled)

const urlFilterDebounced = ref(filterText.value)
let urlDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(filterText, (v) => {
  clearTimeout(urlDebounceTimer)
  if (!v) {
    urlFilterDebounced.value = ''
    return
  }
  urlDebounceTimer = setTimeout(() => {
    urlFilterDebounced.value = v
  }, 60)
})
onBeforeUnmount(() => clearTimeout(urlDebounceTimer))

const matchExact = computed(() => searchMode.value === 'exact')
const urlSearchMode = computed(() => searchMode.value === 'url')

const showHistory = computed(
  () => !filterText.value && searchHistory.value.length > 0
)

function saveToHistory(
  query: string,
  mode: SearchSortMode,
  path?: string[],
  href?: string,
  resultText?: string
) {
  const trimmed = query.trim()
  if (!trimmed || !saveHistoryEnabled.value) return
  const pathKey = (path ?? []).join('\n')
  searchHistory.value = [
    { query: trimmed, mode, path, href, resultText },
    ...searchHistory.value.filter(
      (h) => !(h.query === trimmed && h.mode === mode && (h.path ?? []).join('\n') === pathKey)
    )
  ]
}

function removeFromHistory(index: number) {
  searchHistory.value = searchHistory.value.filter((_, i) => i !== index)
}

function applyHistory(entry: SearchHistoryEntry) {
  if (entry.href) {
    window.dispatchEvent(
      new CustomEvent('search-nav', {
        detail: { query: entry.query, resultText: entry.resultText }
      })
    )
    router.go(entry.href)
    showSearch.value = false
    return
  }
  searchMode.value = entry.mode
  filterText.value = entry.query
  nextTick(() => focusSearchInput(false))
}

// Settings popup
const showSettingsPopup = ref(false)

const urlMatches = shallowRef<PageLink[]>([])
const urlPageGroupCounts = shallowRef<PageGroupCount[]>([])

const URL_PAGE_SIZE = 25
const urlPage = ref(1)
const urlActivePageFilter = ref<string | null>(null)

const urlPageGroups = computed(() =>
  urlPageGroupCounts.value
    .map((group) => ({
      key: group.key,
      label: getPageLabel(group.key, pageMeta),
      count: group.count
    }))
    .sort((a, b) => getPageOrder(a.key, pageMeta) - getPageOrder(b.key, pageMeta))
)

const urlFilteredMatches = computed((): PageLink[] => {
  if (!urlActivePageFilter.value) return urlMatches.value
  return urlMatches.value.filter((l) => l.pageId === urlActivePageFilter.value)
})

const urlTotalPages = computed(() =>
  Math.max(1, Math.ceil(urlFilteredMatches.value.length / URL_PAGE_SIZE))
)

const urlCurrentPage = computed(() =>
  Math.min(urlPage.value, urlTotalPages.value)
)

const filteredUrlResults = computed((): UrlResult[] => {
  const matches = urlFilteredMatches.value
  const start = (urlCurrentPage.value - 1) * URL_PAGE_SIZE
  const end = start + URL_PAGE_SIZE
  const out: UrlResult[] = []
  const query = urlFilterDebounced.value.trim()
  for (let i = start; i < end && i < matches.length; i++) {
    const link = matches[i]
    out.push({
      href: link.href,
      linkText: link.linkText,
      pageId: link.pageId,
      anchor: link.anchor,
      titles: link.titles,
      tabs: link.tabs,
      highlighted: highlightUrl(link.href, query)
    })
  }
  return out
})

const urlPageList = computed<(number | '…')[]>(() => {
  const total = urlTotalPages.value
  const current = urlCurrentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push('…')
  for (let p = left; p <= right; p++) pages.push(p)
  if (right < total - 1) pages.push('…')
  pages.push(total)
  return pages
})

function goToUrlPage(p: number) {
  const target = Math.min(Math.max(1, p), urlTotalPages.value)
  if (target === urlCurrentPage.value) return
  urlPage.value = target
  selectedIndex.value = filteredUrlResults.value.length ? 1 : -1
  nextTick(() => {
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    scrollToSelectedResult()
  })
}

watch([urlFilterDebounced, urlActivePageFilter], () => { urlPage.value = 1 })

watch(urlMatches, () => {
  if (
    urlActivePageFilter.value &&
    !urlPageGroups.value.some((g) => g.key === urlActivePageFilter.value)
  ) {
    urlActivePageFilter.value = null
  }
})

watch(urlSearchMode, (active) => {
  if (!active) {
    urlActivePageFilter.value = null
    urlPage.value = 1
  }
})

function setUrlPageFilter(key: string | null) {
  urlActivePageFilter.value = urlActivePageFilter.value === key ? null : key
  urlPage.value = 1
  selectedIndex.value = filteredUrlResults.value.length ? 1 : -1
  nextTick(() => {
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    scrollToSelectedResult()
  })
}

const disableDetailedView = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.detailedView === false
  )
})

const buttonText = computed(() => {
  const options = theme.value.search?.options
  return (
    options?.locales?.[localeIndex.value]?.translations?.button?.buttonText ||
    options?.translations?.button?.buttonText ||
    'Search'
  )
})

watchEffect(() => {
  if (disableDetailedView.value) {
    showDetailedList.value = false
  }
})

const results: Ref<(SearchResult & Result)[]> = shallowRef([])
const currentTerms = shallowRef(new Set<string>())
const enableNoResults = ref(false)
const textSearchLoading = ref(false)
const urlSearchLoading = ref(false)
const searchLoading = computed(() =>
  urlSearchMode.value ? urlSearchLoading.value : textSearchLoading.value
)

const pageMeta = (() => {
  const map = new Map<string, { label: string; order: number }>()
  let order = 0
  const stripIcon = (text: string) =>
    text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const walk = (items: DefaultTheme.SidebarItem[]) => {
    for (const item of items) {
      if (item.link) {
        const key = item.link.replace(/\/$/, '')
        if (!map.has(key)) {
          map.set(key, { label: stripIcon(item.text ?? key), order: order++ })
        }
      }
      if (item.items) walk(item.items)
    }
  }
  walk(sidebar as DefaultTheme.SidebarItem[])
  return map
})()

const activePageFilter = ref<string | null>(null)
const searchWorkerReady = ref(false)
const searchWorkerConfigKey = computed(() =>
  JSON.stringify(getMiniSearchWorkerConfig())
)

let searchWorker: Worker | undefined
let searchWorkerRequestId = 0
let loadedWorkerIndexKey = ''
let preloadedSearchDataKey = ''
let preloadSearchDataRequest: { key: string; promise: Promise<void> } | undefined
const searchWorkerRequests = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }
>()

function getMiniSearchWorkerConfig() {
  const miniSearch = theme.value.search?.provider === 'local'
    ? theme.value.search.options?.miniSearch
    : undefined
  const rawSearchOptions = miniSearch?.searchOptions as Record<string, unknown> | undefined
  return {
    options: stripNonCloneable(miniSearch?.options) as Record<string, unknown> | undefined,
    searchOptions: stripNonCloneable(rawSearchOptions) as Record<string, unknown> | undefined,
    useDefaultBoostDocument: typeof rawSearchOptions?.boostDocument === 'function'
  }
}

async function preloadSearchData(
  localeIndexValue: string,
  indexVersion: number,
  configKey: string
) {
  const workerIndexKey = `${localeIndexValue}\n${indexVersion}\n${configKey}`
  if (preloadedSearchDataKey === workerIndexKey) return
  if (preloadSearchDataRequest?.key === workerIndexKey) {
    await preloadSearchDataRequest.promise
    return
  }

  const promise = (async () => {
    if (loadedWorkerIndexKey !== workerIndexKey) {
      const indexJson = (await searchIndexData.value[localeIndexValue]?.())?.default
      await postSearchWorker<void>({
        type: 'load-index',
        localeIndex: localeIndexValue,
        indexJson,
        indexVersion,
        config: getMiniSearchWorkerConfig()
      })
      loadedWorkerIndexKey = workerIndexKey
    }

    await postSearchWorker<void>({
      type: 'preload-metadata',
      pageOrderEntries: getPageOrderEntries(pageMeta)
    })
    preloadedSearchDataKey = workerIndexKey
  })()

  preloadSearchDataRequest = { key: workerIndexKey, promise }
  try {
    await promise
  } finally {
    if (preloadSearchDataRequest?.promise === promise) {
      preloadSearchDataRequest = undefined
    }
  }
}

function ensureSearchWorker() {
  if (!inBrowser || searchWorker) return searchWorker

  try {
    searchWorker = new Worker(
      new URL('../../workers/searchWorker.ts', import.meta.url),
      { type: 'module' }
    )
  } catch (error) {
    console.error('[search] failed to start search worker', error)
    return
  }

  searchWorker.onmessage = (event: MessageEvent) => {
    const data = event.data as { id: number; type: string; payload?: unknown; error?: string }
    const request = searchWorkerRequests.get(data.id)
    if (!request) return
    searchWorkerRequests.delete(data.id)
    if (data.type.endsWith(':error')) {
      request.reject(new Error(data.error ?? 'Search worker failed'))
    } else {
      request.resolve(data.payload)
    }
  }
  searchWorker.onerror = (event) => {
    console.error('[search] search worker error', event)
  }
  searchWorkerReady.value = true
  return searchWorker
}

function postSearchWorker<T>(message: SearchWorkerRequest) {
  const worker = ensureSearchWorker()
  if (!worker) return Promise.reject(new Error('Search worker is unavailable'))

  const id = ++searchWorkerRequestId
  return new Promise<T>((resolve, reject) => {
    searchWorkerRequests.set(id, { resolve: (value) => resolve(value as T), reject })
    worker.postMessage({ ...message, id })
  })
}

onMounted(() => { ensureSearchWorker() })

onBeforeUnmount(() => {
  searchWorker?.terminate()
  searchWorker = undefined
  loadedWorkerIndexKey = ''
  preloadedSearchDataKey = ''
  preloadSearchDataRequest = undefined
  searchWorkerReady.value = false
  for (const request of searchWorkerRequests.values()) {
    request.reject(new Error('Search worker was terminated'))
  }
  searchWorkerRequests.clear()
})

// Watch: preload search data when search opens
watch(
  () => [searchWorkerReady.value, showSearch.value, localeIndex.value, searchIndexVersion.value, searchWorkerConfigKey.value] as const,
  async ([ready, isOpen, localeIndexValue, indexVersion, configKey]) => {
    if (!ready || !isOpen) return
    try {
      await preloadSearchData(localeIndexValue, indexVersion, configKey)
    } catch (error) {
      console.error('[search] search data preload failed', error)
    }
  },
  { immediate: true }
)

// Watch: URL search
watch(
  () => [searchWorkerReady.value, showSearch.value, urlSearchMode.value, urlFilterDebounced.value] as const,
  async ([ready, isOpen, active, query], _old, onCleanup) => {
    let canceled = false
    onCleanup(() => { canceled = true })
    if (!active || !isOpen || !query.trim()) {
      urlMatches.value = []
      urlPageGroupCounts.value = []
      urlSearchLoading.value = false
      return
    }
    if (!ready) { urlSearchLoading.value = false; return }
    urlSearchLoading.value = true
    try {
      const payload = await postSearchWorker<UrlSearchWorkerPayload>({
        type: 'url-search',
        query,
        pageOrderEntries: getPageOrderEntries(pageMeta)
      })
      if (canceled) return
      urlMatches.value = payload.matches
      urlPageGroupCounts.value = payload.pageGroups
      urlSearchLoading.value = false
    } catch (error) {
      if (!canceled) {
        console.error('[search] URL search worker request failed', error)
        urlMatches.value = []
        urlPageGroupCounts.value = []
        urlSearchLoading.value = false
      }
    }
  },
  { immediate: true }
)

// Page groups computed
const pageGroups = computed(() => {
  const map = new Map<string, { key: string; label: string; count: number }>()
  for (const r of results.value) {
    const key = getPageKey(r.id)
    const existing = map.get(key)
    if (existing) existing.count++
    else map.set(key, { key, label: getPageLabel(key, pageMeta), count: 1 })
  }
  return [...map.values()].sort(
    (a, b) => getPageOrder(a.key, pageMeta) - getPageOrder(b.key, pageMeta)
  )
})

const filteredResults = computed(() => {
  if (!activePageFilter.value) return results.value
  return results.value.filter((r) => getPageKey(r.id) === activePageFilter.value)
})

// Normal pagination
const NORMAL_PAGE_SIZE = URL_PAGE_SIZE
const normalPage = ref(1)
const normalTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredResults.value.length / NORMAL_PAGE_SIZE))
)
const normalCurrentPage = computed(() =>
  Math.min(normalPage.value, normalTotalPages.value)
)

const pagedResults = computed(() => {
  const start = (normalCurrentPage.value - 1) * NORMAL_PAGE_SIZE
  return filteredResults.value.slice(start, start + NORMAL_PAGE_SIZE)
})

const normalPageList = computed<(number | '…')[]>(() => {
  const total = normalTotalPages.value
  const current = normalCurrentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push('…')
  for (let p = left; p <= right; p++) pages.push(p)
  if (right < total - 1) pages.push('…')
  pages.push(total)
  return pages
})

function goToNormalPage(p: number) {
  const target = Math.min(Math.max(1, p), normalTotalPages.value)
  if (target === normalCurrentPage.value) return
  normalPage.value = target
  selectedIndex.value = pagedResults.value.length ? 1 : -1
  nextTick(() => {
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    scrollToSelectedResult()
    reapplyHighlights()
    void buildVisibleExcerpts()
  })
}

function setPageFilter(key: string | null) {
  activePageFilter.value = activePageFilter.value === key ? null : key
  normalPage.value = 1
  selectedIndex.value = filteredResults.value.length ? 1 : -1
  nextTick(() => {
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    scrollToSelectedResult()
    reapplyHighlights()
    void buildVisibleExcerpts()
  })
}

// Mark.js & excerpts
const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

const cache = new LRUCache<string, Map<string, string>>(120)
const inFlightExcerpts = new Map<string, Promise<void>>()
const excerptCache = new LRUCache<string, unknown>(24)

async function reapplyHighlights() {
  if (!showDetailedList.value || !currentTerms.value.size) {
    centerExcerptsUntilSettled()
    return
  }
  await new Promise<void>((resolve) => {
    mark.value?.unmark({
      done: () => {
        mark.value?.markRegExp(formMarkRegex(currentTerms.value), {
          done: () => resolve()
        })
      }
    })
  })
  await nextTick()
  centerExcerptsUntilSettled()
}

const toRows = (list: (SearchResult & Result)[]) =>
  list.map((r) => {
    const map = cache.get(getDocId(r.id))
    return { ...r, text: map?.get(getDocAnchor(r.id)) ?? '' }
  })

let excerptBuildToken = 0

function visiblePageDocs(pageOffset: number): string[] {
  const start = (normalCurrentPage.value - 1 + pageOffset) * NORMAL_PAGE_SIZE
  if (start < 0) return []
  const list = filteredResults.value
  const docs: string[] = []
  const seen = new Set<string>()
  for (let i = start; i < start + NORMAL_PAGE_SIZE && i < list.length; i++) {
    const docId = getDocId(String(list[i].id))
    if (!seen.has(docId)) {
      seen.add(docId)
      docs.push(docId)
    }
  }
  return docs
}

async function buildVisibleExcerpts() {
  const token = ++excerptBuildToken
  if (!showDetailedList.value || urlSearchMode.value) return

  let builtAny = false
  let sliceStart = performance.now()

  const refreshRows = async () => {
    const keepSelected = selectedIndex.value
    results.value = toRows(results.value)
    await nextTick()
    if (token !== excerptBuildToken) return false
    selectedIndex.value = keepSelected
    return true
  }

  const buildAll = async (docIds: string[], progressive = false) => {
    for (const docId of docIds) {
      if (cache.get(docId)) continue
      await buildDocExcerpt(docId)
      if (token !== excerptBuildToken) return false
      builtAny = true
      if (performance.now() - sliceStart > 40) {
        if (progressive && !(await refreshRows())) return false
        await nextFrame()
        if (token !== excerptBuildToken) return false
        sliceStart = performance.now()
      }
    }
    return true
  }

  if (!(await buildAll(visiblePageDocs(0), true))) return

  const rowsStale = pagedResults.value.some((r) => {
    if (r.text) return false
    const map = cache.get(getDocId(String(r.id)))
    return Boolean(map?.get(getDocAnchor(String(r.id))))
  })

  if (builtAny || rowsStale) {
    if (!(await refreshRows())) return
    await reapplyHighlights()
    if (token !== excerptBuildToken) return
  }

  if (excerptPreload.value === 'next') {
    await buildAll(visiblePageDocs(1))
  } else if (excerptPreload.value === 'all') {
    const seen = new Set<string>()
    const docs: string[] = []
    for (const r of results.value) {
      const docId = getDocId(String(r.id))
      if (!seen.has(docId)) {
        seen.add(docId)
        docs.push(docId)
      }
    }
    await buildAll(docs)
  }
}

function buildDocExcerpt(docId: string): Promise<void> {
  if (cache.get(docId)) return Promise.resolve()
  const pending = inFlightExcerpts.get(docId)
  if (pending) return pending

  const job = (async () => {
    const { mod } = await fetchExcerpt(docId)
    if (cache.get(docId)) return
    const comp = (mod as any).default ?? mod
    if (!(comp?.render || comp?.setup)) return

    const map = new Map<string, string>()
    const app = createApp(comp)
    app.config.warnHandler = () => {}
    enhanceAppWithTabs(app, { renderAll: true })
    registerGlobalComponents(app)
    app.provide(dataSymbol, vitePressData)
    Object.defineProperties(app.config.globalProperties, {
      $frontmatter: { get() { return vitePressData.frontmatter.value } },
      $params: { get() { return vitePressData.page.value.params } }
    })
    const div = document.createElement('div')
    try {
      const originalCreateElement = document.createElement
      document.createElement = function (this: Document, ...args: Parameters<Document['createElement']>) {
        const el = originalCreateElement.apply(this, args)
        if (el instanceof HTMLImageElement) { el.loading = 'lazy'; el.decoding = 'async' }
        return el
      } as typeof document.createElement
      try { app.mount(div) } finally { document.createElement = originalCreateElement }
      const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach((heading) => {
        const href = heading.querySelector('a')?.getAttribute('href')
        const anchor = href?.startsWith('#') && href.slice(1)
        if (!anchor) return
        let html = ''
        let node = heading as Element
        while ((node = node.nextElementSibling!) && !/^h[1-6]$/i.test(node.tagName)) {
          html += (node as HTMLElement).outerHTML
        }
        map.set(anchor, html)
      })
    } catch (e) {
      console.error('[search] excerpt render failed for', docId, e)
    } finally {
      try { app.unmount() } catch { /* ignore */ }
    }
    cache.set(docId, map)
  })()

  inFlightExcerpts.set(docId, job)
  job.finally(() => {
    if (inFlightExcerpts.get(docId) === job) inFlightExcerpts.delete(docId)
  })
  return job
}

async function fetchExcerpt(id: string) {
  const docId = getDocId(id)
  const cached = excerptCache.get(docId)
  if (cached) return { id, mod: cached }
  const file = pathToFile(docId)
  try {
    if (!file) throw new Error(`Cannot find file for id: ${id}`)
    const mod = await import(/*@vite-ignore*/ file)
    excerptCache.set(docId, mod)
    return { id, mod }
  } catch (e) {
    console.error(e)
    return { id, mod: {} }
  }
}

watch(excerptPreload, () => { void buildVisibleExcerpts() })

watch(results, () => {
  if (
    activePageFilter.value &&
    !pageGroups.value.some((g) => g.key === activePageFilter.value)
  ) {
    activePageFilter.value = null
  }
})

watch(filterText, () => { enableNoResults.value = false })

// Debounced text search
watchDebounced(
  () => [searchWorkerReady.value, showSearch.value, localeIndex.value, searchIndexVersion.value, searchWorkerConfigKey.value, filterText.value, showDetailedList.value, searchMode.value] as const,
  async ([ready, isOpen, localeIndexValue, indexVersion, configKey, filterTextValue, showDetailedListValue, mode], old, onCleanup) => {
    if (old?.[2] !== localeIndexValue || old?.[3] !== indexVersion || old?.[4] !== configKey) {
      cache.clear()
    }
    let canceled = false
    onCleanup(() => { canceled = true })
    excerptBuildToken++
    if (!ready || !isOpen) { textSearchLoading.value = false; return }

    if (mode === 'url') {
      results.value = []
      currentTerms.value = new Set()
      enableNoResults.value = Boolean(filterTextValue.trim())
      textSearchLoading.value = false
      return
    }

    const searchQuery = filterTextValue.trim()
    textSearchLoading.value = Boolean(searchQuery)
    try {
      await preloadSearchData(localeIndexValue, indexVersion, configKey)
      if (canceled) return
    } catch (error) {
      if (!canceled) {
        console.error('[search] text search index preload failed', error)
        results.value = []; currentTerms.value = new Set()
        enableNoResults.value = Boolean(searchQuery); textSearchLoading.value = false
      }
      return
    }
    if (!searchQuery) {
      results.value = []; currentTerms.value = new Set()
      enableNoResults.value = false; textSearchLoading.value = false
      return
    }

    let workerPayload: TextSearchWorkerPayload
    try {
      workerPayload = await postSearchWorker<TextSearchWorkerPayload>({
        type: 'text-search',
        query: searchQuery,
        mode,
        pageOrderEntries: getPageOrderEntries(pageMeta)
      })
    } catch (error) {
      if (!canceled) {
        console.error('[search] text search worker request failed', error)
        results.value = []; currentTerms.value = new Set()
        enableNoResults.value = true; textSearchLoading.value = false
      }
      return
    }
    if (canceled) return

    const _result = workerPayload.results
    const terms = new Set(workerPayload.terms)
    currentTerms.value = terms
    enableNoResults.value = true
    if (!_result.length) { results.value = []; textSearchLoading.value = false; return }

    const highlight = () =>
      new Promise<void>((resolve) => {
        if (!terms.size || !mark.value) { resolve(); return }
        mark.value.unmark({
          done: () => {
            mark.value?.markRegExp(formMarkRegex(terms), { done: () => resolve() })
          }
        })
      })

    normalPage.value = 1
    results.value = toRows(_result)
    await nextTick()
    if (canceled) return
    await highlight()
    await nextTick()
    await nextFrame()
    if (canceled) return
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    centerExcerptsUntilSettled()
    if (showDetailedListValue) {
      await buildVisibleExcerpts()
      if (canceled) return
    }
    textSearchLoading.value = false
  },
  { debounce: 80, immediate: true }
)

// Excerpt centering
function centerExcerpts() {
  const excerpts = el.value?.querySelectorAll('.result .excerpt') ?? []
  for (let i = 0; i < excerpts.length; i++) {
    const excerptElement = excerpts[i] as HTMLElement
    const markNode = excerptElement.querySelector('mark[data-markjs="true"]') as HTMLElement | null
    if (!markNode) continue
    const viewportHeight = excerptElement.clientHeight || 84
    let offset = 0
    let node: HTMLElement | null = markNode
    while (node && node !== excerptElement) {
      offset += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    const targetScrollTop = offset - viewportHeight / 2 + markNode.offsetHeight / 2
    excerptElement.scrollTop = Math.max(0, targetScrollTop)
  }
}

let centerHandle = 0

function centerExcerptsUntilSettled(duration = searchAnimationsEnabled.value ? 450 : 0) {
  if (centerHandle) cancelAnimationFrame(centerHandle)
  if (duration <= 0) {
    centerHandle = requestAnimationFrame(() => { centerExcerpts(); centerHandle = 0 })
    return
  }
  const start = performance.now()
  const tick = () => {
    centerExcerpts()
    if (performance.now() - start < duration) {
      centerHandle = requestAnimationFrame(tick)
    } else { centerHandle = 0 }
  }
  centerHandle = requestAnimationFrame(tick)
}

onBeforeUnmount(() => {
  if (centerHandle) cancelAnimationFrame(centerHandle)
})

// Search input
const disableReset = computed(() => filterText.value?.length <= 0)

function focusSearchInput(select = true) {
  searchInput.value?.focus()
  select && searchInput.value?.select()
}

onMounted(() => { focusSearchInput() })

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') focusSearchInput()
}

// Keyboard navigation
const selectedIndex = ref(-1)
const disableMouseOver = ref(true)

const activeResultsLength = computed(() =>
  urlSearchMode.value ? filteredUrlResults.value.length : pagedResults.value.length
)

watch(pagedResults, (r) => {
  if (!urlSearchMode.value) { selectedIndex.value = r.length ? 0 : -1; scrollToSelectedResult() }
})

watch(filteredUrlResults, (r) => {
  if (urlSearchMode.value) { selectedIndex.value = r.length ? 0 : -1; scrollToSelectedResult() }
})

watch([pagedResults, filteredUrlResults, faviconsEnabled], () => {
  if (!faviconsEnabled.value) return
  nextTick(() => { if (resultsEl.value) applyFavicons(resultsEl.value) })
})

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector('.result.selected')
    selectedEl?.scrollIntoView({ block: 'nearest' })
  })
}

function goToSearchPageDelta(delta: number) {
  if (urlSearchMode.value) {
    const target = urlCurrentPage.value + delta
    if (target < 1 || target > urlTotalPages.value) return false
    goToUrlPage(target)
    return true
  }
  const target = normalCurrentPage.value + delta
  if (target < 1 || target > normalTotalPages.value) return false
  goToNormalPage(target)
  return true
}

function cyclePageTab(delta: number) {
  if (urlSearchMode.value) {
    if (urlPageGroups.value.length <= 1) return false
    const keys = [null, ...urlPageGroups.value.map((group) => group.key)]
    const current = keys.indexOf(urlActivePageFilter.value)
    const next = (current + delta + keys.length) % keys.length
    setUrlPageFilter(keys[next])
    ribbonRef.value?.scrollActivePagePillIntoView(delta)
    return true
  }
  if (pageGroups.value.length <= 1) return false
  const keys = [null, ...pageGroups.value.map((group) => group.key)]
  const current = keys.indexOf(activePageFilter.value)
  const next = (current + delta + keys.length) % keys.length
  setPageFilter(keys[next])
  ribbonRef.value?.scrollActivePagePillIntoView(delta)
  return true
}

onKeyStroke('ArrowUp', (event) => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0) selectedIndex.value = activeResultsLength.value - 1
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', (event) => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= activeResultsLength.value + 1) selectedIndex.value = 0
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowLeft', (event) => {
  if (!goToSearchPageDelta(-1)) return
  event.preventDefault()
  disableMouseOver.value = true
})

onKeyStroke('ArrowRight', (event) => {
  if (!goToSearchPageDelta(1)) return
  event.preventDefault()
  disableMouseOver.value = true
})

onKeyStroke('Tab', (event) => {
  if (!showSearch.value) return
  if (!cyclePageTab(event.shiftKey ? -1 : 1)) return
  event.preventDefault()
  disableMouseOver.value = true
})

const router = useRouter()

function navigateToUrlResult(item: UrlResult) {
  saveToHistory(
    filterText.value, searchMode.value,
    [getPageLabel(item.pageId, pageMeta), ...item.titles, item.linkText].map(toHistoryPathHtml).filter(Boolean),
    buildResultHref(item.pageId, item.tabs, item.anchor), item.linkText
  )
  window.dispatchEvent(
    new CustomEvent('search-nav', {
      detail: {
        query: filterText.value,
        resultText: item.linkText,
        anchor: item.anchor
      }
    })
  )
  router.go(buildResultHref(item.pageId, item.tabs, item.anchor))
  showSearch.value = false
}

onKeyStroke('Enter', (e) => {
  if (e.isComposing) return
  if (e.target instanceof HTMLButtonElement && e.target.type !== 'submit') return

  const index = selectedIndex.value - 1
  if (index === -1) {
    // @ts-ignore
    window.toggleAI({ value: filterText.value })
    showSearch.value = false
    return
  }

  if (urlSearchMode.value) {
    const selectedUrl = filteredUrlResults.value[index]
    if (selectedUrl) navigateToUrlResult(selectedUrl)
    return
  }

  const selectedPackage = pagedResults.value[index]
  if (e.target instanceof HTMLInputElement && !selectedPackage) { e.preventDefault(); return }
  if (selectedPackage) {
    saveToHistory(
      filterText.value, searchMode.value,
      [getPageLabel(getPageKey(String(selectedPackage.id)), pageMeta), ...selectedPackage.titles, selectedPackage.title].map(toHistoryPathHtml).filter(Boolean),
      getSearchResultHref(selectedPackage), selectedPackage.title
    )
    window.dispatchEvent(
      new CustomEvent('search-nav', {
        detail: {
          query: filterText.value,
          resultText: selectedPackage.title,
          anchor: getDocAnchor(String(selectedPackage.id))
        }
      })
    )
    router.go(getSearchResultHref(selectedPackage))
    showSearch.value = false
  }
})

function onResultClick(item: SearchResult & Result) {
  saveToHistory(
    filterText.value, searchMode.value,
    [getPageLabel(getPageKey(String(item.id)), pageMeta), ...item.titles, item.title].map(toHistoryPathHtml).filter(Boolean),
    getSearchResultHref(item), item.title
  )
  window.dispatchEvent(
    new CustomEvent('search-nav', {
      detail: {
        query: filterText.value,
        resultText: item.title,
        anchor: getDocAnchor(String(item.id))
      }
    })
  )
  showSearch.value = false
}

onKeyStroke('Escape', () => {
  if (showSettingsPopup.value) { showSettingsPopup.value = false; return }
  showSearch.value = false
})

// Translations
const defaultTranslations: { modal: ModalTranslations } = {
  modal: {
    displayDetails: 'Display detailed list',
    exactMatchTitle: 'Exact search',
    resetButtonTitle: 'Reset search',
    backButtonTitle: 'Close search',
    noResultsText: 'No results for',
    footer: {
      selectText: 'select',
      selectKeyAriaLabel: 'enter',
      navigateText: 'navigate',
      navigateUpKeyAriaLabel: 'up arrow',
      navigateDownKeyAriaLabel: 'down arrow',
      switchTabsText: 'switch tabs',
      switchTabsKeyAriaLabel: 'shift tab and tab',
      switchPagesText: 'switch pages',
      switchPagesKeyAriaLabel: 'left and right arrow',
      closeText: 'close',
      closeKeyAriaLabel: 'escape'
    }
  }
}

const translate = createSearchTranslate(defaultTranslations)

// Back
onMounted(() => { window.history.pushState(null, '', null) })
useEventListener('popstate', (event) => { event.preventDefault(); showSearch.value = false })

// Lock body
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(() => showSearch.value, (val) => {
  if (!val) { isLocked.value = false; return }
  nextTick(() => {
    isLocked.value = true
    nextTick().then(() => { activate() })
  })
})

function resetSearch() {
  filterText.value = ''
  nextTick().then(() => focusSearchInput(false))
}

function onMouseMove(e: MouseEvent) {
  if (!disableMouseOver.value) return
  const el = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('.result')
  const index = Number.parseInt(el?.dataset.index!)
  if (index >= 0 && index !== selectedIndex.value) selectedIndex.value = index
  disableMouseOver.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      role="button"
      :aria-owns="results?.length ? 'localsearch-list' : undefined"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-labelledby="localsearch-label"
      class="VPLocalSearchBox"
      :class="{ 'pointer-events-none': !showSearch }"
    >
      <AnimatePresence>
        <component
          :is="searchMotionDiv"
          v-if="showSearch"
          class="backdrop"
          @click="showSearch = false"
          v-bind="backdropMotion"
        />
      </AnimatePresence>

      <AnimatePresence>
        <component
          :is="searchMotionDiv"
          v-if="showSearch"
          class="shell"
          v-bind="shellMotion"
        >
          <!-- Search Bar -->
          <SearchBar
            ref="searchBarRef"
            :filter-text="filterText"
            :search-loading="searchLoading"
            :show-settings-popup="showSettingsPopup"
            :button-text="buttonText"
            :disable-reset="disableReset"
            :search-motion-form="searchMotionForm"
            :form-motion="formMotion"
            :translate="translate"
            @update:filter-text="filterText = $event"
            @reset-search="resetSearch"
            @search-bar-click="onSearchBarClick"
            @toggle-settings="showSettingsPopup = !showSettingsPopup"
            @close="showSearch = false"
          />

          <!-- Page Ribbon -->
          <AnimatePresence>
            <SearchRibbon
              ref="ribbonRef"
              :search-motion-div="searchMotionDiv"
              :ribbon-motion="ribbonMotion"
              :search-animations-enabled="searchAnimationsEnabled"
              :url-search-mode="urlSearchMode"
              :url-page-groups="urlPageGroups"
              :url-active-page-filter="urlActivePageFilter"
              :url-matches-length="urlMatches.length"
              :page-groups="pageGroups"
              :active-page-filter="activePageFilter"
              :results-length="results.length"
              @select-url-page="setUrlPageFilter"
              @select-page="setPageFilter"
            />
          </AnimatePresence>

          <ul
            ref="resultsEl"
            :id="results?.length ? 'localsearch-list' : undefined"
            :role="results?.length ? 'listbox' : undefined"
            :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
            class="results"
            @mousemove="onMouseMove"
          >
            <!-- Empty state -->
            <AnimatePresence>
              <SearchEmptyState
                v-if="!showHistory && (urlSearchMode
                ? (!filterText || !urlMatches.length)
                : (!filterText || !filteredResults.length))"
                :filter-text="filterText"
                :search-motion-div="searchMotionDiv"
                :empty-state-motion="emptyStateMotion"
              />
            </AnimatePresence>

            <!-- Search history -->
            <AnimatePresence>
              <SearchHistory
                :search-motion-div="searchMotionDiv"
                :empty-state-motion="emptyStateMotion"
                :filter-text="filterText"
                @apply-history="applyHistory"
                @remove-from-history="removeFromHistory"
              />
            </AnimatePresence>

            <!-- URL search results -->
            <template v-if="urlSearchMode">
              <AnimatePresence>
                <component
                  :is="searchMotionLi"
                  v-for="(item, index) in filteredUrlResults"
                  :key="'url-' + urlCurrentPage + '-' +
                  item.pageId + '-' +
                  item.anchor + '-' + index"
                  class="result-layout"
                  :id="'localsearch-item-' + (index + 1)"
                  :aria-selected="selectedIndex === index + 1 ? 'true' : 'false'"
                  role="option"
                  v-bind="resultMotion(index)"
                >
                  <div
                    class="result url-result-card"
                    :class="{ selected: selectedIndex === index + 1 }"
                    :aria-label="item.href"
                    role="button"
                    @mouseenter="!disableMouseOver && (selectedIndex = index + 1)"
                    @focusin="selectedIndex = index + 1"
                    @click="navigateToUrlResult(item)"
                    :data-index="index + 1"
                  >
                    <div class="url-result-body">
                      <div class="url-path">
                        <Hash
                          v-if="item.anchor || item.titles.length > 0"
                          stroke-width="2"
                          :size="18"
                        />
                        <File v-else stroke-width="2" :size="18" />
                        <span v-for="(t, ti) in item.titles" :key="ti" class="url-path-segment">
                          <span class="text" v-html="t" />
                          <ArrowRight stroke-width="2" :size="18" class="mx-0.5" />
                        </span>
                        <span v-if="item.linkText" class="url-path-current" v-html="item.linkText" />
                      </div>
                      <a
                        :href="item.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="url-link"
                        :title="item.href"
                        @click.stop
                        v-html="item.highlighted"
                      />
                    </div>
                  </div>
                </component>
              </AnimatePresence>
            </template>

            <!-- Normal search results -->
            <template v-else>
              <AnimatePresence>
                <component
                  :is="searchMotionLi"
                  v-for="(p, index) in pagedResults"
                  :key="'normal-' + normalCurrentPage + '-' + p.id + (p._linkIndex != null ? '-' + p._linkIndex : '')"
                  class="result-layout"
                  :id="'localsearch-item-' + (index + 1)"
                  :aria-selected="selectedIndex === index + 1 ? 'true' : 'false'"
                  role="option"
                  v-bind="resultMotion(index)"
                >
                  <a
                    :href="getSearchResultHref(p)"
                    class="result"
                    :class="{ selected: selectedIndex === index + 1 }"
                    :aria-label="[...p.titles, p.title].join(' > ')"
                    @mouseenter="!disableMouseOver && (selectedIndex = index + 1)"
                    @focusin="selectedIndex = index + 1"
                    @click="onResultClick(p)"
                    :data-index="index + 1"
                  >
                    <div>
                      <div class="titles">
                        <Hash
                          v-if="getDocAnchor(p.id) || p.titles.length > 0"
                          stroke-width="2"
                          :size="18"
                        />
                        <File v-else stroke-width="2" :size="18" />
                        <span v-for="(t, index) in p.titles" :key="index" class="title">
                          <span class="text" v-html="t" />
                          <ArrowRight stroke-width="2" :size="18" class="mx-0.5" />
                        </span>
                        <span class="title main">
                          <span class="text" v-html="p.title" />
                        </span>
                      </div>
                      <div
                        v-if="showDetailedList && hasExcerptPreview(p.text)"
                        class="excerpt-wrapper"
                      >
                        <component
                          :is="searchMotionDiv"
                          class="excerpt"
                          inert
                          v-bind="excerptMotion"
                        >
                          <div class="vp-doc" v-html="p.text" />
                        </component>
                        <div class="excerpt-gradient-bottom" />
                        <div class="excerpt-gradient-top" />
                      </div>
                    </div>
                  </a>
                </component>
              </AnimatePresence>
            </template>
          </ul>

          <!-- Pagination -->
          <SearchPagination
            :url-search-mode="urlSearchMode"
            :url-total-pages="urlTotalPages"
            :url-current-page="urlCurrentPage"
            :url-page-list="urlPageList"
            :normal-total-pages="normalTotalPages"
            :normal-current-page="normalCurrentPage"
            :normal-page-list="normalPageList"
            @go-to-url-page="goToUrlPage"
            @go-to-normal-page="goToNormalPage"
          />

          <!-- Keyboard Shortcuts -->
          <SearchKeyboardShortcuts
            v-if="showKeyboardShortcuts"
            :search-motion-div="searchMotionDiv"
            :footer-motion="footerMotion"
            :translate="translate"
          />
        </component>
      </AnimatePresence>

      <!-- Search Settings popup (teleported to body) -->
      <SearchSettings
        v-if="showSearch"
        v-model:show-settings-popup="showSettingsPopup"
        :settings-button-ref="settingsButtonRef"
      />

      <button v-if="!showSearch" />
    </div>
  </Teleport>
</template>

<style>
.VPLocalSearchBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: flex-start;
}

@media (max-width: 767px) {
  .VPLocalSearchBox {
    align-items: stretch;
  }
}

.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
}

.shell {
  position: relative;
  box-sizing: border-box;
  padding: 12px 12px 8px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-local-search-bg);
  width: min(100vw - 60px, 700px);
  height: 100%;
  max-height: min(100vh - 128px, 680px);
  border-radius: 6px;
}

@media (max-width: 767px) {
  .shell {
    margin: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
    overflow: hidden;
    gap: 8px;
  }
}

.results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
  min-height: 0 !important;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.result-layout {
  will-change: transform, opacity, height;
}

.result {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  transition: none;
  line-height: 1rem;
  border: solid 2px var(--vp-local-search-result-border);
  outline: none;
}

.result > div {
  margin: 12px;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 767px) {
  .result > div {
    margin: 8px;
  }
}

.result.selected {
  --vp-local-search-result-bg: var(--vp-local-search-result-selected-bg);
  border-color: var(--vp-local-search-result-selected-border);
}

.titles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: relative;
  z-index: 1001;
  padding: 2px 0;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.title.main {
  font-weight: 500;
}

.title svg {
  opacity: 0.5;
}

.titles > svg {
  flex-shrink: 0;
  align-self: center;
}

.titles mark,
.excerpt mark {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
}

.url-highlight {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
}

.excerpt-wrapper {
  position: relative;
}

.excerpt {
  opacity: 50%;
  pointer-events: none;
  height: 84px;
  max-height: 84px;
  overflow: hidden;
  position: relative;
  margin-top: 4px;
  contain: layout paint;
}

.result.selected .excerpt {
  opacity: 1;
}

.excerpt * {
  font-size: 0.8rem !important;
  line-height: 130% !important;
}

.excerpt .vp-code-group .tabs {
  display: none;
}

.excerpt .vp-code-group div[class*="language-"] {
  border-radius: 8px !important;
}

.excerpt > .vp-doc > *:first-child {
  margin-top: 6px !important;
}

.excerpt-gradient-bottom {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(transparent, var(--vp-local-search-result-bg));
  z-index: 1000;
}

.excerpt-gradient-top {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(var(--vp-local-search-result-bg), transparent);
  z-index: 1000;
}

.result.selected .titles {
  color: var(--vp-c-brand-1) !important;
}

.result.selected .url-link {
  color: var(--vp-c-brand-1);
}

svg {
  flex: none;
}

.url-result-card {
  cursor: pointer;
}

.url-result-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.url-path {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.2;
}

.url-path > svg,
.url-path-segment svg {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  margin-top: -1px;
  opacity: 0.55;
}

.url-path > svg {
  margin-top: -2px;
}

.url-path-segment {
  display: flex;
  align-items: center;
  min-width: 0;
}

.url-path-current {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-2);
}

.url-link {
  align-self: flex-start;
  max-width: 100%;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.url-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>

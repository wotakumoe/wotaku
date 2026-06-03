<script lang="ts" setup>
import MiniSearch, { type SearchResult } from 'minisearch'
import { type DefaultTheme, dataSymbol, inBrowser, useRouter } from 'vitepress'
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
// @ts-ignore
import { escapeRegExp } from 'vitepress/dist/client/shared'

import {
  computedAsync,
  onKeyStroke,
  refDebounced,
  useEventListener,
  useLocalStorage,
  useScrollLock,
  useSessionStorage,
  watchDebounced
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

// @ts-ignore
import localSearchIndex from '@localSearchIndex'

import {
  ArrowRight,
  ChevronRight,
  Delete,
  ExternalLink,
  File,
  Globe,
  Hash,
  LayoutList,
  List,
  Locate,
  LocateOff,
  TextAlignStart
} from 'lucide-vue-next'
import Mark from 'mark.js/dist/mark.es6.js'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import { LRUCache } from '../composables/search/lru-cache'
import type { PageLink } from '../../plugins/urlSearchPlugin'
import { createSearchTranslate } from '../composables/search/translation'
import { useData } from '../composables/search/use-data'
import { sidebar } from '../../configs/constants'

export interface FooterTranslations {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  closeText?: string
  closeKeyAriaLabel?: string
}

export interface ModalTranslations {
  displayDetails?: string
  resetButtonTitle?: string
  backButtonTitle?: string
  noResultsText?: string
  footer?: FooterTranslations
}

const showSearch = defineModel<boolean>()

const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()

/* Search */
const searchIndexData = shallowRef(localSearchIndex)

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept('@localSearchIndex', (m) => {
    if (m) {
      searchIndexData.value = m.default
    }
  })
}

interface Result {
  title: string
  titles: string[]
  text?: string
}

const vitePressData = useData()
const { activate } = useFocusTrap(el, {
  immediate: true,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
  returnFocusOnDeactivate: false,
  initialFocus: () => {
    return searchInput.value
  }
})
const { localeIndex, theme } = vitePressData
const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[localeIndex.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          boost: { title: 10, titles: 4, text: 1 },
          ...(theme.value.search?.provider === 'local' &&
            theme.value.search.options?.miniSearch?.searchOptions)
        },
        ...(theme.value.search?.provider === 'local' &&
          theme.value.search.options?.miniSearch?.options)
      }
    )
  )
)

const disableQueryPersistence = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.disableQueryPersistence === true
  )
})

const filterText = disableQueryPersistence.value
  ? ref('')
  : useSessionStorage('vitepress:local-search-filter', '')

const debouncedFilterText = refDebounced(filterText, 300)

const showDetailedList = useLocalStorage(
  'vitepress:local-search-detailed-list',
  false
)

// Three search modes: 'exact' | 'fuzzy' | 'url'
const searchMode = useLocalStorage<'exact' | 'fuzzy' | 'url'>(
  'vitepress:local-search-mode',
  'exact'
)

// Cycle through modes on mobile (only active button is visible, tap it to advance)
function cycleSearchMode() {
  const modes = ['exact', 'fuzzy', 'url'] as const
  const idx = modes.indexOf(searchMode.value)
  searchMode.value = modes[(idx + 1) % modes.length]
}

// Keep matchExact and urlSearchMode as computed aliases
const matchExact = computed(() => searchMode.value === 'exact')
const urlSearchMode = computed(() => searchMode.value === 'url')

const allLinks = shallowRef<PageLink[]>([])
let allLinksFetchPromise: Promise<void> | null = null

async function ensureAllLinks() {
  if (allLinks.value.length > 0) return
  if (allLinksFetchPromise) { await allLinksFetchPromise; return }
  allLinksFetchPromise = fetch('/url-search-index.json')
    .then((r) => r.json())
    .then((data: PageLink[]) => {
      data.sort((a, b) => {
        const pa = pageMeta.get(a.pageId)?.order ?? Number.MAX_SAFE_INTEGER
        const pb = pageMeta.get(b.pageId)?.order ?? Number.MAX_SAFE_INTEGER
        return pa - pb
      })
      allLinks.value = data
    })
    .catch(() => { allLinks.value = [] })
    .finally(() => { allLinksFetchPromise = null })
  await allLinksFetchPromise
}

watch(urlSearchMode, (active) => { if (active) ensureAllLinks() }, { immediate: true })

interface UrlResult {
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
  highlighted: string
}

const urlResults = computed((): UrlResult[] => {
  if (!urlSearchMode.value || !debouncedFilterText.value.trim()) return []
  const query = debouncedFilterText.value.trim().toLowerCase()
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  // allLinks is pre-sorted by page order — no sort needed here
  return allLinks.value
    .filter(({ href }) => href.toLowerCase().includes(query))
    .map(({ href, linkText, pageId, anchor, titles }) => ({
      href, linkText, pageId, anchor, titles,
      highlighted: href.replace(regex, '<mark class="url-highlight">$1</mark>')
    }))
})

// URL mode page ribbon — mirrors the normal pageGroups/filteredResults logic
const urlActivePageFilter = ref<string | null>(null)

const urlPageGroups = computed(() => {
  const map = new Map<string, { key: string; label: string; count: number }>()
  for (const r of urlResults.value) {
    const key = r.pageId
    const existing = map.get(key)
    if (existing) existing.count++
    else map.set(key, { key, label: getPageLabel(key), count: 1 })
  }
  return [...map.values()].sort((a, b) => getPageOrder(a.key) - getPageOrder(b.key))
})

const filteredUrlResults = computed(() => {
  if (!urlActivePageFilter.value) return urlResults.value
  return urlResults.value.filter((r) => r.pageId === urlActivePageFilter.value)
})

// Reset URL filter when query changes or mode switches
watch(urlResults, (r) => {
  if (urlActivePageFilter.value && !urlPageGroups.value.some((g) => g.key === urlActivePageFilter.value)) {
    urlActivePageFilter.value = null
  }
})

watch(urlSearchMode, (active) => {
  if (!active) urlActivePageFilter.value = null
})

function setUrlPageFilter(key: string | null) {
  urlActivePageFilter.value = urlActivePageFilter.value === key ? null : key
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

const pageMeta = (() => {
  const map = new Map<string, { label: string; order: number }>()
  let order = 0
  const stripIcon = (text: string) =>
    text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
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

const docOrder = computed(() => {
  const map = new Map<string, number>()
  const index = searchIndex.value as any
  if (!index) return map
  // _documentIds maps internalDocId -> original id, in insertion order.
  const ids = index._documentIds
  if (ids instanceof Map) {
    let i = 0
    for (const originalId of ids.values()) {
      map.set(String(originalId), i++)
    }
  } else if (ids && typeof ids === 'object') {
    // Some versions store it as a plain object keyed by numeric doc id.
    const keys = Object.keys(ids)
      .map(Number)
      .sort((a, b) => a - b)
    let i = 0
    for (const k of keys) {
      map.set(String(ids[k]), i++)
    }
  }
  return map
})

function getDocOrder(id: string) {
  return docOrder.value.get(id) ?? Number.MAX_SAFE_INTEGER
}

function getPageKey(id: string) {
  return id.split('#')[0].replace(/\/$/, '')
}

function getPageLabel(key: string) {
  return pageMeta.get(key)?.label ?? key.replace(/^\//, '')
}

function getPageOrder(key: string) {
  return pageMeta.get(key)?.order ?? Number.MAX_SAFE_INTEGER
}

const pageGroups = computed(() => {
  const map = new Map<string, { key: string; label: string; count: number }>()
  for (const r of results.value) {
    const key = getPageKey(r.id)
    const existing = map.get(key)
    if (existing) existing.count++
    else map.set(key, { key, label: getPageLabel(key), count: 1 })
  }
  return [...map.values()].sort(
    (a, b) => getPageOrder(a.key) - getPageOrder(b.key)
  )
})

const filteredResults = computed(() => {
  if (!activePageFilter.value) return results.value
  return results.value.filter(
    (r) => getPageKey(r.id) === activePageFilter.value
  )
})

function setPageFilter(key: string | null) {
  activePageFilter.value = activePageFilter.value === key ? null : key
  selectedIndex.value = filteredResults.value.length ? 1 : -1
  nextTick(() => {
    if (resultsEl.value) resultsEl.value.scrollTop = 0
    scrollToSelectedResult()
    reapplyHighlights()
  })
}

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

watch(results, () => {
  if (
    activePageFilter.value &&
    !pageGroups.value.some((g) => g.key === activePageFilter.value)
  ) {
    activePageFilter.value = null
  }
})

watch(filterText, () => {
  enableNoResults.value = false
})

const ribbonTrack = shallowRef<HTMLElement>()
const ribbonCanScrollLeft = ref(false)
const ribbonCanScrollRight = ref(false)

function getRibbonTrack(): HTMLElement | null {
  return (
    ribbonTrack.value ??
    (el.value?.querySelector('.page-ribbon-track') as HTMLElement | null)
  )
}

function updateRibbonOverflow() {
  const track = getRibbonTrack()
  if (!track) {
    ribbonCanScrollLeft.value = false
    ribbonCanScrollRight.value = false
    return
  }
  ribbonCanScrollLeft.value = track.scrollLeft > 2
  ribbonCanScrollRight.value =
    track.scrollWidth - track.clientWidth - track.scrollLeft > 2
}

let ribbonAnimHandle = 0

function scrollRibbon(direction: number) {
  const track = getRibbonTrack()
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  const amount = track.clientWidth * 0.7 * direction
  const from = track.scrollLeft
  const to = Math.max(0, Math.min(max, from + amount))
  if (to === from) return

  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
  const duration = 280
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    track.scrollLeft = from + (to - from) * ease(t)
    updateRibbonOverflow()
    if (t < 1) {
      ribbonAnimHandle = requestAnimationFrame(step)
    } else {
      ribbonAnimHandle = 0
    }
  }
  ribbonAnimHandle = requestAnimationFrame(step)
}

watch(pageGroups, () => {
  nextTick(updateRibbonOverflow)
})

watch(urlPageGroups, () => {
  nextTick(updateRibbonOverflow)
})

useEventListener('resize', () => {
  updateRibbonOverflow()
})

const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

const cache = new LRUCache<string, Map<string, string>>(120)

const inFlightExcerpts = new Map<string, Promise<void>>()

const EAGER_EXCERPTS = 15

function buildDocExcerpt(
  docId: string,
  filterTextValue: string
): Promise<void> {
  const cacheId = `${docId}\n${filterTextValue}`
  if (cache.get(cacheId)) return Promise.resolve()
  const pending = inFlightExcerpts.get(cacheId)
  if (pending) return pending

  const job = (async () => {
    const { mod } = await fetchExcerpt(docId)
    if (cache.get(cacheId)) return

    const comp = (mod as any).default ?? mod
    if (!(comp?.render || comp?.setup)) return // nothing renderable; don't cache

    const map = new Map<string, string>()
    const app = createApp(comp)
    app.config.warnHandler = () => {}
    enhanceAppWithTabs(app)
    app.provide(dataSymbol, vitePressData)
    Object.defineProperties(app.config.globalProperties, {
      $frontmatter: {
        get() {
          return vitePressData.frontmatter.value
        }
      },
      $params: {
        get() {
          return vitePressData.page.value.params
        }
      }
    })
    const div = document.createElement('div')
    try {
      app.mount(div)
      await selectExcerptTabs(div, filterTextValue)
      const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach((heading) => {
        const href = heading.querySelector('a')?.getAttribute('href')
        const anchor = href?.startsWith('#') && href.slice(1)
        if (!anchor) return
        let html = ''
        let node = heading as Element
        while (
          (node = node.nextElementSibling!) &&
          !/^h[1-6]$/i.test(node.tagName)
        ) {
          html += (node as HTMLElement).outerHTML
        }
        map.set(anchor, html)
      })
    } catch (e) {
      console.error('[search] excerpt render failed for', docId, e)
    } finally {
      try {
        app.unmount()
      } catch {
        /* ignore */
      }
    }
    cache.set(cacheId, map)
  })()

  inFlightExcerpts.set(cacheId, job)
  job.finally(() => {
    if (inFlightExcerpts.get(cacheId) === job) inFlightExcerpts.delete(cacheId)
  })
  return job
}

watchDebounced(
  () => [searchIndex.value, filterText.value, showDetailedList.value, searchMode.value] as const,
  async ([index, filterTextValue, showDetailedListValue, mode], old, onCleanup) => {
    if (old?.[0] !== index) {
      // in case of hmr
      cache.clear()
    }

    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!index) return

    // In URL search mode, skip normal text search
    if (mode === 'url') {
      results.value = []
      enableNoResults.value = true
      return
    }

    // Dynamic search options based on matchExact toggle
    const dynamicSearchOptions = {
      fuzzy: mode === 'fuzzy' ? (0.3 as number | false) : false,
      prefix: mode === 'fuzzy' ? (term: string) => term.length > 3 : false,
      maxFuzzy: mode === 'fuzzy' ? 1 : 0,
      boost: { title: 10, titles: 4, text: 1 },
    }

    // Search
    const ranked = index.search(filterTextValue, dynamicSearchOptions) as (SearchResult & Result)[]

    const top = ranked.slice(0, 50)
    const seen = new Set(top.map((r) => r.id))
    const titleHits = ranked.filter(
      (r) => !seen.has(r.id) && r.match && Object.keys(r.match).length > 0
    )
    const _result = [...top, ...titleHits] as (SearchResult & Result)[]
    enableNoResults.value = true

    if (!_result.length) {
      results.value = []
      return
    }

    // Collect highlight terms up front (cheap — no rendering needed).
    const terms = new Set<string>()
    for (const r of _result) {
      for (const term in r.match) terms.add(term)
    }
    currentTerms.value = terms

    const toRows = (list: (SearchResult & Result)[]) =>
      list
        .map((r) => {
          const [id, anchor] = r.id.split('#')
          const map = cache.get(`${id}\n${filterTextValue}`)
          return { ...r, text: map?.get(anchor) ?? '' }
        })
        .sort((a, b) => {
          const pageDiff =
            getPageOrder(getPageKey(a.id)) - getPageOrder(getPageKey(b.id))
          if (pageDiff !== 0) return pageDiff
          return getDocOrder(a.id) - getDocOrder(b.id)
        })

    const highlight = () =>
      new Promise<void>((resolve) => {
        if (!terms.size || !mark.value) {
          resolve()
          return
        }
        mark.value.unmark({
          done: () => {
            mark.value?.markRegExp(formMarkRegex(terms), {
              done: () => resolve()
            })
          }
        })
      })

    const docOrderList: string[] = []
    const seenDocs = new Set<string>()
    for (const r of _result) {
      const docId = r.id.slice(0, r.id.indexOf('#'))
      if (!seenDocs.has(docId)) {
        seenDocs.add(docId)
        docOrderList.push(docId)
      }
    }

    // Show results immediately (excerpts may be empty on first detail-view switch;
    // they fill in below once built)
    results.value = toRows(_result)

    if (showDetailedListValue) {
      const eagerDocs = new Set<string>()
      for (const r of _result.slice(0, EAGER_EXCERPTS)) {
        eagerDocs.add(r.id.slice(0, r.id.indexOf('#')))
      }
      await Promise.all(
        [...eagerDocs].map((docId) => buildDocExcerpt(docId, filterTextValue))
      )
      if (canceled) return
    }

    results.value = toRows(_result)

    await nextTick()
    if (canceled) return
    await highlight()
    await nextTick()
    await nextFrame()
    if (canceled) return

    if (resultsEl.value) {
      resultsEl.value.scrollTop = 0
    }
    centerExcerptsUntilSettled()

    if (showDetailedListValue) {
      const built = new Set<string>()
      for (const r of _result.slice(0, EAGER_EXCERPTS)) {
        built.add(r.id.slice(0, r.id.indexOf('#')))
      }
      const remaining = docOrderList.filter((d) => !built.has(d))
      if (remaining.length) {
        for (const docId of remaining) {
          await buildDocExcerpt(docId, filterTextValue)
          if (canceled) return
          await nextFrame()
          if (canceled) return
        }
        results.value = toRows(_result)
        await nextTick()
        if (canceled) return
        await highlight()
        await nextTick()
        await nextFrame()
        if (canceled) return
        centerExcerptsUntilSettled()
      }
    }
  },
  { debounce: 80, immediate: true }
)

function centerExcerpts() {
  const excerpts = el.value?.querySelectorAll('.result .excerpt') ?? []
  for (let i = 0; i < excerpts.length; i++) {
    const excerptElement = excerpts[i] as HTMLElement

    const markNode = excerptElement.querySelector(
      'mark[data-markjs="true"]'
    ) as HTMLElement | null
    if (!markNode) continue

    const viewportHeight =
      Number.parseFloat(getComputedStyle(excerptElement).maxHeight) || 84

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

function centerExcerptsUntilSettled() {
  // No layout animations to wait on anymore — a single pass after the
  // DOM has painted is enough.
  if (centerHandle) cancelAnimationFrame(centerHandle)
  centerHandle = requestAnimationFrame(() => {
    centerExcerpts()
    centerHandle = 0
  })
}

onBeforeUnmount(() => {
  if (centerHandle) cancelAnimationFrame(centerHandle)
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
})

const excerptCache = new LRUCache<string, unknown>(24)

async function fetchExcerpt(id: string) {
  const hashIndex = id.indexOf('#')
  const docId = hashIndex === -1 ? id : id.slice(0, hashIndex)

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

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const getSearchTerms = (query: string) =>
  query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)

async function selectExcerptTabs(root: HTMLElement, query: string) {
  const terms = getSearchTerms(query)
  if (!terms.length) return

  const tabs = root.querySelectorAll<HTMLElement>('.plugin-tabs')

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    const selectedTab = tab.querySelector<HTMLButtonElement>(
      '.plugin-tabs--tab[aria-selected="true"]'
    )
    const buttons = tab.querySelectorAll<HTMLButtonElement>(
      '.plugin-tabs--tab[role="tab"]'
    )

    let found = false

    for (let j = 0; j < buttons.length; j++) {
      const button = buttons[j]
      button.click()
      await nextTick()
      await nextFrame()

      const panelId = button.getAttribute('aria-controls')
      const panel = panelId
        ? root.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`)
        : tab.querySelector<HTMLElement>('.plugin-tabs--content')
      const text = panel?.textContent?.toLowerCase() ?? ''

      if (terms.every((term) => text.includes(term))) {
        found = true
        break
      }
    }

    if (!found) {
      selectedTab?.click()
      await nextTick()
    }
  }
}

/* Search input focus */

const searchInput = ref<HTMLInputElement>()
const disableReset = computed(() => {
  return filterText.value?.length <= 0
})
function focusSearchInput(select = true) {
  searchInput.value?.focus()
  select && searchInput.value?.select()
}

onMounted(() => {
  focusSearchInput()
})

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    focusSearchInput()
  }
}

/* Search keyboard selection */

const selectedIndex = ref(-1)
const disableMouseOver = ref(true)

// Active result list length (URL mode vs normal mode)
const activeResultsLength = computed(() =>
  urlSearchMode.value ? filteredUrlResults.value.length : filteredResults.value.length
)

watch(filteredResults, (r) => {
  if (!urlSearchMode.value) {
    selectedIndex.value = r.length ? 0 : -1
    scrollToSelectedResult()
  }
})

watch(filteredUrlResults, (r) => {
  if (urlSearchMode.value) {
    selectedIndex.value = r.length ? 0 : -1
    scrollToSelectedResult()
  }
})

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector('.result.selected')
    selectedEl?.scrollIntoView({ block: 'nearest' })
  })
}

onKeyStroke('ArrowUp', (event) => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0) {
    selectedIndex.value = activeResultsLength.value - 1
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', (event) => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= activeResultsLength.value + 1) {
    selectedIndex.value = 0
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

const router = useRouter()

onKeyStroke('Enter', (e) => {
  if (e.isComposing) return

  if (e.target instanceof HTMLButtonElement && e.target.type !== 'submit') {
    return
  }

  const index = selectedIndex.value - 1

  if (index === -1) {
    // @ts-ignore
    window.toggleAI({ value: filterText.value })
    showSearch.value = false
    return
  }

  // URL search mode: navigate to the page containing the link (like normal search)
  if (urlSearchMode.value) {
    const selectedUrl = filteredUrlResults.value[index]
    if (selectedUrl) {
      window.dispatchEvent(new CustomEvent('search-nav', { detail: { query: filterText.value } }))
      const dest = selectedUrl.anchor ? selectedUrl.pageId + '#' + selectedUrl.anchor : selectedUrl.pageId
      router.go(dest)
      showSearch.value = false
    }
    return
  }

  const selectedPackage = filteredResults.value[index]
  if (e.target instanceof HTMLInputElement && !selectedPackage) {
    e.preventDefault()
    return
  }

  if (selectedPackage) {
    window.dispatchEvent(
      new CustomEvent('search-nav', {
        detail: { query: filterText.value }
      })
    )
    router.go(selectedPackage.id)
    showSearch.value = false
  }
})

function onResultClick() {
  window.dispatchEvent(
    new CustomEvent('search-nav', {
      detail: { query: filterText.value }
    })
  )
  showSearch.value = false
}

onKeyStroke('Escape', () => {
  showSearch.value = false
})

// Translations
const defaultTranslations = {
  modal: {
    displayDetails: 'Display detailed list',
    exactMatchTitle: 'Exact search',
    resetButtonTitle: 'Reset search',
    backButtonTitle: 'Close search',
    noResultsText: 'No results for',
    footer: {
      selectText: 'to select',
      selectKeyAriaLabel: 'enter',
      navigateText: 'to navigate',
      navigateUpKeyAriaLabel: 'up arrow',
      navigateDownKeyAriaLabel: 'down arrow',
      closeText: 'to close',
      closeKeyAriaLabel: 'escape'
    }
  }
}

const translate = createSearchTranslate(defaultTranslations)

// Back

onMounted(() => {
  // Prevents going to previous site
  window.history.pushState(null, '', null)
})

useEventListener('popstate', (event) => {
  event.preventDefault()
  showSearch.value = false
})

/** Lock body */
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  () => showSearch.value,
  (val) => {
    if (!val) {
      isLocked.value = false
      return
    }

    nextTick(() => {
      isLocked.value = true
      nextTick().then(() => {
        activate()
        updateRibbonOverflow()
      })
    })
  }
)

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map((term) => `(${escapeRegExp(term)})`)
      .join('|'),
    'gi'
  )
}

function resetSearch() {
  filterText.value = ''
  nextTick().then(() => focusSearchInput(false))
}

function onMouseMove(e: MouseEvent) {
  if (!disableMouseOver.value) return
  const el = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('.result')
  const index = Number.parseInt(el?.dataset.index!)
  if (index >= 0 && index !== selectedIndex.value) {
    selectedIndex.value = index
  }
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
      <div
        v-if="showSearch"
        class="backdrop"
        @click="showSearch = false"
      />

      <div
        v-if="showSearch"
        class="shell"
      >
          <form
            class="search-bar"
            @pointerup="onSearchBarClick($event)"
            @submit.prevent=""
          >
            <label
              :title="buttonText"
              id="localsearch-label"
              for="localsearch-input"
            >
              <span
                aria-hidden="true"
                class="vpi-search search-icon local-search-icon"
              />
            </label>
            <div class="search-actions before">
              <button
                class="back-button"
                :title="translate('modal.backButtonTitle')"
                @click="showSearch = false"
              >
                <span class="vpi-arrow-left local-search-icon" />
              </button>
            </div>
            <input
              ref="searchInput"
              v-model="filterText"
              :aria-activedescendant="selectedIndex > -1
              ? 'localsearch-item-' + selectedIndex
              : undefined"
              aria-autocomplete="both"
              :aria-controls="results?.length ? 'localsearch-list' : undefined"
              aria-labelledby="localsearch-label"
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              class="search-input"
              id="localsearch-input"
              enterkeyhint="go"
              maxlength="64"
              :placeholder="buttonText"
              spellcheck="false"
              type="search"
            />
            <div class="search-actions">
              <div v-if="!disableDetailedView && searchMode !== 'url'" class="view-group toolbar-group">
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': showDetailedList }"
                  title="Detail view (Consumes more RAM)"
                  @click="showDetailedList ? showDetailedList = false : showDetailedList = true"
                >
                  <LayoutList :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': !showDetailedList }"
                  title="List view (Consumes less RAM)"
                  @click="!showDetailedList ? showDetailedList = true : showDetailedList = false"
                >
                  <List :size="18" stroke-width="1.25" />
                </button>
              </div>
              <div class="search-mode-group toolbar-group">
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': searchMode === 'exact' }"
                  title="Exact search"
                  @click="searchMode === 'exact' ? cycleSearchMode() : searchMode = 'exact'"
                >
                  <Locate :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': searchMode === 'fuzzy' }"
                  title="Fuzzy search"
                  @click="searchMode === 'fuzzy' ? cycleSearchMode() : searchMode = 'fuzzy'"
                >
                  <LocateOff :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': searchMode === 'url' }"
                  title="URL search"
                  @click="searchMode === 'url' ? cycleSearchMode() : searchMode = 'url'"
                >
                  <Globe :size="18" stroke-width="1.25" />
                </button>
              </div>
              <button
                class="clear-button"
                type="reset"
                :disabled="disableReset"
                :title="translate('modal.resetButtonTitle')"
                @click="resetSearch"
              >
                <Delete :size="19" stroke-width="1.25" />
              </button>
            </div>
          </form>

          <div
            v-if="urlSearchMode ? urlPageGroups.length > 1 : pageGroups.length > 1"
            class="page-ribbon"
          >
              <button
                v-if="ribbonCanScrollLeft"
                type="button"
                class="page-ribbon-arrow left"
                aria-label="Scroll filters left"
                @click="scrollRibbon(-1)"
              >
                <ChevronRight :size="18" stroke-width="1.75" />
              </button>
              <div
                ref="ribbonTrack"
                class="page-ribbon-track"
                @scroll="updateRibbonOverflow"
              >
                <!-- URL mode tabs -->
                <template v-if="urlSearchMode">
                  <button
                    type="button"
                    class="page-pill"
                    :class="{ active: urlActivePageFilter === null }"
                    @click="setUrlPageFilter(null)"
                  >
                    All
                    <span class="page-pill-count">{{ urlResults.length }}</span>
                  </button>
                  <button
                    v-for="group in urlPageGroups"
                    :key="group.key"
                    type="button"
                    class="page-pill"
                    :class="{ active: urlActivePageFilter === group.key }"
                    @click="setUrlPageFilter(group.key)"
                  >
                    <span class="page-pill-label">{{ group.label }}</span>
                    <span class="page-pill-count">{{ group.count }}</span>
                  </button>
                </template>
                <!-- Normal mode tabs -->
                <template v-else>
                  <button
                    type="button"
                    class="page-pill"
                    :class="{ active: activePageFilter === null }"
                    @click="setPageFilter(null)"
                  >
                    All
                    <span class="page-pill-count">{{ results.length }}</span>
                  </button>
                  <button
                    v-for="group in pageGroups"
                    :key="group.key"
                    type="button"
                    class="page-pill"
                    :class="{ active: activePageFilter === group.key }"
                    @click="setPageFilter(group.key)"
                  >
                    <span class="page-pill-label">{{ group.label }}</span>
                    <span class="page-pill-count">{{ group.count }}</span>
                  </button>
                </template>
              </div>
              <button
                v-if="ribbonCanScrollRight"
                type="button"
                class="page-ribbon-arrow right"
                aria-label="Scroll filters right"
                @click="scrollRibbon(1)"
              >
                <ChevronRight :size="18" stroke-width="1.75" />
              </button>
            </div>

          <ul
            ref="resultsEl"
            :id="results?.length ? 'localsearch-list' : undefined"
            :role="results?.length ? 'listbox' : undefined"
            :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
            class="results"
            @mousemove="onMouseMove"
          >
            <!-- Empty state (shared) -->
            <div
              v-if="urlSearchMode
                ? (!filterText || !urlResults.length)
                : (!filterText || !filteredResults.length)"
              class="flex flex-col justify-center items-center h-47.5 gap-2 font-medium text-sm text-gray-500 dark:text-gray-300 m-auto md:mt-10 md:mb-6 opacity-90"
            >
              <img
                class="h-40 object-contain object-center -translate-x-2"
                src="/asset/smolame.png"
                alt="Smol ame"
              />
              <h1 v-if="filterText">Couldn't find anything, try again?</h1>
              <h1 v-else>Looking for something?</h1>
            </div>

            <!-- URL search results -->
            <template v-if="urlSearchMode">
              <li
                v-for="(item, index) in filteredUrlResults"
                :key="item.href + item.pageId"
                class="result-layout"
                :id="'localsearch-item-' + (index + 1)"
                :aria-selected="selectedIndex === index + 1 ? 'true' : 'false'"
                role="option"
              >
                <a
                  :href="item.anchor ? item.pageId + '#' + item.anchor : item.pageId"
                  class="result"
                  :class="{ selected: selectedIndex === index + 1 }"
                  :aria-label="item.linkText || item.href"
                  @mouseenter="!disableMouseOver && (selectedIndex = index + 1)"
                  @focusin="selectedIndex = index + 1"
                  @click="onResultClick"
                  :data-index="index + 1"
                >
                  <div>
                    <div class="titles">
                      <Hash v-if="item.titles.length > 0" stroke-width="1.25" :size="18" />
                      <File v-else stroke-width="1.25" :size="18" />
                      <span
                        v-for="(t, ti) in item.titles"
                        :key="ti"
                        class="title"
                      >
                        <span class="text" v-html="t" />
                        <ArrowRight stroke-width="1.25" :size="18" class="mx-0.5" />
                      </span>
                      <span class="title main">
                        <span class="text">{{ item.linkText || item.href }}</span>
                      </span>
                      <a
                        :href="item.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="url-open-btn"
                        :class="{ 'url-open-btn-selected': selectedIndex === index + 1 }"
                        title="Open link"
                        @click.stop
                      >
                        <ExternalLink :size="14" stroke-width="1.5" />
                      </a>
                    </div>
                  </div>
                </a>
              </li>
            </template>

            <!-- Normal search results -->
            <template v-else>
              <li
                v-for="(p, index) in filteredResults"
                :key="p.id"
                class="result-layout"
                :id="'localsearch-item-' + (index + 1)"
                :aria-selected="selectedIndex === index + 1 ? 'true' : 'false'"
                role="option"
              >
                <a
                  :href="p.id"
                  class="result"
                  :class="{ selected: selectedIndex === index + 1 }"
                  :aria-label="[...p.titles, p.title].join(' > ')"
                  @mouseenter="!disableMouseOver && (selectedIndex = index + 1)"
                  @focusin="selectedIndex = index + 1"
                  @click="onResultClick"
                  :data-index="index + 1"
                >
                  <div>
                    <div class="titles">
                      <Hash v-if="p.titles.length > 0" stroke-width="1.25" :size="18" />
                      <File v-else stroke-width="1.25" :size="18" />
                      <span
                        v-for="(t, index) in p.titles"
                        :key="index"
                        class="title"
                      >
                        <span class="text" v-html="t" />
                        <ArrowRight stroke-width="1.25" :size="18" class="mx-0.5" />
                      </span>
                      <span class="title main">
                        <span class="text" v-html="p.title" />
                      </span>
                    </div>

                    <div v-if="showDetailedList" class="excerpt-wrapper">
                      <div v-if="p.text" class="excerpt" inert>
                        <div class="vp-doc" v-html="p.text" />
                      </div>
                      <div class="excerpt-gradient-bottom" />
                      <div class="excerpt-gradient-top" />
                    </div>
                  </div>
                </a>
              </li>
            </template>
          </ul>

          <div class="search-keyboard-shortcuts">
            <span>
              <kbd
                :aria-label="translate(
                  'modal.footer.navigateUpKeyAriaLabel'
                )"
              >
                <span class="vpi-arrow-up navigate-icon" />
              </kbd>
              <kbd
                :aria-label="translate(
                  'modal.footer.navigateDownKeyAriaLabel'
                )"
              >
                <span class="vpi-arrow-down navigate-icon" />
              </kbd>
              {{ translate('modal.footer.navigateText') }}
            </span>
            <span>
              <kbd :aria-label="translate('modal.footer.selectKeyAriaLabel')">
                <span class="vpi-corner-down-left navigate-icon" />
              </kbd>
              {{ translate('modal.footer.selectText') }}
            </span>
            <span>
              <kbd :aria-label="translate('modal.footer.closeKeyAriaLabel')">
                esc
              </kbd>
              {{ translate('modal.footer.closeText') }}
            </span>
          </div>
        </div>

      <button v-if="!showSearch" />
    </div>
  </Teleport>
</template>

<style scoped>
.VPLocalSearchBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
}

.shell {
  position: relative;
  padding: 12px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-local-search-bg);
  width: min(100vw - 60px, 900px);
  height: min-content;
  max-height: min(100vh - 128px, 900px);
  border-radius: 6px;
}

@media (max-width: 767px) {
  .shell {
    margin: 0;
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}

.search-bar {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
}

@media (max-width: 767px) {
  .search-bar {
    padding: 0 8px;
  }
}

.search-bar:focus-within {
  border-color: var(--vp-c-brand-1);
}

.page-ribbon {
  display: flex;
  align-items: center;
  padding: 12px 0 4px;
  padding-inline: calc(var(--spacing) * 3);
  position: relative;
  min-width: 0;
  flex: none;
  overflow: hidden;
}

.page-ribbon-track {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
}

.page-ribbon-track::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.page-ribbon-arrow {
  position: absolute;
  top: 12px;
  bottom: 4px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s;
}

.page-ribbon-arrow:hover {
  color: var(--vp-c-text-1);
}

.page-ribbon-arrow.right {
  right: 0;
  background: linear-gradient(to right, transparent, var(--vp-local-search-bg, var(--vp-c-bg-soft)) 70%);
  justify-content: flex-end;
  padding-right: 6px;
}

.page-ribbon-arrow.left {
  left: 0;
  background: linear-gradient(to left, transparent, var(--vp-local-search-bg, var(--vp-c-bg-soft)) 70%);
  justify-content: flex-start;
  padding-left: 6px;
}

.page-ribbon-arrow.left svg {
  transform: rotate(180deg);
}

.page-pill {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
  border-radius: 8px;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background-color 0.15s;
}

.page-pill:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.page-pill.active {
  color: #6ab0f5;
  border: 1.5px solid #6ab0f5;
  background: rgba(60, 120, 210, 0.12);
  box-shadow: none;
}

.page-pill-label {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-pill-count {
  font-variant-numeric: tabular-nums;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.15);
  color: inherit;
}

.page-pill.active .page-pill-count {
  background: rgba(100, 160, 240, 0.18);
}

@media (max-width: 767px) {
  .page-ribbon {
    padding: 14px 12px 4px;
  }

  .page-pill {
    padding: 7px 14px;
    font-size: 0.82rem;
    background: var(--vp-c-bg-elv, var(--vp-c-bg-soft));
    border-color: var(--vp-c-divider);
    color: var(--vp-c-text-1);
  }
}

.local-search-icon {
  display: block;
  font-size: 18px;
}

.navigate-icon {
  display: block;
  font-size: 14px;
}

.search-icon {
  margin: 8px;
}

@media (max-width: 767px) {
  .search-icon {
    display: none;
  }
}

.search-input {
  padding: 6px 12px;
  font-size: inherit;
  width: 100%;
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

@media (max-width: 767px) {
  .search-input {
    padding: 6px 4px;
  }
}

.search-actions {
  display: flex;
  gap: 4px;
}

@media (any-pointer: coarse) {
  .search-actions {
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .search-actions.before {
    display: none;
  }
}

.search-actions button {
  padding: 8px;
}

.search-actions button:not([disabled]):hover,
.toggle-layout-button.detailed-list {
  color: var(--vp-c-brand-1);
}

.search-actions button.clear-button:disabled {
  opacity: 0.37;
}

.search-keyboard-shortcuts {
  font-size: 0.8rem;
  opacity: 75%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  line-height: 14px;
}

.search-keyboard-shortcuts span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 767px) {
  .search-keyboard-shortcuts {
    display: none;
  }
}

.search-keyboard-shortcuts kbd {
  background: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  padding: 3px 6px;
  min-width: 24px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border: 1px solid rgba(128, 128, 128, 0.15);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
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

.titles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: relative;
  z-index: 1001;
  padding: 2px 0;
  align-items: center;
}

.titles > svg {
  flex-shrink: 0;
  align-self: center;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.title.main {
  font-weight: 500;
}

.title-icon {
  opacity: 1;
  font-weight: 500;
}

.title svg {
  opacity: 0.5;
}

.result.selected {
  --vp-local-search-result-bg: var(--vp-local-search-result-selected-bg);
  border-color: var(--vp-local-search-result-selected-border);
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
}

.result.selected .excerpt {
  opacity: 1;
}

.excerpt :deep(*) {
  font-size: 0.8rem !important;
  line-height: 130% !important;
}

.titles :deep(mark),
.excerpt :deep(mark) {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
}

.excerpt :deep(.vp-code-group) .tabs {
  display: none;
}

.excerpt :deep(.vp-code-group) div[class*="language-"] {
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

.result.selected .titles,
.result.selected .title-icon {
  color: var(--vp-c-brand-1) !important;
}

.no-results {
  font-size: 0.9rem;
  text-align: center;
  padding: 12px;
}

svg {
  flex: none;
}

.exact-match-button.exact-match-active {
  color: var(--vp-c-brand-1);
  background-color: rgba(var(--vp-c-brand-1), 0.1);
  border-radius: 4px;
}

.toolbar-group + .toolbar-group {
  margin-left: 6px;
}

.search-mode-group,
.view-group {
  display: flex;
  align-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  overflow: hidden;
}

/* Mobile: hide inactive buttons in both groups — tap the active one to cycle */
@media (max-width: 767px) {
  .search-mode-group .mode-btn:not(.mode-active),
  .view-group .mode-btn:not(.mode-active) {
    display: none;
  }

  .search-mode-group,
  .view-group {
    border-radius: 5px;
  }

  /* Tapping the sole visible button cycles to the next option */
  .search-mode-group .mode-btn.mode-active,
  .view-group .mode-btn.mode-active {
    border-radius: 4px;
  }
}

.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 7px;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  border-radius: 0;
}

.mode-btn + .mode-btn {
  border-left: 1px solid var(--vp-c-divider);
}

.mode-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.mode-btn.mode-active {
  color: var(--vp-c-brand-1);
  background: rgba(60, 120, 210, 0.10);
}

.url-open-btn {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  margin-left: auto;
}

.result:hover .url-open-btn,
.result.selected .url-open-btn {
  opacity: 1;
}

@media (max-width: 767px) {
  .url-open-btn {
    opacity: 1;
  }
}

.url-open-btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.url-open-btn-selected {
  color: var(--vp-c-brand-1) !important;
}

:deep(.url-highlight) {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
}
</style>
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
// @ts-ignore
import { escapeRegExp } from 'vitepress/dist/client/shared'

import {
  computedAsync,
  onClickOutside,
  onKeyStroke,
  useElementBounding,
  useEventListener,
  useLocalStorage,
  useScrollLock,
  useSessionStorage,
  useStorage,
  watchDebounced
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { AnimatePresence, motion } from 'motion-v'

// @ts-ignore
import localSearchIndex from '@localSearchIndex'

import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ChevronRight,
  File,
  Globe,
  Hash,
  List,
  LocateOff,
  Regex,
  Settings2,
  TextAlignStart,
  X
} from 'lucide-vue-next'
import Mark from 'mark.js/dist/mark.es6.js'
import { sidebar } from '../../configs/constants'
import type { PageLink } from '../../plugins/urlSearchPlugin'
import { LRUCache } from '../composables/search/lru-cache'
import { createSearchTranslate } from '../composables/search/translation'
import { useData } from '../composables/search/use-data'
import { LowEndDeviceModeStorageKey } from '../constants'
import { enhanceAppWithTabs } from './tabs'

export interface FooterTranslations {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  switchTabsText?: string
  switchTabsKeyAriaLabel?: string
  switchPagesText?: string
  switchPagesKeyAriaLabel?: string
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
interface Result {
  tabs?: string[]
  title: string
  titles: string[]
  text?: string
}

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
  initialFocus: () => {
    return searchInput.value
  }
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

const lowEndDeviceMode = useStorage(LowEndDeviceModeStorageKey, 'off')
const searchAnimationsEnabled = computed(() => lowEndDeviceMode.value !== 'on')
const showKeyboardShortcuts = computed(() => !filterText.value)

const SearchMotionDiv = motion.div
const SearchMotionForm = motion.form
const SearchMotionLi = motion.li
const searchMotionDiv = computed(() =>
  searchAnimationsEnabled.value ? SearchMotionDiv : 'div'
)
const searchMotionForm = computed(() =>
  searchAnimationsEnabled.value ? SearchMotionForm : 'form'
)
const searchMotionLi = computed(() =>
  searchAnimationsEnabled.value ? SearchMotionLi : 'li'
)
const searchMotionEase = [0.16, 1, 0.3, 1]

const backdropMotion = computed(() =>
  searchAnimationsEnabled.value
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.55, ease: searchMotionEase }
    }
    : {}
)

const shellMotion = computed(() =>
  searchAnimationsEnabled.value
    ? {
      layout: 'size',
      initial: { opacity: 0, scale: 0.9375 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9375 },
      transition: { duration: 0.55, ease: searchMotionEase }
    }
    : {}
)

const formMotion = computed(() =>
  searchAnimationsEnabled.value ? { layout: 'position' } : {}
)

const ribbonMotion = computed(() =>
  searchAnimationsEnabled.value
    ? {
      layout: 'position',
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: 'auto' },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.4, ease: searchMotionEase }
    }
    : {}
)

const emptyStateMotion = computed(() =>
  searchAnimationsEnabled.value
    ? {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { delay: 0.1 }
      },
      exit: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 }
      },
      transition: { duration: 0.7, ease: searchMotionEase }
    }
    : {}
)

function resultMotion(index: number) {
  if (!searchAnimationsEnabled.value) return {}
  return {
    layout: true,
    initial: { opacity: 0, scale: 0.9375 },
    animate: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      scale: 0.9375,
      height: 0,
      transition: { duration: 0.25 }
    },
    transition: {
      duration: 0.55,
      ease: searchMotionEase,
      delay: index * 0.02
    }
  }
}

const excerptMotion = computed(() =>
  searchAnimationsEnabled.value
    ? {
      layout: true,
      initial: { height: 0 },
      animate: { height: '84px' },
      exit: { height: 0 },
      transition: { duration: 0.4, ease: searchMotionEase }
    }
    : {}
)

const footerMotion = computed(() =>
  searchAnimationsEnabled.value ? { layout: true } : {}
)

const urlFilterDebounced = ref(filterText.value)
let urlDebounceTimer: ReturnType<typeof setTimeout> | undefined
watch(filterText, (v) => {
  clearTimeout(urlDebounceTimer)
  if (!v) {
    urlFilterDebounced.value = '' // instant clear, no trailing-edge delay
    return
  }
  urlDebounceTimer = setTimeout(() => {
    urlFilterDebounced.value = v
  }, 60)
})
onBeforeUnmount(() => clearTimeout(urlDebounceTimer))

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

// Mobile settings popup
const showSettingsPopup = ref(false)
const settingsButtonRef = ref<HTMLButtonElement>()
const settingsPopupRef = ref<HTMLDivElement>()
const settingsBounding = useElementBounding(settingsButtonRef)

const settingsPopupStyle = computed(() => ({
  top: `${settingsBounding.bottom.value + 8}px`,
  right: `calc(100vw - ${settingsBounding.right.value}px)`,
}))

onClickOutside(settingsPopupRef, () => {
  showSettingsPopup.value = false
}, { ignore: [settingsButtonRef] })

interface PageGroupCount {
  key: string
  count: number
}

const urlMatches = shallowRef<PageLink[]>([])
const urlPageGroupCounts = shallowRef<PageGroupCount[]>([])

interface UrlResult {
  tabs?: string[]
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
  highlighted: string
}

const URL_PAGE_SIZE = 25

// 1-indexed current page within the URL results.
const urlPage = ref(1)

// Full URL match set returned by the search worker.
// Used for accurate page-group counts in the ribbon and for pagination.

// URL mode page ribbon — mirrors the normal pageGroups/filteredResults logic
const urlActivePageFilter = ref<string | null>(null)

const urlPageGroups = computed(() =>
  urlPageGroupCounts.value
    .map((group) => ({
      key: group.key,
      label: getPageLabel(group.key),
      count: group.count
    }))
    .sort((a, b) => getPageOrder(a.key) - getPageOrder(b.key))
)

// Full match set honoring the active ribbon page filter (uncapped).
const urlFilteredMatches = computed((): PageLink[] => {
  if (!urlActivePageFilter.value) return urlMatches.value
  return urlMatches.value.filter((l) => l.pageId === urlActivePageFilter.value)
})

// Total number of result pages (Google-style paging through urlFilteredMatches).
const urlTotalPages = computed(() =>
  Math.max(1, Math.ceil(urlFilteredMatches.value.length / URL_PAGE_SIZE))
)

// Clamp the current page whenever the result set shrinks.
const urlCurrentPage = computed(() =>
  Math.min(urlPage.value, urlTotalPages.value)
)

// The rows actually rendered: the current page's slice of the filtered matches.
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightUrl(url: string, query: string) {
  const needle = query.trim()
  if (!needle) return escapeHtml(url)

  const lowerUrl = url.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  let out = ''
  let cursor = 0
  let index = lowerUrl.indexOf(lowerNeedle)

  while (index !== -1) {
    out += escapeHtml(url.slice(cursor, index))
    out += `<mark class="url-highlight">${
      escapeHtml(url.slice(index, index + needle.length))
    }</mark>`
    cursor = index + needle.length
    index = lowerUrl.indexOf(lowerNeedle, cursor)
  }

  return out + escapeHtml(url.slice(cursor))
}

// Compact page-number list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 12].
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

// Reset to page 1 whenever the query changes or the page filter changes.
watch([urlFilterDebounced, urlActivePageFilter], () => {
  urlPage.value = 1
})

// Reset URL ribbon filter if the active page disappears from the groups.
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

type SearchMode = 'exact' | 'fuzzy' | 'url'

interface TextSearchWorkerPayload {
  results: (SearchResult & Result)[]
  terms: string[]
}

interface UrlSearchWorkerPayload {
  matches: PageLink[]
  pageGroups: PageGroupCount[]
}

interface LoadIndexWorkerRequest {
  type: 'load-index'
  localeIndex: string
  indexJson: unknown
  indexVersion: number
  config: ReturnType<typeof getMiniSearchWorkerConfig>
}

interface TextSearchWorkerRequest {
  type: 'text-search'
  query: string
  mode: SearchMode
  pageOrderEntries: [string, number][]
}

interface UrlSearchWorkerRequest {
  type: 'url-search'
  query: string
  pageOrderEntries: [string, number][]
}

type SearchWorkerRequest =
  | LoadIndexWorkerRequest
  | TextSearchWorkerRequest
  | UrlSearchWorkerRequest

const activePageFilter = ref<string | null>(null)
const searchWorkerReady = ref(false)
const searchWorkerConfigKey = computed(() =>
  JSON.stringify(getMiniSearchWorkerConfig())
)
let searchWorker: Worker | undefined
let searchWorkerRequestId = 0
let loadedWorkerIndexKey = ''
const searchWorkerRequests = new Map<
  number,
  {
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
  }
>()

function getPageOrderEntries(): [string, number][] {
  return [...pageMeta.entries()].map(([key, meta]) => [key, meta.order])
}

function stripNonCloneable(value: unknown): unknown {
  if (typeof value === 'function' || typeof value === 'symbol') return undefined
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) {
    return value
      .map((item) => stripNonCloneable(item))
      .filter((item) => item !== undefined)
  }

  const out: Record<string, unknown> = {}
  for (const [key, nestedValue] of Object.entries(value)) {
    const cloneable = stripNonCloneable(nestedValue)
    if (cloneable !== undefined) out[key] = cloneable
  }
  return out
}

function getMiniSearchWorkerConfig() {
  const miniSearch = theme.value.search?.provider === 'local'
    ? theme.value.search.options?.miniSearch
    : undefined
  const rawSearchOptions = miniSearch?.searchOptions as
    | Record<string, unknown>
    | undefined

  return {
    options: stripNonCloneable(miniSearch?.options) as
      | Record<string, unknown>
      | undefined,
    searchOptions: stripNonCloneable(rawSearchOptions) as
      | Record<string, unknown>
      | undefined,
    useDefaultBoostDocument:
      typeof rawSearchOptions?.boostDocument === 'function'
  }
}

function ensureSearchWorker() {
  if (!inBrowser || searchWorker) return searchWorker

  try {
    searchWorker = new Worker(
      new URL('../workers/searchWorker.ts', import.meta.url),
      {
        type: 'module'
      }
    )
  } catch (error) {
    console.error('[search] failed to start search worker', error)
    return
  }

  searchWorker.onmessage = (event: MessageEvent) => {
    const data = event.data as {
      id: number
      type: string
      payload?: unknown
      error?: string
    }
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
    searchWorkerRequests.set(id, {
      resolve: (value) => resolve(value as T),
      reject
    })
    worker.postMessage({ ...message, id })
  })
}

onMounted(() => {
  ensureSearchWorker()
})

onBeforeUnmount(() => {
  searchWorker?.terminate()
  searchWorker = undefined
  loadedWorkerIndexKey = ''
  searchWorkerReady.value = false
  for (const request of searchWorkerRequests.values()) {
    request.reject(new Error('Search worker was terminated'))
  }
  searchWorkerRequests.clear()
})

watch(
  () =>
    [
      searchWorkerReady.value,
      showSearch.value,
      urlSearchMode.value,
      urlFilterDebounced.value
    ] as const,
  async ([ready, isOpen, active, query], _old, onCleanup) => {
    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!active || !isOpen || !query.trim()) {
      urlMatches.value = []
      urlPageGroupCounts.value = []
      urlSearchLoading.value = false
      return
    }
    if (!ready) {
      urlSearchLoading.value = false
      return
    }

    urlSearchLoading.value = true
    try {
      const payload = await postSearchWorker<UrlSearchWorkerPayload>({
        type: 'url-search',
        query,
        pageOrderEntries: getPageOrderEntries()
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

function getPageKey(id: string) {
  return getDocId(id).replace(/\/$/, '')
}

function getDocId(id: string) {
  const hashIndex = id.indexOf('#')
  return hashIndex === -1 ? id : id.slice(0, hashIndex)
}

function getDocAnchor(id: string) {
  const hashIndex = id.indexOf('#')
  return hashIndex === -1 ? '' : id.slice(hashIndex + 1)
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

// --- Normal-mode (exact/fuzzy) pagination ---------------------------------
// Mirrors the URL-mode pager. filteredResults stays the full filtered set;
// pagedResults is the current page slice that actually renders.
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
  })
}

// Reset to page 1 when the query changes (results replaced) or filter changes.
watch([results, activePageFilter], () => {
  normalPage.value = 1
})
// ---------------------------------------------------------------------------

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

function scrollActivePagePillIntoView(direction = 0) {
  nextTick(() => {
    const track = getRibbonTrack()
    if (!track) return

    const pills = [...track.querySelectorAll<HTMLElement>('.page-pill')]
    const activeIndex = pills.findIndex((pill) =>
      pill.classList.contains('active')
    )
    const active = pills[activeIndex]
    if (!active) return

    const trackRect = track.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const gap = 8
    let nextScrollLeft = track.scrollLeft

    if (activeRect.left < trackRect.left) {
      nextScrollLeft += activeRect.left - trackRect.left - gap
    } else if (activeRect.right > trackRect.right) {
      nextScrollLeft += activeRect.right - trackRect.right + gap
    }

    const peek = pills[activeIndex + Math.sign(direction)]
    if (peek) {
      const peekRect = peek.getBoundingClientRect()
      if (direction > 0 && peekRect.right > trackRect.right) {
        nextScrollLeft += peekRect.right - trackRect.right + gap
      } else if (direction < 0 && peekRect.left < trackRect.left) {
        nextScrollLeft += peekRect.left - trackRect.left - gap
      }
    }

    const max = track.scrollWidth - track.clientWidth
    track.scrollTo({
      left: Math.max(0, Math.min(max, nextScrollLeft)),
      behavior: searchAnimationsEnabled.value ? 'smooth' : 'auto'
    })
    updateRibbonOverflow()
  })
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

  if (!searchAnimationsEnabled.value) {
    track.scrollLeft = to
    updateRibbonOverflow()
    return
  }

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
    enhanceAppWithTabs(app, { renderAll: true })
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
  () =>
    [
      searchWorkerReady.value,
      showSearch.value,
      localeIndex.value,
      searchIndexVersion.value,
      searchWorkerConfigKey.value,
      filterText.value,
      showDetailedList.value,
      searchMode.value
    ] as const,
  async (
    [
      ready,
      isOpen,
      localeIndexValue,
      indexVersion,
      configKey,
      filterTextValue,
      showDetailedListValue,
      mode
    ],
    old,
    onCleanup
  ) => {
    if (
      old?.[2] !== localeIndexValue ||
      old?.[3] !== indexVersion ||
      old?.[4] !== configKey
    ) {
      // Locale/config changes rebuild the worker index, so cached excerpts may no
      // longer match the active result set.
      cache.clear()
    }

    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!ready || !isOpen) {
      textSearchLoading.value = false
      return
    }

    // In URL search mode, skip normal text search
    if (mode === 'url') {
      results.value = []
      currentTerms.value = new Set()
      enableNoResults.value = Boolean(filterTextValue.trim())
      textSearchLoading.value = false
      return
    }

    const searchQuery = filterTextValue.trim()
    if (!searchQuery) {
      results.value = []
      currentTerms.value = new Set()
      enableNoResults.value = false
      textSearchLoading.value = false
      return
    }

    textSearchLoading.value = true
    let workerPayload: TextSearchWorkerPayload
    try {
      const workerIndexKey =
        `${localeIndexValue}\n${indexVersion}\n${configKey}`
      if (loadedWorkerIndexKey !== workerIndexKey) {
        const indexJson = (await searchIndexData.value[localeIndexValue]?.())
          ?.default
        if (canceled) return
        await postSearchWorker<void>({
          type: 'load-index',
          localeIndex: localeIndexValue,
          indexJson,
          indexVersion,
          config: getMiniSearchWorkerConfig()
        })
        if (canceled) return
        loadedWorkerIndexKey = workerIndexKey
      }

      workerPayload = await postSearchWorker<TextSearchWorkerPayload>({
        type: 'text-search',
        query: searchQuery,
        mode,
        pageOrderEntries: getPageOrderEntries()
      })
    } catch (error) {
      if (!canceled) {
        console.error('[search] text search worker request failed', error)
        results.value = []
        currentTerms.value = new Set()
        enableNoResults.value = true
        textSearchLoading.value = false
      }
      return
    }
    if (canceled) return

    const _result = workerPayload.results
    const terms = new Set(workerPayload.terms)
    currentTerms.value = terms
    enableNoResults.value = true

    if (!_result.length) {
      results.value = []
      textSearchLoading.value = false
      return
    }

    const toRows = (list: (SearchResult & Result)[]) =>
      list.map((r) => {
        const id = getDocId(r.id)
        const anchor = getDocAnchor(r.id)
        const map = cache.get(`${id}\n${searchQuery}`)
        return { ...r, text: map?.get(anchor) ?? '' }
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
      const docId = getDocId(r.id)
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
        eagerDocs.add(getDocId(r.id))
      }
      await Promise.all(
        [...eagerDocs].map((docId) => buildDocExcerpt(docId, searchQuery))
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
        built.add(getDocId(r.id))
      }
      const remaining = docOrderList.filter((d) => !built.has(d))
      if (remaining.length) {
        for (const docId of remaining) {
          await buildDocExcerpt(docId, searchQuery)
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
    textSearchLoading.value = false
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

    const targetScrollTop = offset - viewportHeight / 2 +
      markNode.offsetHeight / 2
    excerptElement.scrollTop = Math.max(0, targetScrollTop)
  }
}

let centerHandle = 0

function centerExcerptsUntilSettled(
  duration = searchAnimationsEnabled.value ? 450 : 0
) {
  if (centerHandle) cancelAnimationFrame(centerHandle)

  if (duration <= 0) {
    centerHandle = requestAnimationFrame(() => {
      centerExcerpts()
      centerHandle = 0
    })
    return
  }

  const start = performance.now()
  const tick = () => {
    centerExcerpts()
    if (performance.now() - start < duration) {
      centerHandle = requestAnimationFrame(tick)
    } else {
      centerHandle = 0
    }
  }
  centerHandle = requestAnimationFrame(tick)
}

onBeforeUnmount(() => {
  if (centerHandle) cancelAnimationFrame(centerHandle)
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
})

const excerptCache = new LRUCache<string, unknown>(24)

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

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

function hasExcerptPreview(html?: string) {
  if (!html) return false
  return Boolean(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
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

// Active result list length (URL mode vs normal mode) — current page only
const activeResultsLength = computed(() =>
  urlSearchMode.value
    ? filteredUrlResults.value.length
    : pagedResults.value.length
)

watch(pagedResults, (r) => {
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
    scrollActivePagePillIntoView(delta)
    return true
  }

  if (pageGroups.value.length <= 1) return false
  const keys = [null, ...pageGroups.value.map((group) => group.key)]
  const current = keys.indexOf(activePageFilter.value)
  const next = (current + delta + keys.length) % keys.length
  setPageFilter(keys[next])
  scrollActivePagePillIntoView(delta)
  return true
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

function buildResultHref(pageId: string, tabs?: string[], anchor = '') {
  const query = tabs?.length
    ? `?tabs=${tabs.map((tab) => encodeURIComponent(tab)).join(',')}`
    : ''
  const hash = anchor ? `#${encodeURIComponent(anchor)}` : ''
  return `${pageId}${query}${hash}`
}

function getSearchResultHref(item: SearchResult & Result) {
  const id = String(item.id)
  const hashIndex = id.indexOf('#')
  if (hashIndex < 0) return buildResultHref(id, item.tabs)

  return buildResultHref(
    id.slice(0, hashIndex),
    item.tabs,
    id.slice(hashIndex + 1)
  )
}

function navigateToUrlResult(item: UrlResult) {
  window.dispatchEvent(
    new CustomEvent('search-nav', { detail: { query: filterText.value } })
  )
  router.go(buildResultHref(item.pageId, item.tabs, item.anchor))
  showSearch.value = false
}

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
      navigateToUrlResult(selectedUrl)
    }
    return
  }

  const selectedPackage = pagedResults.value[index]
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
    router.go(getSearchResultHref(selectedPackage))
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
  if (showSettingsPopup.value) {
    showSettingsPopup.value = false
    return
  }
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
          <component
            :is="searchMotionForm"
            class="search-bar"
            v-bind="formMotion"
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
              <button
                v-if="searchLoading"
                class="search-loading-button"
                type="button"
              >
                <img
                  class="search-loading-bubba"
                  src="/bubba.webp"
                  alt="Bubba loading"
                />
              </button>
              <div
                v-if="!disableDetailedView && searchMode !== 'url'"
                class="view-group toolbar-group"
              >
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': showDetailedList }"
                  title="Detail view (Consumes more RAM)"
                  @click="showDetailedList
                  ? showDetailedList = false
                  : showDetailedList = true"
                >
                  <TextAlignStart :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': !showDetailedList }"
                  title="List view (Consumes less RAM)"
                  @click="!showDetailedList
                  ? showDetailedList = true
                  : showDetailedList = false"
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
                  @click="searchMode === 'exact'
                  ? cycleSearchMode()
                  : searchMode = 'exact'"
                >
                  <Regex :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': searchMode === 'fuzzy' }"
                  title="Fuzzy search"
                  @click="searchMode === 'fuzzy'
                  ? cycleSearchMode()
                  : searchMode = 'fuzzy'"
                >
                  <LocateOff :size="18" stroke-width="1.25" />
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  :class="{ 'mode-active': searchMode === 'url' }"
                  title="URL search"
                  @click="searchMode === 'url'
                  ? cycleSearchMode()
                  : searchMode = 'url'"
                >
                  <Globe :size="18" stroke-width="1.25" />
                </button>
              </div>
              <button
                ref="settingsButtonRef"
                type="button"
                class="mode-btn settings-toggle-btn"
                :class="{ 'mode-active': showSettingsPopup }"
                title="Search settings"
                @click.stop="showSettingsPopup = !showSettingsPopup"
              >
                <Settings2 :size="18" stroke-width="1.25" />
              </button>
              <button
                class="clear-button"
                type="reset"
                :disabled="disableReset"
                :title="translate('modal.resetButtonTitle')"
                @click="resetSearch"
              >
                <X :size="19" stroke-width="1.25" />
              </button>
            </div>
          </component>

          <AnimatePresence>
            <component
              :is="searchMotionDiv"
              v-if="urlSearchMode
              ? urlPageGroups.length > 1
              : pageGroups.length > 1"
              class="page-ribbon"
              :class="{
                'can-scroll-left': ribbonCanScrollLeft,
                'can-scroll-right': ribbonCanScrollRight
              }"
              v-bind="ribbonMotion"
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
                    :class="{
                      active: urlActivePageFilter === null
                    }"
                    @click="setUrlPageFilter(null)"
                  >
                    All
                    <span class="page-pill-count">{{ urlMatches.length }}</span>
                  </button>
                  <button
                    v-for="group in urlPageGroups"
                    :key="group.key"
                    type="button"
                    class="page-pill"
                    :class="{
                      active:
                        urlActivePageFilter === group.key
                    }"
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
                    :class="{
                      active: activePageFilter === group.key
                    }"
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
            </component>
          </AnimatePresence>

          <ul
            ref="resultsEl"
            :id="results?.length ? 'localsearch-list' : undefined"
            :role="results?.length ? 'listbox' : undefined"
            :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
            class="results"
            @mousemove="onMouseMove"
          >
            <!-- Empty state (shared) -->
            <AnimatePresence>
              <component
                :is="searchMotionDiv"
                v-if="urlSearchMode
                ? (!filterText || !urlMatches.length)
                : (!filterText || !filteredResults.length)"
                class="flex flex-1 flex-col justify-center items-center w-full min-h-full gap-2 font-medium text-sm text-center text-gray-500 dark:text-gray-300 m-auto opacity-90"
                v-bind="emptyStateMotion"
              >
                <img
                  class="h-40 object-contain object-center"
                  src="/asset/smolame.png"
                  alt="Smol ame"
                />
                <h1 v-if="filterText">Couldn't find anything, try again?</h1>
                <h1 v-else>Looking for something?</h1>
              </component>
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
                  :aria-selected="selectedIndex === index + 1
                  ? 'true'
                  : 'false'"
                  role="option"
                  v-bind="resultMotion(index)"
                >
                  <div
                    class="result url-result-card"
                    :class="{
                      selected: selectedIndex === index + 1
                    }"
                    :aria-label="item.href"
                    role="button"
                    @mouseenter="!disableMouseOver &&
                    (selectedIndex = index + 1)"
                    @focusin="selectedIndex = index + 1"
                    @click="navigateToUrlResult(item)"
                    :data-index="index + 1"
                  >
                    <div class="url-result-body">
                      <div class="url-path">
                        <Hash
                          v-if="item.anchor ||
                          item.titles.length > 0"
                          stroke-width="1.25"
                          :size="18"
                        />
                        <File v-else stroke-width="1.25" :size="18" />
                        <span
                          v-for="(t, ti) in item.titles"
                          :key="ti"
                          class="url-path-segment"
                        >
                          <span class="text" v-html="t" />
                          <ArrowRight
                            stroke-width="1.25"
                            :size="18"
                            class="mx-0.5"
                          />
                        </span>
                        <span
                          v-if="item.linkText"
                          class="url-path-current"
                          v-html="item.linkText"
                        />
                      </div>
                      <a
                        :href="item.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="url-link"
                        :title="item.href"
                        @click.stop
                        v-html="item.highlighted"
                      >
                      </a>
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
                  :key="'normal-' + normalCurrentPage + '-' + p.id"
                  class="result-layout"
                  :id="'localsearch-item-' + (index + 1)"
                  :aria-selected="selectedIndex === index + 1
                  ? 'true'
                  : 'false'"
                  role="option"
                  v-bind="resultMotion(index)"
                >
                  <a
                    :href="getSearchResultHref(p)"
                    class="result"
                    :class="{
                      selected: selectedIndex === index + 1
                    }"
                    :aria-label="[...p.titles, p.title].join(' > ')"
                    @mouseenter="!disableMouseOver &&
                    (selectedIndex = index + 1)"
                    @focusin="selectedIndex = index + 1"
                    @click="onResultClick"
                    :data-index="index + 1"
                  >
                    <div>
                      <div class="titles">
                        <Hash
                          v-if="getDocAnchor(p.id) ||
                          p.titles.length > 0"
                          stroke-width="1.25"
                          :size="18"
                        />
                        <File v-else stroke-width="1.25" :size="18" />
                        <span
                          v-for="(t, index) in p.titles"
                          :key="index"
                          class="title"
                        >
                          <span class="text" v-html="t" />
                          <ArrowRight
                            stroke-width="1.25"
                            :size="18"
                            class="mx-0.5"
                          />
                        </span>
                        <span class="title main">
                          <span class="text" v-html="p.title" />
                        </span>
                      </div>

                      <div
                        v-if="showDetailedList &&
                        hasExcerptPreview(p.text)"
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

          <!-- Bottom section: pagination (when needed). Always rendered so the
             shell's rounded bottom edge stays consistent. -->
          <nav
            class="url-pagination"
            aria-label="Search result pages"
          >
            <div
              v-if="(urlSearchMode
              ? urlTotalPages
              : normalTotalPages) > 1"
              class="url-pagination-segment"
            >
              <button
                type="button"
                class="url-page-btn url-page-nav"
                :disabled="(urlSearchMode
                ? urlCurrentPage
                : normalCurrentPage) <= 1"
                aria-label="Previous page"
                @click="urlSearchMode
                ? goToUrlPage(urlCurrentPage - 1)
                : goToNormalPage(normalCurrentPage - 1)"
              >
                <ChevronRight
                  :size="14"
                  stroke-width="2"
                  style="transform: rotate(180deg)"
                />
              </button>

              <template
                v-for="(p, pi) in urlSearchMode ? urlPageList : normalPageList"
                :key="pi"
              >
                <span v-if="p === '…'" class="url-page-ellipsis">…</span>
                <button
                  v-else
                  type="button"
                  class="url-page-btn"
                  :class="{
                    active: p === (urlSearchMode
                      ? urlCurrentPage
                      : normalCurrentPage)
                  }"
                  :aria-current="p === (urlSearchMode
                    ? urlCurrentPage
                    : normalCurrentPage)
                  ? 'page'
                  : undefined"
                  @click="urlSearchMode
                  ? goToUrlPage(p as number)
                  : goToNormalPage(p as number)"
                >
                  {{ p }}
                </button>
              </template>

              <button
                type="button"
                class="url-page-btn url-page-nav"
                :disabled="(urlSearchMode
                ? urlCurrentPage
                : normalCurrentPage) >=
                (urlSearchMode
                  ? urlTotalPages
                  : normalTotalPages)"
                aria-label="Next page"
                @click="urlSearchMode
                ? goToUrlPage(urlCurrentPage + 1)
                : goToNormalPage(normalCurrentPage + 1)"
              >
                <ChevronRight :size="14" stroke-width="2" />
              </button>
            </div>
          </nav>

          <component
            :is="searchMotionDiv"
            v-if="showKeyboardShortcuts"
            class="search-keyboard-shortcuts"
            v-bind="footerMotion"
          >
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
              <kbd :aria-label="translate('modal.footer.switchTabsKeyAriaLabel')">
                <ArrowLeftToLine class="navigate-icon" :size="14" stroke-width="2" />
              </kbd>
              <kbd :aria-label="translate('modal.footer.switchTabsKeyAriaLabel')">
                <ArrowRightToLine class="navigate-icon" :size="14" stroke-width="2" />
              </kbd>
              {{ translate('modal.footer.switchTabsText') }}
            </span>
            <span>
              <kbd :aria-label="translate('modal.footer.switchPagesKeyAriaLabel')">
                <ArrowLeft class="navigate-icon" :size="14" stroke-width="2" />
              </kbd>
              <kbd :aria-label="translate('modal.footer.switchPagesKeyAriaLabel')">
                <ArrowRight class="navigate-icon" :size="14" stroke-width="2" />
              </kbd>
              {{ translate('modal.footer.switchPagesText') }}
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
          </component>
          <Teleport to="body">
            <Transition name="settings-popup">
              <div
                v-if="showSettingsPopup"
                ref="settingsPopupRef"
                class="search-settings-popup"
                :style="settingsPopupStyle"
              >
                <div class="settings-section">
                  <div class="settings-section-label">Search Mode</div>
                  <div class="settings-options">
                    <button
                      type="button"
                      class="settings-option"
                      :class="{ active: searchMode === 'exact' }"
                      @click="searchMode = 'exact'"
                    >
                      <Regex :size="18" stroke-width="1.25" />
                      <span>Exact</span>
                    </button>
                    <button
                      type="button"
                      class="settings-option"
                      :class="{ active: searchMode === 'fuzzy' }"
                      @click="searchMode = 'fuzzy'"
                    >
                      <LocateOff :size="18" stroke-width="1.25" />
                      <span>Fuzzy</span>
                    </button>
                    <button
                      type="button"
                      class="settings-option"
                      :class="{ active: searchMode === 'url' }"
                      @click="searchMode = 'url'"
                    >
                      <Globe :size="18" stroke-width="1.25" />
                      <span>URL</span>
                    </button>
                  </div>
                </div>
                <div
                  v-if="!disableDetailedView && searchMode !== 'url'"
                  class="settings-section"
                >
                  <div class="settings-section-label">View Mode</div>
                  <div class="settings-options">
                    <button
                      type="button"
                      class="settings-option"
                      :class="{ active: showDetailedList }"
                      @click="showDetailedList = true"
                    >
                      <TextAlignStart :size="18" stroke-width="1.25" />
                      <span>Detail</span>
                    </button>
                    <button
                      type="button"
                      class="settings-option"
                      :class="{ active: !showDetailedList }"
                      @click="showDetailedList = false"
                    >
                      <List :size="18" stroke-width="1.25" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </component>
      </AnimatePresence>

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
  width: min(100vw - 60px, 900px);
  height: 100%;
  max-height: min(100vh - 128px, 900px);
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

.search-bar {
  flex: 0 0 auto !important;
  min-height: 44px !important;
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
    min-height: 40px !important;
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
  transition: padding-inline 0.15s;
}

.page-ribbon.can-scroll-left {
  padding-left: 42px;
}

.page-ribbon.can-scroll-right {
  padding-right: 42px;
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
  justify-content: flex-end;
  padding-right: 6px;
}

.page-ribbon-arrow.left {
  left: 0;
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
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
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
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
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
  flex: 1 1 auto;
  min-width: 0;
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
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-loading-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  margin-inline-end: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.search-loading-bubba {
  width: 32px;
  height: 28px;
  object-fit: contain;
  image-rendering: pixelated;
  user-select: none;
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

.titles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: relative;
  z-index: 1001;
  padding: 2px 0;
  align-items: center;
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

.url-path :deep(.icon-tip) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  vertical-align: middle;
}

.url-path :deep(.icon-tip > span) {
  width: 1em;
  height: 1em;
  min-width: 1em;
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

.result.selected .url-link {
  color: var(--vp-c-brand-1);
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
  background-color: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
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

/* Mobile: hide toolbar groups entirely — settings popup handles them */
@media (max-width: 767px) {
  .search-mode-group,
  .view-group {
    display: none;
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
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

:deep(.url-highlight) {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
}

/* Bottom-strip pagination. The <nav> is always rendered (empty when only one
   page) but collapses to zero height in that case so the shell's bottom
   rounded edge sits flush against the results. */
.url-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto !important;
}

.url-pagination:has(.url-pagination-segment) {
  padding-top: 8px;
}

.url-pagination-segment {
  display: flex;
  align-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  overflow: hidden;
  background: transparent;
}

.url-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  border-radius: 0;
}

.url-page-btn + .url-page-btn,
.url-page-ellipsis + .url-page-btn,
.url-page-btn + .url-page-ellipsis {
  border-left: 1px solid var(--vp-c-divider);
}

.url-page-btn:hover:not(:disabled):not(.active) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.url-page-btn.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  font-weight: 500;
  cursor: default;
}

.url-page-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  background: transparent;
}

.url-page-nav {
  padding: 0 6px;
}

.url-page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  user-select: none;
  background: transparent;
}

/* Settings toggle button — mobile only */
.settings-toggle-btn {
  display: none;
}

@media (max-width: 767px) {
  .settings-toggle-btn {
    display: flex;
    border: none;
    border-radius: 5px;
    color: var(--vp-c-text-1);
    padding: 8px;
  }
}

/* Settings popup card */
.search-settings-popup {
  position: fixed;
  z-index: 200;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 175px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-section-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  padding: 0 4px;
}

.settings-options {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.settings-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
  width: 100%;
}

.settings-option + .settings-option {
  border-top: 1px solid var(--vp-c-divider);
}

.settings-option:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.settings-option.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.settings-popup-enter-active,
.settings-popup-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform-origin: top right;
}

.settings-popup-enter-from,
.settings-popup-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-4px);
}
</style>
<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import {
  customStorageEventName,
  useEventListener,
  useStorage,
  useThrottleFn
} from '@vueuse/core'
import { usePreferredReducedMotion } from '@vueuse/core'
import { useData, useRoute } from 'vitepress'
import type { DefaultTheme as Theme } from 'vitepress'
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue'
import { getSidebarGroups } from 'vitepress/dist/client/theme-default/support/sidebar'
import DefaultTheme from 'vitepress/theme'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect
} from 'vue'
import { sidebar } from '../configs/constants'
import { useBookmarks, BOOKMARK_CHANGE_EVENT } from './composables/useBookmarks'
import AnnouncementPill from './components/AnnouncementPill.vue'
import SiteFooter from './components/SiteFooter.vue'
import NotFoundComponent from './components/NotFound.vue'
import { NolebaseEnhancedReadabilitiesScreenMenu } from './components/settings'
import NavActions from './components/NavActions.vue'
import SidebarCard from './components/SidebarCard.vue'
import { AccentBgStorageKey, AccentBgStrengthStorageKey, AccentColorStorageKey, TakodachiStorageKey } from './constants'
import { useEffects } from './composables/useEffects'
import { v2add, v2mag, v2norm, v2smul, v2sub, type Vec2D } from './math'

const route = useRoute()
const { frontmatter, isDark, site, theme } = useData()
const { isBookmarked, toggle: bookmarkToggle } = useBookmarks()
const { Layout } = DefaultTheme

// Home sidebar menu
const isHome = computed(() => frontmatter.value.layout === 'home')
const homeSidebarOpen = ref(false)
const sidebarRef = ref<HTMLElement | null>(null)
const homeSidebarGroups = getSidebarGroups(sidebar as any)
const logoSrc = computed(() =>
  typeof theme.value.logo === 'string'
    ? theme.value.logo
    : theme.value.logo?.src
)

watch(() => route.path, () => {
  homeSidebarOpen.value = false
})

let searchNavigated = false
let searchQuery = ''

if (!import.meta.env.SSR) {
  useEventListener(window, 'search-nav', (event) => {
    searchNavigated = true
    searchQuery = event instanceof CustomEvent &&
        typeof event.detail?.query === 'string'
      ? event.detail.query
      : ''
  })
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const getSearchTerms = (query: string) =>
  query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)

const getTargetByHash = (hash: string) => {
  const ids = [hash]
  try {
    const decoded = decodeURIComponent(hash)
    if (decoded !== hash) ids.unshift(decoded)
  } catch {
    /* keep the raw hash */
  }

  for (const id of ids) {
    const target = document.getElementById(id)
    if (target) return target
  }
}

const getScrollTargetForAnchor = (target: HTMLElement) => {
  if (target.classList.contains('tab-search-heading')) {
    return target.closest<HTMLElement>('.plugin-tabs') ?? target
  }

  return target
}

const TAB_QUERY_PARAM = 't'
const COLLAPSIBLE_QUERY_PARAM = 'c'

const getRequestedAnchorPath = (param: string) => {
  const value = new URLSearchParams(window.location.search).get(param)
  return value
    ?.split(',')
    .map((anchor) => anchor.trim())
    .filter(Boolean) ?? []
}

const getRequestedTabPath = () => getRequestedAnchorPath(TAB_QUERY_PARAM)
const getRequestedCollapsiblePath = () =>
  getRequestedAnchorPath(COLLAPSIBLE_QUERY_PARAM)

const encodeAnchorList = (anchors: string[]) =>
  anchors.map((anchor) => encodeURIComponent(anchor)).join(',')

const buildUrl = (
  options: { tabs?: string[]; collapsibles?: string[]; hash?: string } = {}
) => {
  const params = new URLSearchParams(window.location.search)
  const currentTabs = params.get(TAB_QUERY_PARAM)
  const currentCollapsibles = params.get(COLLAPSIBLE_QUERY_PARAM)
  params.delete(TAB_QUERY_PARAM)
  params.delete(COLLAPSIBLE_QUERY_PARAM)

  const tabs = options.tabs ??
    (currentTabs ? currentTabs.split(',').filter(Boolean) : [])
  const collapsibles = options.collapsibles ??
    (currentCollapsibles ? currentCollapsibles.split(',').filter(Boolean) : [])

  const queryParts = [
    params.toString(),
    tabs.length ? `${TAB_QUERY_PARAM}=${encodeAnchorList(tabs)}` : '',
    collapsibles.length
      ? `${COLLAPSIBLE_QUERY_PARAM}=${encodeAnchorList(collapsibles)}`
      : ''
  ].filter(Boolean)

  const hash = options.hash ?? ''
  return `${window.location.pathname}${
    queryParts.length ? `?${queryParts.join('&')}` : ''
  }${hash ? `#${encodeURIComponent(hash)}` : ''}`
}

const buildUrlWithTabs = (tabs: string[], hash = '') => buildUrl({ tabs, hash })

const getSelectedTabAnchor = (tabs: HTMLElement) =>
  tabs.querySelector<HTMLButtonElement>(
    '.plugin-tabs--tab[aria-selected="true"][data-tab-anchor]'
  )?.dataset.tabAnchor

const getPanelForTabButton = (button: HTMLButtonElement) => {
  const panelId = button.getAttribute('aria-controls')
  return panelId ? document.getElementById(panelId) : undefined
}

const getTabPathForGroup = (tabs: HTMLElement) => {
  const groups: HTMLElement[] = []
  let currentTabs: HTMLElement | null = tabs

  while (currentTabs) {
    groups.unshift(currentTabs)
    const parentPanel = currentTabs.parentElement?.closest<HTMLElement>(
      '.plugin-tabs--content[data-tab-anchor]'
    )
    currentTabs = parentPanel?.closest<HTMLElement>('.plugin-tabs') ?? null
  }

  return groups
    .map((group) => getSelectedTabAnchor(group))
    .filter((tab): tab is string => Boolean(tab))
}

const updateQueryForSelectedTab = async (tabs: HTMLElement) => {
  await nextTick()
  await nextFrame()

  const tabPath = getTabPathForGroup(tabs)
  if (!tabPath.length) return

  const collapsibles = getOpenCollapsiblePath(tabs)

  const nextUrl = buildUrl({ tabs: tabPath, collapsibles })
  const currentUrl =
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl === currentUrl) return

  window.history.pushState(null, '', nextUrl)
  rewriteAnchorLinks()
}

const queueTabQueryUpdateForSelection = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return

  const button = target.closest<HTMLButtonElement>(
    '.plugin-tabs--tab[role="tab"]'
  )
  const tabs = button?.closest<HTMLElement>('.plugin-tabs')
  if (tabs) void updateQueryForSelectedTab(tabs)
}

const COLLAPSIBLE_SELECTOR = 'details[data-collapsible-anchor]'

const getOpenCollapsiblePath = (details: HTMLElement) => {
  const path: string[] = []
  let el: HTMLElement | null = details

  while (el) {
    const current: HTMLElement | null = el.closest(COLLAPSIBLE_SELECTOR)
    if (!current) break

    if ((current as HTMLDetailsElement).open) {
      const anchor = current.dataset.collapsibleAnchor
      if (anchor) path.unshift(anchor)
    }

    el = current.parentElement
  }

  return path
}

const getEnclosingTabPath = (el: HTMLElement) => {
  const panel = el.closest<HTMLElement>(
    '.plugin-tabs--content[data-tab-anchor]'
  )
  const tabs = panel?.closest<HTMLElement>('.plugin-tabs')
  return tabs ? getTabPathForGroup(tabs) : []
}

const updateQueryForCollapsible = async (details: HTMLElement) => {
  await nextTick()
  await nextFrame()

  const collapsiblePath = getOpenCollapsiblePath(details)
  const tabPath = getEnclosingTabPath(details)

  const nextUrl = buildUrl({
    tabs: tabPath.length ? tabPath : undefined,
    collapsibles: collapsiblePath
  })
  const currentUrl =
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl === currentUrl) return

  window.history.pushState(null, '', nextUrl)
  rewriteAnchorLinks()
}

const queueCollapsibleQueryUpdate = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return

  const summary = target.closest<HTMLElement>('summary')
  const details = summary?.parentElement
  if (details instanceof HTMLElement && details.matches(COLLAPSIBLE_SELECTOR)) {
    void updateQueryForCollapsible(details)
  }
}

const selectCollapsiblesByPath = async (collapsiblePath: string[]) => {
  let root: ParentNode = document
  let opened: HTMLElement | undefined

  for (const anchor of collapsiblePath) {
    const details = root.querySelector<HTMLDetailsElement>(
      `details[data-collapsible-anchor="${CSS.escape(anchor)}"]`
    )
    if (!details) return opened

    opened = details
    if (!details.open) {
      details.open = true
      await nextTick()
      await nextFrame()
    }

    root = details
  }

  return opened
}

const TAB_LINK_MARKER = 'tab-'

const rewriteAnchorLinks = () => {
  const origin = window.location.origin
  const pathname = window.location.pathname

  document
    .querySelectorAll<HTMLAnchorElement>('.VPDoc .vp-doc a[href]')
    .forEach((link) => {
      // Accept either the original `#…` form or a previously-rewritten absolute URL.
      const raw = link.getAttribute('href') ?? ''
      let fragment: string | null = null
      if (raw.startsWith('#') && raw.length > 1) {
        fragment = raw.slice(1)
      } else if (raw.startsWith(origin + pathname + '#')) {
        fragment = raw.slice((origin + pathname + '#').length)
      } else if (raw.startsWith(origin + pathname + '?')) {
        // Already rewritten as a tab link — re-derive the tab name and re-stamp.
        const qs = raw.slice((origin + pathname + '?').length).split('#')[0]
        const tabName = new URLSearchParams(qs).get(TAB_QUERY_PARAM)
        if (tabName) {
          const href = `${origin}${pathname}?${TAB_QUERY_PARAM}=${
            encodeURIComponent(tabName)
          }`
          if (link.getAttribute('href') !== href) {
            link.setAttribute('href', href)
          }
        }
        return
      } else {
        return
      }

      const isTabLink = fragment.startsWith(TAB_LINK_MARKER)
      const name = (isTabLink
        ? fragment.slice(TAB_LINK_MARKER.length)
        : fragment).trim()
      if (!name) return

      // Use absolute URLs so the browser's Copy Link has nothing to merge with
      // the current ?tabs= query.
      const href = isTabLink
        ? `${origin}${pathname}?${TAB_QUERY_PARAM}=${encodeURIComponent(name)}`
        : `${origin}${pathname}#${name}`

      if (link.getAttribute('href') !== href) link.setAttribute('href', href)
    })
}

const selectTabsByPath = async (tabPath: string[]) => {
  let root: ParentNode = document
  let selectedTabs: HTMLElement | undefined

  for (const anchor of tabPath) {
    const button = root.querySelector<HTMLButtonElement>(
      `.plugin-tabs--tab[role="tab"][data-tab-anchor="${CSS.escape(anchor)}"]`
    )
    if (!button) return selectedTabs

    const tabs = button.closest<HTMLElement>('.plugin-tabs')
    if (!tabs) return selectedTabs

    selectedTabs = tabs
    if (button.getAttribute('aria-selected') !== 'true') {
      button.click()
      await nextTick()
      await nextFrame()
    }

    root = getPanelForTabButton(button) ?? tabs
  }

  return selectedTabs
}

const selectLegacyTabHash = async (hash: string) => {
  const button = document.querySelector<HTMLButtonElement>(
    `.plugin-tabs--tab[role="tab"][data-tab-anchor="${CSS.escape(hash)}"]`
  )
  if (!button) return

  if (button.getAttribute('aria-selected') !== 'true') {
    button.click()
    await nextTick()
    await nextFrame()
  }

  const tabs = button.closest<HTMLElement>('.plugin-tabs')
  if (tabs) {
    window.history.replaceState(null, '', buildUrlWithTabs([hash]))
  }
  return tabs
}

const getSelectedTabScrollTarget = (tabs: HTMLElement) => {
  const selectedTab = tabs.querySelector<HTMLButtonElement>(
    '.plugin-tabs--tab[aria-selected="true"]'
  )
  return selectedTab ? getPanelForTabButton(selectedTab) ?? tabs : tabs
}

const scrollToElement = (target: HTMLElement, smooth = true) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const navBar = document.querySelector<HTMLElement>('.VPNavBar')
      const navOffset = navBar ? navBar.offsetHeight : 0
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: smooth &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth'
          : 'auto'
      })
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    })
  })
}

const openCollapsibles = async (target: HTMLElement) => {
  const activeTarget = target
  let scrollTarget = getScrollTargetForAnchor(activeTarget)
  let el: HTMLElement | null = activeTarget

  while ((el = el.closest('details'))) {
    el.open = true
    scrollTarget = el
    el = el.parentElement
  }

  const tagName = activeTarget.tagName
  if (tagName.length === 2 && tagName[0] === 'H') {
    const level = +tagName[1]
    if (level >= 1 && level <= 6) {
      const terms = getSearchTerms(searchQuery)
      const detailsContainsTerms = (d: HTMLElement) => {
        if (!terms.length) return false
        const text = (d.textContent ?? '').toLowerCase()
        return terms.every((term) => text.includes(term))
      }

      let sibling = activeTarget.nextElementSibling

      while (sibling) {
        const siblingTag = sibling.tagName
        if (
          siblingTag.length === 2 && siblingTag[0] === 'H' &&
          +siblingTag[1] <= level
        ) break

        if (siblingTag === 'DETAILS') {
          if (detailsContainsTerms(sibling as HTMLElement)) {
            ;(sibling as HTMLDetailsElement).open = true
            if (scrollTarget === activeTarget) {
              scrollTarget = sibling as HTMLElement
            }
          }
        }

        const nested = sibling.getElementsByTagName('details')
        for (let i = 0, len = nested.length; i < len; i++) {
          if (detailsContainsTerms(nested[i])) {
            nested[i].open = true
            if (scrollTarget === activeTarget) scrollTarget = nested[i]
          }
        }

        sibling = sibling.nextElementSibling
      }
    }
  }

  await nextTick()
  await nextFrame()

  scrollToElement(scrollTarget)
}

const resetSearchNavigation = () => {
  searchNavigated = false
  searchQuery = ''
}

const tryOpenAnchoredContent = async () => {
  await nextTick()
  await nextFrame()

  const requestedTabs = getRequestedTabPath()
  const selectedTabs = requestedTabs.length
    ? await selectTabsByPath(requestedTabs)
    : undefined
  const requestedCollapsibles = getRequestedCollapsiblePath()
  const openedCollapsible = requestedCollapsibles.length
    ? await selectCollapsiblesByPath(requestedCollapsibles)
    : undefined
  const hash = window.location.hash.slice(1)

  if (!hash) {
    resetSearchNavigation()
    if (openedCollapsible) {
      scrollToElement(openedCollapsible, false)
    } else if (selectedTabs) {
      scrollToElement(getSelectedTabScrollTarget(selectedTabs), false)
    }
    return
  }

  let target = getTargetByHash(hash)

  if (!target && !requestedTabs.length) {
    const legacyTabs = await selectLegacyTabHash(hash)
    if (legacyTabs) {
      resetSearchNavigation()
      scrollToElement(getSelectedTabScrollTarget(legacyTabs), false)
      return
    }
  }

  if (!target) {
    if (searchNavigated) resetSearchNavigation()
    return
  }

  if (searchNavigated) {
    await openCollapsibles(target)
    const collapsiblePath = getOpenCollapsiblePath(target)
    if (collapsiblePath.length) {
      const tabPath = getEnclosingTabPath(target)
      window.history.replaceState(
        null,
        '',
        buildUrl({
          tabs: tabPath.length ? tabPath : undefined,
          collapsibles: collapsiblePath
        })
      )
      rewriteAnchorLinks()
    }
    resetSearchNavigation()
    return
  }

  const isTabRelatedTarget = target.classList.contains('tab-search-heading') ||
    Boolean(target.closest('.plugin-tabs'))

  if (
    !isTabRelatedTarget &&
    new URLSearchParams(window.location.search).has(TAB_QUERY_PARAM)
  ) {
    window.history.replaceState(null, '', buildUrlWithTabs([], hash))
    scrollToElement(getScrollTargetForAnchor(target), false)
    return
  }

  if (target.classList.contains('tab-search-heading')) {
    const tabs = target.closest<HTMLElement>('.plugin-tabs')
    if (tabs) {
      window.history.replaceState(
        null,
        '',
        buildUrlWithTabs(getTabPathForGroup(tabs))
      )
    }
  }

  if (
    selectedTabs ||
    target.classList.contains('tab-search-heading')
  ) {
    scrollToElement(getScrollTargetForAnchor(target), false)
  }
}

const rewriteAnchorLinksDeferred = () => nextTick(() => rewriteAnchorLinks())

let outlineFollowObserver: MutationObserver | null = null
let outlineFollowRaf = 0

const followActiveOutlineLink = () => {
  cancelAnimationFrame(outlineFollowRaf)

  outlineFollowRaf = requestAnimationFrame(() => {
    const activeLink = document.querySelector<HTMLElement>(
      '.VPDocAsideOutline a.outline-link.active'
    )
    const scroller = activeLink?.closest<HTMLElement>('.aside-container')
    if (!activeLink || !scroller) return

    const linkRect = activeLink.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    const margin = 32

    if (linkRect.top < scrollerRect.top + margin) {
      scroller.scrollTop += linkRect.top - scrollerRect.top - margin
    } else if (linkRect.bottom > scrollerRect.bottom - margin) {
      scroller.scrollTop += linkRect.bottom - scrollerRect.bottom + margin
    }
  })
}

const setupOutlineFollow = () => {
  outlineFollowObserver?.disconnect()
  outlineFollowObserver = null

  const outline = document.querySelector('.VPDocAsideOutline')
  if (!outline) return

  outlineFollowObserver = new MutationObserver((mutations) => {
    if (
      mutations.some((mutation) =>
        mutation.type === 'childList' ||
        (mutation.target instanceof HTMLElement &&
          mutation.target.matches('a.outline-link'))
      )
    ) {
      followActiveOutlineLink()
    }
  })

  outlineFollowObserver.observe(outline, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
    subtree: true
  })
  followActiveOutlineLink()
}

const BOOKMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`

function syncTocBookmarkStates() {
  const path = route.path
  document.querySelectorAll<HTMLElement>('.toc-bookmark-btn').forEach(btn => {
    const anchor = btn.dataset.anchor ?? ''
    btn.classList.toggle('is-bookmarked', isBookmarked(anchor, path))
  })
}

function addBookmarkBtnToLi(li: HTMLElement, path: string) {
  if (li.querySelector('.toc-bookmark-btn')) return

  const link = li.querySelector<HTMLAnchorElement>(':scope > .outline-link')
  if (!link) return

  const hrefAttr = link.getAttribute('href') ?? ''
  const anchor = hrefAttr.startsWith('#') ? hrefAttr.slice(1) : hrefAttr
  const title = link.textContent?.trim() ?? ''
  if (!anchor || !title) return

  const btn = document.createElement('button')
  btn.className = 'toc-bookmark-btn'
  btn.setAttribute('aria-label', `Bookmark "${title}"`)
  btn.dataset.anchor = anchor
  btn.innerHTML = BOOKMARK_SVG

  if (isBookmarked(anchor, path)) btn.classList.add('is-bookmarked')

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    bookmarkToggle({ anchor, title, path })
    btn.classList.toggle('is-bookmarked', isBookmarked(anchor, path))
  })

  li.appendChild(btn)
}

let tocMutationObserver: MutationObserver | null = null
let tocRaf = 0

function scanTocItems(path: string) {
  // Desktop sidebar — VPDocOutlineItem is called with :root="true"
  document.querySelectorAll<HTMLElement>('.VPDocOutlineItem.root > li').forEach(li => addBookmarkBtnToLi(li, path))
  // Mobile dropdown — VPDocOutlineItem is called without root prop, so the ul gets class "nested"
  document.querySelectorAll<HTMLElement>('.VPLocalNavOutlineDropdown .outline > .VPDocOutlineItem > li').forEach(li => addBookmarkBtnToLi(li, path))
}

function setupTocBookmarks() {
  const path = route.path
  document.querySelectorAll<HTMLElement>('.toc-bookmark-btn').forEach(btn => btn.remove())
  scanTocItems(path)

  // Mobile dropdown items are v-if rendered on open — watch for them being added
  tocMutationObserver?.disconnect()
  tocMutationObserver = new MutationObserver(() => {
    cancelAnimationFrame(tocRaf)
    tocRaf = requestAnimationFrame(() => scanTocItems(route.path))
  })
  tocMutationObserver.observe(document.body, { childList: true, subtree: true })
}

onMounted(tryOpenAnchoredContent)
onMounted(rewriteAnchorLinksDeferred)
onMounted(() => nextTick(setupOutlineFollow))
onMounted(() => nextTick(setupTocBookmarks))
watch(() => route.data, () => {
  void tryOpenAnchoredContent()
  rewriteAnchorLinksDeferred()
  nextTick(setupOutlineFollow)
  nextTick(setupManualCopyButtons)
  nextTick(setupTocBookmarks)
}, { flush: 'post' })
watch(() => route.query, () => {
  void tryOpenAnchoredContent()
  rewriteAnchorLinksDeferred()
}, { flush: 'post' })
watch(() => route.hash, tryOpenAnchoredContent, { flush: 'post' })

function onSidebarEnter() {
  sidebarRef.value?.focus()
}

interface BreadcrumbItem {
  text: string
  link?: string
}

const buildBreadcrumbs = (
  items: Theme.SidebarItem[],
  currentPath: string
): BreadcrumbItem[] => {
  for (const item of items) {
    // Check if this item matches the current path
    if (item.link === currentPath) {
      return [
        {
          text: item.text!.replace('mr-2 block w-4 h-4 bg-cover', '').trim(),
          link: item.link
        }
      ]
    }

    // Check nested items
    if (item.items) {
      const nestedBreadcrumbs = buildBreadcrumbs(item.items, currentPath)
      if (nestedBreadcrumbs.length > 0) {
        return [
          {
            text: item.text!.replace('mr-2 block w-4 h-4 bg-cover', '').trim(),
            link: item.link
          },
          ...nestedBreadcrumbs
        ]
      }
    }
  }
  return []
}

const breadcrumbs = computed(() => {
  const currentPath = route.path
  // @ts-expect-error
  return buildBreadcrumbs(sidebar, currentPath)
})

// Respect user's reduced motion preferences
const prefs = usePreferredReducedMotion()
const { effectsEnabled } = useEffects()

watchEffect(() => {
  if (import.meta.env.SSR) return

  // Effects are off by default; the class strips blur/transitions/scaling.
  document.documentElement.classList.toggle(
    'effects-disabled',
    !effectsEnabled.value
  )
})

type ShadeMap = Record<string, string>
type PaletteEntry = ShadeMap | { dark: ShadeMap; light: ShadeMap }

const accentPalettes: Record<string, PaletteEntry> = {
  ayanami: {
    400: 'oklch(0.722 0.105 247.48)',
    500: 'oklch(0.626 0.098 247.46)',
    600: 'oklch(0.523 0.081 246.86)',
    700: 'oklch(0.43 0.066 246.75)',
    800: 'oklch(0.335 0.052 246.76)',
  },
  asuka: {
    400: 'oklch(0.740 0.210 32)',
    500: 'oklch(0.650 0.240 30)',
    600: 'oklch(0.555 0.238 28)',
    700: 'oklch(0.455 0.205 26)',
    800: 'oklch(0.370 0.165 24)',
  },
  irys: {
    400: 'oklch(0.716 0.188 5.18)',
    500: 'oklch(0.659 0.237 8.99)',
    600: 'oklch(0.584 0.229 10.32)',
    700: 'oklch(0.538 0.213 9.67)',
    800: 'oklch(0.475 0.187 5.94)',
  },
  inanis: {
    400: 'oklch(0.762 0.073 302.02)',
    500: 'oklch(0.663 0.102 301.22)',
    600: 'oklch(0.580 0.119 301.34)',
    700: 'oklch(0.508 0.114 301.00)',
    800: 'oklch(0.452 0.094 302.20)',
  },
  baelz: {
    400: 'oklch(0.720 0.215 22.00)',
    500: 'oklch(0.640 0.255 22.00)',
    600: 'oklch(0.555 0.268 22.00)',
    700: 'oklch(0.472 0.248 22.00)',
    800: 'oklch(0.395 0.208 22.00)',
  },
  amelia: {
    400: 'oklch(0.800 0.085 75.49)',
    500: 'oklch(0.710 0.090 72.47)',
    600: 'oklch(0.594 0.085 69.07)',
    700: 'oklch(0.496 0.078 72.12)',
    800: 'oklch(0.391 0.062 68.86)',
  },
  suisei: {
    400: 'oklch(0.827 0.096 224.60)',
    500: 'oklch(0.740 0.119 230.91)',
    600: 'oklch(0.645 0.127 236.29)',
    700: 'oklch(0.548 0.120 241.26)',
    800: 'oklch(0.451 0.106 244.63)',
  },
  miku: {
    400: 'oklch(0.788 0.133 184.43)',
    500: 'oklch(0.711 0.123 185.28)',
    600: 'oklch(0.607 0.104 187.31)',
    700: 'oklch(0.515 0.086 189.60)',
    800: 'oklch(0.441 0.071 190.95)',
  },
  fubuki: {
    dark: {
      400: 'oklch(0.88 0 0)',
      500: 'oklch(0.78 0 0)',
      600: 'oklch(0.68 0 0)',
      700: 'oklch(0.58 0 0)',
      800: 'oklch(0.48 0 0)',
    },
    light: {
      400: 'oklch(0.52 0 0)',
      500: 'oklch(0.42 0 0)',
      600: 'oklch(0.32 0 0)',
      700: 'oklch(0.22 0 0)',
      800: 'oklch(0.12 0 0)',
    },
  },
}

const accentColor = useStorage(AccentColorStorageKey, 'ayanami')
const accentBg = useStorage(AccentBgStorageKey, false)
const accentBgStrength = useStorage(AccentBgStrengthStorageKey, 60)

// Accent-tinted replacements for the neutral tokens in style.scss.
// Lightness matches the original hex values, so contrast is unchanged.
// Entries are [lightness, chroma] or [lightness, chroma, alpha].
type TintEntry = [number, number] | [number, number, number]
const accentBgTokens: Record<'dark' | 'light', Record<string, TintEntry>> = {
  dark: {
    '--vp-c-bg': [0.187, 0.024],
    '--vp-c-bg-alt': [0.164, 0.022],
    '--vp-c-bg-elv': [0.224, 0.028],
    '--vp-c-bg-soft': [0.224, 0.028],
    '--vp-c-divider': [0.26, 0.032],
    '--vp-c-border': [0.57, 0.02],
    '--vp-c-text-1': [0.915, 0.012],
    '--vp-c-text-2': [0.742, 0.012],
    '--vp-c-text-3': [0.655, 0.012],
    '--wk-c-menu-bg': [0.295, 0.032],
    '--wk-c-nav-solid-bg': [0.2, 0.024],
    '--nav-pill-bg': [0.205, 0.024, 0.7],
    '--wk-fs-header-divider': [0.44, 0.02, 0.65],
  },
  light: {
    '--vp-c-bg': [0.986, 0.012],
    '--vp-c-bg-alt': [0.958, 0.024],
    '--vp-c-bg-elv': [0.958, 0.024],
    '--vp-c-bg-soft': [0.958, 0.024],
    '--vp-c-divider': [0.828, 0.036],
    '--vp-c-border': [0.815, 0.024],
    '--vp-c-gutter': [0.913, 0.02],
    '--vp-c-text-1': [0.224, 0.016],
    '--vp-c-text-2': [0.309, 0.014],
    '--vp-c-text-3': [0.396, 0.014],
    '--wk-c-menu-bg': [0.928, 0.026],
    '--wk-c-nav-solid-bg': [0.986, 0.012],
    '--nav-pill-bg': [0.99, 0.01, 0.8],
    '--wk-fs-header-divider': [0.715, 0.02, 0.25],
  },
}
const accentBgTokenKeys = [...new Set([
  ...Object.keys(accentBgTokens.dark),
  ...Object.keys(accentBgTokens.light),
])]

const applyAccentTheme = () => {
  if (import.meta.env.SSR) return
  const palette = accentPalettes[accentColor.value] ?? accentPalettes.ayanami
  const shades = 'dark' in palette
    ? (isDark.value ? palette.dark : palette.light)
    : palette
  const el = document.documentElement
  if (isDark.value) {
    el.style.setProperty('--vp-c-brand-1', shades['400'])
    el.style.setProperty('--vp-c-brand-2', shades['500'])
    el.style.setProperty('--vp-c-brand-3', shades['700'])
    el.style.setProperty('--vp-c-brand-soft', `color-mix(in srgb, ${shades['500']} 20%, transparent)`)
    el.style.setProperty('--vp-c-sidebar-active', `color-mix(in srgb, ${shades['500']} 15%, transparent)`)
  } else {
    el.style.setProperty('--vp-c-brand-1', shades['500'])
    el.style.setProperty('--vp-c-brand-2', shades['600'])
    el.style.setProperty('--vp-c-brand-3', shades['800'])
    el.style.setProperty('--vp-c-brand-soft', `color-mix(in srgb, ${shades['400']} 40%, transparent)`)
    el.style.setProperty('--vp-c-sidebar-active', `color-mix(in srgb, ${shades['800']} 15%, transparent)`)
  }

  for (const key of accentBgTokenKeys) el.style.removeProperty(key)
  const userStrength = accentBg.value
    ? Math.min(100, Math.max(0, Number(accentBgStrength.value) || 0)) / 100
    : 0
  if (userStrength > 0) {
    const parsed = shades['500'].match(/oklch\(\s*[\d.]+\s+([\d.]+)\s+([\d.]+)/)
    if (parsed) {
      // Tint scales with the accent's own chroma (full tint at C >= 0.10,
      // grayscale accents stay gray), then with the intensity preset.
      const strength = Math.min(1, Number(parsed[1]) / 0.10) * userStrength * 1.5
      const hue = parsed[2]
      const tokens = accentBgTokens[isDark.value ? 'dark' : 'light']
      for (const [key, [l, c, alpha]] of Object.entries(tokens)) {
        const chroma = (c * strength).toFixed(4)
        const suffix = alpha === undefined ? '' : ` / ${alpha}`
        el.style.setProperty(key, `oklch(${l} ${chroma} ${hue}${suffix})`)
      }
    }
  }
}

// Applying the tint restyles the whole page, so throttle rapid changes
// (leading + trailing: single clicks apply instantly, the last value sticks).
const applyAccentThemeThrottled = useThrottleFn(applyAccentTheme, 100, true)

watch(
  [accentColor, isDark, accentBg, accentBgStrength],
  () => applyAccentThemeThrottled(),
  { immediate: true }
)

const speed = 2
const snapThreshold = 5 // px

const takodachiRef = ref<HTMLImageElement | null>(null)
let mousePos: Vec2D | null = null
let target: Vec2D | null = null
let offset: Vec2D = [0, 0]

const position = ref({
  x: 0,
  y: 0
})

const updateMousePos = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    mousePos = [e.clientX, e.clientY]
  } else {
    mousePos = [e.touches[0].clientX, e.touches[0].clientY]
  }
}

const takodachiDisable = ref<(() => void) | null>(null)
const takodachiToggledOn = useStorage(TakodachiStorageKey, false)

const reloadTakodachi = () => {
  takodachiDisable.value?.()

  if (prefs.value === 'reduce') return
  const saved = takodachiToggledOn
  if (saved.value === false) return

  window.addEventListener('mousemove', updateMousePos)
  window.addEventListener('touchstart', updateMousePos)

  const chaser = takodachiRef!.value
  if (chaser) {
    offset = v2smul([chaser.clientWidth, chaser.clientHeight], 0.5)
    setTimeout(() => {
      chaser.classList.remove('opacity-0')
    }, 1000)
  }

  const intervalId = setInterval(() => {
    if (!mousePos) return

    const currentPos: Vec2D = [
      position.value.x + offset[0],
      position.value.y + offset[1]
    ]

    target = target ?? currentPos

    const diff = v2sub(mousePos, currentPos)

    target = v2mag(diff) < snapThreshold
      ? mousePos
      : v2add(target, v2smul(v2norm(diff), speed))

    const finalVec = v2sub(target, offset)

    position.value = { x: finalVec[0], y: finalVec[1] }
  }, 10)

  takodachiDisable.value = () => {
    chaser?.classList.add('opacity-0')

    window.removeEventListener('mousemove', updateMousePos)
    window.removeEventListener('touchstart', updateMousePos)
    clearInterval(intervalId)

    takodachiDisable.value = null
  }
}

function initTitleOnly() {
  document.querySelectorAll('.custom-block').forEach(block => {
    const children = [...block.children]
    const hasOnlyTitle = children.every(el =>
      el.classList.contains('custom-block-title')
    )
    if (hasOnlyTitle) block.classList.add('title-only')
  })
}

function initCopyButtonsInRoot(root: ParentNode) {
  root.querySelectorAll<HTMLTableElement>('table').forEach(table => {
    const headers = table.querySelectorAll<HTMLTableCellElement>('thead th')
    let manualColIndex = -1
    headers.forEach((th, i) => {
      if (th.textContent?.trim() === 'Manual') manualColIndex = i
    })
    if (manualColIndex === -1) return

    // Track how many more rows each column is occupied by a rowspan from above
    const colOccupied: number[] = []

    table.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach(row => {
      const cells = Array.from(row.querySelectorAll('td'))
      let cellIdx = 0
      let col = 0
      let manualCell: HTMLTableCellElement | null = null

      while (col <= manualColIndex) {
        // Column occupied by a rowspan from a previous row — skip it
        if ((colOccupied[col] ?? 0) > 0) {
          colOccupied[col]--
          col++
          continue
        }

        if (cellIdx >= cells.length) break
        const cell = cells[cellIdx++]
        const colspan = cell.colSpan || 1
        const rowspan = cell.rowSpan || 1

        // Register future occupation for rowspan > 1
        if (rowspan > 1) {
          for (let c = col; c < col + colspan; c++) {
            colOccupied[c] = (colOccupied[c] ?? 0) + (rowspan - 1)
          }
        }

        if (col <= manualColIndex && col + colspan > manualColIndex) {
          manualCell = cell
        }

        col += colspan
      }

      if (!manualCell || manualCell.querySelector('.manual-copy-btn')) return

      const link = manualCell.querySelector<HTMLAnchorElement>('a[href]')
      if (!link) return
      const url = link.getAttribute('href')!

      const btn = document.createElement('button')
      btn.className = 'manual-copy-btn'
      btn.title = 'Copy URL'
      const icon = document.createElement('span')
      icon.className = 'i-lucide:copy'
      btn.appendChild(icon)

      btn.addEventListener('click', async (e) => {
        e.preventDefault()
        try {
          await navigator.clipboard.writeText(url)
          icon.className = 'i-lucide:check'
          btn.classList.add('copied')
          setTimeout(() => {
            icon.className = 'i-lucide:copy'
            btn.classList.remove('copied')
          }, 2000)
        } catch {}
      })

      manualCell.classList.add('has-manual-copy')
      manualCell.appendChild(btn)
    })
  })
}

let copyButtonObserver: MutationObserver | null = null

function setupManualCopyButtons() {
  initCopyButtonsInRoot(document)

  copyButtonObserver?.disconnect()
  copyButtonObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue
        if (node.classList.contains('plugin-tabs--content')) {
          initCopyButtonsInRoot(node)
        } else {
          node.querySelectorAll<HTMLElement>('.plugin-tabs--content').forEach(
            panel => initCopyButtonsInRoot(panel)
          )
        }
      }
    }
  })
  copyButtonObserver.observe(document.body, { childList: true, subtree: true })
}

watch(
  () => route.path,
  () => nextTick(() => { initTitleOnly(); setupManualCopyButtons() }),
  { flush: 'post' }
)

onMounted(() => {
  if (import.meta.env.SSR) return

  window.addEventListener(BOOKMARK_CHANGE_EVENT, syncTocBookmarkStates)

  initTitleOnly()
  nextTick(setupManualCopyButtons)

  // Icon tooltip: fixed-position popup appended to <body> to escape table overflow clipping
  const tooltipEl = document.createElement('div')
  tooltipEl.className = 'icon-tip-popup'
  document.body.appendChild(tooltipEl)

  const showTooltip = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('.icon-tip') as
      | HTMLElement
      | null
    if (!target) return
    const tip = target.dataset.tip
    if (!tip) return

    tooltipEl.textContent = tip
    tooltipEl.classList.add('visible')

    const rect = target.getBoundingClientRect()
    const tipWidth = tooltipEl.offsetWidth
    const tipHeight = tooltipEl.offsetHeight
    let left = rect.left + rect.width / 2 - tipWidth / 2
    left = Math.max(8, Math.min(left, window.innerWidth - tipWidth - 8))
    const top = rect.top - tipHeight - 6

    tooltipEl.style.left = `${left}px`
    tooltipEl.style.top = `${top}px`
  }

  const hideTooltip = () => {
    tooltipEl.classList.remove('visible')
  }

  document.addEventListener('mouseover', showTooltip)
  document.addEventListener('mouseout', hideTooltip)
  document.addEventListener('scroll', hideTooltip, true)

  const onCaptureClick = (e: MouseEvent) => {
    if (!e.isTrusted) return
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
    if (!link) return
    const raw = link.getAttribute('href') ?? ''

    // ── Tab link: #tab-name or already-rewritten /path?tabs=name ──────────
    const tabFromHash = raw.startsWith('#' + TAB_LINK_MARKER)
      ? raw.slice(1 + TAB_LINK_MARKER.length)
      : null
    let tabFromQuery: string | null = null
    if (
      !e.defaultPrevented &&
      !tabFromHash &&
      raw.includes(`?${TAB_QUERY_PARAM}=`) &&
      !raw.includes('#')
    ) {
      try {
        const url = new URL(raw, window.location.href)
        const samePage = url.origin === window.location.origin &&
          url.pathname === window.location.pathname
        tabFromQuery = samePage
          ? url.searchParams.get(TAB_QUERY_PARAM)
          : null
      } catch {
        tabFromQuery = null
      }
    }
    const tabName = tabFromHash ?? tabFromQuery

    if (tabName) {
      e.preventDefault()
      e.stopImmediatePropagation()
      window.history.pushState(null, '', buildUrlWithTabs([tabName]))
      rewriteAnchorLinks()
      void (async () => {
        const tabs = await selectTabsByPath([tabName])
        if (tabs) scrollToElement(getSelectedTabScrollTarget(tabs), false)
      })()
      return
    }

    // ── Plain heading link: #name or already-rewritten /path#name ─────────
    // Only intercept when ?tabs= is present — otherwise let the router handle normally.
    if (!new URLSearchParams(window.location.search).has(TAB_QUERY_PARAM)) {
      return
    }

    let hash: string | null = null
    if (raw.startsWith('#') && raw.length > 1) {
      hash = raw.slice(1)
    } else if (raw.startsWith(window.location.pathname + '#')) {
      hash = raw.slice(window.location.pathname.length + 1)
    }
    if (!hash) return

    e.preventDefault()
    e.stopImmediatePropagation()
    window.history.pushState(null, '', `${window.location.pathname}#${hash}`)
    rewriteAnchorLinks()
    void tryOpenAnchoredContent()
  }

  document.addEventListener('click', onCaptureClick, { capture: true })

  useEventListener(document, 'click', (e: MouseEvent) => {
    if (!e.isTrusted) return
    queueTabQueryUpdateForSelection(e.target)
    queueCollapsibleQueryUpdate(e.target)
  })

  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (!e.isTrusted || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) {
      return
    }

    queueTabQueryUpdateForSelection(e.target)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onCaptureClick, { capture: true })
    document.removeEventListener('mouseover', showTooltip)
    document.removeEventListener('mouseout', hideTooltip)
    document.removeEventListener('scroll', hideTooltip, true)
    tooltipEl.remove()
  })

  // Arrow key scrolling + Escape close for sidebars and content
  let activeScrollTarget: HTMLElement | Window = window

  useEventListener(document, 'pointerdown', (e: PointerEvent) => {
    const el = e.target as HTMLElement
    if (homeSidebarOpen.value && sidebarRef.value?.contains(el)) {
      activeScrollTarget = sidebarRef.value
    } else if (el.closest('.VPSidebar')) {
      activeScrollTarget = el.closest('.VPSidebar') as HTMLElement
    } else {
      activeScrollTarget = window
    }
  })

  const pxPerFrame = 18
  let scrollDirection = 0
  let scrollRaf = 0

  function tickScroll() {
    if (!scrollDirection) return
    activeScrollTarget.scrollBy({ top: scrollDirection * pxPerFrame })
    scrollRaf = requestAnimationFrame(tickScroll)
  }

  function stopScroll() {
    scrollDirection = 0
    cancelAnimationFrame(scrollRaf)
  }

  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Escape') {
      return
    }

    if (e.key === 'Escape') {
      if (homeSidebarOpen.value) homeSidebarOpen.value = false
      return
    }

    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    if (scrollDirection === dir) return
    scrollDirection = dir
    cancelAnimationFrame(scrollRaf)
    scrollRaf = requestAnimationFrame(tickScroll)
  })

  useEventListener(document, 'keyup', (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') stopScroll()
  })

  onUnmounted(stopScroll)

  // Close home NavScreen on outside click
  useEventListener(document, 'click', (e: Event) => {
    if (!isHome.value) return
    const screen = document.getElementById('VPNavScreen')
    if (!screen) return
    const hamburger = document.querySelector('.VPNavBarHamburger')
    if (
      screen.contains(e.target as Node) || hamburger?.contains(e.target as Node)
    ) return
    requestAnimationFrame(() => (hamburger as HTMLElement)?.click())
  })

  // Storage changed in other documents.
  useEventListener(window, 'storage', () => {
    reloadTakodachi()
  })

  // Storage changed in the same document.
  useEventListener(window, customStorageEventName, () => {
    reloadTakodachi()
  })

  reloadTakodachi()
})

onUnmounted(() => {
  outlineFollowObserver?.disconnect()
  copyButtonObserver?.disconnect()
  tocMutationObserver?.disconnect()
  cancelAnimationFrame(outlineFollowRaf)
  cancelAnimationFrame(tocRaf)
  takodachiDisable.value && takodachiDisable.value()
  window.removeEventListener(BOOKMARK_CHANGE_EVENT, syncTocBookmarkStates)
})
</script>

<template>
  <Layout>
    <template #layout-top>
      <img
        id="takodachi"
        ref="takodachiRef"
        src="/takodachi.webp"
        alt="Takodachi"
        class="pointer-events-none fixed absolute z-[9999] h-10 w-10 opacity-0 transition-opacity duration-500"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`
        }"
      />
      <!-- Home sidebar menu -->
      <template v-if="isHome">
        <Transition name="home-fade">
          <div
            v-if="homeSidebarOpen"
            class="home-sidebar-backdrop"
            @click="homeSidebarOpen = false"
          />
        </Transition>
        <Transition name="home-slide" @after-enter="onSidebarEnter">
          <aside
            v-if="homeSidebarOpen"
            ref="sidebarRef"
            class="home-sidebar"
            tabindex="-1"
            @click.stop
          >
            <div class="home-sidebar-header">
              <a href="/" class="home-sidebar-logo">
                <img
                  v-if="logoSrc"
                  :src="logoSrc"
                  class="home-sidebar-logo-img"
                  alt="Logo"
                />
                <span>{{ theme.siteTitle ?? site.title }}</span>
              </a>
            </div>
            <nav id="VPSidebarNav" class="home-sidebar-nav">
              <VPSidebarGroup :items="homeSidebarGroups" />
              <SidebarCard />
            </nav>
          </aside>
        </Transition>
      </template>
    </template>
    <template #doc-before>
      <!-- Breadcrumb Navigation -->
      <nav
        v-if="breadcrumbs.length > 0"
        class="breadcrumb mb-6 text-sm text-text-2"
        aria-label="Breadcrumb"
      >
        <ol class="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" class="hover:text-primary transition-colors">
              <span class="i-lucide:home"></span>
            </a>
          </li>
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="crumb.link || index"
            class="flex items-center gap-2"
          >
            <span
              class="i-lucide:chevron-right text-text-3 flex-shrink-0"
            ></span>
            <span
              v-if="index === breadcrumbs.length - 1"
              v-html="crumb.text"
              class="font-medium text-text-1 break-words"
            ></span>
            <a
              v-else
              :href="crumb.link"
              v-html="crumb.text"
              class="hover:text-primary transition-colors break-words"
            ></a>
          </li>
        </ol>
      </nav>
    </template>
    <template #not-found>
      <NotFoundComponent />
    </template>
    <template #sidebar-nav-after>
      <SidebarCard />
    </template>
    <template #home-hero-info-before>
      <AnnouncementPill />
    </template>
    <template #nav-bar-content-after>
      <NavActions />
    </template>
    <template #nav-screen-content-before>
      <nav v-if="isHome" id="VPSidebarNavMobile" class="home-screen-nav">
        <VPSidebarGroup :items="homeSidebarGroups" />
      </nav>
    </template>
    <template #nav-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>

    <template #nav-bar-title-before>
      <span
        v-if="isHome"
        class="home-menu-btn"
        role="button"
        tabindex="0"
        aria-label="Menu"
        @click.prevent.stop="homeSidebarOpen = !homeSidebarOpen"
        @keydown.enter.prevent.stop="homeSidebarOpen = !homeSidebarOpen"
      >
        <span class="vpi-align-left home-menu-icon" />
      </span>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import {
  onClickOutside,
  useElementBounding,
  useEventListener
} from '@vueuse/core'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-vue-next'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch
} from 'vue'
import { homeCards } from '../../../configs/constants'
import type { HomeCard } from '../../../configs/constants'

interface PageGroup {
  key: string
  label: string
  count: number
}

interface GroupedPage {
  key: string
  label: string
  count: number
  card: HomeCard | null
  iconClass: string
}

interface FolderGroup {
  section: string
  parentCard: HomeCard | null
  iconClass: string
  pages: GroupedPage[]
}

type MenuEntry =
  | { type: 'page'; page: GroupedPage }
  | { type: 'folder'; folder: FolderGroup }

function getPageCard(path: string): HomeCard | null {
  let best: HomeCard | null = null
  let bestLen = 0
  for (const card of homeCards) {
    if (
      (path === card.link || path.startsWith(card.link + '/')) &&
      card.link.length > bestLen
    ) {
      best = card
      bestLen = card.link.length
    }
  }
  return best
}

function cardIconToClass(icon: string): string {
  const m = icon.match(/^:(.+):$/)
  if (!m) return 'i-lucide:file-text'
  const name = m[1]
  const dash = name.indexOf('-')
  if (dash === -1) return 'i-lucide:file-text'
  return `i-${name.slice(0, dash)}:${name.slice(dash + 1)}`
}

const props = defineProps<{
  ribbonStyle: 'tabs' | 'list'
  searchMotionDiv: string | object
  ribbonMotion: Record<string, unknown>
  searchAnimationsEnabled: boolean
  urlSearchMode: boolean
  urlPageGroups: PageGroup[]
  urlActivePageFilter: string | null
  urlMatchesLength: number
  pageGroups: PageGroup[]
  activePageFilter: string | null
  resultsLength: number
}>()

const emit = defineEmits<{
  selectUrlPage: [key: string | null]
  selectPage: [key: string | null]
}>()

// List ribbon state
const showListMenu = ref(false)
const listMenuButtonRef = ref<HTMLElement>()
const listMenuRef = ref<HTMLElement>()
const showListMenuFade = ref(true)
const listMenuBounding = useElementBounding(listMenuRef)
const ribbonBounding = useElementBounding(() =>
  listMenuRef.value?.closest('.page-ribbon-list')
)

const listMenuFadeStyle = computed(() => ({
  top: `${listMenuBounding.bottom.value - ribbonBounding.top.value - 56}px`,
  left: `${listMenuBounding.left.value - ribbonBounding.left.value}px`,
  width: `${listMenuBounding.width.value}px`
}))

const listMenuFadeReady = computed(() => listMenuBounding.width.value > 0)

function onListMenuScroll() {
  const el = listMenuRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  showListMenuFade.value = scrollTop + clientHeight < scrollHeight - 4
}

// Tabs ribbon state
const ribbonTrack = shallowRef<HTMLElement>()
const ribbonCanScrollLeft = ref(false)
const ribbonCanScrollRight = ref(false)
const isDragging = ref(false)
let ribbonAnimHandle = 0
let dragStartX = 0
let dragStartScrollLeft = 0
let dragMoved = false
let touchStartX = 0
let touchStartScrollLeft = 0
let touchDragMoved = false

onClickOutside(listMenuRef, () => {
  showListMenu.value = false
}, { ignore: [listMenuButtonRef] })

function onDragStart(e: MouseEvent) {
  // Only respond to primary (left) button
  if (e.button !== 0) return
  const track = getRibbonTrack()
  if (!track) return
  // Don't drag if user clicked on a scroll arrow
  const target = e.target as HTMLElement
  if (target.closest('.page-ribbon-arrow')) return

  isDragging.value = true
  dragStartX = e.clientX
  dragStartScrollLeft = track.scrollLeft
  dragMoved = false
  track.style.cursor = 'grabbing'
  track.style.userSelect = 'none'
  // Prevent text selection while dragging
  e.preventDefault()
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  const track = getRibbonTrack()
  if (!track) return

  const deltaX = e.clientX - dragStartX
  const threshold = 4
  if (!dragMoved && Math.abs(deltaX) > threshold) {
    dragMoved = true
  }

  if (dragMoved) {
    track.scrollLeft = dragStartScrollLeft - deltaX
    updateRibbonOverflow()
  }
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  const track = getRibbonTrack()
  if (track) {
    track.style.cursor = ''
    track.style.userSelect = ''
  }
}

function onTrackClick(e: MouseEvent) {
  if (dragMoved || touchDragMoved) {
    e.preventDefault()
    e.stopPropagation()
    dragMoved = false
    touchDragMoved = false
  }
}

function onTrackWheel(e: WheelEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  if (max <= 0) return
  const newScroll = Math.max(
    0,
    Math.min(max, track.scrollLeft + e.deltaX + e.deltaY)
  )
  if (newScroll !== track.scrollLeft) {
    e.preventDefault()
    track.scrollLeft = newScroll
    updateRibbonOverflow()
  }
}

function onTouchStart(e: TouchEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const target = e.target as HTMLElement
  if (target.closest('.page-ribbon-arrow')) return
  touchStartX = e.touches[0].clientX
  touchStartScrollLeft = track.scrollLeft
  touchDragMoved = false
}

function onTouchMove(e: TouchEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const deltaX = e.touches[0].clientX - touchStartX
  const threshold = 4
  if (!touchDragMoved && Math.abs(deltaX) > threshold) {
    touchDragMoved = true
  }
  if (touchDragMoved) {
    track.scrollLeft = touchStartScrollLeft - deltaX
    updateRibbonOverflow()
  }
}

function onTouchEnd() {
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

function getRibbonTrack(): HTMLElement | null {
  return ribbonTrack.value ?? null
}

function scrollActivePagePillIntoView(direction = 0) {
  if (props.ribbonStyle === 'list') return
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
      behavior: props.searchAnimationsEnabled ? 'smooth' : 'auto'
    })
    updateRibbonOverflow()
  })
}

function scrollRibbon(direction: number) {
  const track = getRibbonTrack()
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  const amount = track.clientWidth * 0.7 * direction
  const from = track.scrollLeft
  const to = Math.max(0, Math.min(max, from + amount))
  if (to === from) return
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
  if (!props.searchAnimationsEnabled) {
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
    if (t < 1) ribbonAnimHandle = requestAnimationFrame(step)
    else ribbonAnimHandle = 0
  }
  ribbonAnimHandle = requestAnimationFrame(step)
}

watch(() => props.pageGroups, () => {
  nextTick(() => {
    updateRibbonOverflow()
    onListMenuScroll()
  })
})
watch(() => props.urlPageGroups, () => {
  nextTick(() => {
    updateRibbonOverflow()
    onListMenuScroll()
  })
})
watch(showListMenu, async (open) => {
  if (!open) return
  await nextTick()
  onListMenuScroll()
})
useEventListener('resize', updateRibbonOverflow)

onBeforeUnmount(() => {
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
  // Reset drag state if component unmounts mid-drag
  if (isDragging.value) {
    onDragEnd()
  }
})

defineExpose({ scrollActivePagePillIntoView })

const groupedMenuEntries = computed((): MenuEntry[] => {
  const groups = props.urlSearchMode ? props.urlPageGroups : props.pageGroups
  if (!groups.length) return []

  // Wrap each group with card info
  const withCards: GroupedPage[] = groups.map((g) => {
    const card = getPageCard(g.key)
    return {
      key: g.key,
      label: g.label,
      count: g.count,
      card,
      iconClass: card ? cardIconToClass(card.icon) : 'i-lucide:file-text'
    }
  })

  // Separate into top-level (no section) and folder (has section)
  const topPages: GroupedPage[] = []
  const folderMap = new Map<string, GroupedPage[]>()

  for (const p of withCards) {
    if (p.card?.section) {
      if (!folderMap.has(p.card.section)) folderMap.set(p.card.section, [])
      folderMap.get(p.card.section)!.push(p)
    } else {
      topPages.push(p)
    }
  }

  // Build folder entries
  const folderEntries: FolderGroup[] = [...folderMap.entries()]
    .map(([section, pages]) => {
      const parentCard = homeCards.find((c) =>
        c.title === section && !c.section
      ) ?? null
      return {
        section,
        parentCard,
        iconClass: parentCard
          ? cardIconToClass(parentCard.icon)
          : 'i-lucide:folder',
        pages
      }
    })

  // Merge: top-level pages first, then folder groups
  const entries: MenuEntry[] = [
    ...topPages.map((p) => ({ type: 'page' as const, page: p })),
    ...folderEntries.map((f) => ({ type: 'folder' as const, folder: f }))
  ]

  return entries
})

function setUrlPageFilter(key: string | null) {
  emit('selectUrlPage', key)
  showListMenu.value = false
  nextTick(updateRibbonOverflow)
}

function setPageFilter(key: string | null) {
  emit('selectPage', key)
  showListMenu.value = false
  nextTick(updateRibbonOverflow)
}

const activePageData = computed(() => {
  const findInEntries = (key: string, fallbackCount: number) => {
    for (const entry of groupedMenuEntries.value) {
      if (entry.type === 'page' && entry.page.key === key) {
        return {
          label: entry.page.label,
          iconClass: entry.page.iconClass,
          count: entry.page.count
        }
      }
      if (entry.type === 'folder') {
        const found = entry.folder.pages.find((p) => p.key === key)
        if (found) {
          return {
            label: found.label,
            iconClass: entry.folder.iconClass,
            count: found.count
          }
        }
      }
    }
    return null
  }

  if (props.urlSearchMode) {
    if (props.urlActivePageFilter === null) {
      return {
        label: 'All',
        iconClass: 'i-lucide:text-search',
        count: props.urlMatchesLength
      }
    }
    const result = findInEntries(
      props.urlActivePageFilter,
      props.urlMatchesLength
    )
    return result ??
      {
        label: 'All',
        iconClass: 'i-lucide:text-search',
        count: props.urlMatchesLength
      }
  }

  if (props.activePageFilter === null) {
    return {
      label: 'All',
      iconClass: 'i-lucide:text-search',
      count: props.resultsLength
    }
  }
  const result = findInEntries(props.activePageFilter, props.resultsLength)
  return result ??
    {
      label: 'All',
      iconClass: 'i-lucide:text-search',
      count: props.resultsLength
    }
})

function toggleListMenu() {
  showListMenu.value = !showListMenu.value
}

const allPages = computed((): (string | null)[] => {
  const pages: (string | null)[] = [null]
  for (const entry of groupedMenuEntries.value) {
    if (entry.type === 'page') {
      pages.push(entry.page.key)
    } else {
      for (const page of entry.folder.pages) {
        pages.push(page.key)
      }
    }
  }
  return pages
})

const currentPageIndex = computed(() => {
  const activeKey = props.urlSearchMode
    ? props.urlActivePageFilter
    : props.activePageFilter
  return allPages.value.indexOf(activeKey)
})

function pageNav(delta: number) {
  const pages = allPages.value
  if (pages.length <= 1) return
  const idx = currentPageIndex.value
  const nextIdx = ((idx + delta) % pages.length + pages.length) % pages.length
  const key = pages[nextIdx]
  if (props.urlSearchMode) setUrlPageFilter(key)
  else setPageFilter(key)
}
</script>

<template>
  <!-- List ribbon style -->
  <component
    :is="searchMotionDiv"
    v-if="ribbonStyle === 'list' && (urlSearchMode
    ? urlPageGroups.length > 1
    : pageGroups.length > 1)"
    class="page-ribbon page-ribbon-list"
    v-bind="ribbonMotion"
  >
    <div class="page-ribbon-list-label">
      <span :class="activePageData.iconClass" class="page-ribbon-list-icon" />
      <span class="page-ribbon-list-name">{{ activePageData.label }}</span>
      <span class="page-ribbon-list-badge">{{ activePageData.count }}</span>
    </div>

    <div class="page-ribbon-list-actions">
      <button
        type="button"
        class="ribbon-menu-btn ribbon-page-nav"
        title="Previous page"
        @click="pageNav(-1)"
      >
        <ChevronLeft :size="18" stroke-width="2" />
      </button>
      <button
        type="button"
        class="ribbon-menu-btn ribbon-page-nav"
        title="Next page"
        @click="pageNav(1)"
      >
        <ChevronRight :size="18" stroke-width="2" />
      </button>
      <button
        ref="listMenuButtonRef"
        type="button"
        class="ribbon-menu-btn"
        :class="{ 'is-open': showListMenu }"
        title="Filter by page"
        :aria-expanded="showListMenu"
        aria-haspopup="true"
        @click.stop="toggleListMenu"
      >
        <Menu :size="18" stroke-width="2" />
      </button>
    </div>

    <!-- List menu dropdown -->
    <Transition name="ribbon-menu-popup">
      <div
        v-if="showListMenu"
        ref="listMenuRef"
        class="page-ribbon-list-menu"
        @scroll.passive="onListMenuScroll"
      >
        <!-- "All" item -->
        <button
          type="button"
          class="ribbon-menu-item all-item"
          :class="{
            active: urlSearchMode
              ? urlActivePageFilter === null
              : activePageFilter === null
          }"
          @click="urlSearchMode
          ? setUrlPageFilter(null)
          : setPageFilter(null)"
        >
          <span class="i-lucide:text-search ribbon-menu-item-icon" />
          <span class="ribbon-menu-item-label">All</span>
          <span class="ribbon-menu-item-count">{{
            urlSearchMode ? urlMatchesLength : resultsLength
          }}</span>
        </button>

        <div class="ribbon-menu-divider" />

        <!-- Grouped pages -->
        <template
          v-for="entry in groupedMenuEntries"
          :key="entry.type === 'page'
          ? entry.page.key
          : entry.folder.section"
        >
          <!-- Top-level page -->
          <div v-if="entry.type === 'page'" class="ribbon-menu-group">
            <button
              type="button"
              class="ribbon-menu-item"
              :class="{
                active: urlSearchMode
                  ? urlActivePageFilter === entry.page.key
                  : activePageFilter === entry.page.key
              }"
              @click="urlSearchMode
              ? setUrlPageFilter(entry.page.key)
              : setPageFilter(entry.page.key)"
            >
              <span
                :class="entry.page.iconClass"
                class="ribbon-menu-item-icon"
              />
              <span class="ribbon-menu-item-label">{{ entry.page.label }}</span>
              <span class="ribbon-menu-item-count">{{ entry.page.count }}</span>
            </button>
          </div>

          <!-- Folder group -->
          <div v-else class="ribbon-menu-group">
            <h4 class="ribbon-menu-group-title">
              <span
                :class="entry.folder.iconClass"
                class="ribbon-menu-group-icon"
              />
              <span class="ribbon-menu-group-text">{{
                entry.folder.section
              }}</span>
            </h4>
            <div class="ribbon-menu-sub-items">
              <button
                v-for="page in entry.folder.pages"
                :key="page.key"
                type="button"
                class="ribbon-menu-item"
                :class="{
                  active: urlSearchMode
                    ? urlActivePageFilter === page.key
                    : activePageFilter === page.key
                }"
                @click="urlSearchMode
                ? setUrlPageFilter(page.key)
                : setPageFilter(page.key)"
              >
                <span class="ribbon-menu-item-label">{{ page.label }}</span>
                <span class="ribbon-menu-item-count">{{ page.count }}</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </Transition>

    <Transition name="ribbon-menu-fade">
      <div
        v-if="showListMenu && showListMenuFade && listMenuFadeReady"
        class="page-ribbon-list-menu-fade"
        :style="listMenuFadeStyle"
      />
    </Transition>
  </component>

  <!-- Tabs ribbon style (original) -->
  <component
    :is="searchMotionDiv"
    v-if="ribbonStyle !== 'list' && (urlSearchMode
    ? urlPageGroups.length > 1
    : pageGroups.length > 1)"
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
      :class="{ 'is-dragging': isDragging }"
      @scroll="updateRibbonOverflow"
      @mousedown="onDragStart"
      @mousemove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @click.capture="onTrackClick"
      @wheel="onTrackWheel"
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
          <span class="page-pill-count">{{ urlMatchesLength }}</span>
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
          <span class="page-pill-count">{{ resultsLength }}</span>
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
  </component>
</template>

<style>
.page-ribbon {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 0;
  flex: none;
  overflow: hidden;
  padding: 8px 12px 0;
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
  gap: 0;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.page-ribbon-track.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.page-ribbon::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--vp-c-divider);
}

.page-ribbon-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
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

.page-ribbon-arrow.left {
  left: 0;
  justify-content: flex-start;
  padding-left: 6px;
  background: linear-gradient(
    to right,
    var(--vp-local-search-bg) 60%,
    transparent
  );
}

.page-ribbon-arrow.right {
  right: 0;
  justify-content: flex-end;
  padding-right: 6px;
  background: linear-gradient(
    to left,
    var(--vp-local-search-bg) 60%,
    transparent
  );
}

.page-ribbon-arrow:hover {
  color: var(--vp-c-text-1);
}

.page-ribbon-arrow.left svg {
  transform: rotate(180deg);
}

.page-pill {
  flex: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s;
}

.page-pill:hover {
  color: var(--vp-c-text-1);
}

.page-pill.active {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.page-pill::after {
  content: "";
  position: absolute;
  z-index: 1;
  right: 8px;
  bottom: -2px;
  left: 8px;
  height: 2px;
  background-color: transparent;
  border-radius: 0;
  transition: background-color 0.2s;
}

.page-pill.active::after {
  background-color: var(--vp-c-brand-1);
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
  border-radius: 3px;
  background: rgba(128, 128, 128, 0.12);
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.page-pill.active .page-pill-count {
  color: var(--vp-c-text-2);
  background: rgba(128, 128, 128, 0.18);
}

@media (max-width: 767px) {
  .page-pill {
    height: 32px;
    padding: 0 10px;
    font-size: 0.8rem;
  }
}

/* List ribbon style */
.page-ribbon-list {
  justify-content: space-between;
  padding: 6px 12px 4px;
  overflow: visible;
}

@media (min-width: 768px) {
  .ribbon-page-nav {
    display: none;
  }
}

.page-ribbon-list-actions {
  display: flex;
  align-items: center;
}

.page-ribbon-list-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  min-width: 0;
}

.page-ribbon-list-icon {
  flex: none;
  font-size: 16px;
  width: 1em;
  height: 1em;
  color: var(--vp-c-text-1);
}

.page-ribbon-list-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.page-ribbon-list-badge {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.72rem;
  padding: 1px 7px;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.15);
  color: var(--vp-c-text-1);
  line-height: 1.5;
  font-weight: 600;
}

.ribbon-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  padding: 8px 4px;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0;
  line-height: 1;
}

.ribbon-menu-btn:hover {
  color: var(--vp-c-text-1);
  opacity: 1;
  background: transparent;
}

@media (hover: none) {
  .ribbon-menu-btn:hover {
    opacity: 0.55;
    color: var(--vp-c-text-1);
  }
}

.ribbon-menu-btn:focus {
  outline: none;
}

.ribbon-menu-btn:active {
  transform: scale(0.94);
  opacity: 1;
  color: var(--vp-c-text-1);
}

.ribbon-menu-btn.is-open {
  opacity: 1;
  color: var(--vp-c-text-1);
}

html.effects-disabled .ribbon-menu-btn {
  transition: none;
}

html.effects-disabled .ribbon-menu-btn:active {
  transform: none;
}

.page-ribbon-list-menu {
  position: absolute;
  top: 100%;
  right: 4px;
  z-index: 50;
  width: 228px;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 8px;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-ribbon-list-menu::-webkit-scrollbar {
  display: none;
}

.page-ribbon-list-menu-fade {
  position: absolute;
  z-index: 51;
  height: 56px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--vp-c-bg-elv)
  );
  border-radius: 0 0 12px 12px;
}

.ribbon-menu-fade-enter-active,
.ribbon-menu-fade-leave-active {
  transition: opacity 0.2s;
}

.ribbon-menu-fade-enter-from,
.ribbon-menu-fade-leave-to {
  opacity: 0;
}

.ribbon-menu-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 4px 0;
}

.ribbon-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  text-align: left;
  width: 100%;
}

.ribbon-menu-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.ribbon-menu-item.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  font-weight: 600;
}

.ribbon-menu-item-icon {
  flex: none;
  font-size: 15px;
  color: var(--vp-c-text-1);
  width: 1em;
  height: 1em;
}

.ribbon-menu-item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.all-item {
  font-weight: 600;
  font-size: 0.85rem;
}

.ribbon-menu-item-count {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(128, 128, 128, 0.12);
  color: var(--vp-c-text-3);
  line-height: 1.4;
  margin-left: auto;
}

.ribbon-menu-item.active .ribbon-menu-item-count {
  color: var(--vp-c-text-2);
  background: rgba(128, 128, 128, 0.18);
}

.ribbon-menu-group + .ribbon-menu-group {
  margin-top: 2px;
}

.ribbon-menu-group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-1);
  margin: 8px 0 2px;
  padding: 0 8px 4px;
  user-select: none;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ribbon-menu-group-icon {
  font-size: 13px;
  flex: none;
  width: 1em;
  height: 1em;
  color: var(--vp-c-text-1);
}

.ribbon-menu-group-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ribbon-menu-sub-items {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ribbon-menu-popup-enter-active,
.ribbon-menu-popup-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
  transform-origin: top right;
}

.ribbon-menu-popup-enter-from,
.ribbon-menu-popup-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-4px);
}
</style>
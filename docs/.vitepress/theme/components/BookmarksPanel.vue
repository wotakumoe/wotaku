<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { Bookmark, Hash, X } from 'lucide-vue-next'
import { inBrowser } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { computed, nextTick, ref, watch } from 'vue'
import type { HomeCard } from '../../configs/constants'
import { homeCards, sidebar } from '../../configs/constants'
import type { Bookmark as BookmarkItem } from '../composables/useBookmarks'
import { useBookmarks } from '../composables/useBookmarks'

const ICON_SIZE = 18
const ICON_STROKE = 2

const { bookmarks, remove } = useBookmarks()
const isOpen = ref(false)
const wrapperRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const scrollRef = ref<HTMLElement>()
const showFade = ref(true)
const panelStyle = ref<Record<string, string>>({})

onClickOutside(wrapperRef, () => {
  isOpen.value = false
})

function onScroll() {
  if (!scrollRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollRef.value
  showFade.value = scrollTop + clientHeight < scrollHeight - 4
}

function updatePanelPosition() {
  const wrapper = wrapperRef.value
  const button = buttonRef.value
  const panel = panelRef.value
  if (!wrapper || !button || !panel) return

  if (!inBrowser || window.innerWidth <= 767) {
    panelStyle.value = {}
    return
  }

  const viewportMargin = 12
  const wrapperRect = wrapper.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  const panelWidth = panel.offsetWidth
  const centeredLeft = buttonRect.left + buttonRect.width / 2 - panelWidth / 2
  const maxLeft = Math.max(
    viewportMargin,
    window.innerWidth - viewportMargin - panelWidth
  )
  const viewportLeft = Math.min(Math.max(centeredLeft, viewportMargin), maxLeft)

  panelStyle.value = {
    '--bookmarks-panel-left': `${viewportLeft - wrapperRect.left}px`,
    '--bookmarks-panel-shift': '0px'
  }
}

watch(isOpen, async (open) => {
  if (!open) return
  await nextTick()
  updatePanelPosition()
  onScroll()
})

useEventListener(inBrowser ? window : undefined, 'resize', () => {
  if (isOpen.value) updatePanelPosition()
})

function flattenSidebarPaths(items: DefaultTheme.SidebarItem[]): string[] {
  const paths: string[] = []
  for (const item of items) {
    if (item.link) paths.push(item.link)
    if (item.items) paths.push(...flattenSidebarPaths(item.items))
  }
  return paths
}

const sidebarPathOrder = flattenSidebarPaths(Array.isArray(sidebar) ? sidebar : Object.values(sidebar).flat())

function sidebarIndex(path: string): number {
  const exact = sidebarPathOrder.indexOf(path)
  return exact !== -1 ? exact : Infinity
}

function cardIconToClass(icon: string): string {
  const m = icon.match(/^:(.+):$/)
  if (!m) return 'i-lucide:file-text'
  const name = m[1]
  const dash = name.indexOf('-')
  if (dash === -1) return 'i-lucide:file-text'
  return `i-${name.slice(0, dash)}:${name.slice(dash + 1)}`
}

function getPageCard(path: string): HomeCard | null {
  let best: HomeCard | null = null
  let bestLen = 0
  for (const card of homeCards) {
    if ((path === card.link || path.startsWith(card.link + '/')) && card.link.length > bestLen) {
      best = card
      bestLen = card.link.length
    }
  }
  return best
}

type PageGroup = { path: string; card: HomeCard | null; items: BookmarkItem[] }
type TopLevelEntry = { type: 'page'; path: string; card: HomeCard | null; items: BookmarkItem[] }
type FolderEntry = { type: 'folder'; section: string; parentCard: HomeCard | null; pages: PageGroup[] }
type GroupEntry = TopLevelEntry | FolderEntry

const grouped = computed((): GroupEntry[] => {
  // Collect bookmarks by path
  const byPath = new Map<string, BookmarkItem[]>()
  for (const bm of bookmarks.value) {
    if (!byPath.has(bm.path)) byPath.set(bm.path, [])
    byPath.get(bm.path)!.push(bm)
  }

  // Separate into top-level pages and folder sub-pages (those with a section field)
  const topPages: string[] = []
  const folderMap = new Map<string, string[]>() // section → paths

  for (const path of byPath.keys()) {
    const card = getPageCard(path)
    if (card?.section) {
      if (!folderMap.has(card.section)) folderMap.set(card.section, [])
      folderMap.get(card.section)!.push(path)
    } else {
      topPages.push(path)
    }
  }

  // Sort top-level pages by exact sidebar position
  topPages.sort((a, b) => sidebarIndex(a) - sidebarIndex(b))

  // Build folder entries, sorted by parent card's sidebar position
  const folderEntries: FolderEntry[] = [...folderMap.entries()]
    .map(([section, paths]) => {
      const parentCard = homeCards.find(c => c.title === section && !c.section) ?? null
      const sortedPages = [...paths]
        .sort((a, b) => sidebarIndex(a) - sidebarIndex(b))
        .map(path => ({ path, card: getPageCard(path), items: byPath.get(path)! }))
      return { type: 'folder' as const, section, parentCard, pages: sortedPages }
    })
    .sort((a, b) => sidebarIndex(a.parentCard?.link ?? '') - sidebarIndex(b.parentCard?.link ?? ''))

  // Merge top-level and folder entries in sidebar order
  const topEntries: TopLevelEntry[] = topPages.map(path => ({
    type: 'page' as const,
    path,
    card: getPageCard(path),
    items: byPath.get(path)!
  }))

  return [...topEntries, ...folderEntries].sort((a, b) => {
    const ai = a.type === 'page' ? sidebarIndex(a.path) : sidebarIndex(a.parentCard?.link ?? '')
    const bi = b.type === 'page' ? sidebarIndex(b.path) : sidebarIndex(b.parentCard?.link ?? '')
    return ai - bi
  })
})
</script>

<template>
  <div ref="wrapperRef" class="bookmarks-wrapper">
    <button
      ref="buttonRef"
      type="button"
      class="bookmarks-btn"
      aria-label="Bookmarks"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <Bookmark :size="ICON_SIZE" :stroke-width="ICON_STROKE" />
    </button>

    <Transition name="bookmarks-panel">
      <div v-if="isOpen" ref="panelRef" class="bookmarks-panel" :style="panelStyle" role="dialog" aria-label="Bookmarks">
        <div class="bookmarks-mobile-header">
          <span class="bookmarks-mobile-title">Bookmarks</span>
          <button type="button" class="bookmarks-mobile-close" aria-label="Close" @click="isOpen = false">
            <X :size="18" :stroke-width="2" />
          </button>
        </div>
        <div
          ref="scrollRef"
          class="bookmarks-scroll"
          @scroll.passive="onScroll"
        >
          <div v-if="bookmarks.length === 0" class="bookmarks-empty">
            <span class="bookmarks-empty-kaomoji">(˶ᵔ ᵕ ᵔ˶)</span>
            <p class="bookmarks-empty-hint bookmarks-empty-hint--desktop">Tip: Hover over any primary heading under <strong>On this page</strong> and click <Bookmark :size="13" :stroke-width="2" class="bookmarks-empty-inline-icon" /> to bookmark it.</p>
            <p class="bookmarks-empty-hint bookmarks-empty-hint--mobile">Tip: Tap <strong>On this page</strong> and press <Bookmark :size="13" :stroke-width="2" class="bookmarks-empty-inline-icon" /> next to any primary heading to bookmark it.</p>
          </div>
          <div v-else class="bookmarks-groups">
            <template v-for="group in grouped" :key="group.type === 'page' ? group.path : group.section">

              <!-- Top-level page (no folder) -->
              <div v-if="group.type === 'page'" class="bookmarks-group">
                <h3 class="bookmarks-group-title">
                  <span v-if="group.card" :class="cardIconToClass(group.card.icon)" class="bookmarks-group-icon" />
                  <span v-else class="i-lucide:file-text bookmarks-group-icon" />
                  <span class="bookmarks-group-text">{{ group.card?.title ?? group.path }}</span>
                </h3>
                <ul class="bookmarks-list">
                  <li v-for="bm in group.items" :key="bm.anchor" class="bookmarks-item">
                    <a class="bookmarks-item-link" :href="bm.path + '#' + bm.anchor" @click="isOpen = false">
                      <Hash :size="12" :stroke-width="2" class="bookmarks-item-icon" />
                      {{ bm.title }}
                    </a>
                    <button type="button" class="bookmarks-item-remove" :aria-label="`Remove bookmark for ${bm.title}`" @click.stop="remove(bm.anchor, bm.path)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Folder group (e.g. Guides, Glossary) -->
              <div v-else class="bookmarks-group">
                <h3 class="bookmarks-group-title">
                  <span v-if="group.parentCard" :class="cardIconToClass(group.parentCard.icon)" class="bookmarks-group-icon" />
                  <span v-else class="i-lucide:folder bookmarks-group-icon" />
                  <span class="bookmarks-group-text">{{ group.section }}</span>
                </h3>
                <div v-for="page in group.pages" :key="page.path" class="bookmarks-sub-group">
                  <h4 class="bookmarks-sub-title">{{ page.card?.title ?? page.path }}</h4>
                  <ul class="bookmarks-list">
                    <li v-for="bm in page.items" :key="bm.anchor" class="bookmarks-item">
                      <a class="bookmarks-item-link" :href="bm.path + '#' + bm.anchor" @click="isOpen = false">
                        <Hash :size="12" :stroke-width="2" class="bookmarks-item-icon" />
                        {{ bm.title }}
                      </a>
                      <button type="button" class="bookmarks-item-remove" :aria-label="`Remove bookmark for ${bm.title}`" @click.stop="remove(bm.anchor, bm.path)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

            </template>
          </div>
        </div>
        <Transition name="bookmarks-fade">
          <div v-if="showFade && bookmarks.length > 0" class="bookmarks-fade-overlay" />
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bookmarks-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmarks-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bookmarks-btn:hover { opacity: 1; }
.bookmarks-btn:active { transform: scale(0.94); }

.bookmarks-panel {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  left: var(--bookmarks-panel-left, 50%);
  z-index: 100;
  width: 282px;
  max-width: calc(100vw - 24px);
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  transform: translateX(var(--bookmarks-panel-shift, -50%));
  transform-origin: top center;
  overflow: hidden;
}

.bookmarks-scroll {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.bookmarks-scroll::-webkit-scrollbar {
  display: none;
}

.bookmarks-fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--vp-c-bg-elv)
  );
  border-radius: 0 0 12px 12px;
}

.bookmarks-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  gap: 10px;
  text-align: center;
  overflow: hidden;
}

.bookmarks-empty-kaomoji {
  font-size: 28px;
  color: var(--vp-c-text-3);
  line-height: 1;
  user-select: none;
}

.bookmarks-empty-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
}

.bookmarks-empty-hint--mobile {
  display: none;
}

.bookmarks-empty-inline-icon {
  display: inline;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.bookmarks-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bookmarks-sub-group {
  margin-top: 4px;
}

.bookmarks-sub-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--vp-c-text-3);
  margin: 6px 0 2px;
  padding: 0 6px 4px;
  user-select: none;
  border-bottom: 1px solid #525252;
}

.bookmarks-group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0 0 2px;
  padding: 2px 0;
  user-select: none;
  min-width: 0;
}

.bookmarks-group-icon {
  font-size: 16px;
  color: var(--vp-c-text-1);
  flex: none;
}

.bookmarks-group-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bookmarks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bookmarks-item {
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background-color 0.15s;
}

.bookmarks-item:hover {
  background: var(--vp-c-default-soft);
}

.bookmarks-item-link {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  padding: 4px 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
  min-width: 0;
}

.bookmarks-item-link:hover {
  color: var(--vp-c-brand-1);
}

.bookmarks-item-icon {
  flex: none;
  color: var(--vp-c-text-3);
}

.bookmarks-item-remove {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.15s;
}

.bookmarks-item-remove:hover {
  color: var(--vp-c-text-1);
}

.bookmarks-panel-enter-active,
.bookmarks-panel-leave-active {
  transition: opacity 0.15s, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.bookmarks-panel-enter-from,
.bookmarks-panel-leave-to {
  opacity: 0;
  transform: translateX(var(--bookmarks-panel-shift, -50%)) scale(0.95) translateY(-4px);
}

.bookmarks-fade-enter-active,
.bookmarks-fade-leave-active {
  transition: opacity 0.2s;
}

.bookmarks-fade-enter-from,
.bookmarks-fade-leave-to {
  opacity: 0;
}

.bookmarks-mobile-header {
  display: none;
}

@media (max-width: 1279px) {
  .bookmarks-empty-hint--desktop {
    display: none;
  }

  .bookmarks-empty-hint--mobile {
    display: block;
  }
}

@media (max-width: 767px) {
  .bookmarks-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    border-radius: 0;
    border: none;
    z-index: 9999;
    transform: none;
    transform-origin: center top;
    display: flex;
    flex-direction: column;
  }

  .bookmarks-scroll {
    flex: 1;
    height: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .bookmarks-empty {
    flex: 1;
    min-height: 0;
  }

  .bookmarks-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    flex-shrink: 0;
    padding: 0 20px;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .bookmarks-mobile-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .bookmarks-mobile-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .bookmarks-mobile-close:hover {
    background: var(--vp-c-default-soft);
    color: var(--vp-c-text-1);
  }

  .bookmarks-panel-enter-from,
  .bookmarks-panel-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>

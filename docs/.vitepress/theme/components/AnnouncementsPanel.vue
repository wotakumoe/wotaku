<script setup lang="ts">
import { onClickOutside, useEventListener, useMounted } from '@vueuse/core'
import { ArrowLeft, CheckCheck, ChevronRight, Megaphone } from 'lucide-vue-next'
import { inBrowser, useRouter } from 'vitepress'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Announcement, AnnouncementType } from '../composables/useAnnouncements'
import { useAnnouncements } from '../composables/useAnnouncements'
import AnnouncementTypeSelect from './AnnouncementTypeSelect.vue'

const ICON_SIZE = 18
const ICON_STROKE = 2

const {
  announcements,
  enabled,
  isRead,
  markRead,
  markAllRead,
  hasUnread,
  unreadCount
} = useAnnouncements()

const router = useRouter()
const mounted = useMounted()

const TYPE_META: Record<AnnouncementType, { label: string; icon: string }> = {
  section: { label: 'Section', icon: 'i-lucide:panel-top' },
  component: { label: 'Component', icon: 'i-lucide:box' },
  improvement: { label: 'Improvement', icon: 'i-lucide:sparkles' }
}

/* Panel open/close & positioning  */
const isOpen = ref(false)
const wrapperRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const scrollRef = ref<HTMLElement>()
const showFade = ref(true)
const panelStyle = ref<Record<string, string>>({})

onClickOutside(wrapperRef, () => {
  // keep panel open while the filter menu is up
  if (!filterOpen.value) isOpen.value = false
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
    '--ann-panel-left': `${viewportLeft - wrapperRect.left}px`
  }
}

watch(isOpen, async (open) => {
  if (!open) {
    filterOpen.value = false
    return
  }
  await nextTick()
  updatePanelPosition()
  onScroll()
})

useEventListener(inBrowser ? window : undefined, 'resize', () => {
  if (isOpen.value) updatePanelPosition()
  if (filterOpen.value) updateFilterPosition()
})

/*  Type filter (gear menu)  */
// '' = all types
const typeFilter = ref('')
const filterOpen = ref(false)
const filterBtnRef = ref<HTMLElement>()
const filterMenuRef = ref<HTMLElement>()
const filterStyle = ref<Record<string, string>>({})

function updateFilterPosition() {
  const btn = filterBtnRef.value
  if (!btn) return
  const viewportMargin = 12
  const menuWidth = filterMenuRef.value?.offsetWidth ?? 200
  const rect = btn.getBoundingClientRect()
  const maxLeft = Math.max(viewportMargin, window.innerWidth - viewportMargin - menuWidth)
  const left = Math.min(Math.max(rect.right - menuWidth, viewportMargin), maxLeft)
  filterStyle.value = { top: `${rect.bottom + 6}px`, left: `${left}px` }
}

function toggleFilter() {
  filterOpen.value = !filterOpen.value
  if (filterOpen.value) void nextTick(updateFilterPosition)
}

function onFilterDocClick(e: MouseEvent) {
  const target = e.target as Node
  if (
    filterBtnRef.value && !filterBtnRef.value.contains(target)
    && filterMenuRef.value && !filterMenuRef.value.contains(target)
  ) {
    filterOpen.value = false
  }
}

const filtered = computed(() =>
  typeFilter.value
    ? announcements.filter((a) => a.type === typeFilter.value)
    : announcements
)

/*  Detail popup  */
const activePost = ref<Announcement | null>(null)

function openPost(post: Announcement) {
  markRead(post.id)
  if (post.type === 'section') {
    isOpen.value = false
    if (post.link) router.go(post.link)
    return
  }
  activePost.value = post
}

function closePost() {
  activePost.value = null
}

function onMarkAllRead() {
  markAllRead()
}

watch(activePost, (post) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = post ? 'hidden' : ''
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (activePost.value) closePost()
  else if (filterOpen.value) filterOpen.value = false
  else if (isOpen.value) isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onFilterDocClick, true)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onFilterDocClick, true)
  document.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="enabled" ref="wrapperRef" class="ann-wrapper">
    <button
      ref="buttonRef"
      type="button"
      class="ann-btn"
      aria-label="Announcements"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <Megaphone :size="ICON_SIZE" :stroke-width="ICON_STROKE" />
      <span v-if="mounted && hasUnread" class="ann-dot" aria-hidden="true" />
    </button>

    <Transition name="ann-panel">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="ann-panel"
        :style="panelStyle"
        role="dialog"
        aria-label="Announcements"
      >
        <div class="ann-header">
          <button type="button" class="ann-mobile-back" aria-label="Back" @click="isOpen = false">
            <ArrowLeft :size="18" :stroke-width="2" />
          </button>
          <span class="ann-header-title">Announcements</span>
          <div class="ann-header-actions">
            <button
              type="button"
              class="ann-header-btn"
              aria-label="Mark all as read"
              :disabled="unreadCount === 0"
              @click="onMarkAllRead"
            >
              <CheckCheck :size="16" :stroke-width="2" />
            </button>
            <button
              type="button"
              class="ann-settings-btn"
              :class="{ 'is-active': filterOpen }"
              aria-label="Filter by type"
              :aria-expanded="filterOpen"
              ref="filterBtnRef"
              @click="toggleFilter"
            >
              <span class="i-lucide:settings" />
            </button>
          </div>
        </div>

        <div ref="scrollRef" class="ann-scroll" @scroll.passive="onScroll">
          <div v-if="filtered.length === 0" class="ann-empty">
            <span class="ann-empty-kaomoji">(´・ω・`)</span>
            <p class="ann-empty-hint">No announcements to show.</p>
          </div>
          <ul v-else class="ann-list">
            <li v-for="post in filtered" :key="post.id" class="ann-item">
              <button
                type="button"
                class="ann-item-btn"
                :class="{ 'is-unread': !isRead(post.id) }"
                :aria-label="`${TYPE_META[post.type].label}: ${post.title}`"
                @click="openPost(post)"
              >
                <span class="ann-item-typeicon" :class="TYPE_META[post.type].icon" />
                <span class="ann-item-title">{{ post.title }}</span>
                <ChevronRight :size="15" :stroke-width="2" class="ann-item-chevron" />
              </button>
            </li>
          </ul>
        </div>

        <Transition name="ann-fade">
          <div v-if="showFade && filtered.length > 0" class="ann-fade-overlay" />
        </Transition>
      </div>
    </Transition>

    <!-- Type filter menu -->
    <Teleport to="body">
      <div
        v-show="filterOpen"
        ref="filterMenuRef"
        class="ann-filter-menu VPMenu"
        :style="filterStyle"
        role="menu"
        aria-label="Filter announcements by type"
      >
        <AnnouncementTypeSelect v-model="typeFilter" />
      </div>
    </Teleport>

    <!-- detail popup -->
    <Teleport to="body">
      <Transition name="ann-detail-fade">
        <div v-if="activePost" class="ann-backdrop" @click.self="closePost">
          <Transition name="ann-detail-slide" appear>
            <div v-if="activePost" class="ann-detail" role="dialog" aria-modal="true" :aria-label="activePost.title">
              <div class="ann-detail-head">
                <button class="ann-detail-back" aria-label="Back" @click="closePost">
                  <ArrowLeft :size="18" :stroke-width="2" />
                </button>
                <span class="ann-detail-title">{{ activePost.title }}</span>
                <button class="ann-detail-close" aria-label="Close" @click="closePost">
                  <span class="i-lucide:x" />
                </button>
              </div>
              <div class="ann-detail-body">
                <div class="ann-detail-content vp-doc" v-html="activePost.html" />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ann-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ann-btn {
  position: relative;
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

.ann-btn:hover { opacity: 1; }
.ann-btn:active { transform: scale(0.94); }

/* unread dot, brand colour */
.ann-dot {
  position: absolute;
  top: calc(50% - 11px);
  right: calc(50% - 11px);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--nav-pill-bg, var(--vp-c-bg));
}

.ann-panel {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  left: var(--ann-panel-left, 50%);
  z-index: 100;
  width: 320px;
  max-width: calc(100vw - 24px);
  --ann-panel-bg: var(--vp-c-bg-elv);
  background-color: var(--ann-panel-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  transform: translateX(-50%);
  transform-origin: top center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ann-panel[style*="--ann-panel-left"] {
  transform: none;
}

.ann-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 12px 12px 8px 16px;
}

.ann-header-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ann-header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* header buttons, extrepo gear style */
.ann-header-btn,
.ann-settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ann-settings-btn span {
  font-size: 15px;
}

.ann-header-btn:hover,
.ann-settings-btn:hover,
.ann-settings-btn.is-active {
  color: var(--vp-c-text-1);
  opacity: 1;
  background: transparent;
}

.ann-header-btn:active,
.ann-settings-btn:active {
  transform: scale(0.94);
}

.ann-header-btn:disabled {
  opacity: 0.25;
  cursor: default;
}

.ann-header-btn:disabled:active {
  transform: none;
}

html.effects-disabled .ann-settings-btn,
html.effects-disabled .ann-header-btn {
  transition: none;
}

html.effects-disabled .ann-settings-btn:active,
html.effects-disabled .ann-header-btn:active {
  transform: none;
}

.ann-mobile-back {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: color 0.15s;
}

.ann-mobile-back:hover {
  color: var(--vp-c-brand-1);
}

.ann-scroll {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 0 8px 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ann-scroll::-webkit-scrollbar {
  display: none;
}

.ann-fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--ann-panel-bg));
  border-radius: 0 0 12px 12px;
}

.ann-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 340px;
  gap: 10px;
  text-align: center;
}

.ann-empty-kaomoji {
  font-size: 26px;
  color: var(--vp-c-text-3);
  line-height: 1;
  user-select: none;
}

.ann-empty-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.ann-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ann-item-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, opacity 0.15s;
}

.ann-item-btn:hover {
  background: var(--vp-c-default-soft);
}

.ann-item-typeicon {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--vp-c-text-2);
}

.ann-item-title {
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
}

/* dim read items */
.ann-item-btn:not(.is-unread) {
  opacity: 0.5;
}

.ann-item-btn:not(.is-unread):hover {
  opacity: 1;
}

.ann-item-btn:not(.is-unread) .ann-item-title {
  font-weight: 400;
}

.ann-item-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

/*  Filter menu  */
.ann-filter-menu {
  position: fixed;
  z-index: 120;
  width: 260px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3, 0 4px 16px rgba(0, 0, 0, 0.3));
}

/*  Detail popup  */
.ann-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  overscroll-behavior: none;
}

.ann-detail {
  width: min(640px, calc(100vw - 32px));
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
}

.ann-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.ann-detail-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
}

.ann-detail-back {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: color 0.15s;
}

.ann-detail-back:hover {
  color: var(--vp-c-brand-1);
}

.ann-detail-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ann-detail-close:hover {
  color: var(--vp-c-text-1);
}

.ann-detail-close:active {
  transform: scale(0.94);
}

.ann-detail-body {
  overflow-y: auto;
  min-height: 0;
  padding: 20px 24px 28px;
  overscroll-behavior: contain;
}

.ann-detail-content :deep(:first-child) {
  margin-top: 0;
}

/*  Transitions  */
.ann-panel-enter-active,
.ann-panel-leave-active {
  transition: opacity 0.15s, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.ann-panel-enter-from,
.ann-panel-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.95) translateY(-4px);
}

.ann-panel[style*="--ann-panel-left"].ann-panel-enter-from,
.ann-panel[style*="--ann-panel-left"].ann-panel-leave-to {
  transform: scale(0.95) translateY(-4px);
}

.ann-fade-enter-active,
.ann-fade-leave-active {
  transition: opacity 0.2s;
}

.ann-fade-enter-from,
.ann-fade-leave-to {
  opacity: 0;
}

.ann-detail-fade-enter-active,
.ann-detail-fade-leave-active { transition: opacity 0.2s ease; }
.ann-detail-fade-enter-from,
.ann-detail-fade-leave-to { opacity: 0; }

.ann-detail-slide-enter-active { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease; }
.ann-detail-slide-leave-active { transition: transform 0.2s ease, opacity 0.15s ease; }
.ann-detail-slide-enter-from { transform: translateY(20px); opacity: 0; }
.ann-detail-slide-leave-to { transform: translateY(10px); opacity: 0; }

html.effects-disabled .ann-btn,
html.effects-disabled .ann-header-btn,
html.effects-disabled .ann-detail-close {
  transition: none;
}

html.effects-disabled .ann-btn:active,
html.effects-disabled .ann-header-btn:active,
html.effects-disabled .ann-detail-close:active {
  transform: none;
}

/*  Phone: full-screen panel  */
@media (max-width: 767px) {
  .ann-panel {
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
    --ann-panel-bg: var(--vp-c-bg);
  }

  .ann-header {
    height: 49px;
    padding: 6px 8px;
    border-bottom: 1px solid var(--wk-fs-header-divider);
  }

  .ann-mobile-back {
    display: flex;
  }

  .ann-header-title {
    font-size: 16px;
  }

  .ann-scroll {
    flex: 1;
    height: auto;
    min-height: 0;
  }

  .ann-panel-enter-from,
  .ann-panel-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }

  .ann-backdrop {
    align-items: stretch;
  }

  .ann-detail {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
    border: none;
  }

  .ann-detail-head {
    height: 49px;
    padding: 6px 8px;
    justify-content: flex-start;
    border-bottom-color: var(--wk-fs-header-divider);
  }

  .ann-detail-back {
    display: flex;
  }

  .ann-detail-close {
    display: none;
  }
}
</style>

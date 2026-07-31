<script setup lang="ts">
import { onClickOutside, useElementBounding } from '@vueuse/core'
import {
  Clock,
  Globe,
  Highlighter,
  Layers,
  LayoutList,
  List,
  LocateOff,
  Menu,
  Regex,
  Search,
  TextAlignStart
} from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import {
  excerptPreload,
  ribbonStyle,
  saveHistoryEnabled,
  searchMode,
  searchResultHighlightMode,
  showDetailedList
} from '../../searchState'
import type { SearchSortMode } from '../../searchState'

const props = defineProps<{
  showSettingsPopup: boolean
  settingsButtonRef: HTMLElement | undefined
}>()

const emit = defineEmits<{
  'update:showSettingsPopup': [value: boolean]
}>()

const settingsPopupRef = ref<HTMLDivElement>()
const settingsBounding = useElementBounding(() => props.settingsButtonRef)
const settingsPopupBounding = useElementBounding(settingsPopupRef)
const showFade = ref(true)

const settingsFadeStyle = computed(() => ({
  top: `${settingsPopupBounding.bottom.value - 56}px`,
  left: `${settingsPopupBounding.left.value}px`,
  width: `${settingsPopupBounding.width.value}px`
}))

const settingsFadeReady = computed(() => settingsPopupBounding.width.value > 0)

function onSettingsScroll() {
  const el = settingsPopupRef.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  showFade.value = scrollTop + clientHeight < scrollHeight - 4
}

type HelpSection =
  | 'search'
  | 'view'
  | 'ribbon'
  | 'preload'
  | 'highlight'
  | 'history'
const activeHelpSection = ref<HelpSection | null>(null)
const helpPopupEl = ref<HTMLDivElement>()
const helpPopupPos = ref({ top: -9999, left: -9999 })

watch(() => props.showSettingsPopup, async (val) => {
  if (!val) {
    activeHelpSection.value = null
    helpPopupPos.value = { top: -9999, left: -9999 }
    return
  }
  await nextTick()
  onSettingsScroll()
})

const canHoverHelp = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

function positionHelpPopup(btn: HTMLElement) {
  helpPopupPos.value = { top: -9999, left: -9999 }
  const rect = btn.getBoundingClientRect()
  const menuRect = settingsPopupRef.value?.getBoundingClientRect()
  nextTick(() => {
    const popupW = helpPopupEl.value?.offsetWidth || 260
    const popupH = helpPopupEl.value?.offsetHeight || 200
    const vw = window.innerWidth
    const margin = 8
    const isMobile = vw < 768
    if (isMobile) {
      const aboveTop = rect.top - popupH - margin
      const belowTop = rect.bottom + margin
      const top = aboveTop >= margin ? aboveTop : belowTop
      const left = Math.max(
        margin,
        Math.min((vw - popupW) / 2, vw - popupW - margin)
      )
      helpPopupPos.value = { top, left }
    } else {
      const anchorLeft = menuRect ? menuRect.left : rect.left
      helpPopupPos.value = {
        left: Math.max(margin, anchorLeft - popupW - 16),
        top: rect.top
      }
    }
  })
}

function closeHelpSection() {
  activeHelpSection.value = null
  helpPopupPos.value = { top: -9999, left: -9999 }
}

function toggleHelpSection(section: HelpSection, e: MouseEvent) {
  if (canHoverHelp()) {
    activeHelpSection.value = section
    positionHelpPopup(e.currentTarget as HTMLElement)
    return
  }
  if (activeHelpSection.value === section) {
    closeHelpSection()
    return
  }
  activeHelpSection.value = section
  positionHelpPopup(e.currentTarget as HTMLElement)
}

function onHelpEnter(section: HelpSection, e: MouseEvent) {
  if (!canHoverHelp()) return
  activeHelpSection.value = section
  positionHelpPopup(e.currentTarget as HTMLElement)
}

function onHelpLeave() {
  if (!canHoverHelp()) return
  closeHelpSection()
}

const settingsPopupStyle = computed(() => ({
  top: `${settingsBounding.bottom.value + 8}px`,
  right: `calc(100vw - ${settingsBounding.right.value}px)`
}))

const settingsBtnEl = computed(() => props.settingsButtonRef)
onClickOutside(settingsPopupRef, () => {
  emit('update:showSettingsPopup', false)
}, { ignore: [settingsBtnEl] })

function setSearchMode(mode: string) {
  searchMode.value = mode as SearchSortMode
}
</script>

<template>
  <Transition name="settings-popup">
    <div
      v-if="showSettingsPopup"
      ref="settingsPopupRef"
      class="search-settings-popup"
      :style="settingsPopupStyle"
      @scroll.passive="onSettingsScroll"
      @click="closeHelpSection"
    >
      <!-- Search Mode -->
      <div class="settings-section">
        <div class="settings-section-header">
          <div class="settings-section-label">
            <Search :size="14" stroke-width="1.75" />
            Search
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'search' }"
            aria-label="Search mode help"
            @click.stop="toggleHelpSection('search', $event)"
            @mouseenter="onHelpEnter('search', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'search' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchMode === 'exact' }"
            @click="setSearchMode('exact')"
          >
            <span>Exact</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchMode === 'fuzzy' }"
            @click="setSearchMode('fuzzy')"
          >
            <span>Fuzzy</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchMode === 'url' }"
            @click="setSearchMode('url')"
          >
            <span>URL</span>
          </button>
        </div>
      </div>

      <!-- View -->
      <div
        v-if="searchMode !== 'url'"
        class="settings-section"
      >
        <div class="settings-section-header">
          <div class="settings-section-label">
            <LayoutList :size="14" stroke-width="1.75" />
            View
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'view' }"
            aria-label="Result view help"
            @click.stop="toggleHelpSection('view', $event)"
            @mouseenter="onHelpEnter('view', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'view' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: showDetailedList }"
            @click="showDetailedList = true"
          >
            <span>Detail</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: !showDetailedList }"
            @click="showDetailedList = false"
          >
            <span>List</span>
          </button>
        </div>
      </div>

      <!-- Ribbon -->
      <div class="settings-section">
        <div class="settings-section-header">
          <div class="settings-section-label">
            <Menu :size="14" stroke-width="1.75" />
            Ribbon
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'ribbon' }"
            aria-label="Ribbon style help"
            @click.stop="toggleHelpSection('ribbon', $event)"
            @mouseenter="onHelpEnter('ribbon', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'ribbon' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: ribbonStyle === 'tabs' }"
            @click="ribbonStyle = 'tabs'"
          >
            <span>Tabs</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: ribbonStyle === 'list' }"
            @click="ribbonStyle = 'list'"
          >
            <span>List</span>
          </button>
        </div>
      </div>

      <!-- Preload -->
      <div
        v-if="searchMode !== 'url' && showDetailedList"
        class="settings-section"
      >
        <div class="settings-section-header">
          <div class="settings-section-label">
            <Layers :size="14" stroke-width="1.75" />
            Preload
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'preload' }"
            aria-label="Excerpt preload help"
            @click.stop="toggleHelpSection('preload', $event)"
            @mouseenter="onHelpEnter('preload', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'preload' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: excerptPreload === 'all' }"
            @click="excerptPreload = 'all'"
          >
            <span>All</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: excerptPreload === 'next' }"
            @click="excerptPreload = 'next'"
          >
            <span>Next</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: excerptPreload === 'off' }"
            @click="excerptPreload = 'off'"
          >
            <span>Off</span>
          </button>
        </div>
      </div>

      <!-- Highlight -->
      <div class="settings-section">
        <div class="settings-section-header">
          <div class="settings-section-label">
            <Highlighter :size="14" stroke-width="1.75" />
            Highlight
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'highlight' }"
            aria-label="Search result highlight help"
            @click.stop="toggleHelpSection('highlight', $event)"
            @mouseenter="onHelpEnter('highlight', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'highlight' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchResultHighlightMode === 'soft' }"
            @click="searchResultHighlightMode = 'soft'"
          >
            <span>Soft</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchResultHighlightMode === 'solid' }"
            @click="searchResultHighlightMode = 'solid'"
          >
            <span>Solid</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: searchResultHighlightMode === 'off' }"
            @click="searchResultHighlightMode = 'off'"
          >
            <span>Off</span>
          </button>
        </div>
      </div>

      <!-- History -->
      <div class="settings-section">
        <div class="settings-section-header">
          <div class="settings-section-label">
            <Clock :size="14" stroke-width="1.75" />
            History
          </div>
          <button
            type="button"
            class="settings-help-btn"
            :class="{ active: activeHelpSection === 'history' }"
            aria-label="Search history help"
            @click.stop="toggleHelpSection('history', $event)"
            @mouseenter="onHelpEnter('history', $event)"
            @mouseleave="onHelpLeave"
          >
            <span class="i-carbon:help-filled settings-help-icon" />
          </button>
        </div>
        <div
          class="settings-options"
          :class="{ 'is-highlighted': activeHelpSection === 'history' }"
        >
          <button
            type="button"
            class="settings-option"
            :class="{ active: saveHistoryEnabled }"
            @click="saveHistoryEnabled = true"
          >
            <span>On</span>
          </button>
          <button
            type="button"
            class="settings-option"
            :class="{ active: !saveHistoryEnabled }"
            @click="saveHistoryEnabled = false"
          >
            <span>Off</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="settings-fade">
    <div
      v-if="showSettingsPopup && showFade && settingsFadeReady"
      class="search-settings-fade-overlay"
      :style="settingsFadeStyle"
    />
  </Transition>

  <!-- Help popups -->
  <Transition name="help-popup-fade">
    <div
      v-if="activeHelpSection && showSettingsPopup"
      ref="helpPopupEl"
      class="search-help-popup"
      :style="{ top: helpPopupPos.top + 'px', left: helpPopupPos.left + 'px' }"
    >
      <template v-if="activeHelpSection === 'search'">
        <h4 class="sh-title">
          <Search :size="16" stroke-width="1.75" class="sh-title-icon" />
          Search Mode
        </h4>
        <p class="sh-desc">Choose how queries are matched against content.</p>
        <div class="sh-options">
          <div class="sh-option">
            <strong><Regex :size="14" stroke-width="1.5" /> Exact</strong>
            <span>Matches the exact phrase you type</span>
          </div>
          <div class="sh-option">
            <strong><LocateOff :size="14" stroke-width="1.5" /> Fuzzy</strong>
            <span>Approximate matching that tolerates typos</span>
          </div>
          <div class="sh-option">
            <strong><Globe :size="14" stroke-width="1.5" /> URL</strong>
            <span>Searches through hyperlinks</span>
          </div>
        </div>
      </template>
      <template v-else-if="activeHelpSection === 'view'">
        <h4 class="sh-title">
          <LayoutList :size="16" stroke-width="1.75" class="sh-title-icon" />
          Result View
        </h4>
        <p class="sh-desc">Controls how search results are displayed.</p>
        <div class="sh-options">
          <div class="sh-option">
            <strong><TextAlignStart :size="14" stroke-width="1.5" />
              Detail</strong>
            <span>Shows a content excerpt below each result. Uses more
              memory.</span>
          </div>
          <div class="sh-option">
            <strong><List :size="14" stroke-width="1.5" /> List</strong>
            <span>Compact list of titles only. Uses less memory.</span>
          </div>
        </div>
      </template>
      <template v-else-if="activeHelpSection === 'preload'">
        <h4 class="sh-title">
          <Layers :size="16" stroke-width="1.75" class="sh-title-icon" />
          Excerpt Preload
        </h4>
        <p class="sh-desc">
          Renders excerpts for upcoming result pages ahead of time in Detail
          view.
        </p>
        <div class="sh-options">
          <div class="sh-option">
            <strong>All</strong>
            <span>Prepares every result page. Uses more memory.</span>
          </div>
          <div class="sh-option">
            <strong>Next</strong>
            <span>Also prepares the next page so flipping forward is
              instant</span>
          </div>
          <div class="sh-option">
            <strong>Off</strong>
            <span>Only the visible page. Uses the least memory.</span>
          </div>
        </div>
      </template>
      <template v-else-if="activeHelpSection === 'highlight'">
        <h4 class="sh-title">
          <Highlighter :size="16" stroke-width="1.75" class="sh-title-icon" />
          Search Result Highlight
        </h4>
        <p class="sh-desc">Highlights the exact result you open.</p>
        <div class="sh-options">
          <div class="sh-option">
            <strong>Soft</strong>
            <span>Soft accent background with a solid border.</span>
          </div>
          <div class="sh-option">
            <strong>Solid</strong>
            <span>Solid accent fill with no border.</span>
          </div>
        </div>
      </template>
      <template v-else-if="activeHelpSection === 'ribbon'">
        <h4 class="sh-title">
          <Menu :size="16" stroke-width="1.75" class="sh-title-icon" />
          Page Ribbon
        </h4>
        <p class="sh-desc">How result pages are displayed in the search bar.</p>
        <div class="sh-options">
          <div class="sh-option">
            <strong>Tabs</strong>
            <span>Horizontal page list.</span>
          </div>
          <div class="sh-option">
            <strong>List</strong>
            <span>Vertical page list.</span>
          </div>
        </div>
      </template>
      <template v-else-if="activeHelpSection === 'history'">
        <h4 class="sh-title">
          <Clock :size="16" stroke-width="1.75" class="sh-title-icon" />
          Search History
        </h4>
        <p class="sh-desc">
          Saves recent searches and shows them when the search bar is empty.
        </p>
      </template>
    </div>
  </Transition>
</template>

<style>
.search-settings-popup {
  --seg-track: var(--wk-c-menu-bg);
  --seg-pill-bg: var(--vp-c-bg);
  --seg-pill-text: var(--vp-c-text-1);
  --seg-pill-shadow: 0 2px 4px 0 #bababa8c;
  position: fixed;
  z-index: 200;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px;
  box-shadow: var(--vp-shadow-3);
  display: flex;
  flex-direction: column;
  min-width: 196px;
  max-height: min(320px, 60vh);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.search-settings-popup::-webkit-scrollbar {
  display: none;
}

.dark .search-settings-popup {
  --seg-track: var(--wk-c-menu-bg);
  --seg-pill-bg: var(--vp-c-text-1);
  --seg-pill-text: var(--vp-c-bg-elv);
  --seg-pill-shadow: 0 2px 4px 0 #535353db;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settings-section + .settings-section {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 8px;
  padding-top: 8px;
}

.settings-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.settings-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.settings-help-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  opacity: 0.5;
  transition: opacity 0.15s, color 0.15s;
  border-radius: 3px;
  line-height: 1;
}

.settings-help-btn:hover,
.settings-help-btn.active {
  opacity: 1;
  color: var(--vp-c-text-1);
}

.settings-help-icon {
  display: block;
  width: 16px;
  height: 16px;
}

.settings-options {
  display: flex;
  gap: 4px;
  background: var(--seg-track);
  border-radius: 8px;
  padding: 4px;
  outline: 2px dashed transparent;
  outline-offset: 4px;
  transition: outline-color 0.2s ease;
}

.settings-options.is-highlighted {
  outline-color: var(--vp-c-brand-1);
}

.settings-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 6px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.15s, color 0.15s, box-shadow 0.15s;
  flex: 1;
}

.settings-option:hover,
.settings-option.active {
  color: var(--seg-pill-text);
  background: var(--seg-pill-bg);
  box-shadow: var(--seg-pill-shadow);
}

.settings-option.active {
  font-weight: 700;
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

.search-settings-fade-overlay {
  position: fixed;
  z-index: 200;
  height: 56px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--vp-c-bg-elv)
  );
  border-radius: 0 0 12px 12px;
}

.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 0.2s;
}

.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}

.search-help-popup {
  position: fixed;
  z-index: 9999;
  width: 280px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.help-popup-fade-enter-active,
.help-popup-fade-leave-active {
  transition: opacity 0.15s ease;
}

.help-popup-fade-enter-from,
.help-popup-fade-leave-to {
  opacity: 0;
}

.sh-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 4px;
}

.sh-title-icon {
  flex-shrink: 0;
  opacity: 0.8;
  width: 16px;
  height: 16px;
}

.sh-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0 0 6px;
  line-height: 1.5;
}

.sh-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sh-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--wk-c-menu-bg);
  border-radius: 12px;
  padding: 10px 12px;
}

.dark .sh-option {
  background: var(--wk-c-menu-bg);
}

.sh-option strong {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sh-option span {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

@media (max-width: 767px) {
  .search-settings-popup {
    max-width: 280px;
  }

  .search-help-popup {
    position: fixed !important;
    width: calc(100vw - 16px);
    max-width: 300px;
  }
}
</style>

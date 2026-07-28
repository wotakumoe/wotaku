<script setup lang="ts">
import {
  Globe,
  List,
  LocateOff,
  Regex,
  Settings,
  TextAlignStart,
  X
} from 'lucide-vue-next'
import { ref } from 'vue'
import { searchMode, showDetailedList } from '../../searchState'
import type { SearchSortMode } from '../../searchState'

defineProps<{
  filterText: string
  searchLoading: boolean
  disableDetailedView: boolean
  showSettingsPopup: boolean
  buttonText: string
  disableReset: boolean
  searchMotionForm: string | object
  formMotion: Record<string, unknown>
  translate: (key: string) => string
}>()

const emit = defineEmits<{
  'update:filterText': [value: string]
  cycleSearchMode: []
  resetSearch: []
  searchBarClick: [event: PointerEvent]
  toggleSettings: []
  close: []
}>()

const searchInput = ref<HTMLInputElement>()
const settingsButtonRef = ref<HTMLButtonElement>()

defineExpose({ searchInput, settingsButtonRef })

function onViewDetailClick() {
  showDetailedList.value = true
}

function onViewListClick() {
  showDetailedList.value = false
}

function onExactClick() {
  if (searchMode.value === 'exact') emit('cycleSearchMode')
  else searchMode.value = 'exact' as SearchSortMode
}

function onFuzzyClick() {
  if (searchMode.value === 'fuzzy') emit('cycleSearchMode')
  else searchMode.value = 'fuzzy' as SearchSortMode
}

function onUrlClick() {
  if (searchMode.value === 'url') emit('cycleSearchMode')
  else searchMode.value = 'url' as SearchSortMode
}
</script>

<template>
  <component
    :is="searchMotionForm"
    class="search-bar"
    v-bind="formMotion"
    @pointerup="emit('searchBarClick', $event)"
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
        @click="emit('close')"
      >
        <span class="vpi-arrow-left local-search-icon" />
      </button>
    </div>
    <input
      ref="searchInput"
      :value="filterText"
      @input="emit('update:filterText', ($event.target as HTMLInputElement).value)"
      aria-autocomplete="both"
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
          @click="onViewDetailClick"
        >
          <TextAlignStart :size="18" stroke-width="2" />
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-active': !showDetailedList }"
          title="List view (Consumes less RAM)"
          @click="onViewListClick"
        >
          <List :size="18" stroke-width="2" />
        </button>
      </div>
      <div class="search-mode-group toolbar-group">
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-active': searchMode === 'exact' }"
          title="Exact search"
          @click="onExactClick"
        >
          <Regex :size="18" stroke-width="2" />
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-active': searchMode === 'fuzzy' }"
          title="Fuzzy search"
          @click="onFuzzyClick"
        >
          <LocateOff :size="18" stroke-width="2" />
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-active': searchMode === 'url' }"
          title="URL search"
          @click="onUrlClick"
        >
          <Globe :size="18" stroke-width="2" />
        </button>
      </div>
      <button
        ref="settingsButtonRef"
        type="button"
        class="mode-btn settings-toggle-btn"
        :class="{ 'mode-active': showSettingsPopup }"
        title="Search settings"
        @click.stop="emit('toggleSettings')"
      >
        <Settings :size="18" stroke-width="2" />
      </button>
      <button
        class="clear-button"
        type="reset"
        :disabled="disableReset"
        :title="translate('modal.resetButtonTitle')"
        @click="emit('resetSearch')"
      >
        <X :size="18" stroke-width="2" />
      </button>
    </div>
  </component>
</template>

<style>
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

.local-search-icon {
  display: block;
  font-size: 18px;
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

.toolbar-group + .toolbar-group {
  margin-left: 6px;
}

.search-mode-group,
.view-group {
  display: none;
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

.exact-match-button.exact-match-active {
  color: var(--vp-c-brand-1);
  background-color: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  border-radius: 4px;
}

.search-actions .settings-toggle-btn,
.search-actions .clear-button {
  display: flex;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  padding: 8px 4px;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-actions button.settings-toggle-btn:not([disabled]):hover,
.search-actions button.clear-button:not([disabled]):hover,
.settings-toggle-btn.mode-active {
  color: var(--vp-c-text-1);
  opacity: 1;
  background: transparent;
}

.settings-toggle-btn:active,
.clear-button:not([disabled]):active {
  transform: scale(0.94);
}

html.effects-disabled .settings-toggle-btn,
html.effects-disabled .clear-button {
  transition: none;
}

html.effects-disabled .settings-toggle-btn:active,
html.effects-disabled .clear-button:active {
  transform: none;
}

@media (max-width: 767px) {
  .search-actions.before {
    display: flex;
  }

  label[for="localsearch-input"] {
    display: none;
  }
}

.back-button {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  width: 24px;
  height: 24px;
}

@media (max-width: 767px) {
  .back-button {
    display: flex;
  }
}
</style>

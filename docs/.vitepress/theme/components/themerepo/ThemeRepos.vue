<script setup lang="ts">
import { refDebounced, useMediaQuery } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  DEFAULT_THEME,
  resolveThemeColors
} from '../../../../ext/themeRepos/defaults'
import type {
  ManaTheme,
  ThemeRepoEntry
} from '../../../../ext/themeRepos/types'
import { SEARCH_DEBOUNCE_MS, STATUS_TICK_MS } from '../extrepo/constants'
import { screens } from './screens'
import ThemeFilterMenu from './ThemeFilterMenu.vue'
import ThemePreview from './ThemePreview.vue'
import ThemeRow from './ThemeRow.vue'

type ThemeIndexEntry = {
  name?: string
  author?: string | { name?: string }
  url?: string
}
type ThemeFile = {
  theme?: { name?: string; colors?: { values?: Record<string, string> } }
}
type LoadedTheme = ManaTheme & { raw: string }
type ThemeGroup = { author: string; themes: LoadedTheme[] }

const props = withDefaults(defineProps<{ themes?: ThemeRepoEntry[] }>(), {
  themes: () => []
})

const themes = ref<LoadedTheme[]>([])
const loading = ref(props.themes.length > 0)
const loadFailed = ref(false)
const selectedKey = ref<string | null>(null)
const screenIndex = ref(0)
const isPhone = useMediaQuery('(max-width: 767px)')

const previewTheme = computed(
  () =>
    themes.value.find(theme => theme.raw === selectedKey.value) ??
      DEFAULT_THEME
)
const screen = computed(() => screens[screenIndex.value] ?? screens[0])
const groups = computed<ThemeGroup[]>(() => {
  const byAuthor = new Map<string, LoadedTheme[]>()
  for (const theme of themes.value) {
    const author = theme.author?.trim() || 'Unknown'
    const list = byAuthor.get(author)
    if (list) list.push(theme)
    else byAuthor.set(author, [theme])
  }
  return [...byAuthor.entries()]
    .map(([author, list]) => ({
      author,
      themes: [...list].sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.author.localeCompare(b.author))
})

const openGroups = ref<Set<string>>(new Set())
const knownAuthors = new Set<string>()
const query = ref('')
const debouncedQuery = refDebounced(query, SEARCH_DEBOUNCE_MS)
const mainColorsOnly = ref(true)
const bigSwatches = ref(!isPhone.value)

const isSearching = computed(() => debouncedQuery.value.trim().length > 0)
const filteredGroups = computed<ThemeGroup[]>(() => {
  const q = debouncedQuery.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value
    .map(group => ({
      author: group.author,
      themes: group.themes.filter(theme =>
        theme.name.toLowerCase().includes(q) ||
        group.author.toLowerCase().includes(q)
      )
    }))
    .filter(group => group.themes.length > 0)
})
const searchPlaceholder = computed(() =>
  themes.value.length
    ? `Search themes (${themes.value.length})…`
    : 'Search themes…'
)

function toggleGroup(author: string): void {
  const next = new Set(openGroups.value)
  if (next.has(author)) next.delete(author)
  else next.add(author)
  openGroups.value = next
}

function isGroupOpen(author: string): boolean {
  return isSearching.value || openGroups.value.has(author)
}

function applyThemes(list: LoadedTheme[]): void {
  themes.value = list
  const next = new Set(openGroups.value)
  for (const group of groups.value) {
    if (!knownAuthors.has(group.author)) {
      knownAuthors.add(group.author)
      next.add(group.author)
    }
  }
  openGroups.value = next
}

async function fetchJson<T>(url: string, noCache = false): Promise<T> {
  const res = await fetch(url, noCache ? { cache: 'no-cache' } : undefined)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function loadRepo(
  entry: ThemeRepoEntry,
  noCache = false
): Promise<LoadedTheme[]> {
  if (!entry.raw) return []

  const index = await fetchJson<{ themes?: ThemeIndexEntry[] }>(entry.raw, true)
  const results = await Promise.allSettled(
    (index.themes ?? [])
      .filter((item): item is ThemeIndexEntry & { url: string } =>
        Boolean(item.url)
      )
      .map(async item => {
        const file = await fetchJson<ThemeFile>(item.url, noCache)
        const values = file.theme?.colors?.values
        const name = item.name ?? file.theme?.name
        return values && name
          ? {
            name,
            author: typeof item.author === 'string'
              ? item.author
              : item.author?.name,
            colors: resolveThemeColors(values),
            raw: item.url
          }
          : null
      })
  )

  return results
    .map(result => result.status === 'fulfilled' ? result.value : null)
    .filter((theme): theme is LoadedTheme => theme !== null)
}

async function fetchThemes(noCache = false): Promise<{
  themes: LoadedTheme[]
  failed: boolean
}> {
  const results = await Promise.allSettled(
    props.themes.map(entry => loadRepo(entry, noCache))
  )
  const unique = new Map<string, LoadedTheme>()
  for (
    const theme of results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
  ) {
    unique.set(theme.raw, theme)
  }
  return {
    themes: [...unique.values()].sort((a, b) => a.name.localeCompare(b.name)),
    failed: results.some(r => r.status === 'rejected')
  }
}

async function load(): Promise<void> {
  if (props.themes.length === 0) return

  loadFailed.value = false
  try {
    const result = await fetchThemes()
    applyThemes(result.themes)
    loadFailed.value = result.failed
  } finally {
    loading.value = false
  }
}

const refreshing = ref(false)
const refreshFailed = ref(false)
const ticked = ref(false)
let tickTimer: ReturnType<typeof setTimeout> | undefined

onUnmounted(() => {
  if (tickTimer) clearTimeout(tickTimer)
})

async function refresh(): Promise<void> {
  if (refreshing.value) return

  refreshing.value = true
  refreshFailed.value = false
  try {
    const result = await fetchThemes(true)
    if (result.failed || result.themes.length === 0) {
      refreshFailed.value = true
      return
    }
    applyThemes(result.themes)
  } finally {
    refreshing.value = false
  }
}

const busy = computed(() => loading.value || refreshing.value)
const failed = computed(() => loadFailed.value || refreshFailed.value)
const statusIcon = computed(() => {
  if (busy.value) return 'i-lucide:loader-circle'
  if (failed.value) return 'i-lucide:x'
  if (ticked.value) return 'i-lucide:check'
  return 'i-lucide:refresh-cw'
})
const statusTitle = computed(() => {
  if (loading.value) return 'Loading themes…'
  if (refreshing.value) return 'Refreshing themes…'
  if (failed.value) return 'Loading failed — click to retry'
  if (ticked.value) return 'Themes refreshed'
  return 'Refresh themes'
})

async function onStatusClick(): Promise<void> {
  if (busy.value) return
  if (loadFailed.value) {
    loading.value = true
    await load()
    return
  }

  ticked.value = false
  if (tickTimer) clearTimeout(tickTimer)
  await refresh()
  if (!refreshFailed.value) {
    ticked.value = true
    tickTimer = setTimeout(() => {
      ticked.value = false
    }, STATUS_TICK_MS)
  }
}

onMounted(load)

function showScreen(delta: number): void {
  screenIndex.value = (screenIndex.value + delta + screens.length) %
    screens.length
}

function toggleTheme(theme: LoadedTheme): void {
  selectedKey.value = selectedKey.value === theme.raw ? null : theme.raw
}
</script>

<template>
  <div class="theme-repos">
    <div class="theme-toolbar">
      <div class="theme-search">
        <span class="i-lucide:search" />
        <input v-model="query" type="text" :placeholder="searchPlaceholder" />
      </div>
      <button
        type="button"
        class="theme-status-btn"
        :class="{
          spinning: busy,
          'is-failed': !busy && failed,
          'is-ok': !busy && !failed && ticked
        }"
        :disabled="busy"
        :title="statusTitle"
        aria-label="Reload theme data"
        @click="onStatusClick"
      >
        <span :class="statusIcon" />
      </button>
      <ThemeFilterMenu
        v-model="mainColorsOnly"
        :big-swatches="bigSwatches"
        @update:big-swatches="bigSwatches = $event"
      />
    </div>

    <div v-if="themes.length" class="theme-showcase">
      <div class="theme-stage">
        <ThemePreview
          :theme="previewTheme"
          :screen="screen"
          @prev="showScreen(-1)"
          @next="showScreen(1)"
        />
      </div>

      <div class="theme-panel">
        <div
          class="theme-list"
          :class="{ 'theme-list-open': isPhone && selectedKey }"
        >
          <p
            v-if="isSearching && filteredGroups.length === 0"
            class="theme-repos-empty"
          >
            No themes match your search.
          </p>
          <div
            v-for="group in filteredGroups"
            :key="group.author"
            class="theme-group"
          >
            <button
              type="button"
              class="theme-group-row"
              :aria-expanded="isGroupOpen(group.author)"
              @click="toggleGroup(group.author)"
            >
              <span class="theme-group-title">
                <span class="theme-group-name">{{ group.author }}</span>
                <span
                  class="theme-group-count"
                  :title="`${group.themes.length} theme${
                    group.themes.length === 1 ? '' : 's'
                  }`"
                >{{ group.themes.length }}</span>
              </span>
              <span
                class="theme-group-toggle i-lucide:chevron-down"
                :class="{ open: isGroupOpen(group.author) }"
              />
            </button>
            <template v-if="isGroupOpen(group.author)">
              <template v-for="theme in group.themes" :key="theme.raw">
                <ThemeRow
                  :theme="theme"
                  :selected="theme.raw === selectedKey"
                  :main-only="mainColorsOnly"
                  :big-swatches="bigSwatches"
                  @select="toggleTheme(theme)"
                />
                <div
                  v-if="isPhone && theme.raw === selectedKey"
                  class="theme-dropdown"
                >
                  <ThemePreview
                    :theme="theme"
                    :screen="screen"
                    @prev="showScreen(-1)"
                    @next="showScreen(1)"
                  />
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <p v-else-if="loading" class="theme-repos-empty">Loading themes…</p>
    <p v-else-if="loadFailed" class="theme-repos-empty">
      Couldn't load themes from this repo.
    </p>
    <p v-else class="theme-repos-empty">No themes found.</p>
  </div>
</template>

<style scoped>
.theme-repos {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl, 12px);
  overflow: hidden;
}
.theme-toolbar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.theme-search {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 0;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}
.theme-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.theme-search > span {
  flex-shrink: 0;
}
.theme-status-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.25s;
}
.theme-status-btn:hover:not(:disabled) {
  opacity: 1;
}
.theme-status-btn:disabled {
  cursor: default;
}
.theme-status-btn span {
  font-size: 15px;
}
.theme-status-btn.spinning span {
  animation: theme-spin 1s linear infinite;
}
.theme-status-btn.is-failed {
  color: var(--vp-c-red-2, #e5484d);
  opacity: 1;
}
.theme-status-btn.is-ok {
  color: var(--vp-c-green-1, #3dd68c);
  opacity: 1;
}
@keyframes theme-spin {
  to {
    transform: rotate(360deg);
  }
}
html.effects-disabled .theme-status-btn.spinning span {
  animation: none;
}
.theme-showcase {
  display: grid;
  grid-template-columns: minmax(220px, 0.82fr) minmax(0, 1.18fr);
  min-height: 100%;
}
.theme-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 34px;
  background-color: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
}
.theme-panel {
  position: relative;
  min-width: 0;
  min-height: 0;
}
.theme-list {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
.theme-group + .theme-group {
  border-top: 1px solid var(--vp-c-divider);
}
.theme-group-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.theme-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.theme-group-name {
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.theme-group-toggle {
  color: var(--vp-c-text-1);
  font-size: 18px;
  transition: color 0.2s, transform 0.2s;
}
.theme-group-row:hover .theme-group-toggle {
  color: var(--vp-c-brand-1);
}
.theme-group-toggle.open {
  transform: rotate(180deg);
}
.theme-group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.theme-group .theme-row + .theme-row {
  border-top: 1px solid var(--vp-c-divider);
}
.theme-dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 40px 22px;
  background-color: var(--vp-c-bg-soft);
}
.theme-repos-empty {
  margin: 0;
  padding: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

@media (max-width: 767px) {
  .theme-showcase {
    grid-template-columns: minmax(0, 1fr);
  }
  .theme-stage {
    display: none;
  }
  .theme-panel {
    position: static;
  }
  .theme-list {
    position: static;
    max-height: 60vh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .theme-dropdown {
    border-top: 1px solid var(--vp-c-divider);
    --theme-phone-width: min(250px, calc(40vh - 64px));
  }
  .theme-list-open {
    max-height: 85vh;
  }
}
</style>

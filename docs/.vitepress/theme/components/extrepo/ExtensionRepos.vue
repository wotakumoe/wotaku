<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { computed, onUnmounted, ref } from 'vue'
import { SEARCH_DEBOUNCE_MS, STATUS_TICK_MS } from './constants'
import { escapeHtml, stripHtml } from './helpers'
import { mangayomiCopyValue } from './install'
import RepoRow from './RepoRow.vue'
import SettingsMenu from './SettingsMenu.vue'
import SiteGrid from './SiteGrid.vue'
import type { MatchedSite, RatingFilter, Repo } from './types'
import { indexSites, useRepoFilter } from './useRepoFilter'
import { provideRepoStore } from './useRepoStore'
import { provideTooltip } from './useTooltip'

const { tooltip } = provideTooltip()

const props = defineProps<{
  repos: Repo[]
  scheme: string
  from?: string
  manual?: boolean
}>()

const {
  store,
  loading,
  refreshing,
  refreshFailed,
  loadFailed,
  updatedAt,
  loadMs,
  refresh,
  retry
} = provideRepoStore(props.scheme)

const ticked = ref(false)
let tickTimer: ReturnType<typeof setTimeout> | undefined

onUnmounted(() => {
  if (tickTimer) clearTimeout(tickTimer)
})

async function onStatusClick() {
  if (loading.value || refreshing.value) return
  if (loadFailed.value) {
    await retry()
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

const busy = computed(() => loading.value || refreshing.value)
const failed = computed(() => loadFailed.value || refreshFailed.value)

const statusIcon = computed(() => {
  if (busy.value) return 'i-lucide:loader-circle'
  if (failed.value) return 'i-lucide:x'
  if (ticked.value) return 'i-lucide:check'
  return 'i-lucide:refresh-cw'
})

const statusTitle = computed(() => {
  const ms = loadMs.value !== null ? ` (${loadMs.value}ms)` : ''
  if (loading.value) return `Loading sites…${ms}`
  if (refreshing.value) return 'Refreshing…'
  if (failed.value) return `Loading failed${ms} — click to retry`
  if (ticked.value) return 'Database refreshed'
  if (updatedAt.value) {
    return `Database refreshed at ${new Date(updatedAt.value).toLocaleTimeString()}`
  }
  return `Refresh data${ms}`
})

const repoData = computed(() => store.value?.sites ?? {})
const echoAuthors = computed(() => store.value?.echoAuthors ?? {})
const repoLists = computed(() => store.value?.repoLists ?? {})

const baseRepos = computed<Repo[]>(() => {
  const list = props.from ? repoLists.value[props.from] ?? [] : []
  const auto: Repo[] = list.map(entry => ({
    name: entry.repoUrl
      ? `<a href="${entry.repoUrl}" target="_blank" rel="noopener noreferrer">${
        escapeHtml(entry.label)
      }</a>`
      : escapeHtml(entry.label),
    indexUrl: entry.indexUrl,
    repoName: entry.label,
    repoUrl: entry.repoUrl
  }))
  const manualByUrl = new Map(props.repos.map(repo => [repo.indexUrl, repo]))
  const merged = [
    ...auto.filter(repo => !manualByUrl.has(repo.indexUrl)),
    ...props.repos
  ]
  if (!props.manual) {
    merged.sort((a, b) => stripHtml(a.name).localeCompare(stripHtml(b.name)))
  }
  return merged
})

const resolvedRepos = computed<Repo[]>(() => {
  const result: Repo[] = []
  for (const repo of baseRepos.value) {
    const authors = echoAuthors.value[repo.indexUrl]
    if (!authors?.length) {
      result.push(repo)
      continue
    }
    for (const author of authors) {
      const name = author.repoUrl
        ? `<a href="${author.repoUrl}" target="_blank" rel="noopener noreferrer">${
          escapeHtml(author.label)
        }</a>`
        : escapeHtml(author.label)
      result.push({ name, indexUrl: author.indexUrl, repoName: author.label })
    }
  }
  return result
})

const query = ref('')
const debouncedQuery = refDebounced(query, SEARCH_DEBOUNCE_MS)
const langFilter = ref('')
const ratingFilter = ref<RatingFilter>('all')
const contentTypeFilter = ref('')
const showBroken = ref(false)

const allSites = computed(() => {
  const sites: MatchedSite[] = []
  for (const repo of resolvedRepos.value) {
    if (repo.variants?.length) {
      const sameRepoName = repo.repoName ? stripHtml(repo.name) : undefined
      for (const variant of repo.variants) {
        const url = mangayomiCopyValue(variant)
        if (!url) continue
        const repoName = sameRepoName ?? variant.label
        for (const site of repoData.value[url]?.sites ?? []) {
          sites.push({ ...site, repoName })
        }
      }
      continue
    }
    const repoName = stripHtml(repo.name)
    const dataUrl = repo.data ?? repo.indexUrl
    for (const site of repoData.value[dataUrl]?.sites ?? []) {
      sites.push({ ...site, repoName })
    }
  }
  return indexSites(sites)
})

const { facets, isFiltering, filteredSites } = useRepoFilter(allSites, {
  query: debouncedQuery,
  langFilter,
  ratingFilter,
  contentTypeFilter,
  showBroken
})
</script>

<template>
  <div class="ext-repos">
    <div class="ext-toolbar">
      <div class="ext-search">
        <span class="i-lucide:search" />
        <input v-model="query" type="text" placeholder="Search all sites…" />
      </div>
      <button
        type="button"
        class="ext-status-btn"
        :class="{
          spinning: busy,
          'is-failed': !busy && failed,
          'is-ok': !busy && !failed && ticked
        }"
        :disabled="busy"
        :title="statusTitle"
        aria-label="Reload site data"
        @click="onStatusClick"
      >
        <span :class="statusIcon" />
      </button>
      <SettingsMenu
        v-model:lang-filter="langFilter"
        v-model:rating-filter="ratingFilter"
        v-model:content-type-filter="contentTypeFilter"
        v-model:show-broken="showBroken"
        :available-langs="facets.availableLangs"
        :has-multi-language="facets.hasMultiLanguage"
        :has-ratings="facets.hasRatings"
        :has-mixed="facets.hasMixed"
        :has-suggestive="facets.hasSuggestive"
        :available-content-types="facets.availableContentTypes"
        :has-content-types="facets.availableContentTypes.length > 0"
        :has-broken="facets.hasBroken"
      />
    </div>

    <SiteGrid
      v-if="isFiltering"
      class="ext-search-results"
      :sites="filteredSites"
      :scheme="scheme"
      empty-text="No sites match your filters."
    />

    <div v-else>
      <RepoRow
        v-for="repo in resolvedRepos"
        :key="repo.indexUrl"
        :repo="repo"
        :scheme="scheme"
        :show-broken="showBroken"
      />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="tooltip"
      class="ext-fixed-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>
  </Teleport>
</template>

<style scoped>
.ext-repos {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl, 12px);
  overflow: hidden;
}
.ext-toolbar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.ext-search {
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
.ext-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.ext-search > span {
  flex-shrink: 0;
}
.ext-status-btn {
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
.ext-status-btn:hover:not(:disabled) {
  opacity: 1;
}
.ext-status-btn:disabled {
  cursor: default;
}
.ext-status-btn span {
  font-size: 15px;
}
.ext-status-btn.spinning span {
  animation: ext-spin 1s linear infinite;
}
.ext-status-btn.is-failed {
  color: var(--vp-c-red-2, #e5484d);
  opacity: 1;
}
.ext-status-btn.is-ok {
  color: var(--vp-c-green-1, #3dd68c);
  opacity: 1;
}
@keyframes ext-spin {
  to {
    transform: rotate(360deg);
  }
}
html.effects-disabled .ext-status-btn.spinning span {
  animation: none;
}
.ext-fixed-tooltip {
  position: fixed;
  z-index: 9999;
  transform: translate(-50%, calc(-100% - 15px));
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
}
</style>

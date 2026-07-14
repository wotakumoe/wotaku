<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from '../../../../ext/extensionRepos.data'
import { escapeHtml, langLabel, stripHtml } from './helpers'
import { mangayomiCopyValue } from './install'
import RepoRow from './RepoRow.vue'
import SettingsMenu from './SettingsMenu.vue'
import SiteGrid from './SiteGrid.vue'
import type { MatchedSite, RatingFilter, Repo } from './types'
import { provideTooltip } from './useTooltip'

const { tooltip } = provideTooltip()

const repoData = data.sites
const soraAuthors = data.soraAuthors

const props = defineProps<{
  repos: Repo[]
  scheme: string
}>()

const resolvedRepos = computed<Repo[]>(() => {
  const result: Repo[] = []
  for (const repo of props.repos) {
    const authors = soraAuthors[repo.indexUrl]
    if (!authors?.length) {
      result.push(repo)
      continue
    }
    for (const author of authors) {
      const name = author.repoUrl
        ? `<a href="${author.repoUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(author.label)}</a>`
        : escapeHtml(author.label)
      result.push({
        name,
        indexUrl: `${repo.indexUrl}#${author.label}`,
        repoName: author.label,
        variants: author.types.map(t => ({ label: t.label, mangaUrl: t.indexUrl }))
      })
    }
  }
  return result
})

const query = ref('')
const langFilter = ref('')
const ratingFilter = ref<RatingFilter>('all')
const excludedContentTypes = ref<Set<string>>(new Set())
const showBroken = ref(false)

const allSites = computed<MatchedSite[]>(() => {
  const sites: MatchedSite[] = []
  for (const repo of resolvedRepos.value) {
    if (repo.variants?.length) {
      // search fix for variations of setup. (mangayomi and kotatsu)
      const sameRepoName = repo.repoName ? stripHtml(repo.name) : undefined
      for (const variant of repo.variants) {
        const url = mangayomiCopyValue(variant)
        if (!url) continue
        const repoName = sameRepoName ?? variant.label
        for (const site of repoData[url]?.sites ?? []) {
          sites.push({ ...site, repoName })
        }
      }
      continue
    }
    const repoName = stripHtml(repo.name)
    for (const site of repoData[repo.indexUrl]?.sites ?? []) {
      sites.push({ ...site, repoName })
    }
  }
  return sites
})

const availableContentTypes = computed(() => {
  const types = new Set<string>()
  for (const site of allSites.value) if (site.contentType) types.add(site.contentType)
  return [...types].sort()
})
const hasContentTypes = computed(() => availableContentTypes.value.length > 0)

const hasRatings = computed(() => allSites.value.some(site => site.rating !== 'safe'))
const hasSuggestive = computed(() => allSites.value.some(site => site.rating === 'suggestive'))
const hasMultiLanguage = computed(() => allSites.value.some(site => site.lang.toLowerCase() === 'all'))
const hasBroken = computed(() => allSites.value.some(site => site.isBroken))

const availableLangs = computed(() => {
  const codes = new Set(allSites.value.map(site => site.lang))
  codes.delete('all')
  return [...codes].sort((a, b) => langLabel(a).localeCompare(langLabel(b)))
})

const isFiltering = computed(() => {
  return query.value.trim() !== '' || langFilter.value !== '' || ratingFilter.value !== 'all' || excludedContentTypes.value.size > 0
})

const filteredSites = computed(() => {
  const q = query.value.trim().toLowerCase()
  return allSites.value.filter(site => {
    if (site.isBroken && !showBroken.value) return false
    if (q && !site.name.toLowerCase().includes(q) && !site.url.toLowerCase().includes(q)) return false
    if (langFilter.value && site.lang !== langFilter.value) return false
    if (ratingFilter.value !== 'all' && site.rating !== ratingFilter.value) return false
    if (site.contentType && excludedContentTypes.value.has(site.contentType)) return false
    return true
  })
})
</script>

<template>
  <div class="ext-repos">
    <div class="ext-toolbar">
      <div class="ext-search">
        <span class="i-lucide:search" />
        <input v-model="query" type="text" placeholder="Search all sites…" />
      </div>
      <SettingsMenu
        v-model:lang-filter="langFilter"
        v-model:rating-filter="ratingFilter"
        v-model:content-type-filter="excludedContentTypes"
        v-model:show-broken="showBroken"
        :available-langs="availableLangs"
        :has-multi-language="hasMultiLanguage"
        :has-ratings="hasRatings"
        :has-suggestive="hasSuggestive"
        :available-content-types="availableContentTypes"
        :has-content-types="hasContentTypes"
        :has-broken="hasBroken"
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
      <RepoRow v-for="repo in resolvedRepos" :key="repo.indexUrl" :repo="repo" :scheme="scheme" :show-broken="showBroken" />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="tooltip"
      class="ext-fixed-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >{{ tooltip.text }}</div>
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
  flex-wrap: wrap;
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
  flex: 1 1 200px;
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

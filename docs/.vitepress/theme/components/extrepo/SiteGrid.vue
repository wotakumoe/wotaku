<script setup lang="ts">
import { computed, ref } from 'vue'
import SiteCell from './SiteCell.vue'
import SiteGroupCell from './SiteGroupCell.vue'
import type { RepoSite } from './types'

const props = defineProps<{
  sites: (RepoSite & { repoName?: string })[]
  emptyText: string
}>()

interface SiteGroup {
  key: string
  sites: (RepoSite & { repoName?: string })[]
}

const groups = computed<SiteGroup[]>(() => {
  const map = new Map<string, SiteGroup>()
  for (const site of props.sites) {
    const key = `${site.repoName ?? ''}-${site.name}`
    let group = map.get(key)
    if (!group) {
      group = { key, sites: [] }
      map.set(key, group)
    }
    group.sites.push(site)
  }
  return [...map.values()]
})

const openGroups = ref<Set<string>>(new Set())

function toggleGroup(key: string) {
  const next = new Set(openGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openGroups.value = next
}
</script>

<template>
  <div class="ext-site-grid">
    <div v-if="sites.length === 0" class="ext-site-empty">
      {{ emptyText }}
    </div>
    <template v-for="group in groups" :key="group.key">
      <SiteCell v-if="group.sites.length === 1" :site="group.sites[0]" />
      <template v-else>
        <SiteGroupCell
          :sites="group.sites"
          :open="openGroups.has(group.key)"
          @toggle="toggleGroup(group.key)"
        />
        <template v-if="openGroups.has(group.key)">
          <SiteCell v-for="site in group.sites" :key="`${group.key}-${site.lang}`" :site="site" />
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped>
.ext-site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px;
  padding: 10px;
  max-height: 340px;
  overflow-y: auto;
  background-color: var(--vp-c-bg);
}

.ext-site-empty {
  grid-column: 1 / -1;
  color: var(--vp-c-text-2);
  font-size: 13px;
  padding: 8px 4px;
}
</style>

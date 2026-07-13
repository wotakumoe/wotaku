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
  const parent = props.sites.map((_, i) => i)
  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]
      i = parent[i]
    }
    return i
  }
  function union(a: number, b: number) {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA !== rootB) parent[rootA] = rootB
  }

  const byName = new Map<string, number>()
  const byUrl = new Map<string, number>()
  props.sites.forEach((site, i) => {
    const scope = site.repoName ?? ''
    const nameKey = `${scope}-${site.name}`
    if (byName.has(nameKey)) union(i, byName.get(nameKey)!)
    else byName.set(nameKey, i)

    const urlKey = `${scope}-${site.url}`
    if (byUrl.has(urlKey)) union(i, byUrl.get(urlKey)!)
    else byUrl.set(urlKey, i)
  })

  const map = new Map<number, SiteGroup>()
  props.sites.forEach((site, i) => {
    const root = find(i)
    let group = map.get(root)
    if (!group) {
      group = { key: `group-${root}`, sites: [] }
      map.set(root, group)
    }
    group.sites.push(site)
  })
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SITE_GRID_PAGE_SIZE } from './constants'
import { groupSites } from './groupSites'
import SiteCell from './SiteCell.vue'
import SiteGroupCell from './SiteGroupCell.vue'
import type { RepoSite } from './types'

const props = defineProps<{
  sites: (RepoSite & { repoName?: string })[]
  emptyText: string
  scheme?: string
}>()

const groups = computed(() => groupSites(props.sites))

const openGroups = ref<Set<string>>(new Set())

function toggleGroup(key: string) {
  const next = new Set(openGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openGroups.value = next
}

const visibleCount = ref(SITE_GRID_PAGE_SIZE)
watch(() => props.sites, () => {
  visibleCount.value = SITE_GRID_PAGE_SIZE
})

const visibleGroups = computed(() => groups.value.slice(0, visibleCount.value))
const remaining = computed(() =>
  groups.value.length - visibleGroups.value.length
)

function showMore() {
  visibleCount.value += SITE_GRID_PAGE_SIZE
}
</script>

<template>
  <div class="ext-site-grid">
    <div v-if="sites.length === 0" class="ext-site-empty">
      {{ emptyText }}
    </div>
    <template v-for="group in visibleGroups" :key="group.key">
      <SiteCell
        v-if="group.sites.length === 1"
        :site="group.sites[0]"
        :scheme="scheme"
      />
      <template v-else>
        <SiteGroupCell
          :sites="group.sites"
          :open="openGroups.has(group.key)"
          @toggle="toggleGroup(group.key)"
        />
        <template v-if="openGroups.has(group.key)">
          <SiteCell
            v-for="(site, j) in group.sites"
            :key="`${group.key}::${site.lang}::${j}`"
            :site="site"
            :scheme="scheme"
          />
        </template>
      </template>
    </template>
    <button
      v-if="remaining > 0"
      type="button"
      class="ext-site-more"
      @click="showMore"
    >
      Show more ({{ remaining }} remaining)
    </button>
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
.ext-site-more {
  grid-column: 1 / -1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
}
.ext-site-more:hover {
  border-color: var(--vp-c-brand-1);
}
</style>

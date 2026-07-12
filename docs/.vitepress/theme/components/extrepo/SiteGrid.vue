<script setup lang="ts">
import SiteCell from './SiteCell.vue'
import type { RepoSite } from './types'

defineProps<{
  sites: (RepoSite & { repoName?: string })[]
  emptyText: string
}>()
</script>

<template>
  <div class="ext-site-grid">
    <div v-if="sites.length === 0" class="ext-site-empty">
      {{ emptyText }}
    </div>
    <SiteCell v-for="site in sites" :key="`${site.repoName ?? ''}-${site.name}-${site.lang}`" :site="site" />
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

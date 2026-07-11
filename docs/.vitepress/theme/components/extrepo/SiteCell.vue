<script setup lang="ts">
import { langFlagClass, ratingIcon, ratingTitle } from './helpers'
import type { RepoSite } from './types'

defineProps<{
  site: RepoSite & { repoName?: string }
}>()
</script>

<template>
  <component
    :is="site.url ? 'a' : 'div'"
    class="ext-site-cell"
    :class="{ 'ext-site-cell-static': !site.url }"
    :href="site.url || undefined"
    :target="site.url ? '_blank' : undefined"
    :rel="site.url ? 'noopener noreferrer' : undefined"
  >
    <img class="ext-site-icon" :src="site.icon" :alt="site.name" loading="lazy" />
    <span class="ext-site-name">
      <span class="ext-site-name-text">{{ site.name }}</span>
      <span v-if="site.repoName" class="ext-site-repo">{{ site.repoName }}</span>
    </span>
    <span v-if="site.rating !== 'safe'" class="ext-site-nsfw" :class="ratingIcon(site.rating)" :title="ratingTitle(site.rating)" />
    <span class="ext-site-lang" :class="langFlagClass(site.lang)" :title="site.lang" />
  </component>
</template>

<style scoped>
.ext-site-repo {
  display: block;
  font-size: 10.5px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ext-site-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  min-width: 0;
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  transition: border-color 0.2s, background-color 0.2s;
}

.ext-site-cell:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ext-site-cell-static {
  cursor: default;
}

.ext-site-cell-static:hover {
  border-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.ext-site-icon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: contain;
}

.ext-site-name {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.ext-site-name-text {
  font-size: 12.5px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ext-site-nsfw,
.ext-site-lang {
  flex-shrink: 0;
  font-size: 12px;
}
</style>

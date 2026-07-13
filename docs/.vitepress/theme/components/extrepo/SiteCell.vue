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
    <div class="ext-site-row">
      <img v-if="site.icon" class="ext-site-icon" :src="site.icon" :alt="site.name" loading="lazy" />
      <span v-else class="ext-site-icon ext-site-icon-fallback i-lucide:globe" />
      <span class="ext-site-name-text" :title="site.name">{{ site.name }}</span>
      <span v-if="site.rating !== 'safe'" class="ext-site-nsfw" :class="ratingIcon(site.rating)" :title="ratingTitle(site.rating)" />
      <span class="ext-site-lang" :class="langFlagClass(site.lang)" :title="site.lang" />
    </div>
    <span v-if="site.repoName" class="ext-site-repo">{{ site.repoName }}</span>
  </component>
</template>

<style scoped>
.ext-site-repo {
  display: block;
  padding-left: 24px;
  font-size: 10.5px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ext-site-cell {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  min-width: 0;
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  transition: border-color 0.2s, background-color 0.2s;
}

.ext-site-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
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

.ext-site-icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
}

.ext-site-name-text {
  flex: 1;
  min-width: 0;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
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

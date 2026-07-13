<script setup lang="ts">
import { computed } from 'vue'
import { ratingIcon, ratingTitle } from './helpers'
import type { RepoSite } from './types'

const props = defineProps<{
  sites: (RepoSite & { repoName?: string })[]
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()

const primary = computed(() => props.sites[0])
const highestRated = computed(() => props.sites.find(site => site.rating === 'nsfw')
  ?? props.sites.find(site => site.rating === 'suggestive'))
</script>

<template>
  <button
    type="button"
    class="ext-site-cell ext-site-group"
    :class="{ 'ext-site-group-active': open }"
    :aria-expanded="open"
    :aria-label="`${primary.name}, ${sites.length} languages`"
    @click="$emit('toggle')"
  >
    <div class="ext-site-row">
      <img v-if="primary.icon" class="ext-site-icon" :src="primary.icon" :alt="primary.name" loading="lazy" />
      <span v-else class="ext-site-icon ext-site-icon-fallback i-lucide:globe" />
      <span class="ext-site-name-text" :title="primary.name">{{ primary.name }}</span>
      <span
        v-if="highestRated"
        class="ext-site-nsfw"
        :class="ratingIcon(highestRated.rating)"
        :title="ratingTitle(highestRated.rating)"
      />
      <span class="ext-site-layers i-lucide:layers" title="Multiple languages available" />
    </div>
    <span v-if="primary.repoName" class="ext-site-repo">{{ primary.repoName }}</span>
  </button>
</template>

<style scoped>
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

.ext-site-group {
  width: 100%;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.ext-site-group:hover,
.ext-site-group-active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ext-site-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
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
.ext-site-layers {
  flex-shrink: 0;
  font-size: 12px;
}

.ext-site-layers {
  color: var(--vp-c-brand-1);
}

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
</style>

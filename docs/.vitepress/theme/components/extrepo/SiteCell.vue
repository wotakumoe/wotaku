<script setup lang="ts">
import { ref } from 'vue'
import { langFlagClass, ratingIcon, ratingTitle } from './helpers'
import LazyIcon from './LazyIcon.vue'
import type { RepoSite } from './types'

const props = defineProps<{
  site: RepoSite & { repoName?: string }
}>()

const copied = ref(false)

async function copyInstallUrl() {
  const value = props.site.installUrl?.replace(/^sora:\/\/module\?url=/, '')
  if (!value) return
  await navigator.clipboard.writeText(value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="ext-site-cell-wrap">
    <component
      :is="site.url ? 'a' : 'div'"
      class="ext-site-cell"
      :class="{ 'ext-site-cell-static': !site.url }"
      :href="site.url || undefined"
      :target="site.url ? '_blank' : undefined"
      :rel="site.url ? 'noopener noreferrer' : undefined"
    >
      <div class="ext-site-row">
        <LazyIcon class="ext-site-icon" :src="site.icon" :alt="site.name" />
        <span class="ext-site-name-text" :title="site.name">{{ site.name }}</span>
        <span v-if="site.rating !== 'safe'" class="ext-site-nsfw" :class="ratingIcon(site.rating)" :title="ratingTitle(site.rating)" />
        <span class="ext-site-lang" :class="langFlagClass(site.lang)" :title="site.lang" />
      </div>
      <span v-if="site.repoName" class="ext-site-repo">{{ site.repoName }}</span>
    </component>
    <a v-if="site.installUrl" class="ext-site-install-btn" :href="site.installUrl" :title="`Install ${site.name}`">
      <span class="i-lucide:download" />
    </a>
    <button v-if="site.installUrl" class="ext-site-copy-btn" type="button" :title="`Copy ${site.name} url`" @click="copyInstallUrl">
      <span v-if="copied" class="i-lucide:check" />
      <span v-else class="i-lucide:copy" />
    </button>
  </div>
</template>

<style scoped>
.ext-site-cell-wrap {
  display: flex;
  align-items: stretch;
  gap: 4px;
  min-width: 0;
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

.ext-site-cell {
  flex: 1;
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

.ext-site-icon-loading {
  background-color: var(--vp-c-bg-mute, var(--vp-c-bg-soft));
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

.ext-site-install-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border-radius: 8px;
  border: 1px solid var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text) !important;
  text-decoration: none !important;
  transition: filter 0.2s, border-color 0.2s;
}

.ext-site-install-btn:hover {
  filter: brightness(1.08);
  border-color: var(--vp-button-brand-hover-border);
}

.ext-site-install-btn span {
  font-size: 15px;
}

.ext-site-copy-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.ext-site-copy-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.ext-site-copy-btn span {
  font-size: 15px;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as repoData } from '../../../../ext/extensionRepos.data'
import { copyValue, installHref } from './install'
import SiteGrid from './SiteGrid.vue'
import type { Repo } from './types'

const props = defineProps<{
  repo: Repo
  scheme: string
}>()

const open = ref(false)
const copied = ref(false)

const sites = computed(() => repoData[props.repo.indexUrl]?.sites ?? [])
const isExpandable = computed(() => sites.value.length > 1)

async function copyUrl() {
  await navigator.clipboard.writeText(copyValue(props.scheme, props.repo.indexUrl))
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="ext-repo">
    <div class="ext-repo-row">
      <div class="ext-repo-name">
        <span v-html="repo.name" />
        <VTooltip v-if="repo.note" theme="vp-tooltip">
          <button type="button" class="ext-note-btn" aria-label="Note">
            <span class="i-lucide:lightbulb" />
          </button>
          <template #popper>
            <div class="ext-note-popper" v-html="repo.note" />
          </template>
        </VTooltip>
      </div>
      <div class="ext-repo-actions">
        <a class="ext-btn ext-btn-install" :href="installHref(scheme, repo)">
          <span class="i-lucide:download" />
          Install
        </a>
        <button class="ext-btn ext-btn-copy" type="button" @click="copyUrl">
          <span v-if="copied" class="i-lucide:check" />
          <span v-else class="i-lucide:copy" />
        </button>
        <button
          class="ext-btn ext-btn-toggle"
          type="button"
          :class="{ open, 'ext-btn-toggle-hidden': !isExpandable }"
          :aria-expanded="open"
          :aria-hidden="!isExpandable"
          :tabindex="isExpandable ? undefined : -1"
          @click="isExpandable && (open = !open)"
        >
          <span class="i-lucide:chevron-down" />
        </button>
      </div>
    </div>

    <SiteGrid v-if="isExpandable && open" :sites="sites" empty-text="No site data available." />
  </div>
</template>

<style scoped>
.ext-repo + .ext-repo {
  border-top: 1px solid var(--vp-c-divider);
}

.ext-repo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background-color: var(--vp-c-bg-soft);
}

.ext-repo-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.ext-repo-name :deep(a) {
  color: inherit;
}

.ext-note-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  line-height: 0;
  flex-shrink: 0;
}

.ext-note-btn span {
  font-size: 13px;
  vertical-align: 0;
}

.ext-note-popper {
  max-width: 280px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv, var(--vp-c-bg));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.ext-repo-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.ext-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
}

.ext-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.ext-btn-install {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text) !important;
  border-color: var(--vp-button-brand-border);
  text-decoration: none !important;
  font-weight: 600;
}

.ext-btn-install:hover {
  filter: brightness(1.08);
  border-color: var(--vp-button-brand-hover-border);
}

.ext-btn-copy {
  padding: 5px 8px;
}

.ext-btn-toggle {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
}

.ext-btn-toggle:hover {
  border-color: transparent;
  color: var(--vp-c-brand-1);
}

.ext-btn-toggle span {
  font-size: 18px;
  transition: transform 0.2s;
}

.ext-btn-toggle.open span {
  transform: rotate(180deg);
}

.ext-btn-toggle-hidden {
  visibility: hidden;
  pointer-events: none;
}
</style>

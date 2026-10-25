<script setup lang="ts">
import { computed } from 'vue'
import { stremioSoftwareHref, stremioWebHref } from './install'
import type { RepoSite } from './types'

const props = defineProps<{
  site: RepoSite & { repoName?: string }
}>()

const manifestUrl = computed(() => props.site.installUrl ?? '')

const softwareHref = computed(() => stremioSoftwareHref(manifestUrl.value))
const webHref = computed(() => stremioWebHref(manifestUrl.value))
const configureHref = computed(() => props.site.configureUrl ?? null)
</script>

<template>
  <VTooltip
    theme="vp-tooltip"
    placement="bottom-end"
    :distance="6"
    class="ext-addon-install"
  >
    <button
      type="button"
      class="ext-site-install-btn"
      aria-haspopup="true"
      :aria-label="`Install ${site.name}`"
    >
      <span class="i-lucide:download" />
    </button>
    <template #popper>
      <div class="ext-install-menu">
        <a class="ext-install-option" :href="softwareHref">
          <span class="i-lucide:monitor-down" />
          <span class="ext-install-option-label">Software</span>
        </a>
        <a
          class="ext-install-option"
          :href="webHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="i-lucide:globe" />
          <span class="ext-install-option-label">Web</span>
        </a>
        <a
          v-if="configureHref"
          class="ext-install-option"
          :href="configureHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="i-lucide:settings-2" />
          <span class="ext-install-option-label">Configure</span>
        </a>
      </div>
    </template>
  </VTooltip>
</template>

<style scoped>
.ext-addon-install {
  flex-shrink: 0;
  align-self: stretch;
  display: flex;
}
.ext-site-install-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 100%;
  padding: 0;
  border-radius: 8px;
  border: 1px solid var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  cursor: pointer;
  transition: filter 0.2s, border-color 0.2s;
}
.ext-site-install-btn:hover {
  filter: brightness(1.08);
  border-color: var(--vp-button-brand-hover-border);
}
.ext-site-install-btn span {
  font-size: 15px;
}
.ext-install-menu {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3, 0 4px 16px rgba(0, 0, 0, 0.3));
}
.ext-install-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 7px;
  color: var(--vp-c-text-1) !important;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none !important;
  white-space: nowrap;
  transition: background-color 0.15s;
}
.ext-install-option:hover {
  background-color: var(--vp-c-bg-soft);
}
.ext-install-option > span:first-child {
  color: var(--vp-c-brand-1);
  font-size: 15px;
}
</style>

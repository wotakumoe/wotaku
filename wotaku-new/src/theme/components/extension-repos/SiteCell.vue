<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'
import {
  langFlagClass,
  langLabel,
  ratingIcon,
  ratingTitle
} from '../../shared/extension-repos/helpers'
import { hasSiteCopyButton } from '../../shared/extension-repos/install'
import LazyIcon from './LazyIcon.vue'
import type { RepoSite } from '../../../shared/extension-repos/types'
import { useCopy } from '../../composables/extension-repos/use-copy'
import { useTooltip } from '../../composables/extension-repos/use-tooltip'

const { show: showTooltip, hide: hideTooltip } = useTooltip()
const { copiedKey, copyError, copyMessage, copy } = useCopy()

const props = defineProps<{
  site: RepoSite & { repoName?: string }
  scheme?: string
}>()

const copyTarget = computed(() => {
  const value = props.site.copyUrl ?? props.site.installUrl
  const soraMatch = value?.match(/^sora:\/\/module\?url=(.+)$/)
  return soraMatch ? soraMatch[1] : value
})

async function copyInstallUrl() {
  const value = copyTarget.value

  if (!value) return

  await copy(value, value)
}
</script>

<template>
  <div class="ext-site-cell-wrap" :class="{ 'ext-site-cell-copy-error': copyError }">
    <component
      :is="site.url ? 'a' : 'div'"
      class="ext-site-cell"
      :class="{ 'ext-site-cell-static': !site.url }"
      :href="site.url || undefined"
      :target="site.url ? '_blank' : undefined"
      :rel="site.url ? 'noopener noreferrer' : undefined"
    >
      <div class="ext-site-row">
        <LazyIcon :src="site.icon" :alt="site.name" />
        <span
          class="ext-site-name-text"
          :aria-label="site.name"
          @mouseenter="showTooltip($event, site.name)"
          @mouseleave="hideTooltip"
          ><span class="ext-site-name-inner">{{ site.name }}</span></span
        >
        <span
          v-if="site.rating !== 'safe'"
          class="ext-site-nsfw"
          :class="ratingIcon(site.rating)"
          :aria-label="ratingTitle(site.rating)"
          @mouseenter="showTooltip($event, ratingTitle(site.rating))"
          @mouseleave="hideTooltip"
        />
        <span
          v-if="scheme !== 'stremio'"
          class="ext-site-lang"
          :class="langFlagClass(site.lang)"
          :aria-label="langLabel(site.lang)"
          @mouseenter="showTooltip($event, langLabel(site.lang))"
          @mouseleave="hideTooltip"
        />
      </div>
      <span v-if="site.author ?? site.repoName" class="ext-site-repo">{{
        site.author ?? site.repoName
      }}</span>
    </component>
    <a
      v-if="site.installUrl"
      class="ext-site-install-btn"
      :href="site.installUrl"
      :aria-label="`Install ${site.name}`"
      @mouseenter="showTooltip($event, `Install ${site.name}`)"
      @mouseleave="hideTooltip"
    >
      <span class="i-lucide:download" />
    </a>
    <button
      v-if="copyTarget && hasSiteCopyButton(scheme ?? '')"
      class="ext-site-copy-btn"
      type="button"
      :aria-label="`Copy ${site.name} url`"
      @mouseenter="showTooltip($event, `Copy ${site.name} url`)"
      @mouseleave="hideTooltip"
      @click="copyInstallUrl"
    >
      <span v-if="copiedKey === copyTarget" class="i-lucide:check" />
      <span v-else class="i-lucide:copy" />
    </button>
    <p role="status" class="ext-copy-feedback" :class="{ 'visually-hidden': !copyError }">
      {{ copyMessage }}
    </p>
  </div>
</template>

<style scoped src="../../styles/extension-repos/site-cell-shared.css"></style>

<style scoped>
.ext-site-cell-wrap {
  display: flex;
  align-items: stretch;
  gap: 4px;
  min-width: 0;
}
.ext-site-cell-copy-error {
  flex-wrap: wrap;
}
.ext-copy-feedback {
  flex-basis: 100%;
  margin: 0;
  color: var(--wotaku-c-text-2);
  font-size: 13px;
}
.ext-site-cell:hover {
  border-color: var(--wotaku-c-brand-1);
  background-color: var(--wotaku-c-bg);
}
.ext-site-cell-static {
  cursor: default;
}
.ext-site-cell-static:hover {
  border-color: var(--wotaku-c-divider);
  background-color: var(--wotaku-c-bg-soft);
}
.ext-site-install-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border-radius: 8px;
  border: 1px solid var(--wotaku-button-brand-border);
  background-color: var(--wotaku-button-brand-bg);
  color: var(--wotaku-button-brand-text) !important;
  text-decoration: none !important;
  transition:
    filter 0.2s,
    border-color 0.2s;
}
.ext-site-install-btn:hover {
  filter: brightness(1.08);
  border-color: var(--wotaku-button-brand-hover-border);
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
  border: 1px solid var(--wotaku-c-divider);
  background-color: var(--wotaku-c-bg);
  color: var(--wotaku-c-text-1);
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
.ext-site-copy-btn:hover {
  border-color: var(--wotaku-c-brand-1);
}
.ext-site-copy-btn span {
  font-size: 15px;
}
</style>

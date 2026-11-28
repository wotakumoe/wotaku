<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { langLabel, ratingIcon, ratingTitle } from '../../shared/extension-repos/helpers'
import LazyIcon from './LazyIcon.vue'
import type { RepoSite } from '../../../shared/extension-repos/types'
import { useTooltip } from '../../composables/extension-repos/use-tooltip'

const { show: showTooltip, hide: hideTooltip } = useTooltip()

const props = defineProps<{
  sites: (RepoSite & { repoName?: string })[]
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()

const primary = computed(() => props.sites[0])
const highestRated = computed(
  () =>
    props.sites.find((site) => site.rating === 'nsfw') ??
    props.sites.find((site) => site.rating === 'suggestive') ??
    props.sites.find((site) => site.rating === 'mixed')
)

const groupName = computed(() => {
  const wordLists = props.sites.map((site) => site.name.trim().split(/\s+/))
  const minLen = Math.min(...wordLists.map((words) => words.length))
  const common: string[] = []

  for (let i = 0; i < minLen; i++) {
    const word = wordLists[0][i]

    if (wordLists.every((words) => words[i] === word)) common.push(word)
    else break
  }

  if (common.length > 0) return common.join(' ')

  const label = langLabel(primary.value.lang)
  const stripped = primary.value.name.replace(new RegExp(`\\s*${label}$`, 'i'), '').trim()
  return stripped || primary.value.name
})
</script>

<template>
  <button
    type="button"
    class="ext-site-cell ext-site-group"
    :class="{ 'ext-site-group-active': open }"
    :aria-expanded="open"
    :aria-label="`${groupName}, ${sites.length} languages`"
    @click="$emit('toggle')"
  >
    <div class="ext-site-row">
      <LazyIcon :src="primary.icon" :alt="primary.name" />
      <span
        class="ext-site-name-text"
        :aria-label="groupName"
        @mouseenter="showTooltip($event, groupName)"
        @mouseleave="hideTooltip"
        ><span class="ext-site-name-inner">{{ groupName }}</span></span
      >
      <span
        v-if="highestRated"
        class="ext-site-nsfw"
        :class="ratingIcon(highestRated.rating)"
        :aria-label="ratingTitle(highestRated.rating)"
        @mouseenter="showTooltip($event, ratingTitle(highestRated.rating))"
        @mouseleave="hideTooltip"
      />
      <span
        class="ext-site-layers i-lucide:layers"
        :aria-label="`${sites.length} versions available`"
        @mouseenter="showTooltip($event, `${sites.length} versions available`)"
        @mouseleave="hideTooltip"
      />
    </div>
    <span v-if="primary.author ?? primary.repoName" class="ext-site-repo">{{
      primary.author ?? primary.repoName
    }}</span>
  </button>
</template>

<style scoped src="../../styles/extension-repos/site-cell-shared.css"></style>

<style scoped>
.ext-site-group {
  width: 100%;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.ext-site-group:hover,
.ext-site-group-active {
  border-color: var(--wotaku-c-brand-1);
  background-color: var(--wotaku-c-bg);
}
.ext-site-layers {
  color: var(--wotaku-c-brand-1);
}
</style>

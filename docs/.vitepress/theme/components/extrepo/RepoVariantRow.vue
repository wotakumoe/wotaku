<script setup lang="ts">
import { computed, ref } from 'vue'
import { groupSites } from './groupSites'
import {
  mangayomiCopyValue,
  mangayomiHref,
  mangayomiLiveContainerHref
} from './install'
import SiteGrid from './SiteGrid.vue'
import type { Repo, RepoVariant } from './types'
import { useCopy } from './useCopy'
import { useRepoStore } from './useRepoStore'
import { useTooltip } from './useTooltip'

const { show: showTooltip, hide: hideTooltip } = useTooltip()
const { copiedKey, copy } = useCopy()
const { store } = useRepoStore()

const repoData = computed(() => store.value?.sites ?? {})

const props = defineProps<{
  repo: Repo
  variant: RepoVariant
  scheme: string
  showActions: boolean
  showBroken?: boolean
}>()

const open = ref(false)
const copyValue = computed(() => mangayomiCopyValue(props.variant))
const installUrl = computed(() => mangayomiHref(props.repo, props.variant))
const liveUrl = computed(() =>
  mangayomiLiveContainerHref(props.repo, props.variant)
)

const sites = computed(() => {
  const url = copyValue.value
  const all = url ? repoData.value[url]?.sites ?? [] : []
  return props.showBroken ? all : all.filter(site => !site.isBroken)
})
const siteCount = computed(() => groupSites(sites.value).length)
const siteCountTitle = computed(
  () =>
    `${siteCount.value} extension${siteCount.value === 1 ? '' : 's'} available`
)

async function copyVariantUrl() {
  if (!copyValue.value) return
  await copy(props.variant.label, copyValue.value)
}
</script>

<template>
  <div class="ext-repo-variant">
    <div class="ext-repo-variant-row">
      <span class="ext-repo-variant-label">
        {{ variant.label }}
        <span
          v-if="siteCount"
          class="ext-repo-count"
          :title="siteCountTitle"
        >{{ siteCount }}</span>
      </span>
      <div class="ext-repo-actions">
        <template v-if="showActions">
          <a class="ext-btn ext-btn-install" :href="installUrl">
            <span class="i-lucide:download" />
            <span class="ext-btn-install-label">Install</span>
          </a>
          <a
            class="ext-btn ext-btn-livecontainer"
            :href="liveUrl"
            aria-label="Install via LiveContainer (iOS)"
            @mouseenter="showTooltip($event, 'Install via LiveContainer (iOS)')"
            @mouseleave="hideTooltip"
          >
            <span class="i-mdi:apple" />
          </a>
          <button
            v-if="copyValue"
            class="ext-btn ext-btn-copy"
            type="button"
            @click="copyVariantUrl"
          >
            <span v-if="copiedKey === variant.label" class="i-lucide:check" />
            <span v-else class="i-lucide:copy" />
          </button>
        </template>
        <button
          v-else-if="copyValue"
          class="ext-btn ext-btn-copy"
          type="button"
          @click="copyVariantUrl"
        >
          <span v-if="copiedKey === variant.label" class="i-lucide:check" />
          <span v-else class="i-lucide:copy" />
        </button>
        <button
          class="ext-btn ext-btn-toggle"
          type="button"
          :class="{ open }"
          :aria-expanded="open"
          @click="open = !open"
        >
          <span class="i-lucide:chevron-down" />
        </button>
      </div>
    </div>

    <SiteGrid
      v-if="open"
      :sites="sites"
      :scheme="scheme"
      empty-text="No site data available."
    />
  </div>
</template>

<style scoped src="./repoRowShared.css"></style>

<style scoped>
.ext-repo-variant-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px 8px 28px;
  border-top: 1px solid var(--vp-c-divider);
}
.ext-repo-variant-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>

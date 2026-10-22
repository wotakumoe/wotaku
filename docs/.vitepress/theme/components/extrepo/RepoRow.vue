<script setup lang="ts">
import { computed, ref } from 'vue'
import { NOT_EXPANDABLE_REPOS } from './constants'
import { groupSites } from './groupSites'
import { stripHtml } from './helpers'
import {
  copyValue,
  hasCopyButton,
  installHref,
  isBrowseOnly,
  mangayomiCopyValue,
  mangayomiHref,
  mangayomiLiveContainerHref
} from './install'
import RepoVariantRow from './RepoVariantRow.vue'
import SiteGrid from './SiteGrid.vue'
import type { Repo } from './types'
import { useCopy } from './useCopy'
import { useRepoStore } from './useRepoStore'
import { useTooltip } from './useTooltip'

const { show: showTooltip, hide: hideTooltip } = useTooltip()
const { copiedKey, copy } = useCopy()
const { store } = useRepoStore()

const repoData = computed(() => store.value?.sites ?? {})

const props = defineProps<{
  repo: Repo
  scheme: string
  showBroken?: boolean
}>()

const open = ref(false)

const sites = computed(() => {
  const dataUrl = props.repo.data ?? props.repo.indexUrl
  const all = repoData.value[dataUrl]?.sites ?? []
  return props.showBroken ? all : all.filter(site => !site.isBroken)
})
const siteCount = computed(() => {
  const countFor = (url: string | null | undefined) => {
    const all = url ? repoData.value[url]?.sites ?? [] : []
    const visible = props.showBroken
      ? all
      : all.filter(site => !site.isBroken)
    return groupSites(visible).length
  }
  if (props.repo.variants?.length) {
    return props.repo.variants.reduce(
      (total, variant) => total + countFor(mangayomiCopyValue(variant)),
      0
    )
  }
  return countFor(props.repo.data ?? props.repo.indexUrl)
})
const siteCountTitle = computed(
  () =>
    `${siteCount.value} extension${siteCount.value === 1 ? '' : 's'} available`
)
const repoName = computed(() => stripHtml(props.repo.name))
const isExpandable = computed(() => !NOT_EXPANDABLE_REPOS.has(repoName.value))
const installUrl = computed(() =>
  installHref(props.scheme, props.repo, {
    suwatteV6: repoData.value[props.repo.indexUrl]?.suwatteV6,
    suwatteListUrl: repoData.value[props.repo.indexUrl]?.suwatteListUrl
  })
)
const showActions = computed(() => !isBrowseOnly(props.scheme))

const headerVariant = computed(() =>
  showActions.value ? props.repo.variants?.[0] : undefined
)
const headerCopyValue = computed(() =>
  headerVariant.value ? mangayomiCopyValue(headerVariant.value) : null
)
const headerInstallUrl = computed(() =>
  headerVariant.value ? mangayomiHref(props.repo, headerVariant.value) : null
)
const headerLiveUrl = computed(() =>
  headerVariant.value
    ? mangayomiLiveContainerHref(props.repo, headerVariant.value)
    : null
)
const subVariants = computed(() => {
  if (!props.repo.variants?.length) return []
  return showActions.value && props.repo.variants.length > 1
    ? props.repo.variants.slice(1)
    : props.repo.variants
})

async function copyUrl() {
  await copy(props.repo.indexUrl, copyValue(props.scheme, props.repo.indexUrl))
}

async function copyHeaderVariantUrl() {
  if (!headerVariant.value || !headerCopyValue.value) return
  await copy(headerVariant.value.label, headerCopyValue.value)
}
</script>

<template>
  <div class="ext-repo">
    <div class="ext-repo-row">
      <div class="ext-repo-name">
        <span v-html="repo.name" />
        <span
          v-if="siteCount"
          class="ext-repo-count"
          :title="siteCountTitle"
        >{{ siteCount }}</span>
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
        <template v-if="headerVariant">
          <a class="ext-btn ext-btn-install" :href="headerInstallUrl!">
            <span class="i-lucide:download" />
            <span class="ext-btn-install-label">Install</span>
          </a>
          <a
            class="ext-btn ext-btn-livecontainer"
            :href="headerLiveUrl!"
            aria-label="Install via LiveContainer (iOS)"
            @mouseenter="showTooltip($event, 'Install via LiveContainer (iOS)')"
            @mouseleave="hideTooltip"
          >
            <span class="i-mdi:apple" />
          </a>
          <button
            v-if="headerCopyValue"
            class="ext-btn ext-btn-copy"
            type="button"
            @click="copyHeaderVariantUrl"
          >
            <span
              v-if="copiedKey === headerVariant.label"
              class="i-lucide:check"
            />
            <span v-else class="i-lucide:copy" />
          </button>
          <button
            v-else
            class="ext-btn ext-btn-copy ext-btn-spacer"
            tabindex="-1"
            aria-hidden="true"
          >
            <span class="i-lucide:copy" />
          </button>
          <button
            class="ext-btn ext-btn-toggle ext-btn-spacer"
            tabindex="-1"
            aria-hidden="true"
          >
            <span class="i-lucide:chevron-down" />
          </button>
        </template>
        <template v-else-if="showActions">
          <a
            v-if="installUrl"
            class="ext-btn ext-btn-install"
            :href="installUrl"
          >
            <span class="i-lucide:download" />
            <span class="ext-btn-install-label">Install</span>
          </a>
          <button
            v-if="hasCopyButton(scheme)"
            class="ext-btn ext-btn-copy"
            type="button"
            @click="copyUrl"
          >
            <span v-if="copiedKey === repo.indexUrl" class="i-lucide:check" />
            <span v-else class="i-lucide:copy" />
          </button>
        </template>
        <button
          v-if="!repo.variants"
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

    <div v-if="subVariants.length" class="ext-repo-variants">
      <RepoVariantRow
        v-for="variant in subVariants"
        :key="variant.label"
        :repo="repo"
        :variant="variant"
        :scheme="scheme"
        :show-actions="showActions"
        :show-broken="showBroken"
      />
    </div>

    <SiteGrid
      v-if="!repo.variants && isExpandable && open"
      :sites="sites"
      :scheme="scheme"
      empty-text="No site data available."
    />
  </div>
</template>

<style scoped src="./repoRowShared.css"></style>

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
.ext-repo-variants {
  display: flex;
  flex-direction: column;
}
</style>

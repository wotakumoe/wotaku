<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from '../../../../ext/extensionRepos.data'
import { stripHtml } from './helpers'
import { copyValue, hasCopyButton, installHref, isBrowseOnly, mangayomiCopyValue, mangayomiHref, mangayomiLiveContainerHref } from './install'
import SiteGrid from './SiteGrid.vue'
import type { Repo, RepoVariant } from './types'
import { useTooltip } from './useTooltip'

const { show: showTooltip, hide: hideTooltip } = useTooltip()

const repoData = data.sites

const props = defineProps<{
  repo: Repo
  scheme: string
  showBroken?: boolean
}>()

const NOT_EXPANDABLE = new Set(['MegaRepo', 'Shotetsu Compatability'])

const open = ref(false)
const copied = ref(false)
const copiedLabel = ref<string | null>(null)
const openVariants = ref<Set<string>>(new Set())

const sites = computed(() => {
  const all = repoData[props.repo.indexUrl]?.sites ?? []
  return props.showBroken ? all : all.filter(site => !site.isBroken)
})
const isExpandable = computed(() => !NOT_EXPANDABLE.has(stripHtml(props.repo.name)))
const installUrl = computed(() => installHref(props.scheme, props.repo, {
  suwatteV6: repoData[props.repo.indexUrl]?.suwatteV6,
  suwatteListUrl: repoData[props.repo.indexUrl]?.suwatteListUrl
}))
// Browse-only schemes (e.g. Kotatsu forks) have no app to deep-link into, so install,
// copy, and livecontainer actions are hidden everywhere in this component.
const showActions = computed(() => !isBrowseOnly(props.scheme))

// First variant is the combined "All-in-One" one (when 2+ types exist), shown directly
// on the repo header; remaining variants list below as their own collapsible sub-rows.
// Browse-only groups have no such combined header since the builds share nothing to
// combine, so every variant renders as a sub-row instead.
const headerVariant = computed(() => showActions.value ? props.repo.variants?.[0] : undefined)
const subVariants = computed(() => {
  if (!props.repo.variants?.length) return []
  return showActions.value && props.repo.variants.length > 1 ? props.repo.variants.slice(1) : props.repo.variants
})

async function copyUrl() {
  await navigator.clipboard.writeText(copyValue(props.scheme, props.repo.indexUrl))
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}

async function copyVariantUrl(variant: RepoVariant) {
  const value = mangayomiCopyValue(variant)
  if (!value) return
  await navigator.clipboard.writeText(value)
  copiedLabel.value = variant.label
  setTimeout(() => { if (copiedLabel.value === variant.label) copiedLabel.value = null }, 1500)
}

function toggleVariant(label: string) {
  if (openVariants.value.has(label)) openVariants.value.delete(label)
  else openVariants.value.add(label)
}

function variantSites(variant: RepoVariant) {
  const url = mangayomiCopyValue(variant)
  const all = url ? repoData[url]?.sites ?? [] : []
  return props.showBroken ? all : all.filter(site => !site.isBroken)
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
        <template v-if="headerVariant">
          <a class="ext-btn ext-btn-install" :href="mangayomiHref(repo, headerVariant)">
            <span class="i-lucide:download" />
            <span class="ext-btn-install-label">Install</span>
          </a>
          <a class="ext-btn ext-btn-livecontainer" :href="mangayomiLiveContainerHref(repo, headerVariant)" aria-label="Install via LiveContainer (iOS)" @mouseenter="showTooltip($event, 'Install via LiveContainer (iOS)')" @mouseleave="hideTooltip">
            <span class="i-mdi:apple" />
          </a>
          <button
            v-if="mangayomiCopyValue(headerVariant)"
            class="ext-btn ext-btn-copy"
            type="button"
            @click="copyVariantUrl(headerVariant)"
          >
            <span v-if="copiedLabel === headerVariant.label" class="i-lucide:check" />
            <span v-else class="i-lucide:copy" />
          </button>
          <!-- Invisible spacers so the header's action group lines up with the sub-rows' -->
          <button v-if="!mangayomiCopyValue(headerVariant)" class="ext-btn ext-btn-copy ext-btn-spacer" tabindex="-1" aria-hidden="true">
            <span class="i-lucide:copy" />
          </button>
          <button class="ext-btn ext-btn-toggle ext-btn-spacer" tabindex="-1" aria-hidden="true">
            <span class="i-lucide:chevron-down" />
          </button>
        </template>
        <template v-else-if="showActions">
          <a v-if="installUrl" class="ext-btn ext-btn-install" :href="installUrl">
            <span class="i-lucide:download" />
            <span class="ext-btn-install-label">Install</span>
          </a>
          <button v-if="hasCopyButton(scheme)" class="ext-btn ext-btn-copy" type="button" @click="copyUrl">
            <span v-if="copied" class="i-lucide:check" />
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
      <div v-for="variant in subVariants" :key="variant.label" class="ext-repo-variant">
        <div class="ext-repo-variant-row">
          <span class="ext-repo-variant-label">{{ variant.label }}</span>
          <div class="ext-repo-actions">
            <template v-if="showActions">
              <a class="ext-btn ext-btn-install" :href="mangayomiHref(repo, variant)">
                <span class="i-lucide:download" />
                <span class="ext-btn-install-label">Install</span>
              </a>
              <a class="ext-btn ext-btn-livecontainer" :href="mangayomiLiveContainerHref(repo, variant)" aria-label="Install via LiveContainer (iOS)" @mouseenter="showTooltip($event, 'Install via LiveContainer (iOS)')" @mouseleave="hideTooltip">
                <span class="i-mdi:apple" />
              </a>
              <button
                v-if="mangayomiCopyValue(variant)"
                class="ext-btn ext-btn-copy"
                type="button"
                @click="copyVariantUrl(variant)"
              >
                <span v-if="copiedLabel === variant.label" class="i-lucide:check" />
                <span v-else class="i-lucide:copy" />
              </button>
            </template>
            <button
              v-else-if="mangayomiCopyValue(variant)"
              class="ext-btn ext-btn-copy"
              type="button"
              @click="copyVariantUrl(variant)"
            >
              <span v-if="copiedLabel === variant.label" class="i-lucide:check" />
              <span v-else class="i-lucide:copy" />
            </button>
            <button
              class="ext-btn ext-btn-toggle"
              type="button"
              :class="{ open: openVariants.has(variant.label) }"
              :aria-expanded="openVariants.has(variant.label)"
              @click="toggleVariant(variant.label)"
            >
              <span class="i-lucide:chevron-down" />
            </button>
          </div>
        </div>

        <SiteGrid v-if="openVariants.has(variant.label)" :sites="variantSites(variant)" :scheme="scheme" empty-text="No site data available." />
      </div>
    </div>

    <SiteGrid v-if="!repo.variants && isExpandable && open" :sites="sites" :scheme="scheme" empty-text="No site data available." />
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

.ext-btn-copy,
.ext-btn-livecontainer {
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

.ext-btn-spacer {
  visibility: hidden;
  pointer-events: none;
}

.ext-repo-variants {
  display: flex;
  flex-direction: column;
}

.ext-repo-variant-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px 8px 28px;
  border-top: 1px solid var(--vp-c-divider);
}

.ext-repo-variant-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (max-width: 767px) {
  .ext-btn-install {
    padding: 5px 8px;
  }

  .ext-btn-install-label {
    display: none;
  }
}
</style>

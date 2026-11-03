<script setup lang="ts">
import { computed } from 'vue'
import type { ManaTheme } from '../../../../ext/themeRepos/types'
import { useCopy } from '../extrepo/useCopy'

const props = defineProps<{ theme: ManaTheme; selected: boolean }>()
defineEmits<{ select: [] }>()

const { copiedKey, copy } = useCopy()

const addThemeLink = computed(() =>
  props.theme.raw
    ? `mana://add-theme?url=${encodeURIComponent(props.theme.raw)}`
    : undefined
)

const swatches = computed(() =>
  Object.entries(props.theme.colors)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, color]) => ({ key, color }))
)
</script>

<template>
  <div
    class="theme-row"
    :class="{ 'theme-row-selected': selected }"
    @click="$emit('select')"
  >
    <div class="theme-row-body">
      <div class="theme-row-text">
        <button
          type="button"
          class="theme-row-name"
          :aria-pressed="selected"
          :title="selected
          ? 'Show default preview'
          : `Preview ${theme.name}`"
        >
          {{ theme.name }}
        </button>
        <span v-if="theme.author" class="theme-row-author">
          {{ theme.author }}
        </span>
      </div>
      <button
        type="button"
        class="theme-shades"
        :aria-pressed="selected"
        :aria-label="`Preview ${theme.name}`"
      >
        <span
          v-for="swatch in swatches"
          :key="swatch.key"
          class="theme-shade"
          :style="{ backgroundColor: swatch.color }"
          :title="`${swatch.key}: ${swatch.color}`"
        />
      </button>
    </div>

    <a
      v-if="addThemeLink"
      class="theme-install"
      :href="addThemeLink"
      :aria-label="`Add ${theme.name} to Mana`"
      :title="`Add ${theme.name} to Mana`"
      @click.stop
    >
      <span class="theme-install-icon i-lucide:download" />
      <span class="theme-install-label">Install</span>
    </a>

    <button
      v-if="theme.raw"
      type="button"
      class="theme-copy"
      :class="{ 'theme-copy-done': copiedKey === theme.raw }"
      :aria-label="copiedKey === theme.raw
      ? `Copied ${theme.name} URL`
      : `Copy ${theme.name} URL`"
      :title="copiedKey === theme.raw
      ? 'Copied!'
      : `Copy ${theme.name} JSON URL`"
      @click.stop="copy(theme.raw, theme.raw)"
    >
      <span v-if="copiedKey === theme.raw" class="i-lucide:check" />
      <span v-else class="i-lucide:copy" />
    </button>
  </div>
</template>

<style scoped>
.theme-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}
.theme-row:hover {
  background-color: var(--vp-c-bg-soft);
}
.theme-row-selected {
  border-left-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}
.theme-row-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.theme-row-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.theme-row-name {
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.theme-row-author {
  font-size: 12px;
  line-height: 1.3;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.theme-shades {
  width: 100%;
  display: flex;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
}
.theme-shade {
  flex: 1;
  height: 100%;
}
.theme-copy {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.theme-copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.theme-copy-done {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.theme-copy span {
  font-size: 15px;
}
.theme-install {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text) !important;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none !important;
  transition: filter 0.2s, border-color 0.2s;
}
.theme-install:hover {
  filter: brightness(1.08);
  border-color: var(--vp-button-brand-hover-border);
}
.theme-install-icon {
  font-size: 15px;
}
.theme-install-label {
  white-space: nowrap;
}

@media (max-width: 767px) {
  .theme-install {
    width: 32px;
    padding: 0;
    gap: 0;
  }
  .theme-install-label {
    display: none;
  }
}
</style>

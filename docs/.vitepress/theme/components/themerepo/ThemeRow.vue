<script setup lang="ts">
import { computed } from 'vue'
import { IDENTITY_COLORS } from '../../../../ext/themeRepos/defaults'
import type { ManaTheme } from '../../../../ext/themeRepos/types'
import { useCopy } from '../extrepo/useCopy'

const props = withDefaults(
  defineProps<{
    theme: ManaTheme
    selected: boolean
    mainOnly?: boolean
    bigSwatches?: boolean
  }>(),
  { mainOnly: false, bigSwatches: false }
)
defineEmits<{ select: [] }>()

const { copiedKey, copy } = useCopy()

const addThemeLink = computed(() =>
  props.theme.raw
    ? `mana://add-theme?url=${encodeURIComponent(props.theme.raw)}`
    : undefined
)

function formatColor(color: string): string {
  return /^#[0-9a-f]{6}ff$/i.test(color) ? color.slice(0, 7) : color
}

const swatches = computed(() => {
  const colors = props.theme.colors
  if (props.mainOnly) {
    return IDENTITY_COLORS
      .filter(key => colors[key])
      .map(key => ({ key, color: formatColor(colors[key]) }))
  }
  return Object.entries(colors)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, color]) => ({ key, color: formatColor(color) }))
})
</script>

<template>
  <div
    class="theme-row"
    :class="{ 'theme-row-selected': selected }"
    role="button"
    tabindex="0"
    :aria-pressed="selected"
    @click="$emit('select')"
    @keydown.enter.self.prevent="$emit('select')"
    @keydown.space.self.prevent="$emit('select')"
  >
    <div class="theme-row-body">
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
      <button
        type="button"
        class="theme-shades"
        :class="{ 'theme-shades-big': bigSwatches }"
        :aria-pressed="selected"
        :aria-label="`Preview ${theme.name}`"
      >
        <span
          v-for="swatch in swatches"
          :key="swatch.key"
          class="theme-shade"
          :class="{ 'theme-shade-big': bigSwatches }"
          :style="bigSwatches
          ? undefined
          : { backgroundColor: swatch.color }"
          :title="`${swatch.key}: ${swatch.color}`"
        >
          <template v-if="bigSwatches">
            <span
              class="theme-shade-fill"
              :style="{ backgroundColor: swatch.color }"
            />
            <span class="theme-shade-hex">{{
              swatch.color.replace('#', '')
            }}</span>
          </template>
        </span>
      </button>
    </div>

    <div class="theme-row-actions">
      <a
        v-if="addThemeLink"
        class="ext-btn ext-btn-install"
        :href="addThemeLink"
        :aria-label="`Add ${theme.name} to Mana`"
        :title="`Add ${theme.name} to Mana`"
        @click.stop
      >
        <span class="i-lucide:download" />
        <span class="ext-btn-install-label">Install</span>
      </a>

      <button
        v-if="theme.raw"
        type="button"
        class="ext-btn ext-btn-copy"
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
  </div>
</template>

<style scoped src="../extrepo/repoRowShared.css"></style>

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
.theme-row:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
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
.theme-row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
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
.theme-shades-big {
  height: auto;
  gap: 6px;
  border-radius: 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.theme-shade-big {
  flex: 1 0 48px;
  min-width: 48px;
  height: auto;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}
.theme-shade-fill {
  width: 100%;
  height: 42px;
}
.theme-shade-hex {
  display: block;
  padding: 4px 2px;
  font-size: 10px;
  line-height: 1.2;
  text-align: center;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.theme-copy-done {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>

<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  label: string
  ariaLabel?: string
  active?: boolean
}>()

const open = ref(false)
const rootRef = ref<HTMLDivElement>()

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div
    ref="rootRef"
    class="settings-select"
    :class="{ 'settings-select--open': open }"
    @keydown.esc="open = false"
  >
    <NuInputHighlight :active="!!active" class="rounded-md">
      <div>
        <button
          type="button"
          class="settings-select-trigger"
          :aria-expanded="open"
          :aria-label="ariaLabel ?? label"
          @click="open = !open"
        >
          <span class="settings-select-label">{{ label }}</span>
          <span
            class="settings-select-chevron i-lucide:chevron-down"
            :class="{ 'settings-select-chevron--open': open }"
            aria-hidden="true"
          />
        </button>

        <NuVerticalTransition :duration="200">
          <div
            v-show="open"
            class="settings-select-options"
            role="group"
            :aria-label="ariaLabel ?? label"
          >
            <slot />
          </div>
        </NuVerticalTransition>
      </div>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.settings-select {
  position: relative;
}

.settings-select-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  background: var(--wk-c-menu-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.settings-select-trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.settings-select--open .settings-select-trigger {
  border-color: var(--vp-c-brand-1);
}

.settings-select-label {
  flex: 1;
  text-align: left;
}

.settings-select-chevron {
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.settings-select-chevron--open {
  transform: rotate(180deg);
}

.settings-select-options {
  margin-top: 6px;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2);
}
</style>

<style>
.settings-select-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 5px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: opacity 0.15s, background-color 0.15s;
}

.settings-select-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.settings-select-row.is-disabled {
  opacity: 0.45;
}

.settings-select-row.is-disabled:hover {
  opacity: 0.75;
}

.settings-select-row-icon {
  flex: none;
  width: 16px;
  height: 16px;
  opacity: 0.85;
}

.settings-select-row-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-select-row-eye {
  flex: none;
  width: 15px;
  height: 15px;
  opacity: 0.55;
}

.settings-select-row:hover .settings-select-row-eye {
  opacity: 0.9;
}
</style>

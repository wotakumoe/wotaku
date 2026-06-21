<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { AccentColorStorageKey } from '../../constants'
import MenuTitle from './MenuTitle.vue'

const accentOptions = [
  { key: 'ayanami', label: 'Ayanami', color: 'oklch(0.626 0.098 247.46)' },
  { key: 'asuka', label: 'Asuka', color: '#F35640' },
  { key: 'rebecca', label: 'Rebecca', color: '#18CF7A' },
  { key: 'okayu', label: 'Okayu', color: '#BC87C5' },
  { key: 'inanis', label: "Ina'nis", color: '#8F81B0' },
] as const

const accentColor = useStorage(AccentColorStorageKey, 'ayanami')
</script>

<template>
  <div>
    <MenuTitle title="Accent Color" aria-label="Accent Color" mb-2>
      <template #icon>
        <span i-lucide:palette mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div class="accent-grid">
      <button
        v-for="option in accentOptions"
        :key="option.key"
        class="accent-btn"
        :aria-pressed="accentColor === option.key"
        :aria-label="option.label"
        @click="accentColor = option.key"
      >
        <span class="accent-swatch" :style="{ backgroundColor: option.color }" />
        <span class="accent-label">{{ option.label }}</span>
        <span v-if="accentColor === option.key" i-lucide:check text-xs ml-auto />
      </button>
    </div>
  </div>
</template>

<style scoped>
.accent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}

.accent-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 13px;
  width: 100%;
  transition: background-color 0.15s;
}

.accent-btn:hover {
  background-color: var(--vp-c-bg-soft);
}

.accent-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.accent-label {
  flex: 1;
  text-align: left;
}
</style>

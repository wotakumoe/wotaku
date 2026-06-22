<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { AccentColorStorageKey } from '../../constants'
import MenuTitle from './MenuTitle.vue'

const accentOptions = [
  {
    key: 'ayanami',
    label: 'Ayanami',
    shades: ['oklch(0.722 0.105 247.48)', 'oklch(0.626 0.098 247.46)', 'oklch(0.523 0.081 246.86)', 'oklch(0.43 0.066 246.75)', 'oklch(0.335 0.052 246.76)'],
  },
  {
    key: 'asuka',
    label: 'Asuka',
    shades: ['#FB7F6E', '#F35640', '#E2432D', '#BD2C18', '#9C2818'],
  },
  {
    key: 'rebecca',
    label: 'Rebecca',
    shades: ['#41E799', '#18CF7A', '#0DAC62', '#0E874F', '#116A42'],
  },
  {
    key: 'okayu',
    label: 'Okayu',
    shades: ['#CDA4D5', '#BC87C5', '#A86BB2', '#915799', '#794A7F'],
  },
  {
    key: 'inanis',
    label: "Ina'nis",
    shades: ['#A39AC0', '#8F81B0', '#816FA1', '#776392', '#645479'],
  },
  {
    key: 'raora',
    label: 'Raora',
    shades: ['#FB6BA9', '#F44088', '#D91A5D', '#C6104B', '#A4103E'],
  },
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
    <div class="accent-list">
      <button
        v-for="option in accentOptions"
        :key="option.key"
        class="accent-btn"
        :class="{ 'accent-btn--selected': accentColor === option.key }"
        :aria-pressed="accentColor === option.key"
        :aria-label="option.label"
        @click="accentColor = option.key"
      >
        <span class="accent-label">{{ option.label }}</span>
        <span class="accent-shades">
          <span
            v-for="(shade, i) in option.shades"
            :key="i"
            class="accent-shade"
            :style="{ backgroundColor: shade }"
          />
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.accent-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.accent-btn {
  display: flex;
  align-items: center;
  gap: 8px;
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

.accent-btn--selected {
  background-color: var(--vp-c-brand-soft);
}

.accent-btn--selected:hover {
  background-color: var(--vp-c-brand-soft);
}

.accent-label {
  flex: 1;
  text-align: left;
}

.accent-shades {
  display: flex;
  height: 1em;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.accent-shade {
  width: 18px;
  height: 100%;
}

</style>

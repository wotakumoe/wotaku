<script setup lang="ts">
import { useData } from 'vitepress'
import { useStorage } from '@vueuse/core'

import { AccentColorStorageKey } from '../../constants'
import MenuTitle from './MenuTitle.vue'

const { isDark } = useData()

const accentOptions = [
  {
    key: 'ayanami',
    label: 'Ayanami',
    shades: ['oklch(0.722 0.105 247.48)', 'oklch(0.626 0.098 247.46)', 'oklch(0.523 0.081 246.86)', 'oklch(0.43 0.066 246.75)', 'oklch(0.335 0.052 246.76)'],
  },
  {
    key: 'asuka',
    label: 'Asuka',
    shades: ['oklch(0.734 0.155 29.34)', 'oklch(0.662 0.196 30.82)', 'oklch(0.612 0.199 31.08)', 'oklch(0.524 0.184 31.19)', 'oklch(0.460 0.155 31.14)'],
  },
  {
    key: 'miku',
    label: 'Miku',
    shades: ['oklch(0.788 0.133 184.43)', 'oklch(0.711 0.123 185.28)', 'oklch(0.607 0.104 187.31)', 'oklch(0.515 0.086 189.60)', 'oklch(0.441 0.071 190.95)'],
  },
  {
    key: 'inanis',
    label: "Ina'nis",
    shades: ['oklch(0.762 0.073 302.02)', 'oklch(0.663 0.102 301.22)', 'oklch(0.580 0.119 301.34)', 'oklch(0.508 0.114 301.00)', 'oklch(0.452 0.094 302.20)'],
  },
  {
    key: 'watson',
    label: 'Watson',
    shades: ['oklch(0.800 0.085 75.49)', 'oklch(0.710 0.090 72.47)', 'oklch(0.594 0.085 69.07)', 'oklch(0.496 0.078 72.12)', 'oklch(0.391 0.062 68.86)'],
  },
  {
    key: 'baelz',
    label: 'Baelz',
    shades: ['oklch(0.711 0.182 25.11)', 'oklch(0.655 0.229 27.98)', 'oklch(0.601 0.234 29.19)', 'oklch(0.528 0.207 29.27)', 'oklch(0.461 0.176 28.95)'],
  },
  {
    key: 'irys',
    label: 'IRyS',
    shades: ['oklch(0.716 0.188 5.18)', 'oklch(0.659 0.237 8.99)', 'oklch(0.584 0.229 10.32)', 'oklch(0.538 0.213 9.67)', 'oklch(0.475 0.187 5.94)'],
  },
  {
    key: 'suisei',
    label: 'Suisei',
    shades: ['oklch(0.827 0.096 224.60)', 'oklch(0.740 0.119 230.91)', 'oklch(0.645 0.127 236.29)', 'oklch(0.548 0.120 241.26)', 'oklch(0.451 0.106 244.63)'],
  },
  {
    key: 'fubuki',
    label: 'Fubuki',
    shades: ['oklch(0.88 0 0)', 'oklch(0.78 0 0)', 'oklch(0.68 0 0)', 'oklch(0.58 0 0)', 'oklch(0.48 0 0)'],
    lightShades: ['oklch(0.52 0 0)', 'oklch(0.42 0 0)', 'oklch(0.32 0 0)', 'oklch(0.22 0 0)', 'oklch(0.12 0 0)'],
  },
]

const accentColor = useStorage(AccentColorStorageKey, 'ayanami')
</script>

<template>
  <div>
    <MenuTitle title="Accent Color" aria-label="Accent Color" mb-2>
      <template #icon>
        <span i-lucide:swatch-book mr-1 aria-hidden="true" />
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
            v-for="(shade, i) in ('lightShades' in option && !isDark ? option.lightShades : option.shades)"
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

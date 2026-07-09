<script setup lang="ts">
import { useData } from 'vitepress'
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { AccentColorStorageKey } from '../../constants'
import MenuHelp from './MenuHelp.vue'
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
    shades: ['oklch(0.740 0.210 32)', 'oklch(0.650 0.240 30)', 'oklch(0.555 0.238 28)', 'oklch(0.455 0.205 26)', 'oklch(0.370 0.165 24)'],
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
    key: 'amelia',
    label: 'Amelia',
    shades: ['oklch(0.800 0.085 75.49)', 'oklch(0.710 0.090 72.47)', 'oklch(0.594 0.085 69.07)', 'oklch(0.496 0.078 72.12)', 'oklch(0.391 0.062 68.86)'],
  },
  {
    key: 'baelz',
    label: 'Baelz',
    shades: ['oklch(0.720 0.215 22.00)', 'oklch(0.640 0.255 22.00)', 'oklch(0.555 0.268 22.00)', 'oklch(0.472 0.248 22.00)', 'oklch(0.395 0.208 22.00)'],
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

const open = ref(false)
const rootRef = ref<HTMLDivElement>()
const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const selectedOption = computed(
  () => accentOptions.find((o) => o.key === accentColor.value) ?? accentOptions[0]
)

function shadesFor(option: typeof accentOptions[number]) {
  return 'lightShades' in option && !isDark.value ? option.lightShades! : option.shades
}

function select(key: string) {
  accentColor.value = key
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="rootRef" class="accent-color">
    <div ref="menuTitleElementRef" relative flex items-center mb-2>
      <MenuTitle title="Accent Color" aria-label="Accent Color" flex="1" pr-4>
        <template #icon>
          <span i-lucide:swatch-book mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Accent Color</h4>
        <p text="sm" mb-2 max-w-100>
          Sets the accent color used for links, buttons, and highlights across
          the site.
        </p>
      </MenuHelp>
    </div>

    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <div class="accent-select" :class="{ 'accent-select--open': open }">
      <button
        type="button"
        class="accent-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-label="`Accent Color: ${selectedOption.label}`"
        @click="open = !open"
      >
        <span class="accent-label">{{ selectedOption.label }}</span>
        <span class="accent-shades">
          <span
            v-for="(shade, i) in shadesFor(selectedOption)"
            :key="i"
            class="accent-shade"
            :style="{ backgroundColor: shade }"
          />
        </span>
        <span
          class="accent-chevron i-lucide:chevron-down"
          :class="{ 'accent-chevron--open': open }"
          aria-hidden="true"
        />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="accent-options" role="listbox">
          <button
            v-for="option in accentOptions"
            :key="option.key"
            type="button"
            role="option"
            class="accent-btn"
            :class="{ 'accent-btn--selected': accentColor === option.key }"
            :aria-selected="accentColor === option.key"
            :aria-label="option.label"
            @click="select(option.key)"
          >
            <span class="accent-label">{{ option.label }}</span>
            <span class="accent-shades">
              <span
                v-for="(shade, i) in shadesFor(option)"
                :key="i"
                class="accent-shade"
                :style="{ backgroundColor: shade }"
              />
            </span>
          </button>
        </div>
      </NuVerticalTransition>
      </div>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.accent-select {
  position: relative;
}

.accent-trigger {
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

.accent-trigger:hover {
  border-color: var(--vp-c-brand-1);
}

.accent-select--open .accent-trigger {
  border-color: var(--vp-c-brand-1);
}

.accent-chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.accent-chevron--open {
  transform: rotate(180deg);
}

.accent-options {
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

.accent-btn--selected .accent-label {
  font-weight: 600;
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

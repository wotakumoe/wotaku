<script setup lang="ts">
import {
  NuInputHighlight,
  NuInputHorizontalRadioGroup,
  NuVerticalTransition
} from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { AccentBgStorageKey, AccentBgStrengthStorageKey } from '../../constants'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const intensityTitleElementRef = ref<HTMLDivElement>()
const isIntensityHelpPoppedUp = ref(false)

const accentBg = useStorage(AccentBgStorageKey, false)
const strengthStorageValue = useStorage(AccentBgStrengthStorageKey, 60)

const strengthValue = computed({
  get: () => {
    const parsed = Number.parseInt(String(strengthStorageValue.value))
    if (Number.isNaN(parsed)) return 60
    // Snap stored values to the nearest preset.
    return Math.round(Math.min(100, Math.max(20, parsed)) / 20) * 20
  },
  set: (val) => {
    strengthStorageValue.value = val
  }
})

const fieldOptions = computed(() => [
  {
    value: true,
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Accent Background Toggle Switch'
  },
  {
    value: false,
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Accent Background Toggle Switch'
  }
])

const strengthOptions = computed(() =>
  [20, 40, 60, 80, 100].map((v) => ({
    value: v,
    title: `${v}%`,
    ariaLabel: `${v}%`,
    text: `${v}`,
    name: 'Accent Background Strength'
  }))
)
</script>

<template>
  <div space-y-2 select-none role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle
        title="Accent Background"
        aria-label="Accent Background"
        flex="1"
        pr-4
      >
        <template #icon>
          <span i-lucide:paint-roller mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Accent Background</h4>
        <p text="sm" mb-2 max-w-100>
          Tints backgrounds, surfaces, and text with your accent color.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="accentBg"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>
    <NuVerticalTransition :duration="200">
      <div v-show="accentBg" space-y-2 role="radiogroup">
        <div ref="intensityTitleElementRef" relative flex items-center>
          <MenuTitle title="Intensity" aria-label="Intensity" flex="1" pr-4>
            <template #icon>
              <span
                i-lucide:chart-no-axes-column-increasing
                mr-1
                aria-hidden="true"
              />
            </template>
          </MenuTitle>
          <MenuHelp
            v-model:is-popped-up="isIntensityHelpPoppedUp"
            :menu-title-element-ref="intensityTitleElementRef"
          >
            <h4 text-md mb-1 font-semibold>Intensity</h4>
            <p text="sm" mb-2 max-w-100>
              How strongly the accent color tints the background.
            </p>
          </MenuHelp>
        </div>
        <NuInputHighlight :active="isIntensityHelpPoppedUp" class="rounded-md">
          <NuInputHorizontalRadioGroup
            v-model="strengthValue"
            bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
            text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
            :options="strengthOptions"
          />
        </NuInputHighlight>
      </div>
    </NuVerticalTransition>
  </div>
</template>

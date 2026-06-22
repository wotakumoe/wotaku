<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'

import MenuTitle from './MenuTitle.vue'

const { isDark } = useData()
const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})

const fieldOptions = [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Dark Mode'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Dark Mode'
  }
]

const currentMode = computed({
  get: () => (isDark.value ? 'on' : 'off'),
  set: (value) => {
    if ((value === 'on') !== isDark.value) {
      toggleAppearance()
    }
  }
})
</script>

<template>
  <div space-y-2>
    <MenuTitle title="Dark mode" aria-label="Dark mode">
      <template #icon>
        <span i-icon-park-outline:dark-mode mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <NuInputHorizontalRadioGroup
      v-model="currentMode"
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="fieldOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed } from 'vue'

import MenuTitle from './MenuTitle.vue'

const fieldOptions = computed(() => [
  {
    title: 'On',
    ariaLabel: 'On',
    value: true,
    text: 'ON',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch'
  },
  {
    title: 'Off',
    ariaLabel: 'Off',
    value: false,
    text: 'OFF',
    name: 'VitePress Nolebase Enhanced Readabilities Spotlight Toggle Switch'
  }
])
</script>

<template>
  <div space-y-2>
    <MenuTitle title="Spotlight" aria-label="Spotlight" disabled>
      <template #icon>
        <span i-icon-park-outline:click mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div
      border="1 red/50 solid"
      bg="red/30"
      flex
      items-center
      rounded-lg
      p-2
      opacity-50
    >
      <span text-xs>
        Spotlight Styles is not available in mobile screen temporarily.
      </span>
    </div>
    <NuInputHorizontalRadioGroup
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="fieldOptions"
      disabled
    />
  </div>
</template>

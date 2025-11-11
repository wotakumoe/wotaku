<script setup lang="ts">
import { NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed } from 'vue'

import MenuTitle from './MenuTitle.vue'

import { LayoutMode } from '../../constants'

const fieldOptions = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: 'Expand all',
    ariaLabel: 'Expand all',
    icon: 'i-icon-park-outline:full-screen-one',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: 'Expand sidebar with adjustable values',
    ariaLabel: 'Expand sidebar with adjustable values',
    icon: 'i-icon-park-outline:full-screen-two',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: 'Expand all with adjustable values',
    ariaLabel: 'Expand all with adjustable values',
    icon: 'i-icon-park-outline:full-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  },
  {
    value: LayoutMode.Original,
    title: 'Original width',
    ariaLabel: 'Original width',
    icon: 'i-icon-park-outline:overall-reduction',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox'
  }
])
</script>

<template>
  <div space-y-2>
    <MenuTitle title="Layout Switch" aria-label="Layout Switch" disabled>
      <template #icon>
        <slot i-icon-park-outline:layout-one mr-1 aria-hidden="true" />
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
      <span text-xs>No available layout can be switched in mobile screen.</span>
    </div>
    <NuInputHorizontalRadioGroup
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      :options="fieldOptions"
      disabled
    />
  </div>
</template>

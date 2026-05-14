<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { LowEndDeviceModeStorageKey } from '../../constants'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const lowEndDeviceMode = useStorage(LowEndDeviceModeStorageKey, 'off')

const fieldOptions = computed(() => [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Low-End Device Mode'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Low-End Device Mode'
  }
])
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle
        title="Low-end device mode"
        aria-label="Low-end device mode"
        flex="1"
        pr-4
      >
        <template #icon>
          <span i-icon-park-outline:effects mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Low-end device mode</h4>
        <p text="sm" mb-2 max-w-100>
          Turn on to disable expensive backdrop blur and view transitions if the
          site feels laggy on slower devices.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="lowEndDeviceMode"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>
  </div>
</template>

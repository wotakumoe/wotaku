<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed, ref } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { useEffects } from '../../composables/useEffects'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const { effects } = useEffects()

const fieldOptions = computed(() => [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Effects'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Effects'
  }
])
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Effects" aria-label="Effects" flex="1" pr-4>
        <template #icon>
          <span i-icon-park-outline:effects mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Effects</h4>
        <p text="sm" mb-2 max-w-100>
          Adds backdrop blur, smooth page transitions, and scaling animations. Keep off for the best performance on slower devices.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="effects"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>
  </div>
</template>

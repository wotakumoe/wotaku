<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { TakodachiStorageKey } from '../../constants'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const takodachToggledOn = useStorage(TakodachiStorageKey, false)

const fieldOptions = computed(() => [
  {
    value: true,
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Takodachi Toggle Switch'
  },
  {
    value: false,
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Takodachi Toggle Switch'
  }
])
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Takodachi" aria-label="Takodachi" :disabled="disabled" flex="1" pr-4>
        <template #icon>
          <img src="/takodachi.webp" alt="Takodachi" class="w-6 h-6 mr-1" aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp v-model:is-popped-up="isMenuHelpPoppedUp" :menu-title-element-ref="menuTitleElementRef">
        <h4 text-md mb-1 font-semibold>Takodachi</h4>
        <p text="sm" mb-2 max-w-100>
          <span>Gives you a cool takodachi following your cursor.</span>
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup v-model="takodachToggledOn"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color" :options="fieldOptions" :disabled="disabled" />
    </NuInputHighlight>
  </div>
</template>

<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@/theme/components/ui'
import { computed, ref } from 'vue'
import MenuHelp from '../settings/SettingsMenuHelp.vue'
import MenuTitle from '../settings/SettingsMenuTitle.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const options = [
  { value: 'on', title: 'On', ariaLabel: 'On', text: 'ON', name: 'ShowBroken' },
  { value: 'off', title: 'Off', ariaLabel: 'Off', text: 'OFF', name: 'ShowBroken' }
]

const showBroken = computed({
  get: () => (props.modelValue ? 'on' : 'off'),
  set: (value: string) => emit('update:modelValue', value === 'on')
})
</script>

<template>
  <div class="ext-broken" role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center mb-2>
      <MenuTitle title="Show broken urls" aria-label="Show broken urls" flex="1" pr-4>
        <template #icon>
          <span i-lucide:unlink mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Show Broken Urls</h4>
        <p text="sm" mb-2 max-w-100>
          Toggles whether entries with a broken source url are shown in the list.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="showBroken"
        bg="$wotaku-menu-background-color"
        text="sm $wotaku-menu-text-color"
        :options="options"
      />
    </NuInputHighlight>
  </div>
</template>

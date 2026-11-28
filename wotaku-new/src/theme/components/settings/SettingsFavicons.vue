<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@/theme/components/ui'
import { computed, ref } from 'vue'

import MenuHelp from './SettingsMenuHelp.vue'
import MenuTitle from './SettingsMenuTitle.vue'

import { useFavicons } from '../../composables/use-favicons'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const { favicons } = useFavicons()

const fieldOptions = computed(() => [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Favicons'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Favicons'
  }
])
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Favicons" aria-label="Favicons" flex="1" pr-4>
        <template #icon>
          <span i-lucide:globe mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Favicons</h4>
        <p text="sm" mb-2 max-w-100>Shows favicons beside external links.</p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="favicons"
        bg="$wotaku-menu-background-color"
        text="sm $wotaku-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>
  </div>
</template>

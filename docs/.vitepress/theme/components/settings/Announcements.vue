<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { AnnouncementsEnabledKey } from '../../constants'

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const announcements = useStorage(AnnouncementsEnabledKey, 'on')

const fieldOptions = computed(() => [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'On',
    text: 'ON',
    name: 'Announcements'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Off',
    text: 'OFF',
    name: 'Announcements'
  }
])
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" relative flex items-center>
      <MenuTitle title="Announcements" aria-label="Announcements" flex="1" pr-4>
        <template #icon>
          <span i-lucide:megaphone mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Announcements</h4>
        <p text="sm" mb-2 max-w-100>
          Shows the megaphone in the navbar with news about new sections, components, and improvements.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <NuInputHorizontalRadioGroup
        v-model="announcements"
        bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
        text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
        :options="fieldOptions"
      />
    </NuInputHighlight>
  </div>
</template>

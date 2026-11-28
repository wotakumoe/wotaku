<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@/theme/components/ui'
import { reactive, useId } from 'vue'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'
import MenuHelp from './SettingsMenuHelp.vue'
import MenuTitle from './SettingsMenuTitle.vue'

const { mobile, style, presentation, tabs } = useMobileNavigation()
const id = useId()
const styles = [
  {
    value: 'island',
    title: 'Island',
    description: 'Keep site controls within reach at the bottom of the screen.'
  },
  {
    value: 'classic',
    title: 'Classic',
    description:
      'Use the top navigation, slide-out sidebar, and On this page dropdown. No island or sheet.'
  }
] as const
const presentations = [
  {
    value: 'underlay',
    title: 'Underlay',
    description: 'Shrink the page into a rounded preview above the menu.'
  },
  {
    value: 'floating',
    title: 'Floating',
    description: 'Open a floating sheet over the page without resizing or moving it.'
  },
  {
    value: 'fullscreen',
    title: 'Full screen',
    description: 'Open Navigation and Settings at full height from the start.'
  }
] as const
const layouts = [
  {
    value: false,
    title: 'Combined',
    description: 'Show page headings within Navigation. Open Settings with the gear.'
  },
  {
    value: true,
    title: 'Tabs',
    description:
      'Separate site links and page headings into Navigation and On this page tabs. Open Settings with the gear.'
  }
]
const groups = reactive([
  {
    title: 'Navigation style',
    icon: 'i-lucide:panel-bottom',
    value: style,
    options: styles,
    help: false,
    element: undefined as HTMLDivElement | undefined
  },
  {
    title: 'Menu presentation',
    icon: 'i-lucide:panels-top-left',
    value: presentation,
    options: presentations,
    help: false,
    element: undefined as HTMLDivElement | undefined
  },
  {
    title: 'Menu layout',
    icon: 'i-lucide:columns-2',
    value: tabs,
    options: layouts,
    help: false,
    element: undefined as HTMLDivElement | undefined
  }
])
</script>

<template>
  <section
    v-if="mobile"
    class="settings-mobile-navigation"
    :aria-labelledby="`${id}-title`"
  >
    <h3 :id="`${id}-title`">Mobile navigation</h3>
    <p class="settings-mobile-intro">These preferences only change the mobile layout.</p>
    <template v-for="(group, index) in groups" :key="group.title">
      <div v-if="index === 0 || style === 'island'" class="settings-mobile-option">
        <div
          :ref="(el) => (group.element = el as HTMLDivElement)"
          relative
          flex
          items-center
        >
          <MenuTitle :id="`${id}-${index}`" :title="group.title" flex="1" pr-4>
            <template #icon
              ><span :class="group.icon" mr-1 aria-hidden="true"
            /></template>
          </MenuTitle>
          <MenuHelp
            v-model:is-popped-up="group.help"
            :menu-title-element-ref="group.element"
          >
            <h4 text-md mb-2 font-semibold>{{ group.title }}</h4>
            <p v-for="option in group.options" :key="option.title" text-sm mb-2>
              <strong>{{ option.title }}:</strong> {{ option.description }}
            </p>
          </MenuHelp>
        </div>
        <NuInputHighlight :active="group.help" class="rounded-md">
          <NuInputHorizontalRadioGroup
            v-model="group.value"
            :aria-labelledby="`${id}-${index}`"
            bg="$wotaku-menu-background-color"
            text="sm $wotaku-menu-text-color"
            :options="
              group.options.map((option) => ({
                ...option,
                text: option.title,
                ariaLabel: option.title,
                name: `${id}-${index}`
              }))
            "
          />
        </NuInputHighlight>
      </div>
    </template>
    <p v-if="style === 'classic'" class="settings-mobile-intro">
      Island menu preferences are paused in Classic mode. Switch back to Island to use
      them again.
    </p>
  </section>
</template>

<style scoped>
.settings-mobile-navigation {
  display: grid;
  gap: 20px;
  border-top: 1px solid var(--wotaku-c-divider);
  padding-top: 20px;
  color: var(--wotaku-c-text-1);
}
h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}
.settings-mobile-intro {
  margin: -12px 0 0;
  color: var(--wotaku-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}
.settings-mobile-option {
  display: grid;
  gap: 8px;
  min-width: 0;
}
.settings-mobile-option :deep(.wotaku-ui-input-horizontal-option) {
  min-width: 0;
  min-height: 44px;
  padding-inline: 6px;
  white-space: normal;
  text-align: center;
}
</style>

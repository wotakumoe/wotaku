<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@/theme/components/ui'
import { computed, ref } from 'vue'
import MenuHelp from '../settings/SettingsMenuHelp.vue'
import MenuTitle from '../settings/SettingsMenuTitle.vue'
import { useDropdown } from '../../composables/extension-repos/use-dropdown'

export interface FilterOption {
  value: string
  label: string
  flag?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    icon: string
    helpText: string
    options: FilterOption[]
    modelValue: string
    triggerLabel?: string
  }>(),
  {
    triggerLabel: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { rootRef, triggerRef, open, toggle, close } = useDropdown()
const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

const currentLabel = computed(() => {
  if (props.triggerLabel) return props.triggerLabel

  return props.options.find((o) => o.value === props.modelValue)?.label ?? 'All'
})

function select(value: string) {
  emit('update:modelValue', value)
  close()
}
</script>

<template>
  <div ref="rootRef" class="ext-fselect" :class="{ 'ext-fselect--open': open }">
    <div ref="menuTitleElementRef" relative flex items-center mb-2>
      <MenuTitle :title="title" :aria-label="title" flex="1" pr-4>
        <template #icon>
          <span :class="icon" mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>{{ title }}</h4>
        <p text="sm" mb-2 max-w-100>
          {{ helpText }}
        </p>
        <slot name="help-extra" />
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <button
        ref="triggerRef"
        type="button"
        class="ext-fselect-trigger"
        :aria-label="`${title}: ${currentLabel}`"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="ext-fselect-label">{{ currentLabel }}</span>
        <span
          class="ext-fselect-chevron i-lucide:chevron-down"
          :class="{ 'ext-fselect-chevron--open': open }"
        />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ext-fselect-options" role="listbox" :aria-label="title">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="option"
            class="ext-fselect-option"
            :class="{
              'ext-fselect-option--selected': modelValue === option.value
            }"
            :aria-selected="modelValue === option.value"
            @click="select(option.value)"
          >
            <span class="ext-fselect-option-label">{{ option.label }}</span>
            <span
              v-if="option.flag"
              class="ext-fselect-option-flag"
              :class="option.flag"
              aria-hidden="true"
            />
          </button>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ext-fselect {
  position: relative;
}
.ext-fselect-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 2px solid var(--wotaku-c-divider);
  background: var(--wk-c-menu-bg);
  color: var(--wotaku-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}
.ext-fselect-trigger:hover,
.ext-fselect--open .ext-fselect-trigger {
  border-color: var(--wotaku-c-brand-1);
}
.ext-fselect-label {
  flex: 1;
  text-align: left;
}
.ext-fselect-chevron {
  flex-shrink: 0;
  color: var(--wotaku-c-text-2);
  transition: transform 0.2s ease;
}
.ext-fselect-chevron--open {
  transform: rotate(180deg);
}
.ext-fselect-options {
  margin-top: 6px;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--wotaku-c-divider);
  background: var(--wotaku-c-bg-elv);
  box-shadow: var(--wotaku-shadow-2, 0 4px 16px rgba(0, 0, 0, 0.2));
}
.ext-fselect-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--wotaku-c-text-1);
  font-size: 13px;
  text-align: left;
  width: 100%;
  transition: background-color 0.15s;
}
.ext-fselect-option:hover {
  background-color: var(--wotaku-c-bg-soft);
}
.ext-fselect-option--selected {
  background-color: var(--wotaku-c-brand-soft);
  font-weight: 600;
}
.ext-fselect-option--selected:hover {
  background-color: var(--wotaku-c-brand-soft);
}
.ext-fselect-option-label {
  flex: 1;
  min-width: 0;
}
.ext-fselect-option-flag {
  flex-shrink: 0;
  font-size: 14px;
}
</style>

<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'

import NuInputHorizontalOptionsItem from './NuInputHorizontalRadioGroupOption.vue'

interface OptionItem {
  name: string
  icon?: string
  text?: string
  title: string
  ariaLabel: string
  value?: any
}

interface Props {
  disabled?: boolean
  modelValue?: any
  options: OptionItem[]
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

<template>
  <fieldset
    flex="~ row"
    bg="zinc-100 dark:zinc-900"
    text="sm zinc-400 dark:zinc-500"
    w-full
    appearance-none
    rounded-lg
    rounded-md
    border-none
    p-1
    space-x-2
  >
    <NuInputHorizontalOptionsItem
      v-for="option in props.options"
      :key="option.title"
      v-model="model"
      :name="option.name"
      :icon="option.icon"
      :title="option.title"
      :text="option.text"
      :aria-label="option.ariaLabel"
      :disabled="props.disabled"
      :value="option.value"
    />
  </fieldset>
</template>

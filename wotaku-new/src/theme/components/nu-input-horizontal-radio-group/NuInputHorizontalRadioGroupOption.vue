<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: any
  value?: any
  icon?: string
  text?: string
  title: string
  disabled?: boolean
  modelValue?: any
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

<template>
  <label
    :title="props.title"
    class="wotaku-ui-input-horizontal-option"
    :class="{
      active: model === props.value && !props.disabled,
      disabled: props.disabled
    }"
    :disabled="props.disabled"
    text="[14px]"
    w-full
    inline-flex
    cursor-pointer
    select-none
    items-center
    justify-center
    rounded-md
    px-3
    py-2
    font-medium
  >
    <input
      v-model="model"
      type="radio"
      :value="props.value"
      :name="props.name"
      :checked="model === props.value"
      :aria-checked="model === props.value"
      :aria-label="String($attrs['aria-label'] || props.text || props.title)"
      :disabled="props.disabled"
      role="radio"
    />
    <span inline-flex="~" items-center align-middle class="option-content">
      <span v-if="props.icon" :class="props.icon" aria-hidden="true" />
      <span v-if="props.text" :class="[!!props.icon ? 'ml-1' : '']">{{
        props.text
      }}</span>
    </span>
  </label>
</template>

<style less>
.wotaku-ui-input-horizontal-option {
  --wotaku-ui-input-horizontal-option-text: var(--wotaku-c-text-1);
  --wotaku-ui-input-horizontal-option-active-text: var(--wotaku-c-text-1);
  --wotaku-ui-input-horizontal-option-active-bg: var(--wotaku-c-bg-elv);
  --wotaku-ui-input-horizontal-option-shadow-color: #bababa8c;
}

.dark {
  .wotaku-ui-input-horizontal-option {
    --wotaku-ui-input-horizontal-option-text: var(--wotaku-c-text-1);
    --wotaku-ui-input-horizontal-option-active-text: var(--wotaku-c-bg-elv);
    --wotaku-ui-input-horizontal-option-active-bg: var(--wotaku-c-text-1);
    --wotaku-ui-input-horizontal-option-shadow-color: #535353db;
  }
}

.wotaku-ui-input-horizontal-option {
  position: relative;
  color: var(--wotaku-ui-input-horizontal-option-text);
  white-space: nowrap;
  transition:
    background-color 0.25s,
    color 0.25s,
    box-shadow 0.25s;

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: inherit;
  }

  .option-content {
    pointer-events: none;
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--wotaku-c-text-1);
    outline-offset: 2px;
  }

  &.active {
    font-weight: bold;
    color: var(--wotaku-ui-input-horizontal-option-active-text);
    background-color: var(--wotaku-ui-input-horizontal-option-active-bg);
    box-shadow: 0 2px 4px 0px var(--wotaku-ui-input-horizontal-option-shadow-color);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: var(--wotaku-ui-input-horizontal-option-active-text);
  }

  @media (hover: hover) {
    &:not(.disabled):hover {
      color: var(--wotaku-ui-input-horizontal-option-active-text);
      background-color: var(--wotaku-ui-input-horizontal-option-active-bg);
      box-shadow: 0 2px 4px 0px var(--wotaku-ui-input-horizontal-option-shadow-color);
    }
  }
}

.dark {
  .wotaku-ui-input-horizontal-option {
    &.active {
      color: var(--wotaku-ui-input-horizontal-option-active-text);
      background-color: var(--wotaku-ui-input-horizontal-option-active-bg);
      box-shadow: 0 2px 4px 0 var(--wotaku-ui-input-horizontal-option-shadow-color);
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: var(--wotaku-ui-input-horizontal-option-text);
    }

    @media (hover: hover) {
      &:not(.disabled):hover {
        color: var(--wotaku-ui-input-horizontal-option-active-text);
        background-color: var(--wotaku-ui-input-horizontal-option-active-bg);
        box-shadow: 0 2px 4px 0 var(--wotaku-ui-input-horizontal-option-shadow-color);
      }
    }
  }
}
</style>

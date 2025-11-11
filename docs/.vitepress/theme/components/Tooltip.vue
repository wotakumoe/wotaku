<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

withDefaults(
  defineProps<{
    title: string
    icon: string
  }>(),
  {
    title: 'Info',
    // https://icon-sets.iconify.design/material-symbols/
    icon: 'i-material-symbols-help'
  }
)
</script>

<template>
  <VTooltip
    theme="vp-tooltip"
    @show="isOpen = true"
    @hide="isOpen = false"
  >
    <button
      aria-label="Tooltip"
      :class="[
        'text-$vp-custom-block-tip-text-deep h-9 e-9 p-0 select-none font-bold cursor-pointer',
        isOpen && 'tooltip-open-glow'
      ]"
    >
      <div :class="icon" />
    </button>

    <template #popper>
      <div class="border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 max-w-md max-h-md border-2 border-solid p-4 transition-all">
        <h3
          class="text-$vp-c-text-1 mb-2 text-lg font-semibold"
          v-text="title"
        />
        <p class="text-$vp-c-text-2 text-sm content">
          <slot />
        </p>
      </div>
    </template>
  </VTooltip>
</template>

<style>
.v-popper__popper {
  --uno: z-9999;
}

.v-popper {
  display: inline-flex !important;
}

.v-popper__popper .content ol {
  list-style: decimal !important;
}

.v-popper__popper .content ul {
  --uno: ml-4;
  color: var(--vp-c-text-2);
  list-style: disc !important;
}

.tooltip-open-glow {
  filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 12px currentColor);
  transition: filter 0.2s ease;
}
</style>

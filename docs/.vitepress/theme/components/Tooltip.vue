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
  }>(),
  {
    title: 'Info',
  }
)
</script>

<template>
  <VTooltip theme="vp-tooltip" @show="isOpen = true" @hide="isOpen = false">
    <button
      aria-label="Tooltip"
      class="size-3 p-0 select-none font-bold cursor-pointer" style="color: var(--vp-custom-block-tip-text)"
    >
      <div :class="isOpen ? 'i-ic-twotone-add-circle' : 'i-ic-twotone-add-circle-outline'" />
    </button>

    <template #popper>
      <div class="border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 max-w-md max-h-md border-2 border-solid p-4 transition-all">
        <h3
          class="text-$vp-c-text-1 mb-2 text-lg font-semibold"
          v-text="title"
        />
        <div class="text-$vp-c-text-2 text-sm content">
          <slot />
        </div>
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
  vertical-align: -0.125em;
}

.v-popper__popper .content ol {
  list-style: decimal !important;
}

.v-popper__popper .content ul {
  --uno: ml-4;
  color: var(--vp-c-text-2);
  list-style: disc !important;
}

.v-popper__popper .content table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  --uno: text-sm;
}

.v-popper__popper .content thead th {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 600;
  padding: 6px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.v-popper__popper .content tbody td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

</style>
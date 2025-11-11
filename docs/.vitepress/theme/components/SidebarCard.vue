<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { ref } from 'vue'

import LegendModal from './LegendModal.vue'

const isModalOpen = ref(false)
</script>

<template>
  <div
    class="bg-$vp-c-bg hover:bg-$vp-c-bg/40 border-$vp-c-default-soft transition-all duration-500 mt-2 overflow-hidden hover:-translate-y-1 hover:shadow-lg rounded-lg border-2 border-solid relative z-0 max-md:bg-white/85 max-md:dark:bg-neutral-800/85 max-md:border max-md:border-neutral-200 max-md:dark:border-neutral-700"
  >
    <div class="h-20 w-full overflow-hidden">
      <img
        src="/sui.webp"
        alt="Icon Key Banner"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-5">
      <button class="w-full text-left" @click="isModalOpen = true">
        <div class="flex items-center gap-2">
          <div class="i-lucide-badge-info text-$vp-c-text-1" />
          <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">
            Icon key
          </div>
        </div>
        <div class="text-$vp-c-text-2 text-sm mt-2">
          Reference guide for all symbols used across the index.
        </div>
      </button>

      <LegendModal :is-open="isModalOpen" @close="isModalOpen = false" />
    </div>
  </div>
</template>

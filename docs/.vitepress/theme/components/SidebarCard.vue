<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { ref } from "vue";

import LegendModal from "./LegendModal.vue";

const isModalOpen = ref(false);

const focusLegendModal = () => {
  isModalOpen.value = true;
};
</script>

<template>
  <div
    class="bg-$vp-c-bg hover:bg-$vp-c-bg/40 border-$vp-c-default-soft hover:border-primary transition-border relative z-0 rounded-lg border-2 border-solid p-5 duration-500 mt-2">
    <button class="w-full text-left" @click="isModalOpen = true">
      <div class="align-center flex items-center gap-2">
        <div class="i-material-symbols-info-outline-rounded text-$vp-c-text-2" />
        <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">Legend</div>
      </div>
      <div class="text-$vp-c-text-2 text-xs mt-1">
        Click to view all icons and their meanings
      </div>
    </button>

    <LegendModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

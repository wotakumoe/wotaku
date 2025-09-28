<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
defineProps<{
  icon: string
  iconClass?: string
}>()
</script>

<template>
  <div class="g-[12px] mb-[8px] flex items-center">
    <span class="flex items-center">
      <span class="size-6" :class="[icon, iconClass]" />
      <div class="ml-2 text-sm text-$vp-c-text-2">
        <slot />
      </div>
    </span>
  </div>
</template>

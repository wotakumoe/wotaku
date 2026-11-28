<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
defineProps<{
  filterText: string
  searchMotionDiv: string | object
  emptyStateMotion: Record<string, unknown>
}>()
</script>

<template>
  <component
    :is="searchMotionDiv"
    class="flex flex-1 flex-col justify-center items-center w-full min-h-full gap-2 font-medium text-sm text-center m-auto"
    text="$wotaku-c-text-2"
    v-bind="emptyStateMotion"
  >
    <img
      class="h-40 object-contain object-center"
      src="/asset/smolame.png"
      alt="Smol ame"
    />
    <h1 v-if="filterText">Couldn't find anything, try again?</h1>
    <h1 v-else>Looking for something?</h1>
  </component>
</template>

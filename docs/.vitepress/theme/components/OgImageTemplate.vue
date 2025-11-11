<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
defineProps<{ title: string; description?: string; image: string }>()
</script>

<template>
  <span
    tw="w-full h-full bg-black flex flex-col"
    :style="{
      backgroundImage: `url(${image})`
    }"
  >
    <span
      tw="p-10 w-full min-h-0 grow flex flex-col items-center justify-between"
    >
      <span tw="w-full flex justify-between items-center text-5xl font-medium">
        <span tw="flex items-center">
          <span tw="text-zinc-100 ml-2 mt-1 font-semibold">wotaku.wiki</span>
        </span>
      </span>
      <span tw="w-full pr-56 flex flex-col items-start justify-end">
        <span style="color: #f7f7f7" tw="text-6xl font-bold" v-html="title" />
      </span>
    </span>
    <span tw="shrink-0 h-2 w-full flex" />
  </span>
</template>

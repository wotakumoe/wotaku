<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <span
    tw="w-full h-full bg-black flex flex-col"
    style="background-image: url(https://files.catbox.moe/lulxzs.png)">
    <span tw="p-10 w-full min-h-0 grow flex flex-col items-center justify-between">
      <span tw="w-full flex justify-between items-center text-4xl font-medium">
        <span tw="flex items-center">
          <span tw="text-zinc-100 ml-2 mt-1 font-semibold">wotaku.wiki</span>
        </span>
      </span>
      <span tw="w-full pr-56 flex flex-col items-start justify-end">
        <span style="color: #f7f7f7" tw="text-6xl font-bold" v-html="title" />
      </span>
    </span>
    <span tw="shrink-0 h-2 w-full flex" style="background-color: #56b4fc" />
  </span>
</template>

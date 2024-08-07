<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div
    tw="w-full h-full bg-black flex flex-col"
    style="background-image: url(https://i.ibb.co/9w9MYDf/og2-1.png)">
    <div tw="p-10 w-full min-h-0 grow flex flex-col items-center justify-between">
      <div tw="w-full flex justify-between items-center text-4xl font-medium">
        <div tw="flex items-center">
          <div tw="text-zinc-100 ml-2 mt-1 font-semibold">wotaku.wiki</div>
        </div>
      </div>
      <div tw="w-full pr-56 flex flex-col items-start justify-end">
        <div style="color: #f7f7f7" tw="text-6xl font-bold" v-html="title" />
      </div>
    </div>
    <div tw="shrink-0 h-2 w-full flex" style="background-color: #56b4fc" />
  </div>
</template>

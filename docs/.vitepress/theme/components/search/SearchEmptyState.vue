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
    class="flex flex-1 flex-col justify-center items-center w-full min-h-full gap-2 font-medium text-sm text-center text-gray-500 dark:text-gray-300 m-auto opacity-90"
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

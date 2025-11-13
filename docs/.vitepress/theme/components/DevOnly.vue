<script setup lang="ts">
defineProps<{
  fallback?: string
}>()

const isDev = import.meta.env.DEV
</script>

<template>
  <div v-if="isDev" class="vp-doc vp-doc-content">
    <slot />
  </div>
  <div v-else-if="fallback" class="vp-doc vp-doc-content" v-html="fallback">
  </div>
</template>

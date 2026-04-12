<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const open = ref(false)
</script>

<template>
  <details class="details custom-block" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary>{{ title || 'Details' }}</summary>
    <slot />
  </details>
</template>

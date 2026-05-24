<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const open = ref(false)
</script>

<template>
  <details class="details custom-block" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary>
      <span v-if="open" class="i-iconoir-nav-arrow-down collapsible-icon" />
      <span v-else class="i-iconoir-nav-arrow-right collapsible-icon" />
      {{ title || 'Details' }}
    </summary>
    <slot />
  </details>
</template>

<style scoped>
summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.4em;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.collapsible-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
</style>
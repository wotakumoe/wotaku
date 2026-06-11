<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  type?: 'tip' | 'warning' | 'danger'
}>()

const open = ref(false)
</script>

<template>
  <details class="details custom-block" :class="type" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
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

.tip {
  background-color: #042a20;
  color: #a8f0cc;
  border-color: #0a5c42;
}

.warning {
  background-color: #413306;
  color: #fee38b;
  border-color: #86680e;
}

.danger {
  background-color: #430a0a;
  color: #fec8c8;
  border-color: #981b1b;
}
</style>
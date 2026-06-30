<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  type?: 'tip' | 'warning' | 'danger'
  anchor?: string
}>()

const open = ref(false)
</script>

<template>
  <details class="details custom-block" :class="type" :data-collapsible-anchor="anchor || undefined" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
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

.details {
  background-color: var(--vp-collapsible-bg);
  color: var(--vp-collapsible-text);
  border-color: var(--vp-collapsible-border);
}

.tip {
  background-color: var(--vp-custom-block-tip-bg);
  color: var(--vp-custom-block-tip-text);
  border-color: var(--vp-custom-block-tip-border);
}

.warning {
  background-color: var(--vp-custom-block-warning-bg);
  color: var(--vp-custom-block-warning-text);
  border-color: var(--vp-custom-block-warning-border);
}

.danger {
  background-color: var(--vp-custom-block-danger-bg);
  color: var(--vp-custom-block-danger-text);
  border-color: var(--vp-custom-block-danger-border);
}
</style>

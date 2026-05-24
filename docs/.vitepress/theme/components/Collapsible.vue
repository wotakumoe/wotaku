<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const open = ref(false)

const headingId = computed(() =>
  props.title
    ? props.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
    : undefined
)
</script>

<template>
  <details class="details custom-block" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary>
      <span v-if="open" class="i-iconoir-nav-arrow-down collapsible-icon" />
      <span v-else class="i-iconoir-nav-arrow-right collapsible-icon" />
      {{ title || 'Details' }}
    </summary>
    <h3 v-if="headingId" :id="headingId" class="collapsible-anchor" aria-hidden="true">{{ title }}</h3>
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

.collapsible-anchor {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  margin: 0;
  padding: 0;
}
</style>
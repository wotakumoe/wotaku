<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

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
  <details
    class="details custom-block"
    :class="type"
    :data-collapsible-anchor="anchor || undefined"
    :open="open || undefined"
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary>
      <span v-if="open" class="i-iconoir-nav-arrow-down collapsible-icon" />
      <span v-else class="i-iconoir-nav-arrow-right collapsible-icon" />
      <span class="collapsible-title">{{ title || 'Details' }}</span>
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

/* keeps the header element in one line in excerpts */
.collapsible-title {
  min-width: 0;
}

.details {
  background-color: var(--wotaku-collapsible-bg);
  color: var(--wotaku-collapsible-text);
  border-color: var(--wotaku-collapsible-border);
}

.tip {
  background-color: var(--wotaku-custom-block-tip-bg);
  color: var(--wotaku-custom-block-tip-text);
  border-color: var(--wotaku-custom-block-tip-border);
}

.warning {
  background-color: var(--wotaku-custom-block-warning-bg);
  color: var(--wotaku-custom-block-warning-text);
  border-color: var(--wotaku-custom-block-warning-border);
}

.danger {
  background-color: var(--wotaku-custom-block-danger-bg);
  color: var(--wotaku-custom-block-danger-text);
  border-color: var(--wotaku-custom-block-danger-border);
}
</style>

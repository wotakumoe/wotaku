<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed, provide } from 'vue'
import { DECK_MINI_KEY } from '../../shared/link-card/deck'

const props = withDefaults(
  defineProps<{
    mini?: boolean
  }>(),
  {
    mini: false
  }
)

provide(
  DECK_MINI_KEY,
  computed(() => props.mini)
)
</script>

<template>
  <div class="wotaku-grid" :class="{ 'wotaku-grid--mini': mini }">
    <slot />
  </div>
</template>

<style scoped>
.wotaku-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  gap: 8px;
}

.wotaku-grid--mini {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

@media (min-width: 640px) {
  .wotaku-grid {
    gap: 8px;
  }
}

@media (min-width: 768px) {
  .wotaku-grid {
    gap: 8px;
  }
}
</style>

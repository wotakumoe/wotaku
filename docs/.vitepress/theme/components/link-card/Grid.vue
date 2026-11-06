<script setup lang="ts">
import { computed, provide } from 'vue'
import { DECK_MINI_KEY } from './deck'

const props = withDefaults(
  defineProps<{
    mini?: boolean
  }>(),
  {
    mini: false
  }
)

provide(DECK_MINI_KEY, computed(() => props.mini))
</script>

<template>
  <div class="vp-grid" :class="{ 'vp-grid--mini': mini }">
    <slot />
  </div>
</template>

<style scoped>
.vp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  gap: 8px;
}

.vp-grid--mini {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

@media (min-width: 640px) {
  .vp-grid {
    gap: 8px;
  }
}

@media (min-width: 768px) {
  .vp-grid {
    gap: 8px;
  }
}
</style>

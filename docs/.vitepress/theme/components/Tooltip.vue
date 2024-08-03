<script setup lang="ts">
import { ref } from "vue";

const show = ref<boolean>(false);

function toggleTooltip() {
  show.value = !show.value;
}

withDefaults(defineProps<{ icon: string }>(), {
  icon: "i-lucide-info",
});
</script>

<template>
  <button @click="toggleTooltip" class="tooltip-button">
    <div :class="icon" />
  </button>
  <p v-if="show" class="tooltip">
    <slot />
  </p>
</template>

<style scoped>
.tooltip-button {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-custom-block-info-bg);
  display: inline-flex;
  border-radius: 100px;
  padding: 5px;
  line-height: 26px;
  font-size: 16px;
  font-weight: 500;
}

.tooltip {
  background: var(--vp-c-bg-nav);
  padding: 12px 24px 24px;
  border-radius: 12px;
  position: relative;
  z-index: 0;
  border: 1px solid transparent;
  white-space: pre-wrap;
  border-color: var(--vp-c-brand);
  font-size: 14px;
  font-weight: 500;
}
</style>

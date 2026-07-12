<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <h3 class="ext-menu-title">
    <span :class="icon" aria-hidden="true" />
    {{ title }}
  </h3>
</template>

<style scoped>
.ext-menu-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ext-menu-title span {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>

<script setup lang="ts">
import Field from "./CardField.vue";
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Legend</div>
    </div>
    <Field icon="i-twemoji-glowing-star">Favorite</Field>
    <Field icon="i-lucide-message-circle">Feedback</Field>
    <Field icon="i-lucide-info">More Info</Field>
    <Field icon="i-material-symbols-subdirectory-arrow-right">Related</Field>
  </div>
</template>

<style scoped >

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 32px;
  font-size: 16px;
}

.card {
  background: var(--vp-c-bg);
  padding: 12px 24px 24px;
  border-radius: 12px;
  position: relative;
  z-index: 0;
  border: 1px solid transparent;
  transition: border-color 0.4s ease-in-out;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
}
</style>

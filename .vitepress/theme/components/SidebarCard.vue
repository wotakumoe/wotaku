<script setup lang="ts">
import Field from "./CardField.vue";
import Feedback from "./Modal.vue";
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Emoji Legend</div>
    </div>
    <Field icon="i-twemoji-glowing-star">Favorite</Field>
    <Field icon="i-mdi-information-slab-circle-outline">More Info</Field>
    <div class="mb-2 mt-2 gap" />
    <Feedback />
  </div>
</template>

<style scoped>
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

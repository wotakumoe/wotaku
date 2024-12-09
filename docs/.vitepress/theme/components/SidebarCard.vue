<script setup lang="ts">
import Field from './CardField.vue'
</script>

<template>
  <div
    class="bg-$vp-c-bg hover:bg-$vp-c-bg/40 border-$vp-c-default-soft hover:border-primary transition-border relative z-0 rounded-lg border-2 border-solid p-5 duration-500">
    <div class="align-center mb-4 flex justify-between">
      <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">Legend</div>
    </div>
    <Field icon="i-twemoji-glowing-star">Favorite</Field>
    <Field icon="i-material-symbols-lock-outline">Closed Source</Field>
    <Field icon="i-lucide-message-circle">Feedback</Field>
    <Field icon="i-material-symbols-info-outline-rounded">More Info</Field>
    <Field icon="i-material-symbols-subdirectory-arrow-right">Related</Field>
  </div>
</template>

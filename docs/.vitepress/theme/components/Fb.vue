<script setup lang="ts">
import Feedback from './Feedback.vue'

defineProps<{ h: string }>()
</script>

<template>
  <Feedback :heading="h" />
</template>
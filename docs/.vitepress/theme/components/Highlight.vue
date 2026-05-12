<template>
  <span class="highlight-pill" :class="variant">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.highlight-pill {
  display: inline-block;
  padding: 0 0.25em;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  vertical-align: baseline;
  border: 1px solid;
}

.default {
  background-color: #042a20;
  color: #a8f0cc;
  border-color: #0a5c42;
}

.warning {
  background-color: #413306;
  color: #fee38b;
  border-color: #86680e;
}

.danger {
  background-color: #430a0a;
  color: #fec8c8;
  border-color: #981b1b;
}
</style>
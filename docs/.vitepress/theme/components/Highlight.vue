<template>
  <span class="highlight-pill" :class="[variant, { 'has-link': linked }]">
    <slot />
    <span v-if="linked" class="i-mdi-arrow-top-right-thick link-icon"></span>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  linked: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.highlight-pill {
  display: inline-block;
  position: relative;
  padding: 0 0.25em;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  vertical-align: baseline;
  border: 1px solid;
}

.has-link {
  margin-right: 0.5em;
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

.link-icon {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  font-size: 0.9em;
  opacity: 0.9;
}
</style>
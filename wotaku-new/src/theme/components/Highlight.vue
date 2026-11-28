<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

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
  background-color: var(--wotaku-custom-block-tip-bg);
  color: var(--wotaku-custom-block-tip-text);
  border-color: var(--wotaku-custom-block-tip-border);
}

.warning {
  background-color: var(--wotaku-custom-block-warning-bg);
  color: var(--wotaku-custom-block-warning-text);
  border-color: var(--wotaku-custom-block-warning-border);
}

.danger {
  background-color: var(--wotaku-custom-block-danger-bg);
  color: var(--wotaku-custom-block-danger-text);
  border-color: var(--wotaku-custom-block-danger-border);
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

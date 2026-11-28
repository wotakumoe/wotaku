<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    type?: 'info' | 'tip' | 'warning' | 'danger'
    link: string
    icon?: string
  }>(),
  { icon: 'i-lucide-external-link', type: 'tip' }
)
</script>

<template>
  <component
    :is="link ? 'a' : 'span'"
    :href="link"
    :class="type"
    class="VButton flex items-center px4 py3 gap2 rounded-xl align-middle cursor-pointer w-full"
  >
    <span :class="icon" class="shrink-0" aria-hidden="true" />
    <span class="block-text"><slot>{{ text }}</slot></span>
    <span
      v-if="link"
      class="i-lucide-arrow-right block-arrow shrink-0"
      aria-hidden="true"
    />
  </component>
</template>

<style scoped>
.VButton {
  text-decoration: none !important;
}

.block-text {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

a.VButton .block-text {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}

@media (hover: hover) {
  a.VButton:hover .block-text {
    text-decoration-thickness: 2px;
  }
}

a.VButton:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

[dir='rtl'] .block-arrow {
  transform: rotate(180deg);
}

.VButton.info {
  color: var(--wotaku-badge-info-text);
  background-color: var(--wotaku-badge-info-bg);
}

.VButton.tip {
  color: var(--wotaku-custom-block-tip-text);
  background-color: var(--wotaku-custom-block-tip-bg);
  border: 2px solid var(--wotaku-custom-block-tip-border);
}

.VButton.warning {
  color: var(--wotaku-badge-warning-text);
  background-color: var(--wotaku-badge-warning-bg);
}

.VButton.danger {
  color: var(--wotaku-badge-danger-text);
  background-color: var(--wotaku-badge-danger-bg);
}
</style>

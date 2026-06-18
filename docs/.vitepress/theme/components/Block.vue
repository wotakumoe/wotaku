<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

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
    <div :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VButton {
  text-decoration: none !important;
}

.VButton:hover,
.VButton:active,
.VButton:focus {
  color: inherit !important;
}

.VButton.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VButton.tip {
  color: var(--vp-custom-block-tip-text);
  background-color: var(--vp-custom-block-tip-bg);
  border: 2px solid var(--vp-custom-block-tip-border);
}

.VButton.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.VButton.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}
</style>

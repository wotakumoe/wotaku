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
  { icon: 'i-octicon-link-external-16', type: 'tip' }
)
</script>

<template>
  <component :target="link ? '_blank' : undefined" :is="link ? 'a' : 'span'" :href="link" :class="type"
    class="VButton px4 py3 mt2 gap2 block flex items-center rounded-md">
    <div :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VButton {
  text-decoration: none !important;
}

.VButton.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VButton.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
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

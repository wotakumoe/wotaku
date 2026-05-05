<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
interface Props {
  text?: string
  link?: string
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'green'
  icon?: string
}
withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<template>
  <component
    :target="link ? '_blank' : undefined"
    :is="link ? 'a' : 'span'"
    class="VPBadge"
    :class="link ? 'tip' : type"
    :href="link"
  >
    <div v-if="icon" :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VPBadge {
  display: inline-flex;
  margin-left: 0.125em;
  border: 1px solid transparent;
  border-radius: 1em;
  padding: 0 0.75em;
  line-height: 1.5;
  font-size: 0.75em;
  font-weight: 500;
  align-items: center;
  gap: 0.25em;
  vertical-align: middle;
  text-decoration: none !important;
}

.VPBadge.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VPBadge.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.VPBadge.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.VPBadge.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}

.VPBadge.green {
  color: var(--vp-custom-block-tip-text);
  background-color: var(--vp-custom-block-tip-bg);
}
</style>
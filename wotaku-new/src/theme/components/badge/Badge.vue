<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

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
    class="WotakuBadge"
    :class="link ? 'tip' : type"
    :href="link"
  >
    <div v-if="icon" :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.WotakuBadge {
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

.WotakuBadge.info {
  color: var(--wotaku-badge-info-text);
  background-color: var(--wotaku-badge-info-bg);
}

.WotakuBadge.tip {
  color: var(--wotaku-badge-tip-text);
  background-color: var(--wotaku-badge-tip-bg);
}

.WotakuBadge.warning {
  color: var(--wotaku-badge-warning-text);
  background-color: var(--wotaku-badge-warning-bg);
}

.WotakuBadge.danger {
  color: var(--wotaku-badge-danger-text);
  background-color: var(--wotaku-badge-danger-bg);
}

.WotakuBadge.green {
  color: var(--wotaku-custom-block-tip-text);
  background-color: var(--wotaku-custom-block-tip-bg);
}
</style>

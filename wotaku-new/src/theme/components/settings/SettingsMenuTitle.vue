<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
const props = defineProps<{
  title?: string
  disabled?: boolean
}>()
</script>

<template>
  <h3
    class="settings-menu-title"
    :class="{ disabled: !!props.disabled }"
    text="[16px] $wotaku-menu-text-color"
    inline-flex
    select-none
    items-center
    align-middle
    font-medium
  >
    <slot name="icon" />
    <span v-if="props.title">{{ props.title }}</span>
    <slot />
  </h3>
</template>

<style scoped less>
.settings-menu-title {
  &.disabled {
    opacity: 0.5;
  }
}
</style>

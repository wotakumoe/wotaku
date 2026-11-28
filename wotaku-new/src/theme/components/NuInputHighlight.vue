<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <div
    class="input-highlight"
    transition="outline duration-200 ease"
    :class="{
      active: Boolean(active)
    }"
  >
    <slot />
  </div>
</template>

<style lang="css" scoped>
.input-highlight {
  outline-width: 2px;
  outline-color: transparent;
  outline-offset: 4px;
  outline-style: dashed;
}

.input-highlight.active {
  outline-color: var(--wotaku-c-brand-1);
}
</style>

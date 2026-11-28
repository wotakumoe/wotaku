<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
defineProps<{
  show: boolean
}>()
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="WotakuBackdrop" />
  </transition>
</template>

<style scoped>
.WotakuBackdrop {
  position: fixed;
  top: 0;
  /*rtl:ignore*/
  right: 0;
  bottom: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--wotaku-z-index-backdrop);
  background: var(--wotaku-backdrop-bg-color);
  transition: opacity 0.5s;
}

.WotakuBackdrop.fade-enter-from,
.WotakuBackdrop.fade-leave-to {
  opacity: 0;
}

.WotakuBackdrop.fade-leave-active {
  transition-duration: 0.25s;
}

@media (min-width: 1280px) {
  .WotakuBackdrop {
    display: none;
  }
}
</style>

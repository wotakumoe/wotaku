<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from '@/theme/shared/client'
import { ref } from 'vue'

defineProps<{
  open: boolean
}>()

const screen = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? document.body : null)
</script>

<template>
  <transition name="fade" @enter="isLocked = true" @after-leave="isLocked = false">
    <div v-if="open" class="WotakuNavScreen" ref="screen" id="WotakuNavScreen">
      <div class="container">
        <slot name="nav-screen-content-before" />
        <slot name="nav-screen-content-after" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.WotakuNavScreen {
  position: fixed;
  top: calc(var(--wotaku-nav-height) + var(--wotaku-layout-top-height, 0px));
  /*rtl:ignore*/
  right: 0;
  bottom: 0;
  /*rtl:ignore*/
  left: 0;
  padding: 0 32px;
  width: 100%;
  background-color: var(--wotaku-nav-screen-bg-color);
  overflow-y: auto;
  transition: background-color 0.25s;
  pointer-events: auto;
}

.WotakuNavScreen.fade-enter-active,
.WotakuNavScreen.fade-leave-active {
  transition: opacity 0.25s;
}

.WotakuNavScreen.fade-enter-active .container,
.WotakuNavScreen.fade-leave-active .container {
  transition: transform 0.25s ease;
}

.WotakuNavScreen.fade-enter-from,
.WotakuNavScreen.fade-leave-to {
  opacity: 0;
}

.WotakuNavScreen.fade-enter-from .container,
.WotakuNavScreen.fade-leave-to .container {
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .WotakuNavScreen {
    display: none;
  }
}

.container {
  margin: 0 auto;
  padding: 24px 0 96px;
  max-width: 288px;
}

.menu + .translations,
.menu + .appearance,
.translations + .appearance {
  margin-top: 24px;
}

.menu + .social-links {
  margin-top: 16px;
}

.appearance + .social-links {
  margin-top: 16px;
}
</style>

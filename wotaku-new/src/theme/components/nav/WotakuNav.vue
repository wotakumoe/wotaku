<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { inBrowser } from '@/theme/shared/client'
import { computed, watch, watchEffect } from 'vue'
import { useData } from '../../composables/base/data'
import { useNav } from '../../composables/base/nav'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'
import { openSettings } from '../../shared/settings-state'
import WotakuNavBar from './WotakuNavBar.vue'
import WotakuNavScreen from './WotakuNavScreen.vue'

const { isScreenOpen, closeScreen, toggleScreen } = useNav()
const { island } = useMobileNavigation()
const { frontmatter } = useData()

watch(island, (value) => {
  if (value && isScreenOpen.value) {
    // A preference changed inside the classic menu: keep Settings reachable.
    openSettings()
    closeScreen()
  }
})

const hasNavbar = computed(() => {
  return frontmatter.value.navbar !== false
})

watchEffect(() => {
  if (inBrowser) {
    document.documentElement.classList.toggle('hide-nav', !hasNavbar.value)
  }
})
</script>

<template>
  <header v-if="hasNavbar" class="WotakuNav">
    <WotakuNavBar :is-screen-open="isScreenOpen" @toggle-screen="toggleScreen">
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
      <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
      <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
    </WotakuNavBar>
    <WotakuNavScreen :open="isScreenOpen">
      <template #nav-screen-content-before
        ><slot name="nav-screen-content-before"
      /></template>
      <template #nav-screen-content-after
        ><slot name="nav-screen-content-after"
      /></template>
    </WotakuNavScreen>
  </header>
</template>

<style scoped>
.WotakuNav {
  position: relative;
  top: var(--wotaku-layout-top-height, 0px);
  /*rtl:ignore*/
  left: 0;
  z-index: var(--wotaku-z-index-nav);
  width: 100%;
  pointer-events: none;
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .WotakuNav {
    position: fixed;
  }
}
</style>

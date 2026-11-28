<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from '@/theme/shared/client'
import { ref, watch } from 'vue'
import { useLayout } from '../../composables/base/layout'
import WotakuSidebarGroup from './WotakuSidebarGroup.vue'

const { sidebarGroups, hasSidebar } = useLayout()

const props = defineProps<{
  open: boolean
}>()

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  [props, navEl],
  () => {
    if (props.open) {
      isLocked.value = true
      navEl.value?.focus()
    } else isLocked.value = false
  },
  { immediate: true, flush: 'post' }
)

const key = ref(0)

watch(
  sidebarGroups,
  () => {
    key.value += 1
  },
  { deep: true }
)
</script>

<template>
  <aside
    v-if="hasSidebar"
    class="WotakuSidebar"
    :class="{ open }"
    ref="navEl"
    @click.stop
  >
    <div class="curtain" />

    <nav
      class="nav"
      id="WotakuSidebarNav"
      aria-labelledby="sidebar-aria-label"
      tabindex="-1"
    >
      <span class="visually-hidden" id="sidebar-aria-label"> Sidebar Navigation </span>

      <slot name="sidebar-nav-before" />
      <WotakuSidebarGroup :items="sidebarGroups" :key />
      <slot name="sidebar-nav-after" />
    </nav>
  </aside>
</template>

<style scoped>
.WotakuSidebar {
  position: fixed;
  top: var(--wotaku-layout-top-height, 0px);
  bottom: 0;
  left: 0;
  z-index: var(--wotaku-z-index-sidebar);
  padding: 32px 32px 96px;
  width: calc(100vw - 64px);
  max-width: 320px;
  background-color: var(--wotaku-sidebar-bg-color);
  opacity: 0;
  box-shadow: var(--wotaku-c-shadow-3);
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-100%);
  transition:
    opacity 0.5s,
    transform 0.25s ease;
  overscroll-behavior: contain;
}

.WotakuSidebar.open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dark .WotakuSidebar {
  box-shadow: var(--wotaku-shadow-1);
}

@media (min-width: 960px) {
  .WotakuSidebar {
    padding-top: var(--wotaku-nav-height);
    width: var(--wotaku-sidebar-width);
    max-width: 100%;
    background-color: var(--wotaku-sidebar-bg-color);
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    transform: translateX(0);
  }
}

@media (min-width: 1440px) {
  .WotakuSidebar {
    padding-left: max(32px, calc((100vw - (var(--wotaku-layout-max-width) - 64px)) / 2));
    width: calc(
      (100vw - (var(--wotaku-layout-max-width) - 64px)) / 2 +
        var(--wotaku-sidebar-width) - 32px
    );
  }
}

@media (min-width: 960px) {
  .curtain {
    position: sticky;
    top: -64px;
    left: 0;
    z-index: 1;
    margin-top: calc(var(--wotaku-nav-height) * -1);
    margin-right: -32px;
    margin-left: -32px;
    height: var(--wotaku-nav-height);
    background-color: var(--wotaku-sidebar-bg-color);
  }
}

.nav {
  outline: 0;
}
</style>

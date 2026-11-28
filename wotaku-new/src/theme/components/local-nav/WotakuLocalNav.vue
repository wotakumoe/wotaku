<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import { useData } from '../../composables/base/data'
import { useLayout } from '../../composables/base/layout'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'
import WotakuLocalNavOutlineDropdown from './WotakuLocalNavOutlineDropdown.vue'

defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'open-menu'): void
}>()

const { theme } = useData()
const { isHome, hasSidebar, headers } = useLayout()
const { mobile, style } = useMobileNavigation()
</script>

<template>
  <div
    v-if="!isHome && (hasSidebar || (mobile && style === 'classic' && headers.length))"
    class="WotakuLocalNav"
  >
    <div class="container">
      <button
        v-if="hasSidebar"
        class="menu"
        :aria-expanded="open"
        aria-controls="WotakuSidebarNav"
        @click="$emit('open-menu')"
      >
        <span class="wotaku-icon-align-left menu-icon"></span>
        <span class="menu-text">
          {{ theme.sidebarMenuLabel || 'Menu' }}
        </span>
      </button>
      <WotakuLocalNavOutlineDropdown
        v-if="mobile && style === 'classic'"
        :headers="[...headers]"
      />
    </div>
  </div>
</template>

<style scoped>
.WotakuLocalNav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--wotaku-z-index-local-nav);
  border-bottom: 1px solid var(--wotaku-c-gutter);
  padding-top: var(--wotaku-layout-top-height, 0px);
  width: 100%;
  background-color: var(--wotaku-local-nav-bg-color);
}

@media (min-width: 960px) {
  .WotakuLocalNav {
    display: none;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--wotaku-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--wotaku-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 960px) {
  .menu {
    display: none;
  }
}

.menu-icon {
  margin-right: 8px;
  font-size: 14px;
}

.menu {
  padding: 12px 24px 11px;
}

@media (min-width: 768px) {
  .menu {
    padding: 12px 32px 11px;
  }
}
</style>

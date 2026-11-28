<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { watch } from 'vue'
import WotakuBackdrop from '../WotakuBackdrop.vue'
import WotakuContent from '../WotakuContent.vue'
import WotakuLocalNav from '../local-nav/WotakuLocalNav.vue'
import WotakuNav from '../nav/WotakuNav.vue'
import MobileNavigation from '../nav/MobileNavigation.vue'
import WotakuSidebar from '../sidebar/WotakuSidebar.vue'
import WotakuSkipLink from './WotakuSkipLink.vue'
import { useData } from '../../composables/base/data'
import { registerWatchers } from '../../composables/base/layout'
import { useSidebarControl } from '../../composables/base/sidebar'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebarControl()

registerWatchers({ closeSidebar })

const { frontmatter } = useData()
const { island } = useMobileNavigation()
watch(island, (value) => {
  if (value) closeSidebar()
})
</script>

<template>
  <MobileNavigation v-if="frontmatter.layout !== false">
    <div
      class="Layout"
      :class="[frontmatter.pageClass, { 'mobile-island-enabled': island }]"
    >
      <slot name="layout-top" />
      <WotakuSkipLink />
      <WotakuBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
      <WotakuNav>
        <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
        <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
        <template #nav-bar-content-before
          ><slot name="nav-bar-content-before"
        /></template>
        <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
        <template #nav-screen-content-before
          ><slot name="nav-screen-content-before"
        /></template>
        <template #nav-screen-content-after
          ><slot name="nav-screen-content-after"
        /></template>
      </WotakuNav>
      <WotakuLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

      <WotakuSidebar :open="isSidebarOpen">
        <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
        <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
      </WotakuSidebar>

      <WotakuContent>
        <template #page-top><slot name="page-top" /></template>
        <template #page-bottom><slot name="page-bottom" /></template>

        <template #not-found><slot name="not-found" /></template>

        <template #doc-footer-before><slot name="doc-footer-before" /></template>
        <template #doc-before><slot name="doc-before" /></template>
        <template #doc-after><slot name="doc-after" /></template>
        <template #doc-top><slot name="doc-top" /></template>
        <template #doc-bottom><slot name="doc-bottom" /></template>

        <template #aside-top><slot name="aside-top" /></template>
        <template #aside-bottom><slot name="aside-bottom" /></template>
        <template #aside-outline-before><slot name="aside-outline-before" /></template>
        <template #aside-outline-after><slot name="aside-outline-after" /></template>
      </WotakuContent>

      <slot name="layout-bottom" />
    </div>
  </MobileNavigation>
  <Content v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

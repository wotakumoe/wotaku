<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import NotFound from './not-found/NotFound.vue'
import { useData } from '../composables/base/data'
import { useLayout } from '../composables/base/layout'
import WotakuDoc from './doc/WotakuDoc.vue'
import WotakuPage from './layout/WotakuPage.vue'

const { page, frontmatter } = useData()
const { isHome, hasSidebar } = useLayout()
</script>

<template>
  <div
    class="WotakuContent"
    id="WotakuContent"
    :class="{ 'has-sidebar': hasSidebar, 'is-home': isHome }"
  >
    <slot name="not-found" v-if="page.isNotFound"><NotFound /></slot>

    <WotakuPage v-else-if="frontmatter.layout === 'page'">
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>
    </WotakuPage>

    <component
      v-else-if="frontmatter.layout && frontmatter.layout !== 'doc'"
      :is="frontmatter.layout"
    />

    <WotakuDoc v-else>
      <template #doc-top><slot name="doc-top" /></template>
      <template #doc-bottom><slot name="doc-bottom" /></template>

      <template #doc-footer-before><slot name="doc-footer-before" /></template>
      <template #doc-before><slot name="doc-before" /></template>
      <template #doc-after><slot name="doc-after" /></template>

      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
    </WotakuDoc>
  </div>
</template>

<style scoped>
.WotakuContent {
  flex-grow: 1;
  flex-shrink: 0;
  margin: var(--wotaku-layout-top-height, 0px) auto 0;
  width: 100%;
}

.WotakuContent.is-home {
  width: 100%;
  max-width: 100%;
}

.WotakuContent.has-sidebar {
  margin: 0;
}

@media (min-width: 960px) {
  .WotakuContent {
    padding-top: var(--wotaku-nav-height);
  }

  .WotakuContent.has-sidebar {
    margin: var(--wotaku-layout-top-height, 0px) 0 0;
    padding-left: var(--wotaku-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .WotakuContent.has-sidebar {
    padding-right: calc((100vw - var(--wotaku-layout-max-width)) / 2);
    padding-left: calc(
      (100vw - var(--wotaku-layout-max-width)) / 2 + var(--wotaku-sidebar-width)
    );
  }
}
</style>

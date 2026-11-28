<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../../composables/base/data'
import { withBase } from '@/theme/shared/client'
import { useLayout } from '../../composables/base/layout'
import WotakuImage from '../WotakuImage.vue'

const { site, theme } = useData()
const { hasSidebar } = useLayout()

const link = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? theme.value.logoLink
    : theme.value.logoLink?.link
)

const rel = computed(() =>
  typeof theme.value.logoLink === 'string' ? undefined : theme.value.logoLink?.rel
)

const target = computed(() =>
  typeof theme.value.logoLink === 'string' ? undefined : theme.value.logoLink?.target
)
</script>

<template>
  <div class="WotakuNavBarTitle" :class="{ 'has-sidebar': hasSidebar }">
    <a class="title" :href="link ?? withBase('/')" :rel :target>
      <slot name="nav-bar-title-before" />
      <WotakuImage v-if="theme.logo" class="logo" :image="theme.logo" />
      <span v-if="theme.siteTitle" v-html="theme.siteTitle"></span>
      <span v-else-if="theme.siteTitle === undefined">{{ site.title }}</span>
      <slot name="nav-bar-title-after" />
    </a>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  width: 100%;
  height: var(--wotaku-nav-height);
  font-size: 16px;
  font-weight: 600;
  color: var(--wotaku-c-text-1);
  transition: opacity 0.25s;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .WotakuNavBarTitle.has-sidebar .title {
    border-bottom-color: var(--wotaku-c-divider);
  }
}

:deep(.logo) {
  margin-right: 8px;
  height: var(--wotaku-nav-logo-height);
}
</style>

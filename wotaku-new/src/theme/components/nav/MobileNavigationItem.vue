<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useData } from '@/theme/shared/client'
import type * as DefaultTheme from '@/shared/types/default-theme'
import { ChevronDown } from 'lucide-vue-next'
import { computed } from 'vue'
import { isActive } from '../../../shared/client'
import { hasActiveLink } from '../../shared/base/sidebar'
import WotakuDocOutlineItem from '../doc/WotakuDocOutlineItem.vue'
import WotakuLink from '../link/WotakuLink.vue'

const props = defineProps<{
  item: DefaultTheme.SidebarItem
  headers: DefaultTheme.OutlineItem[]
}>()
const { page } = useData()
const active = computed(() => isActive(page.value.relativePath, props.item.link))
const expanded = computed(
  () =>
    props.item.collapsed !== true || hasActiveLink(page.value.relativePath, props.item)
)
</script>

<template>
  <li class="mobile-navigation-item">
    <details v-if="item.items?.length" :open="expanded">
      <summary class="mobile-navigation-group">
        <WotakuLink
          v-if="item.link"
          :href="item.link"
          :target="item.target"
          :rel="item.rel"
          :aria-current="active ? 'page' : undefined"
          ><span v-html="item.text"
        /></WotakuLink>
        <span v-else v-html="item.text" />
        <ChevronDown :size="16" :stroke-width="1.5" class="mobile-navigation-caret" />
      </summary>
      <nav
        v-if="active && headers.length"
        aria-label="On this page"
        class="mobile-navigation-toc"
      >
        <WotakuDocOutlineItem :headers="headers" root />
      </nav>
      <ul>
        <MobileNavigationItem
          v-for="child in item.items"
          :key="child.link ?? child.text"
          :item="child"
          :headers="headers"
        />
      </ul>
    </details>
    <template v-else>
      <WotakuLink
        :href="item.link"
        :target="item.target"
        :rel="item.rel"
        class="mobile-navigation-link"
        :aria-current="active ? 'page' : undefined"
        ><span v-html="item.text"
      /></WotakuLink>
      <nav
        v-if="active && headers.length"
        aria-label="On this page"
        class="mobile-navigation-toc"
      >
        <WotakuDocOutlineItem :headers="headers" root />
      </nav>
    </template>
  </li>
</template>

<style scoped>
.mobile-navigation-group,
.mobile-navigation-link {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--wotaku-c-text-2);
  cursor: pointer;
}
.mobile-navigation-group {
  color: var(--wotaku-c-text-1);
  font-weight: 500;
  list-style: none;
}
.mobile-navigation-group::-webkit-details-marker {
  display: none;
}
.mobile-navigation-group > :first-child {
  flex: 1;
  min-width: 0;
}
@media (hover: hover) {
  .mobile-navigation-group:hover,
  .mobile-navigation-link:hover {
    background: var(--wotaku-c-default-soft);
  }
}
.mobile-navigation-link[aria-current],
.mobile-navigation-group a[aria-current] {
  color: var(--wotaku-c-text-1);
  font-weight: 600;
}
.mobile-navigation-link[aria-current] {
  background: var(--wotaku-c-bg);
}
.mobile-navigation-caret {
  flex: none;
  transform: rotate(-90deg);
}
details[open] > summary .mobile-navigation-caret {
  transform: none;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
ul ul {
  padding-inline-start: 12px;
}
.mobile-navigation-toc {
  margin-block: 8px;
  margin-inline: 8px 8px;
  border-inline-start: 1px solid var(--wotaku-c-divider);
  padding-inline-start: 16px;
}
.mobile-navigation-toc :deep(.outline-link) {
  min-height: 44px;
  display: flex;
  align-items: center;
  white-space: normal;
  line-height: 1.4;
  padding-block: 4px;
  color: var(--wotaku-c-text-2);
}
.mobile-navigation-toc :deep(.nested) {
  padding-inline: 12px 0;
}
.mobile-navigation-toc :deep(.toc-bookmark-btn) {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.mobile-navigation-item :deep(a:focus-visible),
summary:focus-visible {
  outline: 2px solid var(--wotaku-c-text-1);
  outline-offset: -2px;
}
</style>

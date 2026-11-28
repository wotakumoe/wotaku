<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import type * as DefaultTheme from '@/shared/types/default-theme'
import { computed } from 'vue'
import { useSidebarItemControl } from '../../composables/sidebar'
import WotakuLink from '../link/WotakuLink.vue'

const props = defineProps<{
  item: DefaultTheme.SidebarItem
  depth: number
}>()

const {
  collapsed,
  collapsible,
  isLink,
  isActiveLink,
  hasActiveLink,
  hasChildren,
  toggle
} = useSidebarItemControl(computed(() => props.item))

const sectionTag = computed(() => (hasChildren.value ? 'section' : `div`))

const linkTag = computed(() => (isLink.value ? 'a' : 'div'))

const textTag = computed(() => {
  return !hasChildren.value ? 'p' : props.depth + 2 === 7 ? 'p' : `h${props.depth + 2}`
})

const itemRole = computed(() => (isLink.value ? undefined : 'button'))

const classes = computed(() => [
  [`level-${props.depth}`],
  { collapsible: collapsible.value },
  { collapsed: collapsed.value },
  { 'is-link': isLink.value },
  { 'is-active': isActiveLink.value },
  { 'has-active': hasActiveLink.value }
])

function onItemInteraction(e: MouseEvent | Event) {
  if ('key' in e && e.key !== 'Enter') {
    return
  }

  if (!props.item.link) toggle()
}

function onCaretClick() {
  if (props.item.link) toggle()
}
</script>

<template>
  <component :is="sectionTag" class="WotakuSidebarItem" :class="classes">
    <div
      v-if="item.text"
      class="item"
      :role="itemRole"
      v-on="item.items ? { click: onItemInteraction, keydown: onItemInteraction } : {}"
      :tabindex="item.items && 0"
    >
      <div class="indicator" />

      <WotakuLink
        v-if="item.link"
        :tag="linkTag"
        class="link"
        :href="item.link"
        :rel="item.rel"
        :target="item.target"
      >
        <component :is="textTag" class="text" v-html="item.text" />
      </WotakuLink>
      <component v-else :is="textTag" class="text" v-html="item.text" />

      <div
        v-if="item.collapsed != null && item.items && item.items.length"
        class="caret"
        role="button"
        aria-label="toggle section"
        @click="onCaretClick"
        @keydown.enter="onCaretClick"
        tabindex="0"
      >
        <span class="wotaku-icon-chevron-right caret-icon" />
      </div>
    </div>

    <div v-if="item.items && item.items.length" class="items">
      <template v-if="depth < 5">
        <WotakuSidebarItem
          v-for="i in item.items"
          :key="i.text"
          :item="i"
          :depth="depth + 1"
        />
      </template>
    </div>
  </component>
</template>

<style scoped>
.WotakuSidebarItem.level-0 {
  padding-bottom: 24px;
}

.WotakuSidebarItem.collapsed.level-0 {
  padding-bottom: 10px;
}

.item {
  position: relative;
  display: flex;
  width: 100%;
}

.WotakuSidebarItem.collapsible > .item {
  cursor: pointer;
}

.indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: -17px;
  width: 2px;
  border-radius: 2px;
  transition: background-color 0.25s;
}

.WotakuSidebarItem.level-2.is-active > .item > .indicator,
.WotakuSidebarItem.level-3.is-active > .item > .indicator,
.WotakuSidebarItem.level-4.is-active > .item > .indicator,
.WotakuSidebarItem.level-5.is-active > .item > .indicator {
  background-color: var(--wotaku-c-brand-1);
}

.link {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.text {
  flex-grow: 1;
  padding: 4px 0;
  line-height: 24px;
  font-size: 14px;
  transition: color 0.25s;
}

.WotakuSidebarItem.level-0 .text {
  font-weight: 700;
  color: var(--wotaku-c-text-1);
}

.WotakuSidebarItem.level-1 .text,
.WotakuSidebarItem.level-2 .text,
.WotakuSidebarItem.level-3 .text,
.WotakuSidebarItem.level-4 .text,
.WotakuSidebarItem.level-5 .text {
  font-weight: 500;
  color: var(--wotaku-c-text-2);
}

.WotakuSidebarItem.level-0.is-link > .item > .link:hover .text,
.WotakuSidebarItem.level-1.is-link > .item > .link:hover .text,
.WotakuSidebarItem.level-2.is-link > .item > .link:hover .text,
.WotakuSidebarItem.level-3.is-link > .item > .link:hover .text,
.WotakuSidebarItem.level-4.is-link > .item > .link:hover .text,
.WotakuSidebarItem.level-5.is-link > .item > .link:hover .text {
  color: var(--wotaku-c-brand-1);
}

.WotakuSidebarItem.level-0.has-active > .item > .text,
.WotakuSidebarItem.level-1.has-active > .item > .text,
.WotakuSidebarItem.level-2.has-active > .item > .text,
.WotakuSidebarItem.level-3.has-active > .item > .text,
.WotakuSidebarItem.level-4.has-active > .item > .text,
.WotakuSidebarItem.level-5.has-active > .item > .text,
.WotakuSidebarItem.level-0.has-active > .item > .link > .text,
.WotakuSidebarItem.level-1.has-active > .item > .link > .text,
.WotakuSidebarItem.level-2.has-active > .item > .link > .text,
.WotakuSidebarItem.level-3.has-active > .item > .link > .text,
.WotakuSidebarItem.level-4.has-active > .item > .link > .text,
.WotakuSidebarItem.level-5.has-active > .item > .link > .text {
  color: var(--wotaku-c-text-1);
}

.WotakuSidebarItem.level-0.is-active > .item .link > .text,
.WotakuSidebarItem.level-1.is-active > .item .link > .text,
.WotakuSidebarItem.level-2.is-active > .item .link > .text,
.WotakuSidebarItem.level-3.is-active > .item .link > .text,
.WotakuSidebarItem.level-4.is-active > .item .link > .text,
.WotakuSidebarItem.level-5.is-active > .item .link > .text {
  color: var(--wotaku-c-brand-1);
}

.caret {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -7px;
  width: 32px;
  height: 32px;
  color: var(--wotaku-c-text-3);
  cursor: pointer;
  transition: color 0.25s;
  flex-shrink: 0;
}

.item:hover .caret {
  color: var(--wotaku-c-text-2);
}

.item:hover .caret:hover {
  color: var(--wotaku-c-text-1);
}

.caret-icon {
  font-size: 18px;
  /*rtl:ignore*/
  transform: rotate(90deg);
  transition: transform 0.25s;
}

.WotakuSidebarItem.collapsed .caret-icon {
  transform: rotate(0) /*rtl:rotate(180deg)*/;
}

.WotakuSidebarItem.level-1 .items,
.WotakuSidebarItem.level-2 .items,
.WotakuSidebarItem.level-3 .items,
.WotakuSidebarItem.level-4 .items,
.WotakuSidebarItem.level-5 .items {
  border-left: 1px solid var(--wotaku-c-divider);
  padding-left: 16px;
}

.WotakuSidebarItem.collapsed .items {
  display: none;
}
</style>

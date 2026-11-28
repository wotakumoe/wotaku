<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { onClickOutside, onKeyStroke, useWindowScroll } from '@vueuse/core'
import { getScrollOffset, onContentUpdated } from '@/theme/shared/client'
import type * as DefaultTheme from '@/shared/types/default-theme'
import { ref, watch } from 'vue'
import { useData } from '../../composables/base/data'
import { resolveTitle } from '../../composables/base/outline'
import WotakuDocOutlineItem from '../doc/WotakuDocOutlineItem.vue'

const props = defineProps<{ headers: DefaultTheme.OutlineItem[] }>()
const { theme } = useData()
const { y } = useWindowScroll()
const open = ref(false)
const main = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()

onClickOutside(main, () => {
  open.value = false
})
onKeyStroke('Escape', (event) => {
  if (!open.value) return

  event.preventDefault()
  open.value = false
  trigger.value?.focus()
})
onContentUpdated(() => {
  open.value = false
})

function scrollToTop() {
  open.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Restore the classic dropdown's reading-position highlight, only while mounted.
watch(
  [open, y, () => props.headers],
  () => {
    if (!open.value) return

    const links = [
      ...(main.value?.querySelectorAll<HTMLAnchorElement>('.outline-link') ?? [])
    ]
    const entries = links
      .map((link) => ({
        link,
        heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
      }))
      .filter((entry) => entry.heading)
    let active: HTMLAnchorElement | undefined

    if (y.value > 0) {
      if (y.value + innerHeight >= document.documentElement.scrollHeight - 4) {
        active = entries.at(-1)?.link
      } else {
        for (const { link, heading } of entries) {
          if (heading!.getBoundingClientRect().top > getScrollOffset() + 4) break

          active = link
        }
      }
    }

    links.forEach((link) => link.classList.toggle('active', link === active))
  },
  { flush: 'post' }
)
</script>

<template>
  <div ref="main" class="WotakuLocalNavOutlineDropdown">
    <button
      v-if="headers.length"
      ref="trigger"
      type="button"
      :aria-expanded="open"
      aria-controls="classic-page-outline"
      @click="open = !open"
    >
      {{ resolveTitle(theme) }}
      <span class="wotaku-icon-chevron-right icon" :class="{ open }" aria-hidden="true" />
    </button>
    <button v-else type="button" @click="scrollToTop">
      {{ theme.returnToTopLabel || 'Return to top' }}
    </button>
    <nav
      v-if="open"
      id="classic-page-outline"
      class="items"
      :aria-label="resolveTitle(theme)"
      @click="
        (event) => {
          if ((event.target as Element).closest('a')) open = false
        }
      "
    >
      <a class="top-link" href="#" @click.prevent="scrollToTop">{{
        theme.returnToTopLabel || 'Return to top'
      }}</a>
      <WotakuDocOutlineItem :headers root />
    </nav>
  </div>
</template>

<style scoped>
.WotakuLocalNavOutlineDropdown {
  margin-inline-start: auto;
  pointer-events: auto;
}
button {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 4px 12px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 12px;
  background: var(--wk-c-menu-bg);
  color: var(--wotaku-c-text-2);
  font-size: 0.75rem;
  line-height: 1.4;
  font-weight: 500;
}
.icon.open {
  transform: rotate(90deg);
}
.items {
  position: absolute;
  top: 40px;
  inset-inline-end: 16px;
  width: 320px;
  max-width: calc(100vw - 32px);
  max-height: calc(100dvh - 140px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 16px;
  background: var(--wk-c-menu-bg);
  box-shadow: var(--wotaku-shadow-3);
}
.top-link,
.items :deep(.outline-link) {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 12px;
  line-height: 1.4;
  white-space: normal;
  border-radius: 12px;
}
.items :deep(.outline-link.active) {
  color: var(--wotaku-c-brand-1);
  background: var(--wotaku-c-brand-nav-active);
  font-weight: 600;
}
.items :deep(.toc-bookmark-btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  margin-inline-start: auto;
  border-radius: 50%;
}
button:focus-visible,
a:focus-visible,
.items :deep(:focus-visible) {
  outline: 2px solid var(--wotaku-c-text-1);
  outline-offset: -2px;
}
</style>

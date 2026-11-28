<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const open = ref(false)
const el = ref<HTMLElement>()
const button = ref<HTMLElement>()
const menu = ref<HTMLElement>()
const menuStyle = ref<Record<string, string>>({})

function toggle() {
  open.value = !open.value

  if (open.value) void nextTick(updateMenuPosition)
}

function updateMenuPosition() {
  if (!el.value || !button.value || !menu.value) return

  const viewportMargin = 12
  const elRect = el.value.getBoundingClientRect()
  const buttonRect = button.value.getBoundingClientRect()
  const menuWidth = menu.value.offsetWidth
  const centeredLeft = buttonRect.left + buttonRect.width / 2 - menuWidth / 2
  const maxLeft = Math.max(viewportMargin, window.innerWidth - viewportMargin - menuWidth)
  const viewportLeft = Math.min(Math.max(centeredLeft, viewportMargin), maxLeft)

  menuStyle.value = {
    '--settings-menu-left': `${viewportLeft - elRect.left}px`,
    '--settings-menu-shift': '0px'
  }
}

function onDocClick(e: MouseEvent) {
  if (el.value && !el.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onResize() {
  if (open.value) updateMenuPosition()
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div ref="el" class="WotakuFlyout">
    <button
      ref="button"
      type="button"
      class="button"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-label="Settings"
      @click="toggle"
    >
      <span class="text">
        <span class="i-lucide:settings option-icon" />
      </span>
    </button>

    <div v-show="open" ref="menu" class="menu" :style="menuStyle">
      <div class="WotakuMenu">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.WotakuFlyout {
  position: relative;
}

.button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: var(--wotaku-nav-height);
  color: var(--wotaku-c-text-1);
  transition: color 0.5s;
}

.text {
  display: flex;
  align-items: center;
  line-height: var(--wotaku-nav-height);
}

.option-icon {
  font-size: 16px;
}

.menu {
  position: absolute;
  top: calc(var(--wotaku-nav-height) / 2 + 20px);
  left: var(--settings-menu-left, 50%);
  z-index: 100;
  max-width: calc(100vw - 24px);
  transform: translateX(var(--settings-menu-shift, -50%));
  transform-origin: top center;
}

.WotakuMenu {
  border-radius: 12px;
  padding: 12px;
  width: 300px;
  max-width: 100%;
  border: 1px solid var(--wotaku-c-divider);
  background-color: var(--wotaku-c-bg-elv);
  box-shadow: var(--wotaku-shadow-3);
  transition: background-color 0.5s;
  max-height: calc(100vh - var(--wotaku-nav-height));
  overflow-y: auto;
}
</style>

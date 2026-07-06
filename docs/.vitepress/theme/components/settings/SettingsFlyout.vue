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
  const maxLeft = Math.max(
    viewportMargin,
    window.innerWidth - viewportMargin - menuWidth
  )
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
  <div ref="el" class="VPFlyout">
    <button
      ref="button"
      type="button"
      class="button"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-label="Enhanced Readability"
      @click="toggle"
    >
      <span class="text">
        <span class="i-lucide:settings option-icon" />
      </span>
    </button>

    <div v-show="open" ref="menu" class="menu" :style="menuStyle">
      <div class="VPMenu">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPFlyout {
  position: relative;
}

.button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.5s;
}

.text {
  display: flex;
  align-items: center;
  line-height: var(--vp-nav-height);
}

.option-icon {
  font-size: 16px;
}

.menu {
  position: absolute;
  top: calc(var(--vp-nav-height) / 2 + 20px);
  left: var(--settings-menu-left, 50%);
  z-index: 100;
  max-width: calc(100vw - 24px);
  transform: translateX(var(--settings-menu-shift, -50%));
  transform-origin: top center;
}

.VPMenu {
  border-radius: 12px;
  padding: 12px;
  min-width: 128px;
  max-width: 100%;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  max-height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
}
</style>

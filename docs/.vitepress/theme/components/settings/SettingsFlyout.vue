<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const open = ref(false)
const el = ref<HTMLElement>()

function toggle() {
  open.value = !open.value
}

function onDocClick(e: MouseEvent) {
  if (el.value && !el.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="el" class="VPFlyout">
    <button
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

    <div v-show="open" class="menu">
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
  right: 0;
  z-index: 100;
}

.VPMenu {
  border-radius: 12px;
  padding: 12px;
  min-width: 128px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
  max-height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
}
</style>

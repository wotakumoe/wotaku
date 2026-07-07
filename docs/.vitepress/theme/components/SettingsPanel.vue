<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { settingsOpen } from '../settingsState'
import { NolebaseEnhancedReadabilitiesScreenMenu } from './settings'
</script>

<template>
  <Teleport to="body">
    <Transition name="settings-panel">
      <div
        v-if="settingsOpen"
        class="settings-panel"
        role="dialog"
        aria-label="Settings"
      >
        <div class="settings-header">
          <button
            type="button"
            class="settings-back"
            aria-label="Back"
            @click="settingsOpen = false"
          >
            <ArrowLeft :size="18" :stroke-width="2" />
          </button>
          <span class="settings-title">Settings</span>
        </div>
        <div class="settings-body">
          <NolebaseEnhancedReadabilitiesScreenMenu />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.settings-panel {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg);
}

.settings-header {
  display: flex;
  align-items: center;
  height: 49px;
  flex-shrink: 0;
  padding: 6px 8px;
  border-bottom: 1px solid var(--wk-fs-header-divider);
}

.settings-back {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: color 0.15s;
}

.settings-back:hover {
  color: var(--vp-c-brand-1);
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.settings-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px;
}

/* Centered column, matching the old nav-screen settings layout (288px). */
.settings-body :deep(.VPNolebaseEnhancedReadabilitiesMenu) {
  max-width: 288px;
  margin-inline: auto;
}

/* Only ever opened from the phone gear; never show on desktop. */
@media (min-width: 768px) {
  .settings-panel {
    display: none;
  }
}

.settings-panel-enter-active,
.settings-panel-leave-active {
  transition: opacity 0.2s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.settings-panel-enter-from,
.settings-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

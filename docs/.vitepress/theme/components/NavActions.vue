<script setup lang="ts">
import { Moon, Search, Settings, Sun } from 'lucide-vue-next'
import { useData } from 'vitepress'
// @ts-ignore
import VPSocialLink from 'vitepress/dist/client/theme-default/components/VPSocialLink.vue'
import { inject } from 'vue'

import { navActions } from '../navActions'
import { openSearch } from '../searchState'
import NolebaseEnhancedReadabilitiesMenu from './settings/Menu.vue'
import BookmarksPanel from './BookmarksPanel.vue'

const ICON_SIZE = 18
const ICON_STROKE = 2

const { isDark } = useData()
const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})

// Opens the full-screen nav menu (the flyout's phone equivalent).
function openScreenMenu() {
  document.querySelector<HTMLElement>('.VPNavBarHamburger')?.click()
}
</script>

<template>
  <div class="nav-actions-container">
  <div class="nav-actions" role="group" aria-label="Site actions">
    <template v-for="(action, i) in navActions" :key="i">
      <div class="nav-action" :class="`nav-action--${action.type}`">
        <button
          v-if="action.type === 'search'"
          type="button"
          class="nav-action-btn"
          aria-label="Search"
          aria-keyshortcuts="/ control+k meta+k"
          @click="openSearch()"
        >
          <Search :size="ICON_SIZE" :stroke-width="ICON_STROKE" />
        </button>

        <button
          v-else-if="action.type === 'appearance'"
          type="button"
          class="nav-action-btn"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleAppearance()"
        >
          <Moon :size="ICON_SIZE" :stroke-width="ICON_STROKE" class="nav-appearance-moon" />
          <Sun :size="ICON_SIZE" :stroke-width="ICON_STROKE" class="nav-appearance-sun" />
        </button>

        <VPSocialLink
          v-else-if="action.type === 'link'"
          :icon="action.icon"
          :link="action.link"
          :aria-label="action.label"
          :me="false"
        />

        <template v-else-if="action.type === 'settings'">
          <NolebaseEnhancedReadabilitiesMenu />
          <button
            type="button"
            class="nav-action-btn nav-settings-mobile"
            aria-label="Settings"
            @click="openScreenMenu()"
          >
            <Settings :size="ICON_SIZE" :stroke-width="ICON_STROKE" />
          </button>
        </template>
        <BookmarksPanel v-else-if="action.type === 'bookmarks'" />
      </div>
    </template>
  </div>
  </div>
</template>

<style scoped>
.nav-actions-container {
  display: flex;
  align-items: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--nav-pill-gap);
  height: var(--nav-pill-height);
  padding: 0 var(--nav-pill-pad);
  border-radius: var(--nav-pill-radius);
  background: var(--nav-pill-bg);
  border: 1px solid var(--nav-pill-border);
  backdrop-filter: blur(var(--nav-pill-blur));
  -webkit-backdrop-filter: blur(var(--nav-pill-blur));
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-action {
  flex: none;
  width: var(--nav-pill-item-size);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Social links move to the full-screen menu on phones. */
.nav-action--link {
  display: none;
}

@media (min-width: 768px) {
  .nav-action--link {
    display: flex;
  }
}

/* Doubled class outranks the later `.nav-action-btn { display: flex }`. */
@media (min-width: 768px) {
  .nav-action-btn.nav-settings-mobile {
    display: none;
  }
}

.nav-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-action-btn:hover { opacity: 1; }
.nav-action-btn:active { transform: scale(0.94); }

.nav-actions :deep(.VPSocialLink) {
  width: 100% !important;
  height: 100% !important;
  color: var(--vp-c-text-1) !important;
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.nav-actions :deep(.VPSocialLink:hover) {
  color: var(--vp-c-text-1) !important;
  opacity: 1;
}
.nav-actions :deep(.VPSocialLink:active) { transform: scale(0.94); }
.nav-actions :deep(.VPSocialLink > span) {
  width: var(--nav-pill-icon-size) !important;
  height: var(--nav-pill-icon-size) !important;
}

.nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout) {
  display: flex !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Phones use the full-screen gear instead of the flyout. */
@media (max-width: 767.9px) {
  .nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout) {
    display: none !important;
  }
}

.nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout .button) {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout:hover .button) {
  opacity: 1;
}
.nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout .button:active) {
  transform: scale(0.94);
}

.nav-action--settings :deep(.VPNolebaseEnhancedReadabilitiesMenuFlyout .text) {
  color: var(--vp-c-text-1) !important;
}

.nav-action--settings :deep(.option-icon) {
  width: var(--nav-pill-icon-size);
  height: var(--nav-pill-icon-size);
}

.nav-action--settings :deep(.vpi-chevron-down) { display: none; }

</style>

<style>
html.dark .nav-appearance-sun { display: none; }
html:not(.dark) .nav-appearance-moon { display: none; }
</style>

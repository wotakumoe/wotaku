<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { Moon, Search, Settings, Sun } from 'lucide-vue-next'
import { useData } from '@/theme/shared/client'
// @ts-ignore
import WotakuSocialLink from '../social/WotakuSocialLink.vue'
import { inject } from 'vue'

import { navActions } from '../../shared/nav-actions'
import { openSearch } from '../../shared/search-state'
import { openSettings } from '../../shared/settings-state'
import SettingsMenu from '../settings/SettingsMenu.vue'
import BookmarksPanel from '../bookmarks/BookmarksPanel.vue'
import AnnouncementsPanel from '../announcement/AnnouncementsPanel.vue'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'

const ICON_SIZE = 18
const ICON_STROKE = 2

const { mobile, island } = useMobileNavigation()
const { isDark } = useData()
const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})
</script>

<template>
  <Teleport to="#mobile-island-actions" :disabled="!island" defer>
    <div class="nav-actions-container">
      <div class="nav-actions" role="group" aria-label="Site actions">
        <template v-for="(action, i) in navActions" :key="i">
          <div
            v-if="
              (action.type !== 'appearance' || !mobile) &&
              (action.type !== 'settings' || !island)
            "
            class="nav-action"
            :class="`nav-action--${action.type}`"
          >
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
              <Moon
                :size="ICON_SIZE"
                :stroke-width="ICON_STROKE"
                class="nav-appearance-moon"
              />
              <Sun
                :size="ICON_SIZE"
                :stroke-width="ICON_STROKE"
                class="nav-appearance-sun"
              />
            </button>

            <WotakuSocialLink
              v-else-if="action.type === 'link'"
              :icon="action.icon"
              :link="action.link"
              :aria-label="action.label"
              :me="false"
            />

            <template v-else-if="action.type === 'settings'">
              <SettingsMenu />
              <button
                type="button"
                class="nav-action-btn nav-settings-mobile"
                aria-label="Settings"
                @click="openSettings()"
              >
                <Settings :size="ICON_SIZE" :stroke-width="ICON_STROKE" />
              </button>
            </template>
            <BookmarksPanel v-else-if="action.type === 'bookmarks'" />
            <AnnouncementsPanel v-else-if="action.type === 'announcement'" />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
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

/* collapse the slot when announcements are disabled */
.nav-action--announcement:empty {
  display: none;
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
  color: var(--wotaku-c-text-1);
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-action-btn:hover {
  opacity: 1;
}
.nav-action-btn:active {
  transform: scale(0.94);
}

.nav-actions :deep(.WotakuSocialLink) {
  width: 100% !important;
  height: 100% !important;
  color: var(--wotaku-c-text-1) !important;
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.nav-actions :deep(.WotakuSocialLink:hover) {
  color: var(--wotaku-c-text-1) !important;
  opacity: 1;
}
.nav-actions :deep(.WotakuSocialLink:active) {
  transform: scale(0.94);
}
.nav-actions :deep(.WotakuSocialLink > span) {
  width: var(--nav-pill-icon-size) !important;
  height: var(--nav-pill-icon-size) !important;
}

.nav-action--settings :deep(.settings-menu-flyout) {
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
  .nav-action--settings :deep(.settings-menu-flyout) {
    display: none !important;
  }
}

.nav-action--settings :deep(.settings-menu-flyout .button) {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  color: var(--wotaku-c-text-1);
  opacity: 0.55;
  transition:
    opacity 0.25s,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.nav-action--settings :deep(.settings-menu-flyout:hover .button) {
  opacity: 1;
}
.nav-action--settings :deep(.settings-menu-flyout .button:active) {
  transform: scale(0.94);
}

.nav-action--settings :deep(.settings-menu-flyout .text) {
  color: var(--wotaku-c-text-1) !important;
}

.nav-action--settings :deep(.option-icon) {
  width: var(--nav-pill-icon-size);
  height: var(--nav-pill-icon-size);
}

.nav-action--settings :deep(.wotaku-icon-chevron-down) {
  display: none;
}
</style>

<style>
html.dark .nav-appearance-sun {
  display: none;
}
html:not(.dark) .nav-appearance-moon {
  display: none;
}
</style>

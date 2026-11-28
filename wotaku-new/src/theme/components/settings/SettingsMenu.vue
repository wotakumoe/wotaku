<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useMounted } from '@vueuse/core'

import AccentBackground from './SettingsAccentBackground.vue'
import AccentColor from './SettingsAccentColor.vue'
import Announcements from './SettingsAnnouncements.vue'
import Effects from './SettingsEffects.vue'
import Favicons from './SettingsFavicons.vue'
import SettingsFlyout from './SettingsFlyout.vue'

const mounted = useMounted()
</script>

<template>
  <SettingsFlyout class="settings-menu settings-menu-flyout">
    <div v-if="mounted" aria-label="Settings" class="min-w-64 p-2 space-y-2">
      <AccentColor />
      <AccentBackground />
      <Effects />
      <Favicons />
      <Announcements />
    </div>
  </SettingsFlyout>
</template>

<style>
.settings-menu-flyout {
  display: none;
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 768px) {
  .settings-menu-flyout {
    display: flex;
    align-items: center;
  }
}
</style>

<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useData } from '@/theme/shared/client'
import WotakuSocialLinks from '../social/WotakuSocialLinks.vue'

import Appearance from './SettingsAppearance.vue'
import AccentBackground from './SettingsAccentBackground.vue'
import AccentColor from './SettingsAccentColor.vue'
import Announcements from './SettingsAnnouncements.vue'
import Effects from './SettingsEffects.vue'
import Favicons from './SettingsFavicons.vue'
import MobileNavigationPreferences from './SettingsMobileNavigation.vue'

const mounted = useMounted()
const { theme } = useData()
</script>

<template>
  <div v-if="mounted" space-y-2 class="settings-menu">
    <Appearance />
    <AccentColor />
    <AccentBackground />
    <Effects />
    <Favicons />
    <Announcements />
    <MobileNavigationPreferences />
    <WotakuSocialLinks
      v-if="theme.socialLinks"
      :links="theme.socialLinks"
      class="screen-menu-social-links"
    />
  </div>
</template>

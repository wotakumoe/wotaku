<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useData } from 'vitepress'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'

import AccentBackground from './AccentBackground.vue'
import AccentColor from './AccentColor.vue'
import Effects from './Effects.vue'

const mounted = useMounted()
const { theme } = useData()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <Effects />
    <AccentColor />
    <AccentBackground />
    <VPSocialLinks
      v-if="theme.socialLinks"
      :links="theme.socialLinks"
      class="screen-menu-social-links"
    />
  </div>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(--wk-c-menu-bg);
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(--wk-c-menu-bg);
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}
</style>

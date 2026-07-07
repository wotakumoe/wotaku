<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useData } from 'vitepress'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'

import AccentColor from './AccentColor.vue'
import Effects from './Effects.vue'

const mounted = useMounted()
const { theme } = useData()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <Effects />
    <AccentColor />
    <VPSocialLinks
      v-if="theme.socialLinks"
      :links="theme.socialLinks"
      class="screen-menu-social-links"
    />
  </div>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: #e8e6ec;
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: #2c2c31;
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}
</style>

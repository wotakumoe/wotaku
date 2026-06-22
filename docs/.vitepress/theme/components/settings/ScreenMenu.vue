<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useData } from 'vitepress'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'

import AccentColor from './AccentColor.vue'
import BlurEffects from './BlurEffects.vue'
import ScreenAppearance from './ScreenAppearance.vue'

const mounted = useMounted()
const { theme } = useData()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <BlurEffects />
    <ScreenAppearance />
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
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --vp-c-bg-soft,
    #e8e8e8
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --vp-c-bg-soft,
    #2c2f35
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}
</style>

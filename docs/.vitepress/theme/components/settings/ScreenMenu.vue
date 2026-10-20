<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useData } from 'vitepress'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'

import { ensureNavItemsLoaded, isNavItemEnabled } from '../../navItemsState'
import AccentBackground from './AccentBackground.vue'
import AccentColor from './AccentColor.vue'
import Effects from './Effects.vue'
import Favicons from './Favicons.vue'
import NavItems from './NavItems.vue'
import RandomLinks from './RandomLinks.vue'

const mounted = useMounted()
const { theme } = useData()

ensureNavItemsLoaded()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <AccentColor />
    <AccentBackground />
    <Effects />
    <Favicons />
    <RandomLinks />
    <NavItems />
    <VPSocialLinks
      v-if="theme.socialLinks && isNavItemEnabled('social')"
      :links="theme.socialLinks"
      class="screen-menu-social-links"
    />
  </div>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --wk-c-menu-bg
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --wk-c-menu-bg
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}
</style>

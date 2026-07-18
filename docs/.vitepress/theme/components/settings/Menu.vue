<script setup lang="ts">
import { useMounted } from '@vueuse/core'

import AccentBackground from './AccentBackground.vue'
import AccentColor from './AccentColor.vue'
import Effects from './Effects.vue'
import Favicons from './Favicons.vue'
import SettingsFlyout from './SettingsFlyout.vue'

const mounted = useMounted()
</script>

<template>
  <SettingsFlyout
    class="VPNolebaseEnhancedReadabilitiesMenu VPNolebaseEnhancedReadabilitiesMenuFlyout"
  >
    <div
      v-if="mounted"
      aria-label="Enhanced Readability"
      class="min-w-64 p-2 space-y-2"
    >
      <AccentColor />
      <AccentBackground />
      <Effects />
      <Favicons />
    </div>
  </SettingsFlyout>
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

.VPNolebaseEnhancedReadabilitiesMenuFlyout {
  display: none;
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 768px) {
  .VPNolebaseEnhancedReadabilitiesMenuFlyout {
    display: flex;
    align-items: center;
  }
}
</style>

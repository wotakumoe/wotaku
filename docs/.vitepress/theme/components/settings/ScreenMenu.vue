<script setup lang="ts">
import { useMounted } from '@vueuse/core'

import MenuTitle from './MenuTitle.vue'
import ScreenLayoutSwitch from './ScreenLayoutSwitch.vue'
import ScreenSpotlight from './ScreenSpotlight.vue'

const mounted = useMounted()
</script>

<template>
  <div v-if="mounted" space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
    <MenuTitle title="Enhanced Readability" aria-label="Enhanced Readability">
      <template #icon>
        <span i-icon-park-outline:setting-two mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div flex="~ col" pl-4 space-y-2>
      <ScreenLayoutSwitch />
      <ScreenSpotlight />
    </div>
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

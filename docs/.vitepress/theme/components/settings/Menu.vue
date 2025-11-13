<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { inject } from 'vue'

import { InjectionKey, VPFlyout } from '../../constants'
import LayoutSwitch from './LayoutSwitch.vue'
import LayoutSwitchContentLayoutWidthInput from './LayoutSwitchContentLayoutMaxWidthSlider.vue'
import LayoutSwitchPageLayoutWidthInput from './LayoutSwitchPageLayoutMaxWidthSlider.vue'
import Spotlight from './Spotlight.vue'
import SpotlightStyles from './SpotlightStyles.vue'
import Takodachi from './Takodachi.vue'

const options = inject(InjectionKey, {})
const mounted = useMounted()
</script>

<template>
  <VPFlyout
    icon="i-icon-park-outline:setting-two"
    class="VPNolebaseEnhancedReadabilitiesMenu VPNolebaseEnhancedReadabilitiesMenuFlyout h-11 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-lg rounded-r-3xl"
    aria-label="Enhanced Readability"
    role="menuitem"
  >
    <div
      v-if="mounted"
      aria-label="Enhanced Readability"
      class="min-w-64 p-2 space-y-2"
    >
      <LayoutSwitch />
      <LayoutSwitchPageLayoutWidthInput />
      <LayoutSwitchContentLayoutWidthInput />
      <Spotlight v-if="!options.spotlight?.disabled" />
      <SpotlightStyles v-if="!options.spotlight?.disabled" />
      <Takodachi />
    </div>
  </VPFlyout>
</template>

<style>
.VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --vp-c-bg-alt,
    #e8e8e8
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.dark .VPNolebaseEnhancedReadabilitiesMenu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --vp-c-bg-alt,
    #2c2f35
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
}

.VPNolebaseEnhancedReadabilitiesMenuFlyout {
  display: none;
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.VPNolebaseEnhancedReadabilitiesMenuFlyout::before {
  --uno: "pr-1.5! pl-1.5!";
}

@media (min-width: 768px) {
  .VPNolebaseEnhancedReadabilitiesMenuFlyout {
    display: flex;
    align-items: center;
  }
}
</style>

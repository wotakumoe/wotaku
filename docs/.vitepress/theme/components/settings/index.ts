import type { Plugin } from 'vue'

import type { Options } from '../../types'

import BlurEffects from './BlurEffects.vue'
import LayoutSwitch from './LayoutSwitch.vue'
import LayoutSwitchContentLayoutMaxWidthSlider from './LayoutSwitchContentLayoutMaxWidthSlider.vue'
import LayoutSwitchPageLayoutMaxWidthSlider from './LayoutSwitchPageLayoutMaxWidthSlider.vue'
import NolebaseEnhancedReadabilitiesMenu from './Menu.vue'
import ScreenLayoutSwitch from './ScreenLayoutSwitch.vue'
import NolebaseEnhancedReadabilitiesScreenMenu from './ScreenMenu.vue'
import ScreenSpotlight from './ScreenSpotlight.vue'
import Spotlight from './Spotlight.vue'
import SpotlightStyles from './SpotlightStyles.vue'

import {
  InjectionKey,
  LayoutMode,
  LayoutSwitchModeStorageKey,
  LowEndDeviceModeStorageKey,
  SpotlightStyle,
  SpotlightToggledStorageKey
} from '../../constants'

export type { Options }

export {
  BlurEffects,
  InjectionKey,
  LayoutMode,
  LayoutSwitch,
  LayoutSwitchContentLayoutMaxWidthSlider,
  LayoutSwitchModeStorageKey,
  LayoutSwitchPageLayoutMaxWidthSlider,
  LowEndDeviceModeStorageKey,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  ScreenLayoutSwitch,
  ScreenSpotlight,
  Spotlight,
  SpotlightStyle,
  SpotlightStyles,
  SpotlightToggledStorageKey
}

const components = {
  NolebaseEnhancedReadabilitiesBlurEffects: BlurEffects,
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  NolebaseEnhancedReadabilitiesLayoutSwitch: LayoutSwitch,
  NolebaseEnhancedReadabilitiesScreenLayoutSwitch: ScreenLayoutSwitch,
  NolebaseEnhancedReadabilitiesSpotlight: Spotlight,
  NolebaseEnhancedReadabilitiesSpotlightStyles: SpotlightStyles,
  NolebaseEnhancedReadabilitiesScreenSpotlight: ScreenSpotlight
}

export const NolebaseEnhancedReadabilitiesPlugin: Plugin<Options[]> = {
  install(app, options?) {
    if (typeof options !== 'undefined' && typeof options === 'object') {
      app.provide(InjectionKey, options)
    }

    for (const key of Object.keys(components)) {
      app.component(key, components[key as keyof typeof components])
    }
  }
}

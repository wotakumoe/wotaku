import type { InjectionKey as VueInjectionKey } from 'vue'

import type { Options } from './types'
// @ts-ignore - VitePress doesn't have types for its internal components
import _VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
// @ts-ignore - VitePress doesn't have types for its internal components
import _VPLocalNavOutlineDropdown from 'vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue'
export const VPFlyout: any = _VPFlyout
export const VPLocalNavOutlineDropdown: any = _VPLocalNavOutlineDropdown

export const InjectionKey: VueInjectionKey<Options> = Symbol(
  'vitepress-nolebase-enhanced-readabilities'
)

export const LayoutSwitchModeStorageKey =
  'vitepress-nolebase-enhanced-readabilities-layout-switch-mode'
export const LayoutSwitchMaxWidthStrategyStorageKey =
  'vitepress-nolebase-enhanced-readabilities-layout-switch-max-width-strategy'
export const ContentLayoutMaxWidthStorageKey =
  'vitepress-nolebase-enhanced-readabilities-content-layout-max-width'
export const PageLayoutMaxWidthStorageKey =
  'vitepress-nolebase-enhanced-readabilities-page-layout-max-width'

export const SpotlightToggledStorageKey =
  'vitepress-nolebase-enhanced-readabilities-spotlight-mode'
export const SpotlightStylesStorageKey =
  'vitepress-nolebase-enhanced-readabilities-spotlight-styles'

export const EffectsStorageKey = 'preference-effects'
/** Legacy on/off key for the cursor companion; migrated to {@link PetStorageKey}. */
export const TakodachiStorageKey = 'preference-takodachi'
/** Whether the cursor pet companion is enabled. */
export const PetStorageKey = 'preference-pet'
/** Which pet character follows the cursor (see `pets.ts`). */
export const PetCharacterStorageKey = 'preference-pet-character'
export const AccentColorStorageKey = 'preference-accent-color'
export const AccentBgStorageKey = 'preference-accent-bg'
/** Accent background tint strength, 0–100. */
export const AccentBgStrengthStorageKey = 'preference-accent-bg-strength'

export enum LayoutMode {
  FullWidth = 1,
  Original = 3,
  SidebarWidthAdjustableOnly = 4,
  BothWidthAdjustable = 5
}

export const supportedLayoutModes = [
  LayoutMode.FullWidth,
  LayoutMode.Original,
  LayoutMode.SidebarWidthAdjustableOnly,
  LayoutMode.BothWidthAdjustable
]

export enum SpotlightStyle {
  Under = 1,
  Aside = 2
}

export const supportedSpotlightStyles = [
  SpotlightStyle.Under,
  SpotlightStyle.Aside
]

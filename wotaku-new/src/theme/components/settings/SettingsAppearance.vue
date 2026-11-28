<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useData } from '@/theme/shared/client'
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from 'reka-ui'
import { useId } from 'vue'

const { appearancePreference, site } = useData()
const groupName = useId()
const options = [
  {
    value: 'auto',
    label: 'System',
    description: 'Use your device’s light or dark theme.',
    icon: Monitor
  },
  { value: 'light', label: 'Light', description: 'Use the light theme.', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Use the dark theme.', icon: Moon }
] as const
</script>

<template>
  <fieldset
    v-if="
      site.appearance &&
      site.appearance !== 'force-dark' &&
      site.appearance !== 'force-auto'
    "
    class="settings-appearance"
  >
    <legend>Theme</legend>
    <div class="settings-appearance-options">
      <TooltipProvider :delay-duration="250">
        <label v-for="option in options" :key="option.value">
          <TooltipRoot>
            <TooltipTrigger as-child>
              <input
                v-model="appearancePreference"
                type="radio"
                :name="groupName"
                :value="option.value"
                :aria-label="option.label"
              />
            </TooltipTrigger>
            <component
              :is="option.icon"
              :size="18"
              :stroke-width="1.75"
              :class="{ selected: appearancePreference === option.value }"
              aria-hidden="true"
            />
            <TooltipPortal>
              <TooltipContent
                class="settings-appearance-tooltip"
                :side-offset="8"
                :collision-padding="12"
              >
                <strong>{{ option.label }}</strong>
                <p>{{ option.description }}</p>
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </label>
      </TooltipProvider>
    </div>
  </fieldset>
</template>

<style scoped>
.settings-appearance {
  display: grid;
  gap: 8px;
  min-width: 0;
  border: 0;
  padding: 0;
  margin: 0;
}
legend {
  margin-bottom: 8px;
  padding: 0;
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 600;
}
.settings-appearance-options {
  display: flex;
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
label {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  color: var(--wotaku-c-text-2);
  cursor: pointer;
}
label + label {
  border-inline-start: 1px solid var(--wotaku-c-divider);
}
input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
svg {
  pointer-events: none;
}
svg.selected {
  fill: currentColor;
}
label:has(input:checked) {
  background: var(--wotaku-c-default-soft);
  color: var(--wotaku-c-text-1);
}
label:has(input:focus-visible) {
  outline: 2px solid var(--wotaku-c-text-1);
  outline-offset: -2px;
}
.settings-appearance-tooltip {
  z-index: 10000;
  max-width: min(208px, calc(100vw - 24px));
  padding: 12px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 12px;
  background: var(--wotaku-c-bg-elv);
  color: var(--wotaku-c-text-1);
  box-shadow: var(--wotaku-shadow-3);
  font-size: 0.8125rem;
  line-height: 1.5;
}
.settings-appearance-tooltip p {
  margin: 0;
  color: var(--wotaku-c-text-2);
}
@media (hover: hover) {
  label:not(:has(input:checked)):hover {
    background: var(--wotaku-c-default-soft);
  }
}
</style>

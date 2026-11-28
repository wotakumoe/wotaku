<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import type { ManaTheme } from '../../../shared/theme-repos/types'
import type { Screen } from '../../shared/theme-repos/screens'
import ThemeScreen from './ThemeScreen.vue'

defineProps<{ theme: ManaTheme; screen: Screen }>()
defineEmits<{ prev: []; next: [] }>()
</script>

<template>
  <div class="theme-preview">
    <div class="theme-phone">
      <ThemeScreen :screen="screen" :theme="theme" />
      <button
        type="button"
        class="theme-arrow theme-arrow-prev"
        aria-label="Previous screen"
        @click="$emit('prev')"
      >
        <span class="i-lucide:chevron-left" />
      </button>
      <button
        type="button"
        class="theme-arrow theme-arrow-next"
        aria-label="Next screen"
        @click="$emit('next')"
      >
        <span class="i-lucide:chevron-right" />
      </button>
    </div>
    <div class="theme-caption">{{ screen.title }}</div>
  </div>
</template>

<style scoped>
.theme-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.theme-phone {
  position: relative;
  width: min(100%, var(--theme-phone-width, 250px));
}
.theme-arrow {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: var(--wotaku-c-text-2);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    color 0.2s,
    filter 0.2s;
}
.theme-arrow:hover {
  color: var(--wotaku-c-brand-1);
  filter: brightness(1.08);
}
.theme-arrow span {
  font-size: 20px;
}
.theme-arrow-prev {
  left: -33px;
}
.theme-arrow-next {
  right: -33px;
}
.theme-caption {
  font-size: 12px;
  color: var(--wotaku-c-text-3);
}
</style>

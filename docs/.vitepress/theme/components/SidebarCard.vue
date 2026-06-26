<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useStorage } from '@vueuse/core'
import { AccentColorStorageKey } from '../constants'

const { isDark } = useData()
const accentColor = useStorage(AccentColorStorageKey, 'ayanami')

const accentImageMap: Record<string, string> = {
  ayanami: 'rei',
  asuka: 'asuka',
  miku: 'miku',
  inanis: 'ina',
  watson: 'ame',
  baelz: 'bae',
  irys: 'irys',
  suisei: 'suisei',
}

const sidebarImage = computed(() => {
  if (accentColor.value === 'fubuki') {
    return isDark.value ? '/sidebar/fubuki.avif' : '/sidebar/kuro.avif'
  }
  const name = accentImageMap[accentColor.value] ?? 'rei'
  return `/sidebar/${name}.avif`
})
</script>

<template>
  <div class="mt-2 overflow-hidden rounded-xl border-2 border-solid border-[#3d3d3d] relative z-0 max-md:border-2 max-md:border-[#3d3d3d]">
    <img
      :src="sidebarImage"
      alt=""
      class="w-full h-full object-cover block"
      no-zoomable
    />
  </div>
</template>

<style scoped>
img {
  pointer-events: none;
}
</style>
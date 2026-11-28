<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import type * as DefaultTheme from '@/shared/types/default-theme'
import { withBase } from '@/theme/shared/client'

defineProps<{
  image: DefaultTheme.ThemeableImage
  alt?: string
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <template v-if="image">
    <img
      v-if="typeof image === 'string' || 'src' in image"
      class="WotakuImage"
      v-bind="typeof image === 'string' ? $attrs : { ...image, ...$attrs }"
      :src="withBase(typeof image === 'string' ? image : image.src)"
      :alt="alt ?? (typeof image === 'string' ? '' : image.alt || '')"
    />
    <template v-else>
      <WotakuImage class="dark" :image="image.dark" :alt="image.alt" v-bind="$attrs" />
      <WotakuImage class="light" :image="image.light" :alt="image.alt" v-bind="$attrs" />
    </template>
  </template>
</template>

<style scoped>
html:not(.dark) .WotakuImage.dark {
  display: none;
}
.dark .WotakuImage.light {
  display: none;
}
</style>

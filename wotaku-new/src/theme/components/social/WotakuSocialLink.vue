<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import type * as DefaultTheme from '@/shared/types/default-theme'
import { computed, nextTick, onMounted, ref, useSSRContext } from 'vue'
import type { SSGContext } from '../../../shared/client'

const props = defineProps<{
  icon: DefaultTheme.SocialLinkIcon
  link: string
  ariaLabel?: string
  me: boolean
}>()

const el = ref<HTMLAnchorElement>()

onMounted(async () => {
  await nextTick()
  const span = el.value?.children[0]

  if (
    span instanceof HTMLElement &&
    span.className.startsWith('wotaku-icon-social-') &&
    (getComputedStyle(span).maskImage || getComputedStyle(span).webkitMaskImage) ===
      'none'
  ) {
    span.style.setProperty(
      '--icon',
      `url('https://api.iconify.design/simple-icons/${props.icon}.svg')`
    )
  }
})

const svg = computed(() => {
  if (typeof props.icon === 'object') return props.icon.svg

  return `<span class="wotaku-icon-social-${props.icon}"></span>`
})

if (import.meta.env.SSR && typeof props.icon === 'string') {
  useSSRContext<SSGContext>()?.wotakuSocialIcons.add(props.icon)
}
</script>

<template>
  <a
    ref="el"
    class="WotakuSocialLink no-icon"
    :href="link"
    :aria-label="ariaLabel ?? (typeof icon === 'string' ? icon : '')"
    target="_blank"
    :rel="me ? 'me noopener' : 'noopener'"
    v-html="svg"
  ></a>
</template>

<style scoped>
.WotakuSocialLink {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: var(--wotaku-c-text-2);
  transition: color 0.5s;
}

.WotakuSocialLink:hover {
  color: var(--wotaku-c-text-1);
  transition: color 0.25s;
}

.WotakuSocialLink > :deep(svg),
.WotakuSocialLink > :deep([class^='wotaku-icon-social-']) {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>

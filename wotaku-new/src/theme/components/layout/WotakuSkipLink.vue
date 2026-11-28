<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from '@/theme/shared/client'
import { useData } from '../../composables/base/data'

const { theme } = useData()
const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => backToTop.value.focus()
)

function focusOnTargetAnchor({ target }: Event) {
  const el = document.getElementById(
    decodeURIComponent((target as HTMLAnchorElement).hash).slice(1)
  )

  if (el) {
    const removeTabIndex = () => {
      el.removeAttribute('tabindex')
      el.removeEventListener('blur', removeTabIndex)
    }

    el.setAttribute('tabindex', '-1')
    el.addEventListener('blur', removeTabIndex)
    el.focus()
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <span ref="backToTop" tabindex="-1" />
  <a
    href="#WotakuContent"
    class="WotakuSkipLink visually-hidden"
    @click="focusOnTargetAnchor"
  >
    {{ theme.skipToContentLabel || 'Skip to content' }}
  </a>
</template>

<style scoped>
.WotakuSkipLink {
  top: 8px;
  left: 8px;
  padding: 8px 16px;
  z-index: 999;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  color: var(--wotaku-c-brand-1);
  box-shadow: var(--wotaku-shadow-3);
  background-color: var(--wotaku-c-bg);
}

.WotakuSkipLink:focus {
  height: auto;
  width: auto;
  clip: auto;
  clip-path: none;
}

@media (min-width: 1280px) {
  .WotakuSkipLink {
    top: 14px;
    left: 16px;
  }
}
</style>

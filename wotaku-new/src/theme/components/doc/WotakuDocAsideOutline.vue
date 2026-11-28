<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useData } from '../../composables/base/data'
import { resolveTitle, useActiveAnchor } from '../../composables/base/outline'
import WotakuDocOutlineItem from './WotakuDocOutlineItem.vue'
import { useLayout } from '../../composables/base/layout'

const { theme } = useData()

const container = ref()
const marker = ref()

const { headers, hasLocalNav } = useLayout()

useActiveAnchor(container, marker)
</script>

<template>
  <nav
    aria-labelledby="doc-outline-aria-label"
    class="WotakuDocAsideOutline"
    :class="{ 'has-outline': hasLocalNav }"
    ref="container"
  >
    <div class="content">
      <div class="outline-marker" ref="marker" />

      <div
        aria-level="2"
        class="outline-title"
        id="doc-outline-aria-label"
        role="heading"
      >
        {{ resolveTitle(theme) }}
      </div>

      <WotakuDocOutlineItem :headers :root="true" />
    </div>
  </nav>
</template>

<style scoped>
.WotakuDocAsideOutline {
  display: none;
}

.WotakuDocAsideOutline.has-outline {
  display: block;
}

.content {
  position: relative;
  border-left: 1px solid var(--wotaku-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 2px;
  border-radius: 2px;
  height: 18px;
  background-color: var(--wotaku-c-brand-1);
  transition:
    top 0.25s cubic-bezier(0, 1, 0.5, 1),
    background-color 0.5s,
    opacity 0.25s;
}

.outline-title {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}
</style>

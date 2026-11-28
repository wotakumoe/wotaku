<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useData } from '@/theme/shared/client'
import { computed, onMounted, ref } from 'vue'

const { page } = useData()
const isHome = computed(() => page.value.relativePath === 'index.md')

const commit = __GIT_COMMIT__
const buildAge = ref('')

onMounted(() => {
  const diff = Math.floor(Date.now() / 1000 - __GIT_COMMIT_TS__)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  let label: string

  if (diff < 3600) label = rtf.format(-Math.floor(diff / 60), 'minute')
  else if (diff < 86400) label = rtf.format(-Math.floor(diff / 3600), 'hour')
  else if (diff < 2592000) label = rtf.format(-Math.floor(diff / 86400), 'day')
  else label = rtf.format(-Math.floor(diff / 2592000), 'month')

  buildAge.value = `Updated ${label}`
})
</script>

<template>
  <footer v-if="isHome" class="site-footer">
    <span class="footer-center">
      <span v-if="buildAge">{{ buildAge }}</span>
      <span v-if="buildAge" class="divider">|</span>
      <a :href="`https://github.com/wotakumoe/Wotaku/commit/${commit}`" class="no-icon">{{
        commit.slice(0, 7)
      }}</a>
    </span>
  </footer>
</template>

<style scoped>
.site-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  font-size: 12px;
  color: var(--wotaku-c-text-2);
  background-color: var(--wotaku-c-bg-alt);
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  color: var(--wotaku-c-divider);
}

a {
  color: var(--wotaku-c-text-2);
  text-decoration-line: underline;
  text-decoration-style: dashed;
  text-underline-offset: 5px;
  transition: color 0.3s;
}

a:hover {
  color: var(--wotaku-c-text-1);
}
</style>

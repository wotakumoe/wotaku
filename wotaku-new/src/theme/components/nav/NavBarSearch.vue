<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'

import { searchOpen as showSearch } from '../../shared/search-state'
import WotakuNavBarSearchButton from './NavBarSearchButton.vue'

const WotakuLocalSearchBox = defineAsyncComponent(() => import('../search/Search.vue'))

onMounted(() => {
  const handleSearchHotKey = (event: KeyboardEvent) => {
    if (
      (event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) ||
      (!isEditingContent(event) && event.key === '/')
    ) {
      event.preventDefault()
      remove()
    }
  }

  const remove = () => {
    window.removeEventListener('keydown', handleSearchHotKey)
  }

  window.addEventListener('keydown', handleSearchHotKey)

  onUnmounted(remove)
})

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const tagName = element.tagName

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  )
}

onKeyStroke('k', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    showSearch.value = true
  }
})

onKeyStroke('/', (event) => {
  if (!isEditingContent(event)) {
    event.preventDefault()
    showSearch.value = true
  }
})
</script>

<template>
  <section class="WotakuNavBarSearch">
    <WotakuLocalSearchBox v-model="showSearch" />

    <div id="local-search">
      <WotakuNavBarSearchButton @click="showSearch = true" />
    </div>
  </section>
</template>

<style>
.WotakuNavBarSearch {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .WotakuNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .WotakuNavBarSearch {
    padding-left: 32px;
  }
}
</style>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'

import { searchOpen as showSearch } from '../searchState'
import VPNavBarSearchButton from './NavBarSearchButton.vue'

const VPLocalSearchBox = defineAsyncComponent(() => import('./Search.vue'))

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
  <section class="VPNavBarSearch">
    <VPLocalSearchBox v-model="showSearch" />

    <div id="local-search">
      <VPNavBarSearchButton @click="showSearch = true" />
    </div>
  </section>
</template>

<style>
.VPNavBarSearch {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}
</style>

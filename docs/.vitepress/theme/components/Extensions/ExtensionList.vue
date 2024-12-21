<!--
  Copyright (c) The Tachiyomi Open Source Project
  SPDX-License-Identifier: MPL-2.0
-->

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import ExtensionGroup from './ExtensionGroup.vue'
import type { Extension } from '../../composables/useExtensionsQuery'

const props = defineProps<{ extensions: Extension[][] }>()
const { extensions } = toRefs(props)

const totalCount = computed(() => {
  return extensions.value.reduce((sum, item) => sum + item.length, 0)
})
</script>

<template>
  <div class="extension-list">
    <ExtensionGroup v-for="group in extensions" :key="group[0].lang" :list="group" :class="group[0].lang"
      :total-count="totalCount" />
  </div>
</template>

<style lang="stylus">
.extension-list {
  > div {
    &:not(:first-of-type) {
      .extensions-total {
        display: none
      }
    }
  }
}
</style>

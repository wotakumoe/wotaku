<!--
  Copyright (c) The Tachiyomi Open Source Project
  SPDX-License-Identifier: MPL-2.0
-->

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect
} from 'element-plus'

import { langName, simpleLangName } from '../../utils/languages'
import ExtensionSourceSelector from './ExtensionSourceSelector.vue'
import type { Extension } from '../../composables/useExtensionsQuery'
import type { ExtensionSource } from '../../../types/ExtensionSources'

export type Nsfw = 'Show all' | 'NSFW' | 'SFW'
export type Sort = 'Ascending' | 'Descending'

const props = defineProps<{
  extensions: Extension[][]
  sources: ExtensionSource[]
  selectedSources: string[]
  search: string
  lang: string[]
  nsfw: Nsfw
  sort: Sort
}>()

defineEmits<{
  (e: 'update:search', search: string): void
  (e: 'update:lang', lang: string[]): void
  (e: 'update:nsfw', nsfw: Nsfw): void
  (e: 'update:sort', sort: Sort): void
  (e: 'update:selectedSources', sources: string[]): void
}>()

const { extensions } = toRefs(props)

const isSmallScreen = useMediaQuery('(max-width: 767px)')
const labelPosition = computed(() => (isSmallScreen.value ? 'top' : 'right'))
</script>

<template>
  <ClientOnly>
    <div class="filters-list">
      <ElForm label-width="120px" :label-position="labelPosition">
        <ExtensionSourceSelector :sources="sources" :selected-sources="selectedSources"
          @update:selected-sources="$emit('update:selectedSources', $event)" />
        <ElFormItem label="Search:">
          <ElInput :model-value="search" placeholder="Search extensions by name or ID..." clearable
            @update:model-value="$emit('update:search', $event)" />
        </ElFormItem>
        <ElFormItem label="Languages:">
          <ElSelect :model-value="lang" placeholder="Show specific languages..." multiple clearable
            @update:model-value="$emit('update:lang', $event)">
            <ElOption v-for="[group] in extensions" :key="group.lang" :label="group.lang === 'en'
                ? simpleLangName(group.lang)
                : langName(group.lang)
              " :value="group.lang" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="Sort by:">
          <ElRadioGroup :model-value="sort" @update:model-value="$emit('update:sort', $event)">
            <ElRadio label="Ascending" />
            <ElRadio label="Descending" />
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="Display mode:">
          <ElRadioGroup :model-value="nsfw" @update:model-value="$emit('update:nsfw', $event)">
            <ElRadio label="NSFW" />
            <ElRadio label="SFW" />
            <ElRadio label="Show all" />
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
    </div>
  </ClientOnly>
</template>

<style lang="stylus">
.filters-list {
  display: flex
  flex-direction: column
  row-gap: 1rem
}

.el-select {
  width: 100%
}
</style>

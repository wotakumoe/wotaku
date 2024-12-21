<!--
  Copyright (c) The Tachiyomi Open Source Project
  SPDX-License-Identifier: MPL-2.0
-->

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { ElFormItem, ElSelect, ElOption } from "element-plus";
import type { ExtensionSource } from "../../types/ExtensionSources";

const props = defineProps<{
  sources: ExtensionSource[];
  selectedSources: string[];
}>();

const emit = defineEmits<{
  (e: "update:selectedSources", sources: string[]): void;
}>();

const { sources } = toRefs(props);

const allSourcesSelected = computed(
  () => props.selectedSources.length === props.sources.length,
);

function handleSelectAll(value: string[]) {
  if (value.includes("all")) {
    if (!allSourcesSelected.value) {
      // Select all sources
      emit(
        "update:selectedSources",
        sources.value.map((s) => s.name),
      );
    } else {
      // Deselect all sources
      emit("update:selectedSources", []);
    }
  } else {
    emit("update:selectedSources", value);
  }
}
</script>

<template>
  <ElFormItem label="Sources:">
    <ElSelect
      :model-value="selectedSources"
      placeholder="Select extension sources..."
      multiple
      clearable
      collapse-tags
      collapse-tags-tooltip
      @update:model-value="handleSelectAll"
    >
      <ElOption
        key="all"
        label="All Sources"
        value="all"
        :checked="allSourcesSelected"
      />
      <ElOption
        v-for="source in sources"
        :key="source.name"
        :label="source.name"
        :value="source.name"
      />
    </ElSelect>
  </ElFormItem>
</template>

<style lang="stylus" scoped>
:deep(.el-select) {
  width: 100%
}
</style>

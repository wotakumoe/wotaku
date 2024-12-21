<!--
  Copyright (c) The Tachiyomi Open Source Project
  SPDX-License-Identifier: MPL-2.0
-->

<script setup lang="ts">
import groupBy from "lodash.groupby";
import { ElLoading } from "element-plus";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { simpleLangName } from "../../utils/languages";
import ExtensionFilters from "./ExtensionFilters.vue";
import ExtensionList from "./ExtensionList.vue";
import type { Nsfw, Sort } from "./ExtensionFilters.vue";
import type { ExtensionSource } from "../../../types/ExtensionSources";
import type { Extension } from "../../composables/useExtensionsQuery";
import useExtensionsRepositoryQuery from "../../composables/useExtensionsQuery";

const extensionSources: ExtensionSource[] = [
  {
    name: "Official",
    url: "https://raw.githubusercontent.com/tachiyomiorg/extensions/repo/index.min.json",
  },
  {
    name: "test",
    url: "https://raw.githubusercontent.com/komikku-app/extensions/repo/index.min.json",
  },
];

const filters = reactive({
  search: "",
  lang: [] as string[],
  nsfw: "Show all" as Nsfw,
  sort: "Ascending" as Sort,
  selectedSources: extensionSources.map((s) => s.name), // Default to all sources selected
});

// Compute active sources based on selection
const activeSources = computed(() =>
  extensionSources.filter((source) =>
    filters.selectedSources.includes(source.name),
  ),
);

const { data: extensions, isLoading } = useExtensionsRepositoryQuery({
  sources: activeSources.value,
  select: (response) => {
    const values: Extension[][] = Object.values(groupBy(response, "lang"));
    values.sort(languageComparator);
    return values;
  },
});

function languageComparator(a: Extension[], b: Extension[]) {
  const langA = simpleLangName(a[0].lang);
  const langB = simpleLangName(b[0].lang);
  if (langA === "All" && langB === "English") {
    return -1;
  }
  if (langA === "English" && langB === "All") {
    return 1;
  }
  if (langA === "English") {
    return -1;
  }
  if (langB === "English") {
    return 1;
  }
  if (langA < langB) {
    return -1;
  }
  if (langA > langB) {
    return 1;
  }
  return 0;
}

const filteredExtensions = computed(() => {
  const filtered: Extension[][] = [];

  for (const group of extensions.value ?? []) {
    let filteredGroup = filters.lang.length
      ? filters.lang.includes(group[0].lang)
        ? group
        : []
      : group;

    if (filters.search) {
      const lower = filters.search.toLowerCase();

      filteredGroup = filteredGroup.filter(
        (ext) =>
          ext.name.toLowerCase().includes(lower) ||
          ext.sources.some((source) => source.id.includes(filters.search)),
      );
    }

    filteredGroup = filteredGroup.filter((ext) =>
      filters.nsfw === "Show all"
        ? true
        : ext.nsfw === (filters.nsfw === "NSFW" ? 1 : 0),
    );

    if (filters.sort === "Descending") {
      filteredGroup = filteredGroup.reverse();
    }

    if (filteredGroup.length) {
      filtered.push(filteredGroup);
    }
  }

  return filtered;
});

const loadingInstance = ref<ReturnType<(typeof ElLoading)["service"]>>();

onMounted(() => {
  loadingInstance.value = ElLoading.service({
    target: ".extensions",
    fullscreen: false,
    background: "transparent",
  });
});

watch(extensions, async () => {
  if (window.location.hash) {
    await nextTick();
    document
      .getElementById(window.location.hash.substring(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }
});

// biome-ignore lint/suspicious/useAwait: <explanation>
watch([isLoading, loadingInstance], async ([newIsLoading]) => {
  if (!newIsLoading) {
    loadingInstance.value?.close();
  }
});
</script>

<template>
  <ExtensionFilters
    v-model:search="filters.search"
    v-model:lang="filters.lang"
    v-model:nsfw="filters.nsfw"
    v-model:sort="filters.sort"
    v-model:selected-sources="filters.selectedSources"
    :extensions="extensions ?? []"
    :sources="extensionSources"
  />
  <div class="extensions">
    <ExtensionList v-if="!isLoading" :extensions="filteredExtensions" />
  </div>
</template>

<style scoped>
.extensions {
  min-height: 200px;
}
</style>

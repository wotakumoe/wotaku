<!--
  Copyright (c) 2024 taskylizard

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<script setup lang="ts">
defineProps<{ title: string; description?: string; image: string }>()
</script>

<template>
  <span
    tw="w-full h-full bg-black flex flex-col"
    :style="{
      backgroundImage: `url(${image})`
    }"
  >
    <span
      tw="p-10 w-full min-h-0 grow flex flex-col items-center justify-between"
    >
      <span tw="w-full flex justify-between items-center text-5xl font-medium">
        <span tw="flex items-center">
          <span tw="text-zinc-100 ml-2 mt-1 font-semibold">wotaku.wiki</span>
        </span>
      </span>
      <span tw="w-full pr-56 flex flex-col items-start justify-end">
        <span style="color: #f7f7f7" tw="text-6xl font-bold" v-html="title" />
      </span>
    </span>
    <span tw="shrink-0 h-2 w-full flex" />
  </span>
</template>

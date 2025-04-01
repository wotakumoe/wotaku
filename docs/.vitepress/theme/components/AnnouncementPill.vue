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
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <a
    v-if="frontmatter.hero.announcement"
    :href="frontmatter.hero.announcement.link"
    class="mb-3 inline-flex items-center rounded-lg bg-[var(--vp-c-default-soft)] px-4 py-1 text-sm font-semibold"
  >
    {{ frontmatter.hero.announcement.title }}
  </a>
</template>

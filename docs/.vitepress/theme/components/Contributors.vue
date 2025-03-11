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
import { computed } from 'vue'
import { contribs, type Contributors } from '../../credits'

const contributors = computed(() => contribs || ({} as Contributors))
</script>

<template>
  <h1 class="text-center">Core Team</h1>
  <hr />
  <div class="flex flex-wrap gap-4 pt-2">
    <div
      v-for="(c, index) of contributors.core"
      class="flex items-center gap-2"
    >
      <img :src="c.avatar" class="h-8 w-8 rounded-full" />
      <a v-if="c.site" :href="c.site">{{ c.name }}</a>
      <span v-else>{{ c.name }}</span>
      <span v-if="index < contributors.core.length - 1">•</span>
    </div>
  </div>
  <span />
  <h1 class="mt-30px text-center">Contributors</h1>
  <hr />
  <div class="flex flex-wrap gap-4 pt-2">
    <div
      v-for="(c, index) of contributors.contributors"
      class="flex items-center gap-2"
    >
      <img :src="c.avatar" class="h-8 w-8 rounded-full" />
      <a v-if="c.site" :href="c.site">{{ c.name }}</a>
      <span v-else>{{ c.name }}</span>
      <span v-if="index < contributors.contributors.length - 1">•</span>
    </div>
  </div>
  <span />
  <h1 class="mt-30px text-center">Special Thanks to</h1>
  <hr />
  <div class="flex flex-wrap gap-4 pt-2">
    <div
      v-for="(c, index) of contributors.special"
      class="flex items-center gap-2"
    >
      <img :src="c.avatar" class="h-8 w-8 rounded-full" />
      <a v-if="c.site" :href="c.site">{{ c.name }}</a>
      <span v-else>{{ c.name }}</span>
      <span v-if="index < contributors.special.length - 1">•</span>
    </div>
  </div>
</template>

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

const props = defineProps<{
  page: string
}>()

interface CreditsInfo {
  [key: string]: {
    name: string
    avatar: string
    // Optional.
    site?: string
  }[]
}

const credits = {
  imagedit: [
    {
      name: 'Oakminati',
      site: 'https://nyaa.si/user/Oakminati',
      avatar: '/pfp/oak.png'
    },
    {
      name: 'XRA-Empire',
      site: 'https://nyaa.si/?f=0&c=3_1&q=xra',
      avatar: '/pfp/xra.png'
    }
  ],

  audiog: [
    {
      name: 'DenpaEater',
      site: 'https://x.com/shibayanfanclub',
      avatar: '/pfp/denpa.jpg'
    }
  ],
  discrip: [
    {
      name: 'nullishcat',
      site: 'https://nullish.cat/',
      avatar: 'https://github.com/nullish-cat.png'
    }
  ],
  fate: [
    {
      name: 'Archziac',
      site: 'https://www.behance.net/archziac',
      avatar: 'https://github.com/archziac.png'
    }
  ]
} satisfies CreditsInfo

const Credits = computed(() => credits[props.page] || ([] as CreditsInfo[]))
</script>
<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <span class="text-lg font-medium">By</span>
    <div v-for="(c, index) of Credits" class="flex items-center gap-2">
      <img :src="c.avatar" class="h-8 w-8 rounded-full" />
      <a v-if="c.site" :href="c.site">{{ c.name }}</a>
      <span v-else>{{ c.name }}</span>
      <span v-if="index < Credits.length - 1">•</span>
    </div>
  </div>
</template>

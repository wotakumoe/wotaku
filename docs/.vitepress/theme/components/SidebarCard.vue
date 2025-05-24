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
import { ref } from 'vue'

import LegendModal from './LegendModal.vue'

const isModalOpen = ref(false)

const focusLegendModal = () => {
  isModalOpen.value = true
}
</script>

<template>
  <div
    class="bg-$vp-c-bg hover:bg-$vp-c-bg/40 border-$vp-c-default-soft hover:border-primary transition-border relative z-0 rounded-lg border-2 border-solid p-5 duration-500 mt-2"
  >
    <button class="w-full text-left" @click="isModalOpen = true">
      <div class="align-center flex items-center gap-2">
        <div
          class="i-material-symbols-info-outline-rounded text-$vp-c-text-2"
        />
        <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">Legend</div>
      </div>
      <div class="text-$vp-c-text-2 text-xs mt-1">
        Click to view all icons and their meanings
      </div>
    </button>

    <LegendModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

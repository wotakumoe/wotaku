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
defineProps<{
  icon: string
  iconClass?: string
}>()
</script>

<template>
  <div class="g-[12px] mb-[8px] flex items-center">
    <span class="flex items-center">
      <span class="size-6" :class="[icon, iconClass]" />
      <div class="ml-2 text-sm text-$vp-c-text-2">
        <slot />
      </div>
    </span>
  </div>
</template>

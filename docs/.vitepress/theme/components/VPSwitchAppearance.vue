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
import { inject } from 'vue'
import VPIconMoon from 'vitepress/dist/client/theme-default/components/icons/VPIconMoon.vue'
import VPIconSun from 'vitepress/dist/client/theme-default/components/icons/VPIconSun.vue'

const { isDark } = useData()

const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value
})
</script>

<template>
  <button
    type="button"
    role="switch"
    title="VPSwitchAppearance"
    class="VPSwitchAppearance"
    :aria-checked="isDark"
    @click="toggleAppearance"
  >
    <ClientOnly>
      <Transition name="fade" mode="out-in">
        <VPIconSun v-if="!isDark" class="sun" />
        <VPIconMoon v-else class="moon" />
      </Transition>
    </ClientOnly>
  </button>
</template>

<style lang="scss" scoped>
.VPSwitchAppearance {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;

  &:hover {
    color: var(--vp-c-text-1);
    transition: color 0.25s;
  }

  & > :deep(svg) {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  &[data-view-transition='false'] {
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.1s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
</style>

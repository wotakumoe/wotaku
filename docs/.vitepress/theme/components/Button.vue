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
withDefaults(
  defineProps<{
    text?: string
    type?: 'info' | 'tip' | 'warning' | 'danger'
    link: string
    icon?: string
  }>(),
  { icon: 'i-octicon-link-external-16', type: 'tip' }
)
</script>

<template>
  <component
    :target="link ? '_blank' : undefined"
    :is="link ? 'a' : 'span'"
    :href="link"
    :class="type"
    class="VButton px4 py3 mt2 gap2 block flex items-center rounded-md"
  >
    <div :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VButton {
  text-decoration: none !important;
}

.VButton.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VButton.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.VButton.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.VButton.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}
</style>

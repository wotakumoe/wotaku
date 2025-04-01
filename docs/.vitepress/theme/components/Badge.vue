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
interface Props {
  text?: string
  link?: string
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'green'
  icon?: string
}
withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<template>
  <component
    :target="link ? '_blank' : undefined"
    :is="link ? 'a' : 'span'"
    class="VPBadge"
    :class="link ? 'tip' : type"
    :href="link"
  >
    <div v-if="icon" :class="icon" />
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VPBadge {
  display: inline-flex;
  margin-left: 2px;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 10px;
  line-height: 22px;
  font-size: 12px;
  font-weight: 500;
  transform: translateY(-2px);
  align-items: center;
  gap: 0.2rem;
  padding-right: 10px;
  vertical-align: middle;
  /** If the badge is a link, we don't want to apply the link style from global styles. */
  text-decoration: none !important;
}

.vp-doc h1 > .VPBadge {
  margin-top: 4px;
  vertical-align: top;
}

.vp-doc h2 > .VPBadge {
  margin-top: 3px;
  padding: 0 8px;
  vertical-align: top;
}

.vp-doc h3 > .VPBadge {
  vertical-align: middle;
}

.vp-doc h4 > .VPBadge,
.vp-doc h5 > .VPBadge,
.vp-doc h6 > .VPBadge {
  vertical-align: middle;
  line-height: 18px;
}

.VPBadge.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VPBadge.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.VPBadge.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.VPBadge.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}

.VPBadge.green {
  color: var(--vp-custom-block-tip-text);
  background-color: var(--vp-custom-block-tip-bg);
}
</style>

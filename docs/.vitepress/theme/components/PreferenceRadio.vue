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
import { useLocalStorage } from '@vueuse/core'

const props = defineProps<{
  text: string
  group: string
  options: string[]
  defaultOption: string
  screenMenu?: boolean
}>()

const key = removeSpaces(
  `preference-${props.group}-${props.options
    .map((key) => key.toLowerCase())
    .join('-')}`
)
const name = key + (props.screenMenu ? '-screen-menu' : '')

const selected = useLocalStorage(key, () => props.defaultOption)

const optionsWithKeys = props.options.map((option) => ({
  key: name + '-' + removeSpaces(option),
  value: option
}))

function removeSpaces(str: string) {
  return str.replace(/\s/g, '_')
}
</script>

<template>
  <p class="title">{{ text }}</p>
  <div class="VPPreference" :class="{ 'screen-menu': screenMenu }">
    <template v-for="option in optionsWithKeys" :key="option">
      <input
        type="radio"
        :id="option.key"
        :name="name"
        :value="option.value"
        v-model="selected"
      />
      <label :for="option.key">{{ option.value }}</label>
    </template>
  </div>
</template>

<style scoped>
.VPPreference {
  display: flex;
  margin: 12px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.VPPreference:first-child {
  margin-top: 0;
}

.VPPreference:last-child {
  margin-bottom: 0;
}

.VPPreference.screen-menu {
  margin: 12px 0 0 12px;
}

.VPPreference input[type='radio'] {
  pointer-events: none;
  position: fixed;
  opacity: 0;
}

.VPPreference label {
  flex: 1;
  margin: 2px;
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

.VPPreference input[type='radio']:checked + label {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}
</style>

<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { contentTypeLabel } from './helpers'
import MenuHelp from '../settings/MenuHelp.vue'
import MenuTitle from '../settings/MenuTitle.vue'

defineProps<{
  modelValue: string
  availableTypes: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement>()
const open = ref(false)
const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

function select(type: string) {
  emit('update:modelValue', type)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="rootRef" class="ext-type-select" :class="{ 'ext-type-select--open': open }">
    <div ref="menuTitleElementRef" relative flex items-center mb-2>
      <MenuTitle title="Type" aria-label="Type" flex="1" pr-4>
        <template #icon>
          <span i-lucide:tags mr-1 aria-hidden="true" />
        </template>
      </MenuTitle>
      <MenuHelp
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>Type</h4>
        <p text="sm" mb-2 max-w-100>
          Filters extensions by type.
        </p>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <button
        type="button"
        class="ext-type-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="ext-type-label">{{ modelValue ? contentTypeLabel(modelValue) : 'All types' }}</span>
        <span class="ext-type-chevron i-lucide:chevron-down" :class="{ 'ext-type-chevron--open': open }" />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ext-type-options" role="listbox">
          <button
            type="button"
            role="option"
            class="ext-type-option"
            :class="{ 'ext-type-option--selected': modelValue === '' }"
            :aria-selected="modelValue === ''"
            @click="select('')"
          >
            <span class="ext-type-option-label">All types</span>
          </button>
          <button
            v-for="type in availableTypes"
            :key="type"
            type="button"
            role="option"
            class="ext-type-option"
            :class="{ 'ext-type-option--selected': modelValue === type }"
            :aria-selected="modelValue === type"
            @click="select(type)"
          >
            <span class="ext-type-option-label">{{ contentTypeLabel(type) }}</span>
          </button>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ext-type-select {
  position: relative;
}

.ext-type-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  background: var(--wk-c-menu-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.ext-type-trigger:hover,
.ext-type-select--open .ext-type-trigger {
  border-color: var(--vp-c-brand-1);
}

.ext-type-label {
  flex: 1;
  text-align: left;
}

.ext-type-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.ext-type-chevron--open {
  transform: rotate(180deg);
}

.ext-type-options {
  margin-top: 6px;
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-2, 0 4px 16px rgba(0, 0, 0, 0.2));
}

.ext-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 13px;
  text-align: left;
  width: 100%;
  transition: background-color 0.15s;
}

.ext-type-option-label {
  flex: 1;
  min-width: 0;
}

.ext-type-option:hover {
  background-color: var(--vp-c-bg-soft);
}

.ext-type-option--selected {
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.ext-type-option--selected:hover {
  background-color: var(--vp-c-brand-soft);
}
</style>

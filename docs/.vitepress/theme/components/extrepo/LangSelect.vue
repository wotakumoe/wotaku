<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { langFlagClass, langLabel } from './helpers'
import MenuTitle from './MenuTitle.vue'

defineProps<{
  modelValue: string
  availableLangs: string[]
  hasMultiLanguage: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement>()
const open = ref(false)

function select(lang: string) {
  emit('update:modelValue', lang)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="rootRef" class="ext-lang-select" :class="{ 'ext-lang-select--open': open }">
    <MenuTitle icon="i-lucide:languages" title="Language" />
    <NuInputHighlight class="rounded-md">
      <button
        type="button"
        class="ext-lang-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="ext-lang-label">{{ modelValue ? langLabel(modelValue) : 'All languages' }}</span>
        <span class="ext-lang-chevron i-lucide:chevron-down" :class="{ 'ext-lang-chevron--open': open }" />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ext-lang-options" role="listbox">
          <button
            type="button"
            role="option"
            class="ext-lang-option"
            :class="{ 'ext-lang-option--selected': modelValue === '' }"
            :aria-selected="modelValue === ''"
            @click="select('')"
          >
            <span class="ext-lang-option-label">All languages</span>
            <span class="ext-lang-option-flag" :class="langFlagClass('')" aria-hidden="true" />
          </button>
          <button
            v-if="hasMultiLanguage"
            type="button"
            role="option"
            class="ext-lang-option"
            :class="{ 'ext-lang-option--selected': modelValue === 'all' }"
            :aria-selected="modelValue === 'all'"
            @click="select('all')"
          >
            <span class="ext-lang-option-label">Multi-language</span>
            <span class="ext-lang-option-flag" :class="langFlagClass('all')" aria-hidden="true" />
          </button>
          <button
            v-for="lang in availableLangs"
            :key="lang"
            type="button"
            role="option"
            class="ext-lang-option"
            :class="{ 'ext-lang-option--selected': modelValue === lang }"
            :aria-selected="modelValue === lang"
            @click="select(lang)"
          >
            <span class="ext-lang-option-label">{{ langLabel(lang) }}</span>
            <span class="ext-lang-option-flag" :class="langFlagClass(lang)" aria-hidden="true" />
          </button>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ext-lang-select {
  position: relative;
}

.ext-lang-trigger {
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

.ext-lang-trigger:hover,
.ext-lang-select--open .ext-lang-trigger {
  border-color: var(--vp-c-brand-1);
}

.ext-lang-label {
  flex: 1;
  text-align: left;
}

.ext-lang-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.ext-lang-chevron--open {
  transform: rotate(180deg);
}

.ext-lang-options {
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

.ext-lang-option {
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

.ext-lang-option-label {
  flex: 1;
  min-width: 0;
}

.ext-lang-option-flag {
  flex-shrink: 0;
  font-size: 14px;
}

.ext-lang-option:hover {
  background-color: var(--vp-c-bg-soft);
}

.ext-lang-option--selected {
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.ext-lang-option--selected:hover {
  background-color: var(--vp-c-brand-soft);
}
</style>

<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { contentTypeLabel } from './helpers'
import MenuTitle from './MenuTitle.vue'

const props = defineProps<{
  // Excluded type values; empty means nothing is excluded, so everything is shown.
  modelValue: Set<string>
  availableTypes: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Set<string>]
}>()

const rootRef = ref<HTMLElement>()
const open = ref(false)

const selectedCount = computed(() => props.availableTypes.length - props.modelValue.size)
const summaryLabel = computed(() => {
  if (props.modelValue.size === 0) return 'All types'
  return `${selectedCount.value} of ${props.availableTypes.length}`
})

function isChecked(type: string): boolean {
  return !props.modelValue.has(type)
}

function toggle(type: string) {
  const next = new Set(props.modelValue)
  if (next.has(type)) next.delete(type)
  else next.add(type)
  emit('update:modelValue', next)
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="rootRef" class="ext-ctype-select" :class="{ 'ext-ctype-select--open': open }">
    <MenuTitle icon="i-lucide:tags" title="Content Type" />
    <NuInputHighlight class="rounded-md">
      <button
        type="button"
        class="ext-ctype-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="ext-ctype-label">{{ summaryLabel }}</span>
        <span class="ext-ctype-chevron i-lucide:chevron-down" :class="{ 'ext-ctype-chevron--open': open }" />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ext-ctype-options" role="listbox">
          <label v-for="type in availableTypes" :key="type" class="ext-ctype-option">
            <input type="checkbox" :checked="isChecked(type)" @change="toggle(type)" />
            <span class="ext-ctype-option-label">{{ contentTypeLabel(type) }}</span>
          </label>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ext-ctype-select {
  position: relative;
}

.ext-ctype-trigger {
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

.ext-ctype-trigger:hover,
.ext-ctype-select--open .ext-ctype-trigger {
  border-color: var(--vp-c-brand-1);
}

.ext-ctype-label {
  flex: 1;
  text-align: left;
}

.ext-ctype-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.ext-ctype-chevron--open {
  transform: rotate(180deg);
}

.ext-ctype-options {
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

.ext-ctype-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 13px;
  width: 100%;
  transition: background-color 0.15s;
}

.ext-ctype-option:hover {
  background-color: var(--vp-c-bg-soft);
}

.ext-ctype-option input {
  flex-shrink: 0;
  accent-color: var(--vp-c-brand-1);
}

.ext-ctype-option-label {
  flex: 1;
  min-width: 0;
}
</style>

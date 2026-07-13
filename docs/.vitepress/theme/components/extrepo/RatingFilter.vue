<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MenuTitle from './MenuTitle.vue'
import type { RatingFilter } from './types'

const props = defineProps<{
  modelValue: RatingFilter
  hasSuggestive: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RatingFilter]
}>()

const options = computed(() => {
  const base = [
    { value: 'all' as RatingFilter, label: 'All' },
    { value: 'safe' as RatingFilter, label: 'Safe' }
  ]
  if (props.hasSuggestive) {
    base.push({ value: 'suggestive' as RatingFilter, label: 'Mature' })
  }
  base.push({
    value: 'nsfw' as RatingFilter,
    label: props.hasSuggestive ? 'Adult' : 'NSFW'
  })
  return base
})

const rootRef = ref<HTMLElement>()
const open = ref(false)

const currentLabel = computed(() => options.value.find(o => o.value === props.modelValue)?.label ?? 'All')

function select(value: RatingFilter) {
  emit('update:modelValue', value)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))
</script>

<template>
  <div ref="rootRef" class="ext-rating-select" :class="{ 'ext-rating-select--open': open }">
    <MenuTitle icon="i-lucide:shield" title="Rating" />
    <NuInputHighlight class="rounded-md">
      <button
        type="button"
        class="ext-rating-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="ext-rating-label">{{ currentLabel }}</span>
        <span class="ext-rating-chevron i-lucide:chevron-down" :class="{ 'ext-rating-chevron--open': open }" />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ext-rating-options" role="listbox">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="option"
            class="ext-rating-option"
            :class="{ 'ext-rating-option--selected': modelValue === option.value }"
            :aria-selected="modelValue === option.value"
            @click="select(option.value)"
          >
            <span class="ext-rating-option-label">{{ option.label }}</span>
          </button>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ext-rating-select {
  position: relative;
}

.ext-rating-trigger {
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

.ext-rating-trigger:hover,
.ext-rating-select--open .ext-rating-trigger {
  border-color: var(--vp-c-brand-1);
}

.ext-rating-label {
  flex: 1;
  text-align: left;
}

.ext-rating-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.ext-rating-chevron--open {
  transform: rotate(180deg);
}

.ext-rating-options {
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

.ext-rating-option {
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

.ext-rating-option-label {
  flex: 1;
  min-width: 0;
}

.ext-rating-option:hover {
  background-color: var(--vp-c-bg-soft);
}

.ext-rating-option--selected {
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.ext-rating-option--selected:hover {
  background-color: var(--vp-c-brand-soft);
}
</style>

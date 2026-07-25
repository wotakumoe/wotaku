<script setup lang="ts">
import { NuInputHighlight, NuVerticalTransition } from '@nolebase/ui'
import { onMounted, onUnmounted, ref } from 'vue'
import type { AnnouncementType } from '../composables/useAnnouncements'
import MenuHelp from './settings/MenuHelp.vue'
import MenuTitle from './settings/MenuTitle.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const OPTIONS: { value: AnnouncementType; label: string }[] = [
  { value: 'section', label: 'Section' },
  { value: 'component', label: 'Component' },
  { value: 'improvement', label: 'Improvement' }
]

function labelFor(value: string): string {
  return OPTIONS.find((o) => o.value === value)?.label ?? 'All types'
}

const rootRef = ref<HTMLElement>()
const open = ref(false)
const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)

function select(value: string) {
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
  <div ref="rootRef" class="ann-type-select" :class="{ 'ann-type-select--open': open }">
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
        <h4 class="sh-title">
          <span class="i-lucide:tags sh-title-icon" />
          Type
        </h4>
        <p class="sh-desc">Filters announcements by type.</p>
        <div class="sh-options">
          <div class="sh-option">
            <strong>
              <span class="i-lucide:panel-top sh-opt-icon" />
              Section
            </strong>
            <span>Newly added section or tab</span>
          </div>
          <div class="sh-option">
            <strong>
              <span class="i-lucide:box sh-opt-icon" />
              Component
            </strong>
            <span>Newly added component</span>
          </div>
          <div class="sh-option">
            <strong>
              <span class="i-lucide:sparkles sh-opt-icon" />
              Improvement
            </strong>
            <span>Improvement of a section or component</span>
          </div>
        </div>
      </MenuHelp>
    </div>
    <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
      <button
        type="button"
        class="ann-type-trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="ann-type-label">{{ labelFor(modelValue) }}</span>
        <span class="ann-type-chevron i-lucide:chevron-down" :class="{ 'ann-type-chevron--open': open }" />
      </button>

      <NuVerticalTransition :duration="200">
        <div v-show="open" class="ann-type-options" role="listbox">
          <button
            type="button"
            role="option"
            class="ann-type-option"
            :class="{ 'ann-type-option--selected': modelValue === '' }"
            :aria-selected="modelValue === ''"
            @click="select('')"
          >
            <span class="ann-type-option-label">All types</span>
          </button>
          <button
            v-for="opt in OPTIONS"
            :key="opt.value"
            type="button"
            role="option"
            class="ann-type-option"
            :class="{ 'ann-type-option--selected': modelValue === opt.value }"
            :aria-selected="modelValue === opt.value"
            @click="select(opt.value)"
          >
            <span class="ann-type-option-label">{{ opt.label }}</span>
          </button>
        </div>
      </NuVerticalTransition>
    </NuInputHighlight>
  </div>
</template>

<style scoped>
.ann-type-select {
  position: relative;
}

.ann-type-trigger {
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

.ann-type-trigger:hover,
.ann-type-select--open .ann-type-trigger {
  border-color: var(--vp-c-brand-1);
}

.ann-type-label {
  flex: 1;
  text-align: left;
}

.ann-type-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.ann-type-chevron--open {
  transform: rotate(180deg);
}

.ann-type-options {
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

.ann-type-option {
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

.ann-type-option-label {
  flex: 1;
  min-width: 0;
}

.ann-type-option:hover {
  background-color: var(--vp-c-bg-soft);
}

.ann-type-option--selected {
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.ann-type-option--selected:hover {
  background-color: var(--vp-c-brand-soft);
}

/* Help popup */
.sh-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 4px;
}

.sh-title-icon {
  flex-shrink: 0;
  opacity: 0.8;
  width: 16px;
  height: 16px;
}

.sh-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0 0 6px;
  line-height: 1.5;
}

.sh-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sh-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--wk-c-menu-bg);
  border-radius: 12px;
  padding: 10px 12px;
}

.sh-option strong {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sh-opt-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.sh-option span {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>

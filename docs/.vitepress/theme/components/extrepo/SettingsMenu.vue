<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import BrokenFilter from './BrokenFilter.vue'
import ContentTypeFilter from './ContentTypeFilter.vue'
import LangSelect from './LangSelect.vue'
import RatingFilter from './RatingFilter.vue'
import type { RatingFilter as RatingFilterValue } from './types'

defineProps<{
  langFilter: string
  ratingFilter: RatingFilterValue
  availableLangs: string[]
  hasMultiLanguage: boolean
  hasRatings: boolean
  hasSuggestive: boolean
  contentTypeFilter: Set<string>
  availableContentTypes: string[]
  hasContentTypes: boolean
  showBroken: boolean
  hasBroken: boolean
}>()

defineEmits<{
  'update:langFilter': [value: string]
  'update:ratingFilter': [value: RatingFilterValue]
  'update:contentTypeFilter': [value: Set<string>]
  'update:showBroken': [value: boolean]
}>()

const rootRef = ref<HTMLElement>()
const btnRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const open = ref(false)
const menuStyle = ref<Record<string, string>>({})

function updatePosition() {
  if (!btnRef.value) return

  const viewportMargin = 12
  const menuWidth = menuRef.value?.offsetWidth ?? 260
  const btnRect = btnRef.value.getBoundingClientRect()
  const maxLeft = Math.max(viewportMargin, window.innerWidth - viewportMargin - menuWidth)
  const left = Math.min(Math.max(btnRect.right - menuWidth, viewportMargin), maxLeft)
  const maxTop = Math.max(viewportMargin, window.innerHeight - viewportMargin)
  const top = Math.min(btnRect.bottom + 6, maxTop)

  menuStyle.value = { top: `${top}px`, left: `${left}px` }
}

function toggle() {
  open.value = !open.value
  if (open.value) void nextTick(updatePosition)
}

function onDocClick(e: MouseEvent) {
  const target = e.target as Node
  if (
    rootRef.value && !rootRef.value.contains(target)
    && menuRef.value && !menuRef.value.contains(target)
  ) {
    open.value = false
  }
}

function onReposition() {
  if (open.value) updatePosition()
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  window.addEventListener('resize', onReposition)
  window.addEventListener('scroll', onReposition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
})
</script>

<template>
  <div ref="rootRef" class="ext-settings">
    <button
      ref="btnRef"
      type="button"
      class="ext-settings-btn"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-label="Filters"
      @click="toggle"
    >
      <span class="i-lucide:settings" />
    </button>

    <Teleport to="body">
      <div
        v-show="open"
        ref="menuRef"
        class="ext-settings-menu VPMenu"
        :class="{ 'ext-settings-menu--wide': hasSuggestive || hasContentTypes }"
        :style="menuStyle"
      >
        <LangSelect
          :model-value="langFilter"
          :available-langs="availableLangs"
          :has-multi-language="hasMultiLanguage"
          @update:model-value="$emit('update:langFilter', $event)"
        />
        <RatingFilter
          v-if="hasRatings"
          :model-value="ratingFilter"
          :has-suggestive="hasSuggestive"
          @update:model-value="$emit('update:ratingFilter', $event)"
        />
        <ContentTypeFilter
          v-if="hasContentTypes"
          :model-value="contentTypeFilter"
          :available-types="availableContentTypes"
          @update:model-value="$emit('update:contentTypeFilter', $event)"
        />
        <BrokenFilter
          v-if="hasBroken"
          :model-value="showBroken"
          @update:model-value="$emit('update:showBroken', $event)"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ext-settings {
  position: relative;
}

.ext-settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.ext-settings-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ext-settings-btn span {
  font-size: 15px;
}

.ext-settings-menu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(--wk-c-menu-bg);
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
  position: fixed;
  z-index: 100;
  width: 260px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3, 0 4px 16px rgba(0, 0, 0, 0.3));
}

.ext-settings-menu > * + * {
  margin-top: 14px;
}

.ext-settings-menu--wide {
  width: 320px;
}
</style>

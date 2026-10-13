<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import BrokenFilter from './BrokenFilter.vue'
import FilterSelect, { type FilterOption } from './FilterSelect.vue'
import { contentTypeLabel, langFlagClass, langLabel } from './helpers'
import type { RatingFilter as RatingFilterValue } from './types'

const props = defineProps<{
  langFilter: string
  ratingFilter: RatingFilterValue
  availableLangs: string[]
  hasMultiLanguage: boolean
  hasRatings: boolean
  hasMixed: boolean
  hasSuggestive: boolean
  contentTypeFilter: string
  availableContentTypes: string[]
  hasContentTypes: boolean
  showBroken: boolean
  hasBroken: boolean
}>()

defineEmits<{
  'update:langFilter': [value: string]
  'update:ratingFilter': [value: RatingFilterValue]
  'update:contentTypeFilter': [value: string]
  'update:showBroken': [value: boolean]
}>()

const rootRef = ref<HTMLElement>()
const btnRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const open = ref(false)
const menuStyle = ref<Record<string, string>>({})
let raf = 0

function updatePosition() {
  if (!btnRef.value) return
  const viewportMargin = 12
  const menuWidth = menuRef.value?.offsetWidth ?? 260
  const btnRect = btnRef.value.getBoundingClientRect()
  const maxLeft = Math.max(
    viewportMargin,
    window.innerWidth - viewportMargin - menuWidth
  )
  const left = Math.min(
    Math.max(btnRect.right - menuWidth, viewportMargin),
    maxLeft
  )
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
    rootRef.value && !rootRef.value.contains(target) &&
    menuRef.value && !menuRef.value.contains(target)
  ) {
    open.value = false
  }
}

function onReposition() {
  if (!open.value || raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    updatePosition()
  })
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  window.addEventListener('resize', onReposition, { passive: true })
  window.addEventListener('scroll', onReposition, {
    capture: true,
    passive: true
  })
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
  if (raf) cancelAnimationFrame(raf)
})

const langOptions = computed<FilterOption[]>(() => [
  { value: '', label: 'All languages' },
  ...(props.hasMultiLanguage
    ? [{ value: 'all', label: 'Multi-language', flag: langFlagClass('all') }]
    : []),
  ...props.availableLangs.map(lang => ({
    value: lang,
    label: langLabel(lang),
    flag: langFlagClass(lang)
  }))
])
const langTrigger = computed(() =>
  props.langFilter ? langLabel(props.langFilter) : 'All languages'
)

const ratingOptions = computed<FilterOption[]>(() => {
  const opts: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'safe', label: 'Safe' }
  ]
  if (props.hasMixed) opts.push({ value: 'mixed', label: 'Mixed' })
  if (props.hasSuggestive) {
    opts.push({ value: 'suggestive', label: 'Mature' })
  }
  opts.push({
    value: 'nsfw',
    label: props.hasMixed || props.hasSuggestive ? 'Adult' : 'NSFW'
  })
  return opts
})

const typeOptions = computed<FilterOption[]>(() => [
  { value: '', label: 'All types' },
  ...props.availableContentTypes.map(t => ({
    value: t,
    label: contentTypeLabel(t)
  }))
])
const typeTrigger = computed(() =>
  props.contentTypeFilter
    ? contentTypeLabel(props.contentTypeFilter)
    : 'All types'
)
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
        :class="{
          'ext-settings-menu--wide': hasMixed || hasSuggestive || hasContentTypes
        }"
        :style="menuStyle"
      >
        <FilterSelect
          v-if="availableLangs.length > 0"
          :model-value="langFilter"
          :options="langOptions"
          :trigger-label="langTrigger"
          title="Language"
          icon="i-lucide:languages"
          help-text="Filters extensions by translated language (not original language)."
          @update:model-value="$emit('update:langFilter', $event)"
        />
        <FilterSelect
          v-if="hasRatings"
          :model-value="ratingFilter"
          :options="ratingOptions"
          title="Rating"
          icon="i-lucide:shield"
          help-text="Choose the highest content rating to include."
          @update:model-value="$emit('update:ratingFilter', $event as RatingFilterValue)"
        >
          <template #help-extra>
            <div class="rating-help-options">
              <div class="rating-help-option">
                <strong>All</strong>
                <span>Shows entries at every rating level</span>
              </div>
              <div class="rating-help-option">
                <strong>Safe</strong>
                <span>Only entries with no mature content</span>
              </div>
              <div v-if="hasMixed" class="rating-help-option">
                <strong>Mixed</strong>
                <span>Includes mixed content</span>
              </div>
              <div v-if="hasSuggestive" class="rating-help-option">
                <strong>Mature</strong>
                <span>Includes mature content</span>
              </div>
              <div class="rating-help-option">
                <strong>{{ hasMixed || hasSuggestive ? 'Adult' : 'NSFW' }}</strong>
                <span>Includes explicit adult content</span>
              </div>
            </div>
          </template>
        </FilterSelect>
        <FilterSelect
          v-if="hasContentTypes"
          :model-value="contentTypeFilter"
          :options="typeOptions"
          :trigger-label="typeTrigger"
          title="Type"
          icon="i-lucide:tags"
          help-text="Filters extensions by type."
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
  flex-shrink: 0;
}
.ext-settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.ext-settings-btn:hover,
.ext-settings-btn[aria-expanded="true"] {
  color: var(--vp-c-text-1);
  opacity: 1;
  background: transparent;
}
.ext-settings-btn:active {
  transform: scale(0.94);
}
.ext-settings-btn span {
  font-size: 15px;
}
html.effects-disabled .ext-settings-btn {
  transition: none;
}
html.effects-disabled .ext-settings-btn:active {
  transform: none;
}
.ext-settings-menu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --wk-c-menu-bg
  );
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
.rating-help-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rating-help-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--wk-c-menu-bg);
  border-radius: 12px;
  padding: 10px 12px;
}
.rating-help-option strong {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.rating-help-option span {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>

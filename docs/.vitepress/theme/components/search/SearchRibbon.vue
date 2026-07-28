<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useEventListener } from '@vueuse/core'

interface PageGroup {
  key: string
  label: string
  count: number
}

const props = defineProps<{
  searchMotionDiv: string | object
  ribbonMotion: Record<string, unknown>
  searchAnimationsEnabled: boolean
  urlSearchMode: boolean
  urlPageGroups: PageGroup[]
  urlActivePageFilter: string | null
  urlMatchesLength: number
  pageGroups: PageGroup[]
  activePageFilter: string | null
  resultsLength: number
}>()

const emit = defineEmits<{
  selectUrlPage: [key: string | null]
  selectPage: [key: string | null]
}>()

const ribbonTrack = shallowRef<HTMLElement>()
const ribbonCanScrollLeft = ref(false)
const ribbonCanScrollRight = ref(false)
let ribbonAnimHandle = 0

function updateRibbonOverflow() {
  const track = getRibbonTrack()
  if (!track) { ribbonCanScrollLeft.value = false; ribbonCanScrollRight.value = false; return }
  ribbonCanScrollLeft.value = track.scrollLeft > 2
  ribbonCanScrollRight.value = track.scrollWidth - track.clientWidth - track.scrollLeft > 2
}

function getRibbonTrack(): HTMLElement | null {
  return ribbonTrack.value ?? null
}

function scrollActivePagePillIntoView(direction = 0) {
  nextTick(() => {
    const track = getRibbonTrack()
    if (!track) return
    const pills = [...track.querySelectorAll<HTMLElement>('.page-pill')]
    const activeIndex = pills.findIndex((pill) => pill.classList.contains('active'))
    const active = pills[activeIndex]
    if (!active) return
    const trackRect = track.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const gap = 8
    let nextScrollLeft = track.scrollLeft
    if (activeRect.left < trackRect.left) {
      nextScrollLeft += activeRect.left - trackRect.left - gap
    } else if (activeRect.right > trackRect.right) {
      nextScrollLeft += activeRect.right - trackRect.right + gap
    }
    const peek = pills[activeIndex + Math.sign(direction)]
    if (peek) {
      const peekRect = peek.getBoundingClientRect()
      if (direction > 0 && peekRect.right > trackRect.right) {
        nextScrollLeft += peekRect.right - trackRect.right + gap
      } else if (direction < 0 && peekRect.left < trackRect.left) {
        nextScrollLeft += peekRect.left - trackRect.left - gap
      }
    }
    const max = track.scrollWidth - track.clientWidth
    track.scrollTo({
      left: Math.max(0, Math.min(max, nextScrollLeft)),
      behavior: props.searchAnimationsEnabled ? 'smooth' : 'auto'
    })
    updateRibbonOverflow()
  })
}

function scrollRibbon(direction: number) {
  const track = getRibbonTrack()
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  const amount = track.clientWidth * 0.7 * direction
  const from = track.scrollLeft
  const to = Math.max(0, Math.min(max, from + amount))
  if (to === from) return
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
  if (!props.searchAnimationsEnabled) { track.scrollLeft = to; updateRibbonOverflow(); return }

  const duration = 280
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    track.scrollLeft = from + (to - from) * ease(t)
    updateRibbonOverflow()
    if (t < 1) ribbonAnimHandle = requestAnimationFrame(step)
    else ribbonAnimHandle = 0
  }
  ribbonAnimHandle = requestAnimationFrame(step)
}

watch(() => props.pageGroups, () => { nextTick(updateRibbonOverflow) })
watch(() => props.urlPageGroups, () => { nextTick(updateRibbonOverflow) })
useEventListener('resize', updateRibbonOverflow)

onBeforeUnmount(() => {
  if (ribbonAnimHandle) cancelAnimationFrame(ribbonAnimHandle)
})

defineExpose({ scrollActivePagePillIntoView })

function setUrlPageFilter(key: string | null) {
  emit('selectUrlPage', key)
  nextTick(updateRibbonOverflow)
}

function setPageFilter(key: string | null) {
  emit('selectPage', key)
  nextTick(updateRibbonOverflow)
}
</script>

<template>
  <component
    :is="searchMotionDiv"
    v-if="urlSearchMode
    ? urlPageGroups.length > 1
    : pageGroups.length > 1"
    class="page-ribbon"
    :class="{
      'can-scroll-left': ribbonCanScrollLeft,
      'can-scroll-right': ribbonCanScrollRight
    }"
    v-bind="ribbonMotion"
  >
    <button
      v-if="ribbonCanScrollLeft"
      type="button"
      class="page-ribbon-arrow left"
      aria-label="Scroll filters left"
      @click="scrollRibbon(-1)"
    >
      <ChevronRight :size="18" stroke-width="1.75" />
    </button>
    <div
      ref="ribbonTrack"
      class="page-ribbon-track"
      @scroll="updateRibbonOverflow"
    >
      <!-- URL mode tabs -->
      <template v-if="urlSearchMode">
        <button
          type="button"
          class="page-pill"
          :class="{ active: urlActivePageFilter === null }"
          @click="setUrlPageFilter(null)"
        >
          All
          <span class="page-pill-count">{{ urlMatchesLength }}</span>
        </button>
        <button
          v-for="group in urlPageGroups"
          :key="group.key"
          type="button"
          class="page-pill"
          :class="{ active: urlActivePageFilter === group.key }"
          @click="setUrlPageFilter(group.key)"
        >
          <span class="page-pill-label">{{ group.label }}</span>
          <span class="page-pill-count">{{ group.count }}</span>
        </button>
      </template>
      <!-- Normal mode tabs -->
      <template v-else>
        <button
          type="button"
          class="page-pill"
          :class="{ active: activePageFilter === null }"
          @click="setPageFilter(null)"
        >
          All
          <span class="page-pill-count">{{ resultsLength }}</span>
        </button>
        <button
          v-for="group in pageGroups"
          :key="group.key"
          type="button"
          class="page-pill"
          :class="{ active: activePageFilter === group.key }"
          @click="setPageFilter(group.key)"
        >
          <span class="page-pill-label">{{ group.label }}</span>
          <span class="page-pill-count">{{ group.count }}</span>
        </button>
      </template>
    </div>
    <button
      v-if="ribbonCanScrollRight"
      type="button"
      class="page-ribbon-arrow right"
      aria-label="Scroll filters right"
      @click="scrollRibbon(1)"
    >
      <ChevronRight :size="18" stroke-width="1.75" />
    </button>
  </component>
</template>

<style>
.page-ribbon {
  display: flex;
  align-items: center;
  padding: 12px 0 4px;
  padding-inline: calc(var(--spacing) * 3);
  position: relative;
  min-width: 0;
  flex: none;
  overflow: hidden;
  transition: padding-inline 0.15s;
}

.page-ribbon.can-scroll-left {
  padding-left: 42px;
}

.page-ribbon.can-scroll-right {
  padding-right: 42px;
}

.page-ribbon-track {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
}

.page-ribbon-track::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.page-ribbon-arrow {
  position: absolute;
  top: 12px;
  bottom: 4px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s;
}

.page-ribbon-arrow:hover {
  color: var(--vp-c-text-1);
}

.page-ribbon-arrow.right {
  right: 0;
  justify-content: flex-end;
  padding-right: 6px;
}

.page-ribbon-arrow.left {
  left: 0;
  justify-content: flex-start;
  padding-left: 6px;
}

.page-ribbon-arrow.left svg {
  transform: rotate(180deg);
}

.page-pill {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
  border-radius: 8px;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background-color 0.15s;
}

.page-pill:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.page-pill.active {
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  box-shadow: none;
}

.page-pill-label {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-pill-count {
  font-variant-numeric: tabular-nums;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.15);
  color: inherit;
}

.page-pill.active .page-pill-count {
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

@media (max-width: 767px) {
  .page-ribbon {
    padding: 14px 12px 4px;
  }

  .page-pill {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
}
</style>

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
const isDragging = ref(false)
let ribbonAnimHandle = 0
let dragStartX = 0
let dragStartScrollLeft = 0
let dragMoved = false
let touchStartX = 0
let touchStartScrollLeft = 0
let touchDragMoved = false

function onDragStart(e: MouseEvent) {
  // Only respond to primary (left) button
  if (e.button !== 0) return
  const track = getRibbonTrack()
  if (!track) return
  // Don't drag if user clicked on a scroll arrow
  const target = e.target as HTMLElement
  if (target.closest('.page-ribbon-arrow')) return
  
  isDragging.value = true
  dragStartX = e.clientX
  dragStartScrollLeft = track.scrollLeft
  dragMoved = false
  track.style.cursor = 'grabbing'
  track.style.userSelect = 'none'
  // Prevent text selection while dragging
  e.preventDefault()
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  const track = getRibbonTrack()
  if (!track) return
  
  const deltaX = e.clientX - dragStartX
  const threshold = 4
  if (!dragMoved && Math.abs(deltaX) > threshold) {
    dragMoved = true
  }
  
  if (dragMoved) {
    track.scrollLeft = dragStartScrollLeft - deltaX
    updateRibbonOverflow()
  }
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  const track = getRibbonTrack()
  if (track) {
    track.style.cursor = ''
    track.style.userSelect = ''
  }
}

function onTrackClick(e: MouseEvent) {
  if (dragMoved || touchDragMoved) {
    e.preventDefault()
    e.stopPropagation()
    dragMoved = false
    touchDragMoved = false
  }
}

function onTrackWheel(e: WheelEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  if (max <= 0) return
  const newScroll = Math.max(0, Math.min(max, track.scrollLeft + e.deltaX + e.deltaY))
  if (newScroll !== track.scrollLeft) {
    e.preventDefault()
    track.scrollLeft = newScroll
    updateRibbonOverflow()
  }
}

function onTouchStart(e: TouchEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const target = e.target as HTMLElement
  if (target.closest('.page-ribbon-arrow')) return
  touchStartX = e.touches[0].clientX
  touchStartScrollLeft = track.scrollLeft
  touchDragMoved = false
}

function onTouchMove(e: TouchEvent) {
  const track = getRibbonTrack()
  if (!track) return
  const deltaX = e.touches[0].clientX - touchStartX
  const threshold = 4
  if (!touchDragMoved && Math.abs(deltaX) > threshold) {
    touchDragMoved = true
  }
  if (touchDragMoved) {
    track.scrollLeft = touchStartScrollLeft - deltaX
    updateRibbonOverflow()
  }
}

function onTouchEnd() {
}

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
  // Reset drag state if component unmounts mid-drag
  if (isDragging.value) {
    onDragEnd()
  }
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
      :class="{ 'is-dragging': isDragging }"
      @scroll="updateRibbonOverflow"
      @mousedown="onDragStart"
      @mousemove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @click.capture="onTrackClick"
      @wheel="onTrackWheel"
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
  position: relative;
  min-width: 0;
  flex: none;
  overflow: hidden;
  padding: 8px 12px 0;
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
  gap: 0;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.page-ribbon-track.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.page-ribbon::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--vp-c-divider);
}

.page-ribbon-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
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

.page-ribbon-arrow.left {
  left: 0;
  justify-content: flex-start;
  padding-left: 6px;
  background: linear-gradient(to right, var(--vp-local-search-bg) 60%, transparent);
}

.page-ribbon-arrow.right {
  right: 0;
  justify-content: flex-end;
  padding-right: 6px;
  background: linear-gradient(to left, var(--vp-local-search-bg) 60%, transparent);
}

.page-ribbon-arrow:hover {
  color: var(--vp-c-text-1);
}

.page-ribbon-arrow.left svg {
  transform: rotate(180deg);
}

.page-pill {
  flex: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 36px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s;
}

.page-pill:hover {
  color: var(--vp-c-text-1);
}

.page-pill.active {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.page-pill::after {
  content: '';
  position: absolute;
  z-index: 1;
  right: 8px;
  bottom: -2px;
  left: 8px;
  height: 2px;
  background-color: transparent;
  border-radius: 0;
  transition: background-color 0.2s;
}

.page-pill.active::after {
  background-color: var(--vp-c-brand-1);
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
  border-radius: 3px;
  background: rgba(128, 128, 128, 0.12);
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.page-pill.active .page-pill-count {
  color: var(--vp-c-text-2);
  background: rgba(128, 128, 128, 0.18);
}

@media (max-width: 767px) {
  .page-pill {
    height: 32px;
    padding: 0 10px;
    font-size: 0.8rem;
  }
}
</style>

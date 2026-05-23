<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref, onMounted } from 'vue'

interface ScrapeValueObject {
  name: string
  metadata?: string[]
}

type ScrapeValue = string | ScrapeValueObject

interface NormalizedScrapeValue {
  name: string
  metadata: string[]
}

interface Site {
  name: string
  scrapes: Record<string, ScrapeValue>
}

const props = defineProps<{
  sites: Site[]
  cornerLabel?: string
}>()

function normalizeScrapeValue(value: ScrapeValue): NormalizedScrapeValue {
  if (typeof value === 'string') {
    return { name: value, metadata: [] }
  }

  return {
    name: value.name,
    metadata: value.metadata ?? [],
  }
}

function hasMetadata(value: NormalizedScrapeValue | undefined, metadata: string) {
  return value?.metadata.some(item => item.toLowerCase() === metadata.toLowerCase()) ?? false
}

function getScrapeTitle(value: NormalizedScrapeValue | undefined) {
  return value?.name || undefined
}

// Normalize source names (case-insensitive dedup, keep first-seen casing)
const normalizedSites = computed(() => {
  const canonical: Record<string, string> = {}
  for (const site of props.sites) {
    for (const source of Object.keys(site.scrapes)) {
      const key = source.toLowerCase()
      if (!canonical[key]) canonical[key] = source
    }
  }
  return props.sites.map(site => {
    const scrapes: Record<string, NormalizedScrapeValue> = {}
    for (const [source, value] of Object.entries(site.scrapes)) {
      scrapes[canonical[source.toLowerCase()]] = normalizeScrapeValue(value)
    }
    return { name: site.name, scrapes }
  })
})

const sources = computed(() => {
  const count: Record<string, number> = {}
  for (const site of normalizedSites.value) {
    for (const source of Object.keys(site.scrapes)) {
      count[source] = (count[source] || 0) + 1
    }
  }
  return Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b))
})

const HEADER_MIN_PX = 48
const HEADER_MAX_PX = 140
const HEADER_PER_CHAR_PX = 7.2
const HEADER_PADDING_PX = 20

const headerHeight = computed(() => {
  const longest = sources.value.reduce((n, s) => Math.max(n, s.length), 0)
  const raw = Math.round(longest * HEADER_PER_CHAR_PX) + HEADER_PADDING_PX
  return Math.min(HEADER_MAX_PX, Math.max(HEADER_MIN_PX, raw))
})

// Drag to scroll + scroll indicator
const wrapRef = ref<HTMLElement | null>(null)
const canScrollRight = ref(false)
const isDragging = ref(false)
let isPending = false
let startX = 0
let scrollStart = 0
let pendingPointerId = -1

const SCROLL_END_PX = 2
const DRAG_THRESHOLD_PX = 5

function checkScroll() {
  const el = wrapRef.value
  if (!el) return
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - SCROLL_END_PX
}

function isTextTarget(e: PointerEvent) {
  const target = e.target as Node | null
  if (!target) return false
  const node = target.nodeType === Node.TEXT_NODE ? target.parentElement : target as Element
  if (!node) return false
  const style = window.getComputedStyle(node as Element)
  return style.userSelect !== 'none' && style.cursor !== 'default' || (node as Element).closest('td.site-name, th') !== null
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const el = wrapRef.value
  if (!el) return
  // Don't initiate drag when clicking on selectable text elements
  if (isTextTarget(e)) return
  isPending = true
  startX = e.clientX
  scrollStart = el.scrollLeft
  pendingPointerId = e.pointerId
}

function onPointerMove(e: PointerEvent) {
  const el = wrapRef.value
  if (!el) return

  // If user is actively selecting text, abort drag
  if (isPending && window.getSelection()?.type === 'Range') {
    isPending = false
    return
  }

  if (isPending && Math.abs(e.clientX - startX) > DRAG_THRESHOLD_PX) {
    isPending = false
    isDragging.value = true
    el.setPointerCapture(pendingPointerId)
  }

  if (!isDragging.value) return
  el.scrollLeft = scrollStart - (e.clientX - startX)
}

function onPointerUp(e: PointerEvent) {
  isPending = false
  isDragging.value = false
  if (wrapRef.value) {
    wrapRef.value.releasePointerCapture(e.pointerId)
  }
}

onMounted(() => {
  checkScroll()
  useEventListener(wrapRef, 'scroll', checkScroll, { passive: true })
  useEventListener(window, 'resize', checkScroll, { passive: true })
})
</script>

<template>
  <div class="scrape-table-outer" :style="{ '--scrape-header-height': `${headerHeight}px` }">
    <div
      ref="wrapRef"
      class="scrape-table-wrap"
      :style="{ cursor: isDragging ? 'grabbing' : 'auto', userSelect: isDragging ? 'none' : 'auto' }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <table class="scrape-table">
        <colgroup>
          <col />
          <col v-for="source in sources" :key="source" class="col-cell" />
        </colgroup>
        <thead>
          <tr>
            <th class="corner">
              {{ cornerLabel ?? 'Sources' }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;margin-left:4px;color:inherit">
                <path fill="currentColor" d="m12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </th>
            <th v-for="source in sources" :key="source" class="source-header">
              <span>{{ source }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in normalizedSites" :key="site.name">
            <td class="site-name">{{ site.name }}</td>
            <td
              v-for="source in sources"
              :key="source"
              class="cell"
              :class="{
                active: source in site.scrapes,
                'active-sd': hasMetadata(site.scrapes[source], 'SD'),
              }"
              :title="getScrapeTitle(site.scrapes[source])"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="canScrollRight" class="scroll-indicator">
      <span class="i-lucide-chevron-right" />
    </div>
  </div>
</template>

<style>
.scrape-table-outer {
  position: relative;
  margin: 16px 0;
}

.scrape-table-wrap {
  overflow-x: auto;
  max-width: 100%;
}

.scroll-indicator {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, transparent, var(--vp-c-bg) 70%);
  pointer-events: none;
  color: var(--vp-c-text-2);
  font-size: 20px;
  animation: pulse-right 1.5s ease-in-out infinite;
}

@keyframes pulse-right {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(4px); }
}
</style>
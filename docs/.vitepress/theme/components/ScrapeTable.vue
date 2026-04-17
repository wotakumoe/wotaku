<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref, onMounted } from 'vue'

interface Site {
  name: string
  scrapes: Record<string, string>
}

const props = defineProps<{
  sites: Site[]
}>()

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
    const scrapes: Record<string, string> = {}
    for (const [source, player] of Object.entries(site.scrapes)) {
      scrapes[canonical[source.toLowerCase()]] = player
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
let isDragging = false
let startX = 0
let scrollStart = 0

const SCROLL_END_PX = 2

function checkScroll() {
  const el = wrapRef.value
  if (!el) return
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - SCROLL_END_PX
}

function onPointerDown(e: PointerEvent) {
  const el = wrapRef.value
  if (!el) return
  isDragging = true
  startX = e.clientX
  scrollStart = el.scrollLeft
  el.setPointerCapture(e.pointerId)
  el.style.cursor = 'grabbing'
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging || !wrapRef.value) return
  wrapRef.value.scrollLeft = scrollStart - (e.clientX - startX)
}

function onPointerUp(e: PointerEvent) {
  isDragging = false
  if (wrapRef.value) {
    wrapRef.value.releasePointerCapture(e.pointerId)
    wrapRef.value.style.cursor = ''
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
            <th class="corner">Sources</th>
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
              :class="{ active: source in site.scrapes }"
              :title="site.scrapes[source] || undefined"
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
  cursor: grab;
  user-select: none;
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

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { renderEmojiShortcodes } from '../../configs/markdown/emoji'
import type { HomeCard } from '../../configs/constants'

const props = defineProps<{ cards: HomeCard[] }>()

const STORAGE_KEY = 'wotaku-home-cards-v1'
const PREFS_KEY = 'wotaku-home-prefs-v1'

interface CardState {
  order: string[]
  hidden: string[]
}

function defaultState(): CardState {
  return {
    order: props.cards.map((c) => c.id),
    hidden: props.cards.filter((c) => !c.featured).map((c) => c.id)
  }
}

const state = ref<CardState>(defaultState())

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const parsed: CardState = JSON.parse(raw)
    const allIds = new Set(props.cards.map((c) => c.id))
    const validOrder = parsed.order.filter((id) => allIds.has(id))
    const seenIds = new Set(validOrder)
    const newIds = props.cards.map((c) => c.id).filter((id) => !seenIds.has(id))
    state.value = {
      order: [...validOrder, ...newIds],
      hidden: (parsed.hidden ?? []).filter((id: string) => allIds.has(id))
    }
  } catch {}
})

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
}

const cardMap = computed(() => new Map(props.cards.map((c) => [c.id, c])))

const orderedCards = computed(() =>
  state.value.order.map((id) => cardMap.value.get(id)!).filter(Boolean)
)

const hiddenSet = computed(() => new Set(state.value.hidden))

const visibleCards = computed(() => {
  const base = sortMode.value === 'default' ? props.cards : orderedCards.value
  return base.filter((c) => !hiddenSet.value.has(c.id))
})

const grid = computed(() => {
  const n = visibleCards.value.length
  if (n === 0) return undefined
  if (columnMode.value === 'max') return 'grid-max'
  if (n === 2) return 'grid-2'
  if (n === 3) return 'grid-3'
  if (n % 3 === 0) return 'grid-6'
  if (n > 3) return 'grid-4'
  return undefined
})

function cardIcon(card: HomeCard) {
  return renderEmojiShortcodes(card.icon)
}

/* ── Manager panel ── */
const panelOpen = ref(false)
const dropdownOpen = ref(false)
const sortMode = ref<'default' | 'user' | 'active'>('default')
const columnMode = ref<'default' | 'max'>('default')
const viewMode = ref<'default' | 'mini'>('default')

onMounted(() => {
  try {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}')
    if (prefs.sortMode === 'user') sortMode.value = 'user'
    else if (prefs.sortMode === 'active') sortMode.value = 'active'
    if (prefs.columnMode === 'max') columnMode.value = 'max'
    if (prefs.viewMode === 'mini') viewMode.value = 'mini'
  } catch {}
})

watch([sortMode, columnMode, viewMode], () => {
  localStorage.setItem(PREFS_KEY, JSON.stringify({
    sortMode: sortMode.value,
    columnMode: columnMode.value,
    viewMode: viewMode.value
  }))
})

const panelCards = computed(() => {
  if (sortMode.value === 'active') {
    const visible = orderedCards.value.filter((c) => !hiddenSet.value.has(c.id))
    const hidden = orderedCards.value.filter((c) => hiddenSet.value.has(c.id))
    return [...visible, ...hidden]
  }
  if (sortMode.value === 'user') return orderedCards.value
  return props.cards
})

function toggleCard(id: string) {
  const h = state.value.hidden
  const i = h.indexOf(id)
  if (i === -1) h.push(id)
  else h.splice(i, 1)
  save()
}

function showAll() {
  state.value.hidden = []
  save()
}

function hideAll() {
  state.value.hidden = props.cards.map((c) => c.id)
  save()
}

function resetDefaults() {
  state.value = defaultState()
  save()
}

/* ── Drag-to-reorder (pointer events — works on mouse & touch) ── */
const dragging = ref<string | null>(null)
const dragTarget = ref<string | null>(null)
const cardListEl = ref<HTMLElement | null>(null)
const ghostPos = ref<{ x: number; y: number } | null>(null)

function onHandlePointerDown(e: PointerEvent, id: string) {
  e.preventDefault()
  dragging.value = id
  dragTarget.value = null
  ghostPos.value = { x: e.clientX, y: e.clientY }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onHandlePointerMove(e: PointerEvent) {
  if (!dragging.value) return
  ghostPos.value = { x: e.clientX, y: e.clientY }
  const items = cardListEl.value?.querySelectorAll<HTMLElement>('[data-card-id]')
  if (!items) return
  for (const item of items) {
    const rect = item.getBoundingClientRect()
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      const id = item.dataset.cardId!
      if (id !== dragging.value) dragTarget.value = id
      break
    }
  }
}

function onHandlePointerUp() {
  if (dragging.value && dragTarget.value) {
    const order = [...state.value.order]
    const from = order.indexOf(dragging.value)
    const to = order.indexOf(dragTarget.value)
    if (from !== -1 && to !== -1) {
      order.splice(from, 1)
      order.splice(to, 0, dragging.value)
      state.value.order = order
      save()
      if (sortMode.value === 'default') sortMode.value = 'user'
    }
  }
  dragging.value = null
  dragTarget.value = null
  ghostPos.value = null
}
</script>

<template>
  <!-- ── Feature Grid ── -->
  <div class="home-features">
    <div class="container">
      <div class="items" :class="{ 'view-mini': viewMode === 'mini' }">
        <div
          v-for="card in visibleCards"
          :key="card.id"
          class="item"
          :class="grid"
        >
          <a class="card" :href="card.link">
            <article class="box">
              <div class="icon" v-html="cardIcon(card)" />
              <h2 class="title">{{ card.title }}</h2>
              <p class="details">{{ card.details }}</p>
            </article>
          </a>
        </div>
      </div>
      <button class="gear-btn" aria-label="Customize cards" @click="panelOpen = true">
        <span class="i-lucide-ellipsis-vertical" />
      </button>
    </div>
  </div>

  <!-- ── Manager Panel ── -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="panelOpen" class="backdrop" @click.self="panelOpen = false">
        <Transition name="slide-up" appear>
          <div v-if="panelOpen" class="panel" role="dialog" aria-modal="true" aria-label="Customize cards">
            <div class="panel-head">
              <span class="panel-title">Customize Cards</span>
              <button class="close-btn" aria-label="Close" @click="panelOpen = false">
                <span class="i-lucide-x" />
              </button>
            </div>

            <ul ref="cardListEl" class="card-list" :class="grid">
              <li
                v-for="card in panelCards"
                :key="card.id"
                :data-card-id="card.id"
                class="card-row"
                :class="{
                  'is-dragging': dragging === card.id,
                  'is-over': dragTarget === card.id && dragging !== card.id,
                  'is-hidden': hiddenSet.has(card.id)
                }"
              >
                <span
                  class="row-handle"
                  aria-hidden="true"
                  @pointerdown="onHandlePointerDown($event, card.id)"
                  @pointermove="onHandlePointerMove"
                  @pointerup="onHandlePointerUp"
                >
                  <span class="i-lucide-grip-vertical" />
                </span>
                <span class="row-icon" v-html="cardIcon(card)" />
                <span class="row-name">{{ card.title }}</span>
                <button
                  class="row-toggle"
                  :class="{ active: !hiddenSet.has(card.id) }"
                  :aria-label="hiddenSet.has(card.id) ? 'Show' : 'Hide'"
                  @click="toggleCard(card.id)"
                >
                  <span :class="hiddenSet.has(card.id) ? 'i-lucide-eye-off' : 'i-lucide-eye'" />
                </button>
              </li>
            </ul>

            <div class="panel-foot">
              <div class="foot-group">
                <button class="tool-btn" aria-label="Show all" @click="showAll">
                  <span class="i-lucide-eye" />
                </button>
                <button class="tool-btn" aria-label="Hide all" @click="hideAll">
                  <span class="i-lucide-eye-off" />
                </button>
              </div>
              <div class="foot-group">
                <div class="settings-wrap">
                  <div v-if="dropdownOpen" class="dropdown-overlay" @click="dropdownOpen = false" />
                  <div v-if="dropdownOpen" class="settings-dropdown">
                    <div class="dropdown-section">
                      <span class="dropdown-label">Sort</span>
                      <div class="dropdown-group">
                        <button class="tool-btn" :class="{ 'is-active': sortMode === 'default' }" @click="sortMode = 'default'">Default</button>
                        <button class="tool-btn" :class="{ 'is-active': sortMode === 'user' }" @click="sortMode = 'user'">User</button>
                        <button class="tool-btn" :class="{ 'is-active': sortMode === 'active' }" @click="sortMode = 'active'">Active</button>
                      </div>
                    </div>
                    <div class="dropdown-section">
                      <span class="dropdown-label">View</span>
                      <div class="dropdown-group">
                        <button class="tool-btn" :class="{ 'is-active': viewMode === 'default' }" @click="viewMode = 'default'">Default</button>
                        <button class="tool-btn" :class="{ 'is-active': viewMode === 'mini' }" @click="viewMode = 'mini'">Mini</button>
                      </div>
                    </div>
                    <div class="dropdown-section">
                      <span class="dropdown-label">Columns</span>
                      <div class="dropdown-group">
                        <button class="tool-btn" :class="{ 'is-active': columnMode === 'default' }" @click="columnMode = 'default'">Default</button>
                        <button class="tool-btn" :class="{ 'is-active': columnMode === 'max' }" @click="columnMode = 'max'">Max</button>
                      </div>
                    </div>
                  </div>
                  <button
                    class="tool-btn"
                    :class="{ 'is-active': dropdownOpen }"
                    aria-label="Display settings"
                    @click.stop="dropdownOpen = !dropdownOpen"
                  >
                    <span class="i-lucide-settings-2" />
                  </button>
                </div>
                <button class="tool-btn" aria-label="Reset to default" @click="resetDefaults">
                  <span class="i-lucide-refresh-ccw" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="ghost-fade">
      <div
        v-if="dragging && ghostPos"
        class="drag-ghost"
        :style="{ left: ghostPos.x + 'px', top: ghostPos.y + 'px' }"
      >
        <span class="row-icon" v-html="cardIcon(cardMap.get(dragging)!)" />
        <span class="drag-ghost-name">{{ cardMap.get(dragging)?.title }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Grid ── */
.home-features {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .home-features { padding: 0 48px; }
}

@media (min-width: 960px) {
  .home-features { padding: 0 64px; }
}

.container {
  position: relative;
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 { width: calc(100% / 2); }
}

@media (min-width: 768px) {
  .item.grid-2,
  .item.grid-4 { width: calc(100% / 2); }
  .item.grid-3,
  .item.grid-6 { width: calc(100% / 3); }
}

@media (min-width: 960px) {
  .item.grid-4 { width: calc(100% / 4); }
}

@media (min-width: 640px) {
  .item.grid-max { width: calc(100% / 2); }
}

@media (min-width: 768px) {
  .item.grid-max { width: calc(100% / 3); }
}

@media (min-width: 960px) {
  .item.grid-max { width: calc(100% / 4); }
}

/* ── Card ── */
.card {
  display: block;
  border: 2px solid #3d3d3d;
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 27px;
  transition: background-color 0.25s;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* ── Mini View ── */
.view-mini .box {
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}

.view-mini .icon {
  width: 32px;
  height: 32px;
  font-size: 18px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.view-mini .title {
  font-size: 14px;
  line-height: 1.3;
}

.view-mini .details {
  display: none;
}

/* ── Gear Button ── */
.gear-btn {
  position: absolute;
  top: 8px;
  right: 0;
  transform: translateX(100%);
  background: none;
  border: none;
  padding: 4px;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.gear-btn:hover {
  color: var(--vp-c-brand-1);
}

/* ── Backdrop ── */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* ── Panel ── */
.panel {
  width: min(520px, calc(100vw - 32px));
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 2px solid #3d3d3d;
  background: var(--vp-c-bg);
}

@media (min-width: 768px) {
  .panel { width: min(720px, calc(100vw - 32px)); }
}

@media (min-width: 960px) {
  .panel { width: min(940px, calc(100vw - 32px)); }
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.close-btn::after {
  content: attr(aria-label);
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 10;
}

.close-btn:hover::after {
  opacity: 1;
}

/* ── Card List ── */
.card-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  overflow-y: auto;
  min-height: 0;
}

@media (min-width: 640px) {
  .card-list { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 768px) {
  .card-list { grid-template-columns: 1fr 1fr 1fr; }
  .card-list.grid-2,
  .card-list.grid-4 { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 960px) {
  .card-list.grid-4,
  .card-list.grid-max { grid-template-columns: 1fr 1fr 1fr 1fr; }
}

.card-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  transition: background 0.15s, opacity 0.15s;
  user-select: none;
}

.card-row:hover {
  background: var(--vp-c-bg-soft);
}

.card-row.is-dragging {
  opacity: 0.25;
  cursor: grabbing;
}

.card-row.is-over {
  background: var(--vp-c-brand-soft);
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.card-row.is-hidden {
  opacity: 0.45;
}

.row-handle {
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  font-size: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: grab;
  touch-action: none;
}

.row-handle:active {
  cursor: grabbing;
}

.row-icon {
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 20px;
}

.row-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.row-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.row-toggle:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.row-toggle.active {
  color: var(--vp-c-brand-1);
}

/* ── Panel Footer ── */
.panel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  gap: 8px;
}

.foot-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 5px;
  padding: 5px 6px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.tool-btn[aria-label]::after {
  content: attr(aria-label);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 10;
}

.tool-btn[aria-label]:hover::after {
  opacity: 1;
}

.tool-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.tool-btn.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ── Settings Dropdown ── */
.settings-wrap {
  position: relative;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
}

.settings-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 2;
  min-width: 196px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.dropdown-section + .dropdown-section {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 8px;
  padding-top: 8px;
}

.dropdown-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  margin-bottom: 6px;
}

.dropdown-group {
  display: flex;
  gap: 4px;
}

/* ── Drag Ghost ── */
.drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  opacity: 0.88;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  user-select: none;
  transform: translate(12px, -50%);
}

.drag-ghost-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.ghost-fade-enter-active,
.ghost-fade-leave-active { transition: opacity 0.1s ease; }
.ghost-fade-enter-from,
.ghost-fade-leave-to { opacity: 0; }

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease; }
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.15s ease; }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
.slide-up-leave-to { transform: translateY(10px); opacity: 0; }
</style>

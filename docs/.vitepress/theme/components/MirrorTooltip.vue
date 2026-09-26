<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { resolveFaviconUrl, useFavicons } from '../composables/useFavicons'

const props = withDefaults(
  defineProps<{
    id?: string
    title?: string
    src?: string
    note?: string
    noteType?: string
    mirrors?: string | string[]
  }>(),
  {
    id: '',
    title: 'Mirrors',
    src: '',
    note: '',
    noteType: 'warning',
    mirrors: () => []
  }
)

const NOTE_TYPES = ['info', 'tip', 'warning', 'danger'] as const

const noteClass = computed(() =>
  `mirror-note--${NOTE_TYPES.includes(props.noteType as typeof NOTE_TYPES[number]) ? props.noteType : 'warning'}`
)

/** Minimal `[text](url)` support for notes (in-wiki + outbound). */
function renderNoteLinks(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, t: string, u: string) => {
      const safeUrl = u.replace(/"/g, '&quot;')
      const safeText = t.replace(/"/g, '&quot;')
      const attrs = /^https?:\/\//i.test(u)
        ? ` href="${safeUrl}" target="_blank" rel="noopener noreferrer"`
        : ` href="${safeUrl}"`
      return `<a${attrs}>${safeText}</a>`
    }
  )
}

const noteHtml = computed(() => renderNoteLinks(props.note))

const isOpen = ref(false)
const buttonRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const panelStyle = ref<Record<string, string>>({})

const mirrorList = computed<string[]>(() => {
  const raw = props.mirrors
  const list: string[] = Array.isArray(raw)
    ? [...raw]
    : typeof raw === 'string' && raw.trim()
      ? (() => {
          try {
            const parsed: unknown = JSON.parse(raw)
            return Array.isArray(parsed)
              ? parsed.filter((u): u is string => typeof u === 'string')
              : []
          } catch {
            return []
          }
        })()
      : []
  const out: string[] = []
  const seen = new Set<string>()
  for (const u of list) {
    const url = (u ?? '').trim()
    if (!url || seen.has(url)) continue
    seen.add(url)
    out.push(url)
  }
  return out
})

interface UrlParts {
  key: string
  pre: string
  tld: string
  post: string
  domain: string
  isOnion: boolean
}

/** Split `name.tld/path` (scheme hidden) so the last domain label (`.app`, `.com`) can be bolded. */
const MAX_URL_CHARS = 32
const MAX_POST_CHARS = 14

function splitUrl(url: string): UrlParts {
  let pre: string
  let tld: string
  let post: string
  let domain = ''
  try {
    const parsed = new URL(url)
    const host = parsed.host
    domain = host.toLowerCase()
    const displayHost = host.replace(/^www\./i, '')
    const dot = displayHost.lastIndexOf('.')
    if (dot > 0) {
      pre = displayHost.slice(0, dot)
      tld = displayHost.slice(dot)
    } else {
      pre = displayHost
      tld = ''
    }
    post = `${parsed.pathname === '/' ? '/' : parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    pre = url.replace(/^https?:\/\//i, '')
    tld = ''
    post = ''
  }
  const isOnion = domain
    ? domain.endsWith('.onion')
    : /\.onion(\/|$)/i.test(url)

  // Middle-truncate long URLs: the TLD/end stays visible, the middle shrinks.
  if (pre.length + tld.length + post.length > MAX_URL_CHARS) {
    const shownPost = post.length > MAX_POST_CHARS
      ? post.slice(0, MAX_POST_CHARS - 1) + '…'
      : post
    const preBudget = Math.max(10, MAX_URL_CHARS - tld.length - shownPost.length)
    const shownPre = pre.length > preBudget
      ? pre.slice(0, preBudget - 1) + '…'
      : pre
    return { key: url, pre: shownPre, tld, post: shownPost, domain, isOnion }
  }
  return { key: url, pre, tld, post, domain, isOnion }
}

const rows = computed<UrlParts[]>(() => mirrorList.value.map(splitUrl))

const { faviconsEnabled } = useFavicons()
const faviconMap = ref<Record<string, string | null>>({})

async function loadFavicons() {
  if (!faviconsEnabled.value) return
  for (const row of rows.value) {
    if (row.isOnion || !row.domain || faviconMap.value[row.key] !== undefined) {
      continue
    }
    faviconMap.value[row.key] = await resolveFaviconUrl(row.domain)
  }
}

// Fixed-position panel teleported to <body> so table overflow clipping
// (and tab containers) can't cut it off — same approach as icon-tip-popup.
function positionPanel() {
  const btn = buttonRef.value
  const panel = panelRef.value
  if (!btn || !panel) return
  const rect = btn.getBoundingClientRect()
  const pw = panel.offsetWidth
  const ph = panel.offsetHeight
  const margin = 8
  let left = rect.left + rect.width / 2 - pw / 2
  left = Math.max(margin, Math.min(left, window.innerWidth - pw - margin))
  let top = rect.top - ph - 8
  if (top < margin) top = rect.bottom + 8
  if (top + ph > window.innerHeight - margin) {
    top = Math.max(margin, window.innerHeight - ph - margin)
  }
  panelStyle.value = { left: `${left}px`, top: `${top}px` }
}

function onDocumentClick(e: MouseEvent) {
  const t = e.target as Node | null
  if (!t) return
  if (buttonRef.value?.contains(t)) return
  if (panelRef.value?.contains(t)) return
  isOpen.value = false
}

function onScroll(e: Event) {
  const t = e.target as Node | null
  if (t && panelRef.value?.contains(t)) return
  isOpen.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

function onResize() {
  if (isOpen.value) positionPanel()
}

watch(isOpen, (open) => {
  if (!open) {
    document.removeEventListener('click', onDocumentClick, true)
    document.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('resize', onResize)
    return
  }
  void nextTick(() => {
    positionPanel()
    void loadFavicons()
  })
  document.addEventListener('click', onDocumentClick, true)
  document.addEventListener('scroll', onScroll, true)
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})

watch(faviconsEnabled, (enabled) => {
  if (enabled && isOpen.value) void loadFavicons()
})
</script>

<template>
  <span ref="buttonRef" class="mirror-wrapper">
    <button
      type="button"
      aria-label="Mirrors"
      class="mirror-btn size-3 p-0 select-none font-bold cursor-pointer"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <div class="i-material-symbols-directions-alt" />
    </button>
  </span>

  <Teleport to="body">
    <Transition name="mirror-panel">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="mirror-panel"
        :style="panelStyle"
        role="dialog"
        :aria-label="`Mirrors for ${title}`"
      >
        <div class="mirror-head">
          <span class="mirror-head-title">{{ title }}</span>
          <span class="mirror-head-count">{{ rows.length }}</span>
        </div>
        <p v-if="note" class="mirror-note" :class="noteClass" v-html="noteHtml" />
        <div class="mirror-scroll">
          <ul v-if="rows.length" class="mirror-list">
            <li v-for="row in rows" :key="row.key" class="mirror-item">
              <a
                :href="row.key"
                target="_blank"
                rel="noopener noreferrer"
                class="mirror-link"
                :title="row.key"
              >
                <img
                  v-if="faviconsEnabled && !row.isOnion && faviconMap[row.key]"
                  :src="faviconMap[row.key] ?? undefined"
                  class="mirror-favicon"
                  alt=""
                  width="14"
                  height="14"
                  loading="lazy"
                  decoding="async"
                  @error="faviconMap[row.key] = null"
                />
                <span
                  v-else-if="row.isOnion"
                  class="i-simple-icons-torbrowser mirror-link-icon"
                  aria-hidden="true"
                />
                <span
                  v-else
                  class="i-lucide-globe mirror-link-icon"
                  aria-hidden="true"
                />
                <span class="mirror-link-text">{{ row.pre }}<strong class="mirror-tld">{{ row.tld }}</strong>{{ row.post }}</span>
              </a>
            </li>
          </ul>
          <p v-else class="mirror-empty">No mirrors listed yet.</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mirror-wrapper {
  display: inline-flex !important;
  vertical-align: -0.125em;
}

.mirror-btn {
  color: var(--vp-c-brand-1);
}

.mirror-panel {
  position: fixed;
  z-index: 9999;
  width: 282px;
  max-width: calc(100vw - 24px);
  background-color: var(--vp-c-bg-elv);
  border: 2px solid #3d3d3d;
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  transform-origin: top center;
  overflow: hidden;
}

.mirror-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 6px;
  user-select: none;
}

.mirror-head-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.mirror-head-count {
  flex: none;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 0 7px;
  line-height: 18px;
}

.mirror-scroll {
  max-height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 4px 8px 10px;
}

.mirror-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mirror-item {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 2px 4px;
  transition: background-color 0.15s;
}

.mirror-item:hover {
  background: var(--vp-c-default-soft);
}

.mirror-link {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  padding: 4px 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.15s;
}

.mirror-link:hover {
  color: var(--vp-c-brand-1);
}

.mirror-link-icon {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.mirror-favicon {
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.mirror-link-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mirror-tld {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.mirror-empty {
  margin: 0;
  padding: 8px 6px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.mirror-note {
  margin: 2px 8px 6px;
  padding: 6px 8px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 8px;
}

.mirror-note--info {
  color: var(--vp-custom-block-info-text);
  background-color: var(--vp-custom-block-info-bg);
  border-color: var(--vp-custom-block-info-border);
}

.mirror-note--tip {
  color: var(--vp-custom-block-tip-text);
  background-color: var(--vp-custom-block-tip-bg);
  border-color: var(--vp-custom-block-tip-border);
}

.mirror-note--warning {
  color: var(--vp-custom-block-warning-text);
  background-color: var(--vp-custom-block-warning-bg);
  border-color: var(--vp-custom-block-warning-border);
}

.mirror-note--danger {
  color: var(--vp-custom-block-danger-text);
  background-color: var(--vp-custom-block-danger-bg);
  border-color: var(--vp-custom-block-danger-border);
}

.mirror-note :deep(a) {
  color: inherit;
  font-weight: 600;
  text-decoration: underline dashed;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.mirror-panel-enter-active,
.mirror-panel-leave-active {
  transition: opacity 0.15s, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.mirror-panel-enter-from,
.mirror-panel-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}

</style>

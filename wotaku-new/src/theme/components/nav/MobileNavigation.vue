<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useEventListener, usePreferredReducedMotion, useWindowSize } from '@vueuse/core'
import { useData, useRoute } from '@/theme/shared/client'
import { List, ListTree, Maximize2, Search, Settings, X } from 'lucide-vue-next'
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from 'reka-ui'
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
import { useLayout } from '../../composables/base/layout'
import { useEffects } from '../../composables/use-effects'
import { useMobileNavigation } from '../../composables/use-mobile-navigation'
import { getSidebarGroups } from '../../shared/base/sidebar'
import { openSearch, searchOpen } from '../../shared/search-state'
import { settingsOpen } from '../../shared/settings-state'
import WotakuDocOutlineItem from '../doc/WotakuDocOutlineItem.vue'
import WotakuLink from '../link/WotakuLink.vue'
import SettingsScreenMenu from '../settings/SettingsScreenMenu.vue'
import WotakuImage from '../WotakuImage.vue'
import MobileNavigationItem from './MobileNavigationItem.vue'
import MobileNavigationPage from './MobileNavigationPage.vue'

const { mobile, mounted, island, presentation, tabs } = useMobileNavigation()
const { frontmatter, theme, dir } = useData()
const enabled = computed(
  () => mounted.value && mobile.value && frontmatter.value.navbar !== false
)
const tabbed = computed(() => island.value && tabs.value)
const fullscreen = computed(() => !island.value || presentation.value === 'fullscreen')
const underlay = computed(() => island.value && presentation.value === 'underlay')
const { sidebar, headers, isHome } = useLayout()
const groups = computed(() =>
  getSidebarGroups([...sidebar.value]).flatMap((group) =>
    group.text ? [group] : (group.items ?? [])
  )
)
const route = useRoute()
const open = ref(false)
const entering = ref(false)
const { effectsEnabled } = useEffects()
const view = ref('navigation')
const navigationView = ref('navigation')
const navigating = ref(false)
const hidden = ref(false)
const panel = ref<HTMLElement>()
const dialog = ref<InstanceType<typeof DialogContent>>()
const navigationButton = ref<HTMLButtonElement>()
const settingsButton = ref<HTMLButtonElement>()
let returnFocus: HTMLElement | undefined
const { height: viewportHeight } = useWindowSize({ type: 'visual' })
const heightRatio = ref(0.5)
const sheetHeight = computed(() =>
  fullscreen.value
    ? viewportHeight.value
    : Math.min(
        Math.max(256, viewportHeight.value * heightRatio.value),
        viewportHeight.value - 16
      )
)
const viewportBottom = ref(0)
const reducedMotion = usePreferredReducedMotion()
const logoLink = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? theme.value.logoLink
    : (theme.value.logoLink?.link ?? '/')
)
let scrollAnchor = 0
let gesture:
  | {
      id: number
      target: HTMLElement
      y: number
      height: number
      moved: boolean
    }
  | undefined
let suppressClick = false

useEventListener(globalThis.window?.visualViewport, ['resize', 'scroll'], () => {
  const viewport = window.visualViewport
  viewportBottom.value = viewport
    ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
    : 0
})
useEventListener(
  globalThis.window,
  'scroll',
  () => {
    // Clamp elastic overscroll; tiny reversals must not flicker the controls.
    const y = Math.max(
      0,
      Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight)
    )

    if (!island.value || open.value || searchOpen.value || settingsOpen.value) {
      scrollAnchor = y
      return
    }

    if (y < 64 || y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      hidden.value = false
      scrollAnchor = y
    } else if (hidden.value) {
      scrollAnchor = Math.max(scrollAnchor, y)

      if (scrollAnchor - y >= 48) {
        hidden.value = false
        scrollAnchor = y
      }
    } else {
      scrollAnchor = Math.min(scrollAnchor, y)

      if (y - scrollAnchor >= 80) {
        hidden.value = true
        scrollAnchor = y
      }
    }
  },
  { passive: true }
)

function openNavigation(section = 'navigation') {
  returnFocus =
    document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  entering.value = effectsEnabled.value && reducedMotion.value !== 'reduce'
  view.value = section

  if (section !== 'settings') navigationView.value = section

  navigating.value = false
  hidden.value = false
  scrollAnchor = window.scrollY
  heightRatio.value = 0.5
  open.value = true
}

function onNavigate(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('button')) return

  const link = event.target instanceof Element ? event.target.closest('a[href]') : null

  if (
    !(link instanceof HTMLAnchorElement) ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.download ||
    (link.target && link.target !== '_self') ||
    link.origin !== location.origin
  )
    return

  navigating.value = true
  open.value = false
}

async function openAction(action: () => void) {
  open.value = false
  await nextTick()
  action()
}

function focusNavigation(event: Event) {
  event.preventDefault()
  void nextTick(() => {
    if (view.value === 'settings') {
      settingsButton.value?.focus({ preventScroll: true })
      return
    }

    if (tabbed.value) {
      dialog.value?.$el.querySelector('[role="tab"][aria-selected="true"]')?.focus()
      return
    }

    const link = panel.value?.querySelector<HTMLElement>('[aria-current="page"]')
    const target = link ?? panel.value?.querySelector<HTMLElement>('summary, a[href]')
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ block: 'nearest' })
  })
}

function restoreFocus(event: Event) {
  event.preventDefault()

  if (!navigating.value && !searchOpen.value && !settingsOpen.value) {
    const target =
      returnFocus?.isConnected && returnFocus.getClientRects().length
        ? returnFocus
        : island.value
          ? navigationButton.value
          : document.querySelector<HTMLElement>('.nav-settings-mobile')
    target?.focus({ preventScroll: true })
  }
}

function startResize(event: PointerEvent) {
  if (
    !event.isPrimary ||
    event.button !== 0 ||
    !(event.currentTarget instanceof HTMLElement)
  )
    return

  gesture = {
    id: event.pointerId,
    target: event.currentTarget,
    y: event.clientY,
    height: sheetHeight.value,
    moved: false
  }
  suppressClick = false
  gesture.target.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function resize(event: PointerEvent) {
  if (!gesture || gesture.id !== event.pointerId) return

  const delta = gesture.y - event.clientY

  if (!gesture.moved && Math.abs(delta) < 4) return

  gesture.moved = true
  heightRatio.value = Math.min(
    1,
    Math.max(0.5, (gesture.height + delta) / viewportHeight.value)
  )
}

function finishResize() {
  const current = gesture

  if (!current) return

  gesture = undefined
  suppressClick = current.moved

  if (current.target.hasPointerCapture(current.id)) {
    current.target.releasePointerCapture(current.id)
  }
}

function toggleHeight(event: MouseEvent) {
  if (suppressClick && event.detail !== 0) {
    suppressClick = false
    return
  }

  heightRatio.value = heightRatio.value > 0.5 ? 0.5 : 1
}

function resizeKey(event: KeyboardEvent) {
  const heights: Record<string, number> = {
    ArrowUp: heightRatio.value + 0.1,
    ArrowDown: heightRatio.value - 0.1,
    Home: 0.5,
    End: 1
  }
  const next = heights[event.key]

  if (next === undefined) return

  event.preventDefault()
  heightRatio.value = Math.min(1, Math.max(0.5, next))
}

watch(open, (value) => {
  if (!value) finishResize()

  scrollAnchor = window.scrollY
})
watch([island, presentation], () => {
  finishResize()
  heightRatio.value = 0.5
  hidden.value = false
})
watch(tabbed, () => {
  if (view.value === 'page') view.value = 'navigation'

  navigationView.value = 'navigation'
})
watch(navigationView, (value) => {
  if (view.value !== 'settings') view.value = value
})
watch(enabled, (value) => {
  if (!value) {
    navigating.value = true
    open.value = false
  }

  hidden.value = false
})
watch(
  () => route.path,
  () => {
    navigating.value = true
    open.value = false
    hidden.value = false
  }
)
watch(searchOpen, (value) => {
  if (value) open.value = false
})
watch(
  settingsOpen,
  (value) => {
    if (value && enabled.value) {
      openNavigation('settings')
      settingsOpen.value = false
    }
  },
  { flush: 'sync' }
)
useEventListener(globalThis.window, 'keydown', (event) => {
  if (event.key === 'Tab') hidden.value = false
})
useEventListener(globalThis.window, 'blur', finishResize)
onScopeDispose(finishResize)
</script>

<template>
  <MobileNavigationPage
    :open="enabled && open && underlay"
    :height="sheetHeight"
    :navigating="navigating || !underlay"
  >
    <slot />
  </MobileNavigationPage>
  <Teleport to="body">
    <div
      v-show="enabled && island"
      class="mobile-island"
      :class="{ hidden: hidden || open }"
      :inert="!enabled || !island || hidden || open"
      :aria-hidden="!enabled || !island || hidden || open"
      aria-label="Mobile site controls"
      role="group"
      @focusin="hidden = false"
    >
      <WotakuLink :href="logoLink" class="mobile-island-logo" aria-label="Wotaku home">
        <WotakuImage v-if="theme.logo" :image="theme.logo" alt="" />
        <span v-else>W</span>
      </WotakuLink>
      <div id="mobile-island-actions" />
      <button
        ref="navigationButton"
        type="button"
        class="mobile-island-navigation"
        aria-label="Navigation"
        aria-haspopup="dialog"
        :aria-expanded="open"
        aria-controls="mobile-navigation-panel"
        title="Navigation"
        @click="openNavigation()"
      >
        <List :size="20" :stroke-width="1.5" />
      </button>
    </div>
  </Teleport>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="mobile-navigation-overlay"
        :class="{ floating: !underlay && !fullscreen }"
      />
      <DialogContent
        ref="dialog"
        id="mobile-navigation-panel"
        class="mobile-navigation-panel"
        :class="{ floating: !underlay && !fullscreen, fullscreen }"
        :aria-describedby="undefined"
        :style="{
          height: `${sheetHeight}px`,
          bottom: `${viewportBottom}px`
        }"
        :data-reduced-motion="reducedMotion === 'reduce'"
        :data-entering="entering"
        @animationend.self="entering = false"
        @animationcancel.self="entering = false"
        @open-auto-focus="focusNavigation"
        @close-auto-focus="restoreFocus"
      >
        <div class="mobile-navigation-header">
          <button
            v-if="!fullscreen"
            type="button"
            class="mobile-navigation-resize"
            :aria-label="heightRatio > 0.5 ? 'Reduce menu' : 'Expand menu'"
            @pointerdown="startResize"
            @pointermove="resize"
            @pointerup="finishResize"
            @pointercancel="finishResize"
            @lostpointercapture="finishResize"
            @click="toggleHeight"
            @keydown="resizeKey"
          >
            <Maximize2 :size="16" :stroke-width="1.5" />
          </button>
          <DialogTitle class="mobile-navigation-title">{{
            view === 'settings' ? 'Settings' : 'Site menu'
          }}</DialogTitle>
          <button type="button" aria-label="Search" @click="openAction(openSearch)">
            <Search :size="18" :stroke-width="1.5" />
          </button>
          <button
            ref="settingsButton"
            type="button"
            aria-label="Settings"
            :aria-pressed="view === 'settings'"
            aria-controls="mobile-navigation-settings"
            @click="view = view === 'settings' ? navigationView : 'settings'"
          >
            <Settings :size="18" :stroke-width="1.5" />
          </button>
          <button type="button" aria-label="Close menu" @click="open = false">
            <X :size="18" :stroke-width="1.5" />
          </button>
        </div>
        <TabsRoot
          v-model="navigationView"
          :dir="dir"
          v-show="view !== 'settings'"
          class="mobile-navigation-body"
        >
          <TabsList
            v-if="tabbed"
            class="mobile-navigation-tabs"
            aria-label="Menu sections"
          >
            <TabsTrigger value="navigation"
              ><List :size="18" aria-hidden="true" /><span>Navigation</span></TabsTrigger
            >
            <TabsTrigger value="page"
              ><ListTree :size="18" aria-hidden="true" /><span
                >On this page</span
              ></TabsTrigger
            >
          </TabsList>
          <component
            :is="tabbed ? TabsContent : 'div'"
            v-bind="tabbed ? { value: 'navigation', forceMount: true } : {}"
            v-show="navigationView === 'navigation'"
            class="mobile-navigation-content"
          >
            <nav
              ref="panel"
              class="mobile-navigation-pages"
              aria-label="Site navigation"
              @click.capture="onNavigate"
            >
              <ul>
                <MobileNavigationItem
                  v-for="group in groups"
                  :key="group.link ?? group.text"
                  :item="group"
                  :headers="tabbed || isHome ? [] : [...headers]"
                />
              </ul>
            </nav>
          </component>
          <TabsContent
            v-if="tabbed"
            v-show="navigationView === 'page'"
            value="page"
            force-mount
            class="mobile-navigation-content"
          >
            <nav
              v-if="!isHome && headers.length"
              class="mobile-navigation-page-toc"
              aria-label="On this page"
              @click.capture="onNavigate"
            >
              <WotakuDocOutlineItem :headers="[...headers]" root />
            </nav>
            <p v-else class="mobile-navigation-empty">
              No page headings here. Use Navigation to explore the site.
            </p>
          </TabsContent>
        </TabsRoot>
        <div
          id="mobile-navigation-settings"
          v-show="view === 'settings'"
          class="mobile-navigation-content"
        >
          <div class="mobile-navigation-settings">
            <SettingsScreenMenu />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.mobile-island {
  --nav-pill-item-size: 40px;
  position: fixed;
  inset-inline: 0;
  bottom: calc(16px + env(safe-area-inset-bottom));
  /* Keep the existing full-screen search overlay above site controls. */
  z-index: 90;
  margin-inline: auto;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: calc(100% - 24px);
  padding: 4px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 28px;
  background: var(--wotaku-c-bg);
  box-shadow:
    0 10px 15px -3px #0002,
    0 4px 6px -4px #0002;
  transition:
    bottom 250ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 200ms;
}
.mobile-island.hidden {
  bottom: -80px;
  opacity: 0;
  pointer-events: none;
}
.mobile-island-logo,
.mobile-island-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
}
.mobile-island-logo :deep(img) {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.mobile-island-navigation {
  color: var(--wotaku-c-text-2);
}
.mobile-island-logo:hover,
.mobile-island-navigation:hover {
  background: var(--wotaku-c-default-soft);
}
/* A filtered or transformed ancestor would trap the existing full-screen action panels. */
.mobile-island :deep(.nav-actions) {
  height: 40px;
  padding: 0;
  gap: 0;
  border: 0;
  border-radius: 0;
  background: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.mobile-island :deep(.nav-action) {
  width: 40px;
}
.mobile-island :deep(.nav-action-btn),
.mobile-island :deep(.bookmarks-btn),
.mobile-island :deep(.ann-btn) {
  border-radius: 50%;
}
.mobile-navigation-overlay {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: var(--wotaku-c-bg-alt);
}
.mobile-navigation-overlay.floating {
  background: #0006;
}
.mobile-navigation-panel {
  position: fixed;
  inset-inline: 0;
  z-index: 210;
  display: flex;
  flex-direction: column;
  min-height: min(256px, calc(100dvh - 16px));
  max-height: calc(100dvh - 16px - env(safe-area-inset-top));
  color: var(--wotaku-c-text-1);
  outline: none;
  padding-bottom: env(safe-area-inset-bottom);
}
.mobile-navigation-panel.fullscreen {
  max-height: 100dvh;
  background: var(--wotaku-c-bg-alt);
  padding-top: env(safe-area-inset-top);
}
.mobile-navigation-panel.floating {
  inset-inline: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 24px;
  background: var(--wotaku-c-bg-alt);
  box-shadow: var(--wotaku-shadow-3);
  overflow: hidden;
}
.mobile-navigation-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 4px 12px 8px;
  flex: none;
}
.mobile-navigation-title {
  flex: 1;
  min-width: min-content;
  padding-inline: 4px;
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 600;
  color: var(--wotaku-c-text-1);
  overflow-wrap: normal;
}
.mobile-navigation-header button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 50%;
  color: var(--wotaku-c-text-2);
}
.mobile-navigation-resize {
  touch-action: none;
  cursor: ns-resize;
}
.mobile-navigation-header button[aria-pressed='true'] {
  background: var(--wotaku-c-bg);
  color: var(--wotaku-c-text-1);
  box-shadow: var(--wotaku-shadow-1);
}
.mobile-navigation-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding-block: 8px;
  padding-bottom: 16px;
}
.mobile-navigation-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.mobile-navigation-tabs {
  display: flex;
  gap: 4px;
  flex: none;
  margin: 0 16px 12px;
  padding: 4px;
  border-radius: 14px;
  background: var(--wk-c-menu-bg);
}
.mobile-navigation-tabs button {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  min-height: 44px;
  padding: 8px 4px;
  border-radius: 10px;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--wotaku-c-text-2);
}
.mobile-navigation-tabs button[data-state='active'] {
  background: var(--wotaku-c-bg);
  box-shadow: var(--wotaku-shadow-1);
  color: var(--wotaku-c-text-1);
  font-weight: 600;
}
.mobile-navigation-page-toc {
  padding-inline: 24px;
}
.mobile-navigation-page-toc :deep(.outline-link) {
  min-height: 44px;
  display: flex;
  align-items: center;
  white-space: normal;
  line-height: 1.4;
  padding-block: 4px;
}
.mobile-navigation-page-toc :deep(.toc-bookmark-btn) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  margin-inline-start: auto;
  border-radius: 50%;
}
.mobile-navigation-empty {
  padding: 16px 24px;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--wotaku-c-text-2);
}
.mobile-navigation-pages {
  padding-inline: 16px;
}
.mobile-navigation-pages > ul {
  list-style: none;
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
}
.mobile-navigation-pages :deep(.mobile-navigation-item:has(> details)) {
  margin-block: 8px;
}
.mobile-navigation-settings {
  padding: 4px 24px 8px;
}
.mobile-navigation-settings :deep(.settings-menu) {
  display: grid;
  gap: 20px;
}
.mobile-navigation-settings :deep(.settings-menu > *) {
  margin-block: 0;
}
@media (hover: hover) {
  .mobile-navigation-header button:not([aria-pressed='true']):hover {
    background: var(--wotaku-c-default-soft);
  }
  .mobile-navigation-tabs button:not([data-state='active']):hover {
    background: var(--wotaku-c-default-soft);
  }
}
.mobile-island :deep(button:focus-visible),
.mobile-island :deep(a:focus-visible),
.mobile-navigation-panel :deep(button:focus-visible),
.mobile-navigation-panel :deep(a:focus-visible) {
  outline: 2px solid var(--wotaku-c-text-1);
  outline-offset: -2px;
}
.mobile-navigation-panel[data-state='open'][data-entering='true'] {
  animation: mobile-panel-in 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-navigation-panel[data-state='closed'] {
  animation: mobile-panel-out 150ms ease-out;
  pointer-events: none;
}
@keyframes mobile-panel-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes mobile-panel-out {
  to {
    opacity: 0;
  }
}
.mobile-navigation-panel[data-reduced-motion='true'],
html.effects-disabled .mobile-navigation-panel {
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-island {
    transition: none;
  }
}
html.effects-disabled .mobile-island {
  transition: none;
}
</style>

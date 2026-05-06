<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import {
  customStorageEventName,
  useEventListener,
  useStorage
} from '@vueuse/core'
import { usePreferredReducedMotion } from '@vueuse/core'
import { useData, useRoute } from 'vitepress'
import type { DefaultTheme as Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue'
import { getSidebarGroups } from 'vitepress/dist/client/theme-default/support/sidebar'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { sidebar } from '../configs/constants'
import AnnouncementPill from './components/AnnouncementPill.vue'
import NotFoundComponent from './components/NotFound.vue'
import {
  NolebaseEnhancedReadabilitiesMenu
} from './components/settings'
import SidebarCard from './components/SidebarCard.vue'
import { TakodachiStorageKey } from './constants'
import { v2add, v2mag, v2norm, v2smul, v2sub, type Vec2D } from './math'

const route = useRoute()
const { frontmatter, site, theme } = useData()
const { Layout } = DefaultTheme

// Home sidebar menu
const isHome = computed(() => frontmatter.value.layout === 'home')
const homeSidebarOpen = ref(false)
const sidebarRef = ref<HTMLElement | null>(null)
const homeSidebarGroups = getSidebarGroups(sidebar as any)
const logoSrc = computed(() =>
  typeof theme.value.logo === 'string' ? theme.value.logo : theme.value.logo?.src
)

watch(() => route.path, () => {
  homeSidebarOpen.value = false
})

const openCollapsibles = () => {
  const hash = window.location.hash.slice(1)
  if (!hash) return

  const target = document.getElementById(decodeURIComponent(hash)) || document.getElementById(hash)
  if (!target) return

  let scrollTarget: HTMLElement = target

  for (let el = target.closest('details'); el; el = el.parentElement?.closest('details')) {
    el.open = true
    scrollTarget = el
  }

  if (/^H[1-6]$/.test(target.tagName)) {
    const level = +target.tagName[1]

    for (let sib = target.nextElementSibling; sib; sib = sib.nextElementSibling) {
      if (/^H[1-6]$/.test(sib.tagName) && +sib.tagName[1] <= level) break

      if (sib.tagName === 'DETAILS') {
        (sib as HTMLDetailsElement).open = true
        if (scrollTarget === target) scrollTarget = sib as HTMLElement
      }

      const nested = sib.querySelectorAll<HTMLDetailsElement>('details')
      for (let i = 0; i < nested.length; i++) {
        nested[i].open = true
        if (scrollTarget === target) scrollTarget = nested[i]
      }
    }
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollTarget.style.scrollMarginTop = 'var(--vp-nav-height)'

      scrollTarget.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      })

      scrollTarget.setAttribute('tabindex', '-1')
      scrollTarget.focus({ preventScroll: true })
    })
  })
}

watch(() => route.data, async () => {
  await nextTick()
  openCollapsibles()
})

watch(() => route.hash, async () => {
  await nextTick()
  openCollapsibles()
})
  
function onSidebarEnter() {
  sidebarRef.value?.focus()
}

interface BreadcrumbItem {
  text: string
  link?: string
}

const buildBreadcrumbs = (
  items: Theme.SidebarItem[],
  currentPath: string
): BreadcrumbItem[] => {
  for (const item of items) {
    // Check if this item matches the current path
    if (item.link === currentPath) {
      return [
        {
          text: item.text!.replace('mr-2 block w-4 h-4 bg-cover', '').trim(),
          link: item.link
        }
      ]
    }

    // Check nested items
    if (item.items) {
      const nestedBreadcrumbs = buildBreadcrumbs(item.items, currentPath)
      if (nestedBreadcrumbs.length > 0) {
        return [
          {
            text: item.text!.replace('mr-2 block w-4 h-4 bg-cover', '').trim(),
            link: item.link
          },
          ...nestedBreadcrumbs
        ]
      }
    }
  }
  return []
}

const breadcrumbs = computed(() => {
  const currentPath = route.path
  // @ts-expect-error
  return buildBreadcrumbs(sidebar, currentPath)
})

// Respect user's reduced motion preferences
const prefs = usePreferredReducedMotion()

const speed = 2
const snapThreshold = 5 // px

const takodachiRef = ref<HTMLImageElement | null>(null)
let mousePos: Vec2D | null = null
let target: Vec2D | null = null
let offset: Vec2D = [0, 0]

const position = ref({
  x: 0,
  y: 0
})

const updateMousePos = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    mousePos = [e.clientX, e.clientY]
  } else {
    mousePos = [e.touches[0].clientX, e.touches[0].clientY]
  }
}

const takodachiDisable = ref<(() => void) | null>(null)
const takodachiToggledOn = useStorage(TakodachiStorageKey, false)

const reloadTakodachi = () => {
  takodachiDisable.value?.()

  if (prefs.value === 'reduce') return
  const saved = takodachiToggledOn
  if (saved.value === false) return

  window.addEventListener('mousemove', updateMousePos)
  window.addEventListener('touchstart', updateMousePos)

  const chaser = takodachiRef!.value
  if (chaser) {
    offset = v2smul([chaser.clientWidth, chaser.clientHeight], 0.5)
    setTimeout(() => {
      chaser.classList.remove('opacity-0')
    }, 1000)
  }

  const intervalId = setInterval(() => {
    if (!mousePos) return

    const currentPos: Vec2D = [
      position.value.x + offset[0],
      position.value.y + offset[1]
    ]

    target = target ?? currentPos

    const diff = v2sub(mousePos, currentPos)

    target = v2mag(diff) < snapThreshold
      ? mousePos
      : v2add(target, v2smul(v2norm(diff), speed))

    const finalVec = v2sub(target, offset)

    position.value = { x: finalVec[0], y: finalVec[1] }
  }, 10)

  takodachiDisable.value = () => {
    chaser?.classList.add('opacity-0')

    window.removeEventListener('mousemove', updateMousePos)
    window.removeEventListener('touchstart', updateMousePos)
    clearInterval(intervalId)

    takodachiDisable.value = null
  }
}

onMounted(() => {
  if (import.meta.env.SSR) return
  useEventListener(document, 'click', async (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a.result')) {
      await nextTick()
      requestAnimationFrame(() => requestAnimationFrame(openCollapsibles))
    }
  })

  useEventListener(document, 'keydown', async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const searchBox = document.querySelector('.VPLocalSearchBox') || document.querySelector('.VPNavBarSearch')
      if (searchBox && searchBox.contains(e.target as Node)) {
        await nextTick()
        requestAnimationFrame(() => requestAnimationFrame(openCollapsibles))
      }
    }
  })

  // Arrow key scrolling + Escape close for sidebars and content
  let activeScrollTarget: HTMLElement | Window = window

  useEventListener(document, 'pointerdown', (e: PointerEvent) => {
    const el = e.target as HTMLElement
    if (homeSidebarOpen.value && sidebarRef.value?.contains(el)) {
      activeScrollTarget = sidebarRef.value
    } else if (el.closest('.VPSidebar')) {
      activeScrollTarget = el.closest('.VPSidebar') as HTMLElement
    } else {
      activeScrollTarget = window
    }
  })

  const pxPerFrame = 18
  let scrollDirection = 0
  let scrollRaf = 0

  function tickScroll() {
    if (!scrollDirection) return
    activeScrollTarget.scrollBy({ top: scrollDirection * pxPerFrame })
    scrollRaf = requestAnimationFrame(tickScroll)
  }

  function stopScroll() {
    scrollDirection = 0
    cancelAnimationFrame(scrollRaf)
  }

  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Escape') return

    if (e.key === 'Escape') {
      if (homeSidebarOpen.value) homeSidebarOpen.value = false
      return
    }

    e.preventDefault()
    const dir = e.key === 'ArrowDown' ? 1 : -1
    if (scrollDirection === dir) return
    scrollDirection = dir
    cancelAnimationFrame(scrollRaf)
    scrollRaf = requestAnimationFrame(tickScroll)
  })

  useEventListener(document, 'keyup', (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') stopScroll()
  })

  onUnmounted(stopScroll)

  // Close home NavScreen on outside click
  useEventListener(document, 'click', (e: Event) => {
    if (!isHome.value) return
    const screen = document.getElementById('VPNavScreen')
    if (!screen) return
    const hamburger = document.querySelector('.VPNavBarHamburger')
    if (screen.contains(e.target as Node) || hamburger?.contains(e.target as Node)) return
    requestAnimationFrame(() => (hamburger as HTMLElement)?.click())
  })

  // Storage changed in other documents.
  useEventListener(window, 'storage', () => {
    reloadTakodachi()
  })

  // Storage changed in the same document.
  useEventListener(window, customStorageEventName, () => {
    reloadTakodachi()
  })

  reloadTakodachi()
})

onUnmounted(() => {
  takodachiDisable.value && takodachiDisable.value()
})
</script>

<template>
  <Layout>
    <template #layout-top>
      <img
        id="takodachi"
        ref="takodachiRef"
        src="/takodachi.webp"
        alt="Takodachi"
        class="pointer-events-none fixed absolute z-[9999] h-10 w-10 opacity-0 transition-opacity duration-500"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`
        }"
      />
      <!-- Home sidebar menu -->
      <template v-if="isHome">
        <Transition name="home-fade">
          <div
            v-if="homeSidebarOpen"
            class="home-sidebar-backdrop"
            @click="homeSidebarOpen = false"
          />
        </Transition>
        <Transition name="home-slide" @after-enter="onSidebarEnter">
          <aside
            v-if="homeSidebarOpen"
            ref="sidebarRef"
            class="home-sidebar"
            tabindex="-1"
            @click.stop
          >
            <div class="home-sidebar-header">
              <a href="/" class="home-sidebar-logo">
                <img v-if="logoSrc" :src="logoSrc" class="home-sidebar-logo-img" alt="Logo" />
                <span>{{ theme.siteTitle ?? site.title }}</span>
              </a>
            </div>
            <nav id="VPSidebarNav" class="home-sidebar-nav">
              <VPSidebarGroup :items="homeSidebarGroups" />
              <SidebarCard />
            </nav>
          </aside>
        </Transition>
      </template>
    </template>
    <template #doc-before>
      <!-- Breadcrumb Navigation -->
      <nav
        v-if="breadcrumbs.length > 0"
        class="breadcrumb mb-6 text-sm text-text-2"
        aria-label="Breadcrumb"
      >
        <ol class="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" class="hover:text-primary transition-colors">
              <span class="i-lucide:home"></span>
            </a>
          </li>
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="crumb.link || index"
            class="flex items-center gap-2"
          >
            <span
              class="i-lucide:chevron-right text-text-3 flex-shrink-0"
            ></span>
            <span
              v-if="index === breadcrumbs.length - 1"
              v-html="crumb.text"
              class="font-medium text-text-1 break-words"
            ></span>
            <a
              v-else
              :href="crumb.link"
              v-html="crumb.text"
              class="hover:text-primary transition-colors break-words"
            ></a>
          </li>
        </ol>
      </nav>
    </template>
    <template #not-found>
      <NotFoundComponent />
    </template>
    <template #sidebar-nav-after>
      <SidebarCard />
    </template>
    <template #home-hero-info-before>
      <AnnouncementPill />
    </template>
    <template #nav-bar-content-after>
      <NolebaseEnhancedReadabilitiesMenu />
    </template>
    <template #nav-screen-content-before>
      <nav v-if="isHome" id="VPSidebarNavMobile" class="home-screen-nav">
        <VPSidebarGroup :items="homeSidebarGroups" />
      </nav>
    </template>
    <template #nav-screen-content-after />

    <template #nav-bar-title-before>
      <span
        v-if="isHome"
        class="home-menu-btn"
        role="button"
        tabindex="0"
        aria-label="Menu"
        @click.prevent.stop="homeSidebarOpen = !homeSidebarOpen"
        @keydown.enter.prevent.stop="homeSidebarOpen = !homeSidebarOpen"
      >
        <span class="vpi-align-left home-menu-icon" />
      </span>
    </template>
  </Layout>
</template>

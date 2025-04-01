<!--
  Copyright (c) 2024 taskylizard

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useEventListener, customStorageEventName } from '@vueuse/core'
import SidebarCard from './components/SidebarCard.vue'
import AnnouncementPill from './components/AnnouncementPill.vue'
import NotFoundComponent from './components/NotFound.vue'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { usePreferredReducedMotion } from '@vueuse/core'
import { ref, onMounted, onUnmounted } from 'vue'
import { type Vec2D, v2add, v2mag, v2norm, v2smul, v2sub } from './math'

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

const reloadTakodachi = () => {
  takodachiDisable.value && takodachiDisable.value()

  if (prefs.value === 'reduce') return
  const saved = localStorage.getItem('preference-takodachi-enable-disable')
  if (saved === 'Disable') return

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

    target =
      v2mag(diff) < snapThreshold
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

const { Layout } = DefaultTheme
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
    <template #nav-bar-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
  </Layout>
</template>

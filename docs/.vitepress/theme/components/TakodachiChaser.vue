<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import { TakodachiStorageKey } from '../constants'
import { v2add, v2mag, v2norm, v2smul, v2sub, type Vec2D } from '../math'

const speed = 2
const snapThreshold = 5 // px

const takodachiRef = ref<HTMLImageElement | null>(null)
let mousePos: Vec2D | null = null
let target: Vec2D | null = null
let offset: Vec2D = [0, 0]

const position = ref({ x: 0, y: 0 })

const updateMousePos = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    mousePos = [e.clientX, e.clientY]
  } else {
    mousePos = [e.touches[0].clientX, e.touches[0].clientY]
  }
}

const takodachiToggledOn = useStorage(TakodachiStorageKey, false)
let disable: (() => void) | null = null

const reload = () => {
  disable?.()

  if (!takodachiToggledOn.value) return

  window.addEventListener('mousemove', updateMousePos)
  window.addEventListener('touchstart', updateMousePos)

  const chaser = takodachiRef.value
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

  disable = () => {
    chaser?.classList.add('opacity-0')

    window.removeEventListener('mousemove', updateMousePos)
    window.removeEventListener('touchstart', updateMousePos)
    clearInterval(intervalId)

    disable = null
  }
}

watch(takodachiToggledOn, reload)

onMounted(reload)
onUnmounted(() => disable?.())
</script>

<template>
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

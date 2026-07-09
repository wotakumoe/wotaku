<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

// Adapted from oneko.js by adryd — https://github.com/adryd325/oneko.js

const props = defineProps<{ active: boolean }>()

const anchorSelectors = ['.wotaku-hero-logo', '.VPNavBarTitle']
const dragThreshold = 4

const nekoRef = ref<HTMLDivElement | null>(null)

const nekoSpeed = 10
const spriteSets: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0]
  ],
  scratchWallN: [
    [0, 0],
    [0, -1]
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2]
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3]
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1]
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1]
  ],
  N: [
    [-1, -2],
    [-1, -3]
  ],
  NE: [
    [0, -2],
    [0, -3]
  ],
  E: [
    [-3, 0],
    [-3, -1]
  ],
  SE: [
    [-5, -1],
    [-5, -2]
  ],
  S: [
    [-6, -3],
    [-7, -2]
  ],
  SW: [
    [-5, -3],
    [-6, -1]
  ],
  W: [
    [-4, -2],
    [-4, -3]
  ],
  NW: [
    [-1, 0],
    [-1, -1]
  ]
}

let mode: 'sleep' | 'awake' = 'sleep'

let nekoPosX = 32
let nekoPosY = 32
let mousePosX = 0
let mousePosY = 0
let frameCount = 0
let idleTime = 0
let idleAnimation: string | null = null
let idleAnimationFrame = 0
let sleepFrame = 0
let lastFrameTimestamp: number | undefined
let rafId: number | null = null

let pointerDown = false
let didDrag = false
let pointerStartX = 0
let pointerStartY = 0
let grabOffsetX = 0
let grabOffsetY = 0

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(min, v), max)

const updateMousePos = (e: MouseEvent) => {
  mousePosX = e.clientX
  mousePosY = e.clientY
}

function setSprite(name: string, frame: number) {
  const neko = nekoRef.value
  if (!neko) return
  const set = spriteSets[name]
  const sprite = set[frame % set.length]
  neko.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`
}

function applyPosition() {
  const neko = nekoRef.value
  if (!neko) return
  neko.style.left = `${nekoPosX - 16}px`
  neko.style.top = `${nekoPosY - 16}px`
}

function parkOnAnchor() {
  let rect: DOMRect | null = null
  for (const selector of anchorSelectors) {
    const el = document.querySelector(selector)
    if (el) {
      rect = el.getBoundingClientRect()
      break
    }
  }

  if (rect && rect.width > 0) {
    nekoPosX = clamp(rect.left + rect.width * 0.72, 16, window.innerWidth - 16)
    nekoPosY = clamp(rect.top - 4, 16, window.innerHeight - 16)
  } else {
    nekoPosX = clamp(64, 16, window.innerWidth - 16)
    nekoPosY = clamp(64, 16, window.innerHeight - 16)
  }
  applyPosition()
}

function resetIdleAnimation() {
  idleAnimation = null
  idleAnimationFrame = 0
}

function idle() {
  idleTime += 1

  if (
    idleTime > 10 &&
    Math.floor(Math.random() * 200) === 0 &&
    idleAnimation == null
  ) {
    const available = ['scratchSelf']
    if (nekoPosX < 32) available.push('scratchWallW')
    if (nekoPosY < 32) available.push('scratchWallN')
    if (nekoPosX > window.innerWidth - 32) available.push('scratchWallE')
    if (nekoPosY > window.innerHeight - 32) available.push('scratchWallS')
    idleAnimation = available[Math.floor(Math.random() * available.length)]
  }

  switch (idleAnimation) {
    case 'scratchWallN':
    case 'scratchWallS':
    case 'scratchWallE':
    case 'scratchWallW':
    case 'scratchSelf':
      setSprite(idleAnimation, idleAnimationFrame)
      if (idleAnimationFrame > 9) resetIdleAnimation()
      break
    default:
      setSprite('idle', 0)
      return
  }
  idleAnimationFrame += 1
}

function sleep() {
  sleepFrame += 1
  if (sleepFrame < 8) {
    setSprite('tired', 0)
    return
  }
  setSprite('sleeping', Math.floor(sleepFrame / 4))
}

function chase() {
  frameCount += 1
  const diffX = nekoPosX - mousePosX
  const diffY = nekoPosY - mousePosY
  const distance = Math.sqrt(diffX ** 2 + diffY ** 2)

  if (distance < nekoSpeed || distance < 48) {
    idle()
    return
  }

  idleAnimation = null
  idleAnimationFrame = 0

  if (idleTime > 1) {
    setSprite('alert', 0)
    idleTime = Math.min(idleTime, 7)
    idleTime -= 1
    return
  }

  let direction = diffY / distance > 0.5 ? 'N' : ''
  direction += diffY / distance < -0.5 ? 'S' : ''
  direction += diffX / distance > 0.5 ? 'W' : ''
  direction += diffX / distance < -0.5 ? 'E' : ''
  setSprite(direction, frameCount)

  nekoPosX -= (diffX / distance) * nekoSpeed
  nekoPosY -= (diffY / distance) * nekoSpeed

  nekoPosX = clamp(nekoPosX, 16, window.innerWidth - 16)
  nekoPosY = clamp(nekoPosY, 16, window.innerHeight - 16)

  applyPosition()
}

function frame() {
  if (pointerDown && didDrag) {
    setSprite('alert', 0)
    return
  }
  if (mode === 'sleep') {
    sleep()
    return
  }
  chase()
}

function onAnimationFrame(timestamp: number) {
  if (rafId == null) return
  if (!lastFrameTimestamp) lastFrameTimestamp = timestamp
  if (timestamp - lastFrameTimestamp > 100) {
    lastFrameTimestamp = timestamp
    frame()
  }
  rafId = requestAnimationFrame(onAnimationFrame)
}

function wake() {
  mode = 'awake'
  idleTime = 0
  resetIdleAnimation()
}

function goToSleep() {
  mode = 'sleep'
  sleepFrame = 0
}

const onPointerDown = (e: PointerEvent) => {
  e.preventDefault()
  pointerDown = true
  didDrag = false
  pointerStartX = e.clientX
  pointerStartY = e.clientY
  grabOffsetX = e.clientX - nekoPosX
  grabOffsetY = e.clientY - nekoPosY
  nekoRef.value?.setPointerCapture?.(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!pointerDown) return
  if (
    !didDrag &&
    Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) >
      dragThreshold
  ) {
    didDrag = true
  }
  if (didDrag) {
    nekoPosX = clamp(e.clientX - grabOffsetX, 16, window.innerWidth - 16)
    nekoPosY = clamp(e.clientY - grabOffsetY, 16, window.innerHeight - 16)
    applyPosition()
  }
}

const onPointerUp = (e: PointerEvent) => {
  if (!pointerDown) return
  pointerDown = false
  nekoRef.value?.releasePointerCapture?.(e.pointerId)
  if (didDrag) {
    goToSleep()
  } else {
    mode === 'sleep' ? wake() : goToSleep()
  }
  didDrag = false
}

let disable: (() => void) | null = null

const reload = () => {
  disable?.()

  if (!props.active) return

  const neko = nekoRef.value
  if (!neko) return

  goToSleep()
  parkOnAnchor()
  neko.classList.remove('opacity-0')

  window.addEventListener('mousemove', updateMousePos)
  neko.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)

  lastFrameTimestamp = undefined
  rafId = requestAnimationFrame(onAnimationFrame)

  disable = () => {
    neko.classList.add('opacity-0')
    window.removeEventListener('mousemove', updateMousePos)
    neko.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
    pointerDown = false
    didDrag = false
    disable = null
  }
}

watch(() => props.active, reload)

onMounted(reload)
onUnmounted(() => disable?.())
</script>

<template>
  <div
    id="oneko"
    ref="nekoRef"
    aria-hidden="true"
    title="Click to wake me up — or drag me around!"
    class="oneko fixed z-[9999] h-8 w-8 opacity-0 transition-opacity duration-500"
    style="image-rendering: pixelated; background-image: url(/oneko.gif)"
  />
</template>

<style scoped>
.oneko {
  cursor: grab;
  touch-action: none;
}

.oneko:active {
  cursor: grabbing;
}
</style>

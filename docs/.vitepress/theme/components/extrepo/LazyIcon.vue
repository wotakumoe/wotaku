<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { scheduleIconLoad } from './iconQueue'

const props = defineProps<{
  src?: string
  alt: string
}>()

const rootRef = ref<HTMLElement>()
const loaded = ref(false)
const failed = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const el = rootRef.value
  if (!el || !props.src) return
  // Preload a bit before the card is actually visible so it's ready by the time it scrolls in.
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return
    observer?.disconnect()
    scheduleIconLoad(() => new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        loaded.value = true
        resolve()
      }
      img.onerror = () => {
        failed.value = true
        resolve()
      }
      img.src = props.src!
    }))
  }, { rootMargin: '200px' })
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <img v-if="loaded" ref="rootRef" :src="src" :alt="alt" />
  <span
    v-else
    ref="rootRef"
    class="ext-site-icon-fallback"
    :class="{ 'i-lucide:globe': !src || failed, 'ext-site-icon-loading': src && !failed }"
  />
</template>

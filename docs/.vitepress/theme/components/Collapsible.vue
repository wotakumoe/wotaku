<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { nextTick, onMounted, ref } from 'vue'

defineProps<{ title?: string }>()

const open = ref(false)
const detailsRef = ref<HTMLDetailsElement | null>(null)

function openForHash(hash: string) {
  if (!hash || !detailsRef.value) return
  const id = decodeURIComponent(hash).slice(1)
  const target = id && document.getElementById(id)
  if (!target || !detailsRef.value.contains(target)) return
  open.value = true
  nextTick(() => target.scrollIntoView({ block: 'start' }))
}

onMounted(() => openForHash(location.hash))
useEventListener(window, 'hashchange', () => openForHash(location.hash))
useEventListener(document, 'click', (e) => {
  const link = (e.target as HTMLElement)?.closest?.<HTMLAnchorElement>('a[href*="#"]')
  if (link?.hash) nextTick(() => openForHash(link.hash))
}, { capture: true })
</script>

<template>
  <details
    ref="detailsRef"
    class="details custom-block"
    :open="open || undefined"
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary>{{ title || 'Details' }}</summary>
    <slot />
  </details>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { iconResultCache, observeIcon } from './iconObserver'
import { scheduleIconLoad } from './iconQueue'

const props = defineProps<{
  src?: string
  alt: string
}>()

const rootRef = ref<HTMLElement>()
const loaded = ref(false)
const failed = ref(false)
let unobserve: (() => void) | undefined
let cancelLoad: (() => void) | undefined

function startLoad() {
  if (!props.src) return
  const cached = iconResultCache.get(props.src)
  if (cached !== undefined) {
    if (cached) loaded.value = true
    else failed.value = true
    return
  }
  cancelLoad = scheduleIconLoad(() =>
    new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        loaded.value = true
        iconResultCache.set(props.src!, true)
        resolve()
      }
      img.onerror = () => {
        failed.value = true
        iconResultCache.set(props.src!, false)
        resolve()
      }
      img.src = props.src!
    })
  )
}

onMounted(() => {
  const el = rootRef.value
  if (!el) return
  if (!props.src) return
  unobserve = observeIcon(el, () => {
    startLoad()
  })
})

onBeforeUnmount(() => {
  unobserve?.()
  cancelLoad?.()
})
</script>

<template>
  <span ref="rootRef" class="ext-site-icon-slot">
    <img v-if="loaded" :src="src" :alt="alt" loading="lazy" decoding="async" />
    <span
      v-else
      class="ext-site-icon-fallback"
      :class="{
        'i-lucide:globe': !src || failed,
        'ext-site-icon-loading': src && !failed
      }"
    />
  </span>
</template>

<style scoped>
.ext-site-icon-slot {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: inline-flex;
}
.ext-site-icon-slot img {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  object-fit: contain;
}
.ext-site-icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  width: 18px;
  height: 18px;
}
.ext-site-icon-loading {
  background-color: var(--vp-c-bg-mute, var(--vp-c-bg-soft));
  border-radius: 4px;
}
</style>

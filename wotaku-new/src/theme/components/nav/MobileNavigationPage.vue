<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useEventListener, usePreferredReducedMotion, useWindowSize } from '@vueuse/core'
import { useAnimate } from 'motion-v'
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
import { useEffects } from '../../composables/use-effects'

const props = defineProps<{ open: boolean; height: number; navigating: boolean }>()
const { height: viewportHeight } = useWindowSize({ type: 'visual' })
const reducedMotion = usePreferredReducedMotion()
const { effectsEnabled } = useEffects()
const [surface, animate] = useAnimate<HTMLElement>()
const content = ref<HTMLElement>()
const frozen = ref(false)
const documentHeight = ref(0)
const contentOffset = ref(0)
const viewportTop = ref(0)
const frameHeight = computed(() =>
  Math.max(0, (viewportHeight.value - props.height - 24) / 0.9)
)
let animation: ReturnType<typeof animate> | undefined
let generation = 0

useEventListener(globalThis.window?.visualViewport, ['resize', 'scroll'], () => {
  viewportTop.value = window.visualViewport?.offsetTop ?? 0
})

function cancelAnimation() {
  generation++
  animation?.stop()
  animation = undefined
}

function releasePage() {
  cancelAnimation()
  frozen.value = false
  surface.value?.removeAttribute('style')
}

async function updatePage() {
  cancelAnimation()

  if (!props.open && props.navigating) {
    releasePage()
    return
  }

  if (props.open && !frozen.value) {
    const bounds = content.value?.firstElementChild?.getBoundingClientRect()

    if (!bounds) return

    viewportTop.value = window.visualViewport?.offsetTop ?? 0
    documentHeight.value = bounds.height
    contentOffset.value = bounds.top - viewportTop.value
    frozen.value = true
  }

  const current = generation
  await nextTick()
  const element = surface.value

  if (current !== generation || !frozen.value || !element) return
  // Freeze the reader's live viewport, not a scaled version of the entire document.
  const target = {
    height: props.open ? frameHeight.value : viewportHeight.value,
    scale: props.open ? 0.9 : 1,
    y: props.open ? 16 : 0,
    borderRadius: props.open ? 24 : 0,
    opacity: props.open && frameHeight.value < 44 ? 0 : 1
  }

  if (!effectsEnabled.value || reducedMotion.value === 'reduce') {
    Object.assign(element.style, {
      height: `${target.height}px`,
      transform: `translateY(${target.y}px) scale(${target.scale})`,
      borderRadius: `${target.borderRadius}px`,
      opacity: `${target.opacity}`
    })
  } else {
    animation = animate(element, target, {
      type: 'spring',
      duration: 0.24,
      bounce: 0
    })
    await animation
  }

  if (current === generation && !props.open) releasePage()
}

watch(
  () => [
    props.open,
    props.height,
    props.navigating,
    viewportHeight.value,
    viewportTop.value
  ],
  () => void updatePage(),
  { flush: 'sync' }
)
onScopeDispose(cancelAnimation)
</script>

<template>
  <div
    class="mobile-page-spacer"
    :class="{ frozen }"
    :style="frozen ? { height: `${documentHeight}px` } : undefined"
  >
    <div
      ref="surface"
      class="mobile-page-surface"
      :class="{ frozen }"
      :style="
        frozen
          ? {
              top: `${viewportTop}px`,
              '--mobile-page-height': `${viewportHeight}px`
            }
          : undefined
      "
    >
      <div
        ref="content"
        class="mobile-page-content"
        :class="{ frozen }"
        :inert="open"
        :style="frozen ? { transform: `translateY(${contentOffset}px)` } : undefined"
      >
        <slot />
      </div>
      <div v-if="frozen" class="mobile-page-handle" aria-hidden="true">
        <span />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-page-spacer,
.mobile-page-surface,
.mobile-page-content {
  display: contents;
}
.mobile-page-spacer.frozen,
.mobile-page-content.frozen {
  display: block;
}
.mobile-page-surface.frozen {
  display: block;
  position: fixed;
  inset-inline: 0;
  height: var(--mobile-page-height);
  z-index: 200;
  overflow: hidden;
  transform-origin: top center;
  background: var(--wotaku-c-bg);
  box-shadow:
    0 10px 15px -3px #0002,
    0 4px 6px -4px #0002;
  pointer-events: none;
}
.mobile-page-handle {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 48px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding-bottom: 8px;
  background: linear-gradient(to top, var(--wotaku-c-bg), transparent);
}
.mobile-page-handle span {
  width: 32px;
  height: 4px;
  border-radius: 4px;
  background: var(--wotaku-c-divider);
}
</style>

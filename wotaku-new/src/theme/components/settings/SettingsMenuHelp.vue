<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import {
  onClickOutside,
  useElementBounding,
  useElementHover,
  useEventListener,
  useMediaQuery,
  useMounted
} from '@vueuse/core'
import { CircleHelp } from 'lucide-vue-next'
import { computed, ref, toRef, useId, watch } from 'vue'

const props = defineProps<{
  menuTitleElementRef?: HTMLDivElement
  isPoppedUp?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:isPoppedUp', value: boolean): void
}>()

const menuTitleElementRef = toRef(props, 'menuTitleElementRef')
const helpElementRef = ref<HTMLButtonElement>()
const popupElementRef = ref<HTMLDivElement>()
const helpId = useId()

const mounted = useMounted()
const canHover = useMediaQuery('(hover: hover)')
const isHovered = useElementHover(helpElementRef)
const isPopupHovered = useElementHover(popupElementRef)
const isClicked = ref(false)
const isKeyboardFocused = ref(false)
const isVisible = computed(
  () =>
    (canHover.value && (isHovered.value || isPopupHovered.value)) ||
    isClicked.value ||
    isKeyboardFocused.value
)

// Clear click state when hover ends so desktop hover-out closes the popup cleanly
watch(isHovered, (val) => {
  if (canHover.value && !val) isClicked.value = false
})

const bounding = useElementBounding(menuTitleElementRef)
const popupBounding = useElementBounding(popupElementRef)

// Enclosing flyout panel — anchor the popup to its outer left edge.
const menuPanelRef = computed(
  () =>
    (menuTitleElementRef.value?.closest('.WotakuMenu') as HTMLElement | null) ?? undefined
)
const menuBounding = useElementBounding(menuPanelRef)

const helpPopupStyle = computed(() => {
  const margin = 8
  const popupW = popupBounding.width.value
  const popupH = popupBounding.height.value
  const vw = window.innerWidth
  const vh = window.innerHeight
  const isMobile = vw < 768

  let top: number
  let left: number

  if (isMobile) {
    // Mobile: place above the title row, center horizontally, fall back to below
    const aboveTop = bounding.top.value - popupH - 8
    const belowTop = bounding.bottom.value + 8
    top =
      aboveTop >= margin
        ? aboveTop
        : belowTop + popupH <= vh - margin
          ? belowTop
          : Math.max(margin, vh - popupH - margin)
    left = Math.max(margin, Math.min((vw - popupW) / 2, vw - popupW - margin))
  } else {
    // Desktop: place to the left of the menu panel, aligned vertically
    const anchorLeft = menuBounding.width.value
      ? menuBounding.left.value
      : bounding.left.value
    left = Math.max(margin, anchorLeft - popupW - 12)
    top = bounding.top.value
  }

  return {
    top: `${top}px`,
    left: `${left}px`
  }
})

function onHelpClick() {
  isClicked.value = !isClicked.value
}

function closeHelp(event?: KeyboardEvent) {
  if (!isVisible.value) return

  event?.preventDefault()
  event?.stopPropagation()
  isClicked.value = false
  isKeyboardFocused.value = false
  isHovered.value = false
  isPopupHovered.value = false
}

onClickOutside(helpElementRef, () => closeHelp(), { ignore: [popupElementRef] })
// A touch-opened tooltip may not own focus. Dismiss it before the parent dialog.
useEventListener(
  globalThis.document,
  'keydown',
  (event) => {
    if (event.key === 'Escape') closeHelp(event)
  },
  { capture: true }
)

watch(isVisible, (value) => {
  emits('update:isPoppedUp', value)
})

watch(
  isVisible,
  () => {
    bounding.update()
    popupBounding.update()
    menuBounding.update()
  },
  {
    flush: 'pre'
  }
)
</script>

<template>
  <button
    ref="helpElementRef"
    type="button"
    class="settings-help-trigger"
    :aria-label="`About ${menuTitleElementRef?.querySelector('h3')?.textContent?.trim() || 'this option'}`"
    :aria-describedby="isVisible ? helpId : undefined"
    text="$wotaku-menu-text-color"
    @click="onHelpClick"
    @focus="isKeyboardFocused = !!helpElementRef?.matches(':focus-visible')"
    @blur="
      isKeyboardFocused = false;
      isClicked = false
    "
  >
    <CircleHelp :size="16" :stroke-width="2" aria-hidden="true" />
  </button>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="mounted"
        v-show="isVisible"
        :id="helpId"
        ref="popupElementRef"
        role="tooltip"
        :style="helpPopupStyle"
        bg="$wotaku-c-bg-elv"
        text="$wotaku-menu-text-color"
        border="1 solid $wotaku-c-divider"
        fixed
        z-10000
        rounded-xl
        p-4
        shadow-xl
        w="[280px]"
        max-w="[calc(100vw-16px)]"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.settings-help-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  opacity: 0.65;
  cursor: help;
}
.settings-help-trigger:focus-visible {
  opacity: 1;
  outline: 2px solid var(--wotaku-c-text-1);
  outline-offset: 2px;
}
@media (hover: hover) {
  .settings-help-trigger:hover {
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

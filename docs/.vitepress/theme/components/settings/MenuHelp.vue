<script setup lang="ts">
import { onClickOutside, useElementBounding, useElementHover, useMounted } from '@vueuse/core'
import { computed, ref, toRef, watch } from 'vue'

const props = defineProps<{
  menuTitleElementRef?: HTMLDivElement
  isPoppedUp?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:isPoppedUp', value: boolean): void
}>()

const menuTitleElementRef = toRef(props, 'menuTitleElementRef')
const helpElementRef = ref<HTMLSpanElement>()
const popupElementRef = ref<HTMLDivElement>()

const mounted = useMounted()
const isHovered = useElementHover(helpElementRef)
const isClicked = ref(false)
const isVisible = computed(() => isHovered.value || isClicked.value)

// Clear click state when hover ends so desktop hover-out closes the popup cleanly
watch(isHovered, (val) => {
  if (!val) isClicked.value = false
})

const bounding = useElementBounding(menuTitleElementRef)
const popupBounding = useElementBounding(popupElementRef)

const helpPopupStyle = computed(() => {
  const margin = 8
  const popupW = popupBounding.width.value
  const popupH = popupBounding.height.value
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Horizontal: prefer left of element, then right, then center in viewport
  let left = bounding.left.value - popupW - 16
  if (left < margin) {
    const rightPos = bounding.right.value + 8
    left = rightPos + popupW <= vw - margin
      ? rightPos
      : (vw - popupW) / 2
  }
  left = Math.max(margin, Math.min(left, vw - popupW - margin))

  // Vertical: prefer above the title row, fall back to below
  const aboveTop = bounding.top.value - popupH - 8
  const belowTop = bounding.bottom.value + 8
  const top = aboveTop >= margin
    ? aboveTop
    : belowTop + popupH <= vh - margin
      ? belowTop
      : Math.max(margin, vh - popupH - margin)

  return {
    top: `${top}px`,
    left: `${left}px`
  }
})

function onHelpClick() {
  isClicked.value = !isClicked.value
}

function onTouchStart(e: TouchEvent) {
  // preventDefault stops the browser from firing synthetic mouseenter after touch,
  // which would interfere with the isHovered state and break the toggle.
  e.preventDefault()
  isClicked.value = !isClicked.value
}

onClickOutside(helpElementRef, () => {
  isClicked.value = false
})

watch(isVisible, (value) => {
  emits('update:isPoppedUp', value)
})

watch(
  isVisible,
  () => {
    bounding.update()
    popupBounding.update()
  },
  {
    flush: 'pre'
  }
)
</script>

<template>
  <span
    ref="helpElementRef"
    text="$vp-nolebase-enhanced-readabilities-menu-text-color"
    class="i-carbon:help-filled opacity-50 hover:opacity-100"
    transition="all duration-200 ease"
    cursor-help
    @touchstart="onTouchStart"
    @click="onHelpClick"
  />
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="mounted"
        v-show="isVisible"
        ref="popupElementRef"
        :style="helpPopupStyle"
        bg="$vp-c-bg-elv"
        text="$vp-nolebase-enhanced-readabilities-menu-text-color"
        border="1 solid $vp-c-divider"
        pointer-events-none
        fixed
        z-100
        rounded-xl
        p-4
        shadow-xl
        max-w="[calc(100vw-16px)]"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

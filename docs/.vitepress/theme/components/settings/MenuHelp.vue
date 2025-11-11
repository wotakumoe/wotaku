<script setup lang="ts">
import { useElementBounding, useElementHover, useMounted } from '@vueuse/core'
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
const bounding = useElementBounding(menuTitleElementRef)
const popupBounding = useElementBounding(popupElementRef)

const helpPopupStyle = computed(() => {
  return {
    top: `${bounding.top.value}px`,
    left: `${bounding.left.value - popupBounding.width.value - 16}px`
  }
})

watch(isHovered, (value) => {
  emits('update:isPoppedUp', value)
})

watch(
  isHovered,
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
  />
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="mounted"
        v-show="isHovered"
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

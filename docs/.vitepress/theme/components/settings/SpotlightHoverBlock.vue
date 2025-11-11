<script setup lang="ts">
import {
  useElementBounding,
  useElementByPoint,
  useElementVisibility,
  useEventListener,
  useMouse,
  useMouseInElement,
  useStorage
} from '@vueuse/core'
import { useRoute } from 'vitepress'
import { inject, nextTick, onMounted, reactive, ref, watch } from 'vue'

import {
  InjectionKey,
  SpotlightStyle,
  SpotlightStylesStorageKey
} from '../../constants'

const props = defineProps<{ enabled: boolean }>()

const options = inject(InjectionKey, {})

const shouldRecalculate = ref(false)
const boxStyles = ref<Record<string, string | number>>({ display: 'none' })
const vpDocElement = ref<HTMLDivElement>()
const highlightedElement = ref<HTMLElement>()

const route = useRoute()
const spotlightStyle = useStorage<SpotlightStyle>(
  SpotlightStylesStorageKey,
  options.spotlight?.defaultStyle || SpotlightStyle.Aside
)

const { x, y } = useMouse({ type: 'client' })
const { isOutside } = useMouseInElement(vpDocElement)
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))
const elementVisibility = useElementVisibility(highlightedElement)

useEventListener('scroll', bounding.update, true)

function computeBoxStyles(bounding: {
  height: number
  left: number
  top: number
  width: number
}) {
  return {
    display: 'block',
    width: `${bounding.width + 8}px`,
    height: `${bounding.height + 8}px`,
    left: `${bounding.left - 4}px`,
    top: `${bounding.top - 4}px`,
    transition: 'all 0.2s ease',
    borderRadius: '8px'
  }
}

function findChildElementUnderVPDocElement(element: HTMLElement | null) {
  if (element === null) return null

  if (
    element.parentElement ===
      document.querySelector('.VPDoc main .vp-doc > div')
  ) {
    return element
  } else return findChildElementUnderVPDocElement(element.parentElement)
}

function watchHandler() {
  if (!(element.value && !isOutside.value)) return

  const el = findChildElementUnderVPDocElement(element.value)
  highlightedElement.value = el || undefined

  if (highlightedElement.value && highlightedElement.value.tagName === 'P') {
    const val = highlightedElement.value
    const style = window.getComputedStyle(val)
    const lineHeight = Number.parseFloat(style.lineHeight)
    const lines = Math.floor(val.offsetHeight / lineHeight)

    const rect = val.getBoundingClientRect()
    const relativeY = y.value - rect.top

    for (let i = 0; i < lines; i++) {
      const top = i * lineHeight
      const height = lineHeight
      const left = val.offsetLeft
      const width = val.offsetWidth

      if (relativeY >= top && relativeY < top + height) {
        boxStyles.value = computeBoxStyles({
          top: top + rect.top,
          left: left + rect.left,
          width,
          height
        })

        break
      }
    }
  } else {
    if (highlightedElement.value) {
      const rect = highlightedElement.value.getBoundingClientRect()

      boxStyles.value = computeBoxStyles({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })
    }
  }
}

onMounted(() => {
  if (!document) return
  if (!document.body) return

  document.body.style.setProperty(
    '--vp-nolebase-enhanced-readabilities-spotlight-under-bg-color',
    options?.spotlight?.hoverBlockColor || `rgb(240 197 52 / 10%)`
  )

  vpDocElement.value = document.querySelector(
    '.VPDoc main .vp-doc'
  ) as HTMLDivElement
})

watch(route, async () => {
  // Wait for the next tick to ensure the DOM is updated since the route change
  // may trigger a page reload.
  await nextTick()

  vpDocElement.value = document.querySelector(
    '.VPDoc main .vp-doc'
  ) as HTMLDivElement

  shouldRecalculate.value = true
  boxStyles.value = { display: 'none' }

  bounding.update()

  watchHandler()
  shouldRecalculate.value = false
})

watch([x, y], () => {
  if (props.enabled) watchHandler()
})

watch(bounding, (val) => {
  if (!props.enabled) return

  if (val.width === 0 && val.height === 0) boxStyles.value = { display: 'none' }
  else watchHandler()
})

watch(elementVisibility, (val) => {
  if (props.enabled && !val) boxStyles.value = { display: 'none' }
})

watch(
  () => props.enabled,
  (val) => {
    if (!val) boxStyles.value = { display: 'none' }
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.enabled && !shouldRecalculate"
      :style="boxStyles"
      aria-hidden="true"
      focusable="false"
      pointer-events-none
      fixed
      class="VPNolebaseEnhancedReadabilitiesSpotlightHoverBlock"
      :class="[
        spotlightStyle === SpotlightStyle.Under
          ? 'VPNolebaseEnhancedReadabilitiesSpotlightHoverBlockUnder'
          : '',
        spotlightStyle === SpotlightStyle.Aside
          ? 'VPNolebaseEnhancedReadabilitiesSpotlightHoverBlockAside'
          : ''
      ]"
    />
  </Teleport>
</template>

<style less scoped>
:root {
  --vp-nolebase-enhanced-readabilities-spotlight-under-bg-color: rgb(
    240
    197
    52
    /
    10%
  );
}

.VPNolebaseEnhancedReadabilitiesSpotlightHoverBlock.VPNolebaseEnhancedReadabilitiesSpotlightHoverBlockUnder {
  background-color: var(
    --vp-nolebase-enhanced-readabilities-spotlight-under-bg-color
  );
}

.VPNolebaseEnhancedReadabilitiesSpotlightHoverBlock.VPNolebaseEnhancedReadabilitiesSpotlightHoverBlockAside::before {
  content: "";
  position: absolute;
  display: block;
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--vp-c-brand);
  left: -24px;
}
</style>

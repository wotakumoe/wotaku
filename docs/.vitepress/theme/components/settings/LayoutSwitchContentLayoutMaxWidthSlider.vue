<script setup lang="ts">
import {
  NuInputHighlight,
  NuInputSlider,
  NuVerticalTransition
} from '@nolebase/ui'
import {
  useDebounceFn,
  useLocalStorage,
  useMediaQuery,
  useMounted,
  useStorage
} from '@vueuse/core'
import { computed, inject, onMounted, ref, watch } from 'vue'

import MenuHelp from './MenuHelp.vue'
import MenuTitle from './MenuTitle.vue'

import { useLayoutAppearanceChangeAnimation } from '../../composables/animation'
import {
  ContentLayoutMaxWidthStorageKey,
  InjectionKey,
  LayoutMode,
  LayoutSwitchModeStorageKey
} from '../../constants'

const min = ref(60)
const minScaled = computed(() => min.value * 100)

const max = ref(100)
const maxScaled = computed(() => max.value * 100)

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const shouldActivateMaxWidth = useMediaQuery('(min-width: 1440px)')
const maxWidthLocalStorageValue = useStorage(
  ContentLayoutMaxWidthStorageKey,
  (options.layoutSwitch?.contentLayoutMaxWidth?.defaultMaxWidth || 80) * 100
)
const layoutMode = useLocalStorage<LayoutMode>(
  LayoutSwitchModeStorageKey,
  options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable
)

const maxWidthValue = computed({
  get: () => {
    const parsedMaxWidth = Number.parseInt(
      String(maxWidthLocalStorageValue.value)
    )

    if (Number.isNaN(parsedMaxWidth)) return maxScaled.value

    if (parsedMaxWidth < minScaled.value) return minScaled.value

    if (parsedMaxWidth > maxScaled.value) return maxScaled.value

    return parsedMaxWidth
  },
  set: (val) => {
    if (val < minScaled.value) val = minScaled.value

    if (val > maxScaled.value) val = maxScaled.value

    maxWidthLocalStorageValue.value = val
  }
})

const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

const updatePageMaxWidth = useDebounceFn((val: number) => {
  if (!shouldActivateMaxWidth.value) {
    if (!options.layoutSwitch?.contentLayoutMaxWidth?.disableAnimation) {
      triggerAnimation(document.body)
    }
    document.body.style.setProperty(
      '--vp-nolebase-enhanced-readabilities-content-max-width',
      `100%`
    )
  } else {
    if (!options.layoutSwitch?.contentLayoutMaxWidth?.disableAnimation) {
      triggerAnimation(document.body)
    }
    document.body.style.setProperty(
      '--vp-nolebase-enhanced-readabilities-content-max-width',
      `${Math.ceil(val / 100)}%`
    )
  }
}, 1000)

watch(mounted, (val) => {
  if (!val) return

  updatePageMaxWidth(maxWidthValue.value)
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) disabled.value = true
})

watch(shouldActivateMaxWidth, () => {
  updatePageMaxWidth(maxWidthValue.value)
})

onMounted(() => {
  if (!isLargerThanMobile.value) disabled.value = true
})

watch(maxWidthValue, (val) => {
  if (!mounted.value) return

  updatePageMaxWidth(val)
})
</script>

<template>
  <NuVerticalTransition :duration="200">
    <div
      v-show="layoutMode === LayoutMode.BothWidthAdjustable"
      space-y-2
      role="range"
    >
      <div ref="menuTitleElementRef" flex items-center>
        <MenuTitle
          title="Content Layout Max Width"
          aria-label="Content Layout Max Width"
          :disabled="disabled"
          flex="1"
          pr-4
        >
          <template #icon>
            <span i-icon-park-outline:layout-one mr-1 aria-hidden="true" />
          </template>
          <span i-icon-park-outline:auto-line-width />
        </MenuTitle>
        <MenuHelp
          v-if="!options.layoutSwitch?.contentLayoutMaxWidth?.disableHelp"
          v-model:is-popped-up="isMenuHelpPoppedUp"
          :menu-title-element-ref="menuTitleElementRef"
        >
          <h4 text-md mb-1 font-semibold>Content Layout Max Width</h4>
          <p text="sm" mb-2 max-w-100>
            <span>
              Adjust the exact value of the document content width of VitePress
              layout to adapt to different reading needs and screens.
            </span>
          </p>
          <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
            <div
              text="sm"
              bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
              max-w-100
              rounded-xl
              p-3
            >
              <h5 text="sm" mb-2 flex="~" items-center align-middle>
                <span i-icon-park-outline:scale mr-1 />
                <span font-semibold>
                  Adjust the maximum width of the content layout
                </span>
              </h5>
              <span>
                A ranged slider for user to choose and customize their desired
                width of the maximum width of the content layout can go.
              </span>
            </div>
          </div>
        </MenuHelp>
      </div>
      <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
        <NuInputSlider
          v-model="maxWidthValue"
          bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
          text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
          name="VitePress Nolebase Enhanced Readabilities content layout max width range slider"
          aria-label="Adjust the maximum width of the content layout"
          :disabled="disabled"
          :min="minScaled"
          :max="maxScaled"
          :formatter="(val) => `${Math.ceil(val / 100)}%`"
        />
      </NuInputHighlight>
    </div>
  </NuVerticalTransition>
</template>

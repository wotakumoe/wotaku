<script setup lang="ts">
import { NuInputHighlight, NuInputHorizontalRadioGroup } from '@nolebase/ui'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import MenuHelp from '../settings/MenuHelp.vue'
import MenuTitle from '../settings/MenuTitle.vue'

const props = defineProps<{ modelValue: boolean; bigSwatches?: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:big-swatches': [value: boolean]
}>()

const rootRef = ref<HTMLElement>()
const btnRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const open = ref(false)
const menuStyle = ref<Record<string, string>>({})
let raf = 0

function updatePosition() {
  if (!btnRef.value) return
  const viewportMargin = 12
  const menuWidth = menuRef.value?.offsetWidth ?? 260
  const btnRect = btnRef.value.getBoundingClientRect()
  const maxLeft = Math.max(
    viewportMargin,
    window.innerWidth - viewportMargin - menuWidth
  )
  const left = Math.min(
    Math.max(btnRect.right - menuWidth, viewportMargin),
    maxLeft
  )
  const maxTop = Math.max(viewportMargin, window.innerHeight - viewportMargin)
  const top = Math.min(btnRect.bottom + 6, maxTop)
  menuStyle.value = { top: `${top}px`, left: `${left}px` }
}

function toggle() {
  open.value = !open.value
  if (open.value) void nextTick(updatePosition)
}

function onDocClick(e: MouseEvent) {
  const target = e.target as Node
  if (
    rootRef.value && !rootRef.value.contains(target) &&
    menuRef.value && !menuRef.value.contains(target)
  ) {
    open.value = false
  }
}

function onReposition() {
  if (!open.value || raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    updatePosition()
  })
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  window.addEventListener('resize', onReposition, { passive: true })
  window.addEventListener('scroll', onReposition, {
    capture: true,
    passive: true
  })
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
  if (raf) cancelAnimationFrame(raf)
})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const bigMenuTitleElementRef = ref<HTMLDivElement>()
const isBigMenuHelpPoppedUp = ref(false)

const options = [
  {
    value: 'main',
    title: 'Main',
    ariaLabel: 'Main colors only',
    text: 'MAIN',
    name: 'Swatches'
  },
  {
    value: 'all',
    title: 'All',
    ariaLabel: 'All colors',
    text: 'ALL',
    name: 'Swatches'
  }
]

const bigOptions = [
  {
    value: 'on',
    title: 'On',
    ariaLabel: 'Big swatches on',
    text: 'ON',
    name: 'BigSwatches'
  },
  {
    value: 'off',
    title: 'Off',
    ariaLabel: 'Big swatches off',
    text: 'OFF',
    name: 'BigSwatches'
  }
]

const swatchMode = computed({
  get: () => props.modelValue ? 'main' : 'all',
  set: (value: string) => emit('update:modelValue', value === 'main')
})

const bigMode = computed({
  get: () => props.bigSwatches ? 'on' : 'off',
  set: (value: string) => emit('update:big-swatches', value === 'on')
})
</script>

<template>
  <div ref="rootRef" class="theme-settings">
    <button
      ref="btnRef"
      type="button"
      class="theme-settings-btn"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-label="Filters"
      @click="toggle"
    >
      <span class="i-lucide:settings" />
    </button>

    <Teleport to="body">
      <div
        v-show="open"
        ref="menuRef"
        class="theme-settings-menu VPMenu"
        :style="menuStyle"
      >
        <div class="theme-filter" role="radiogroup">
          <div ref="menuTitleElementRef" relative flex items-center mb-2>
            <MenuTitle
              title="Swatches"
              aria-label="Swatches"
              flex="1"
              pr-4
            >
              <template #icon>
                <span i-lucide:palette mr-1 aria-hidden="true" />
              </template>
            </MenuTitle>
            <MenuHelp
              v-model:is-popped-up="isMenuHelpPoppedUp"
              :menu-title-element-ref="menuTitleElementRef"
            >
              <h4 text-md mb-1 font-semibold>Swatches</h4>
              <p text="sm" mb-2 max-w-100>
                Show main colors or all the colors
              </p>
            </MenuHelp>
          </div>
          <NuInputHighlight :active="isMenuHelpPoppedUp" class="rounded-md">
            <NuInputHorizontalRadioGroup
              v-model="swatchMode"
              bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
              text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
              :options="options"
            />
          </NuInputHighlight>
        </div>
        <div class="theme-filter" role="radiogroup">
          <div ref="bigMenuTitleElementRef" relative flex items-center mb-2>
            <MenuTitle
              title="Big swatches"
              aria-label="Big swatches"
              flex="1"
              pr-4
            >
              <template #icon>
                <span i-lucide:layout-grid mr-1 aria-hidden="true" />
              </template>
            </MenuTitle>
            <MenuHelp
              v-model:is-popped-up="isBigMenuHelpPoppedUp"
              :menu-title-element-ref="bigMenuTitleElementRef"
            >
              <h4 text-md mb-1 font-semibold>Big swatches</h4>
              <p text="sm" mb-2 max-w-100>
                Shows each color as a larger tile with its hex value underneath.
              </p>
            </MenuHelp>
          </div>
          <NuInputHighlight :active="isBigMenuHelpPoppedUp" class="rounded-md">
            <NuInputHorizontalRadioGroup
              v-model="bigMode"
              bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
              text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
              :options="bigOptions"
            />
          </NuInputHighlight>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.theme-settings {
  position: relative;
  flex-shrink: 0;
}
.theme-settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.theme-settings-btn:hover,
.theme-settings-btn[aria-expanded="true"] {
  color: var(--vp-c-text-1);
  opacity: 1;
  background: transparent;
}
.theme-settings-btn:active {
  transform: scale(0.94);
}
.theme-settings-btn span {
  font-size: 15px;
}
html.effects-disabled .theme-settings-btn {
  transition: none;
}
html.effects-disabled .theme-settings-btn:active {
  transform: none;
}
.theme-settings-menu {
  --vp-nolebase-enhanced-readabilities-menu-background-color: var(
    --wk-c-menu-bg
  );
  --vp-nolebase-enhanced-readabilities-menu-text-color: var(--vp-c-text-1);
  position: fixed;
  z-index: 100;
  width: 260px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3, 0 4px 16px rgba(0, 0, 0, 0.3));
}
.theme-settings-menu > * + * {
  margin-top: 14px;
}
</style>

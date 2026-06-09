<script setup lang="ts">
import { computed, ref, toRef, useId, useSlots } from 'vue'
import { useIsPrint, useStabilizeScrollPosition } from './composables'
import { provideTabsSingleState, useTabsSelectedState } from './state'

defineOptions({ name: 'PluginTabs' })

const props = defineProps<{ sharedStateKey?: string }>()

interface TabItem {
  anchor: string
  label: string
}

const isPrint = useIsPrint()
const slots = useSlots()
const tabItems = computed<TabItem[]>(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  return defaultSlot
    .filter((vnode) => {
      if (!vnode.props) return false
      if (typeof vnode.type !== 'object') return false

      const type = vnode.type as { __name?: string; name?: string }
      return type.__name === 'PluginTabsTab' || type.name === 'PluginTabsTab'
    })
    .map((vnode) => ({
      anchor: String(vnode.props?.anchor ?? ''),
      label: String(vnode.props?.label ?? '')
    }))
    .filter((item) => item.anchor && item.label)
})
const tabLabels = computed(() => tabItems.value.map((item) => item.label))
const { selected, select } = useTabsSelectedState(
  tabLabels,
  toRef(props, 'sharedStateKey')
)
const tablist = ref<HTMLElement>()
const { stabilizeScrollPosition } = useStabilizeScrollPosition(tablist)
const selectStable = stabilizeScrollPosition(select)
const buttonRefs = ref<HTMLButtonElement[]>([])
const uid = useId()

provideTabsSingleState({ uid, selected })

function getTabButtonId(item: TabItem) {
  return `tab-${item.anchor}-${uid}`
}

function getTabPanelId(item: TabItem) {
  return `panel-${item.anchor}-${uid}`
}

async function onKeydown(e: KeyboardEvent) {
  const currentIndex = tabItems.value.findIndex(
    (item) => item.label === selected.value
  )
  let selectIndex: number | undefined

  if (e.key === 'ArrowLeft') {
    selectIndex = currentIndex >= 1
      ? currentIndex - 1
      : tabItems.value.length - 1
  } else if (e.key === 'ArrowRight') {
    selectIndex = currentIndex < tabItems.value.length - 1
      ? currentIndex + 1
      : 0
  }

  if (selectIndex === undefined || !tabItems.value[selectIndex]) return

  e.preventDefault()
  await selectStable(tabItems.value[selectIndex].label)
  buttonRefs.value[selectIndex]?.focus()
}
</script>

<template>
  <div class="plugin-tabs">
    <div
      ref="tablist"
      class="plugin-tabs--tab-list"
      role="tablist"
      @keydown="onKeydown"
    >
      <button
        v-for="item in tabItems"
        :id="getTabButtonId(item)"
        ref="buttonRefs"
        :key="item.anchor"
        type="button"
        role="tab"
        class="plugin-tabs--tab"
        :data-tab-anchor="item.anchor"
        :aria-selected="item.label === selected && !isPrint"
        :aria-controls="getTabPanelId(item)"
        :tabindex="item.label === selected ? 0 : -1"
        @click="selectStable(item.label)"
      >
        {{ item.label }}
      </button>
    </div>
    <slot />
  </div>
</template>

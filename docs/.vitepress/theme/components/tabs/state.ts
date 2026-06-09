import type { App, ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, inject, onMounted, provide, reactive, ref, watch } from 'vue'

const sharedStateKey: InjectionKey<{ content?: Record<string, string> }> =
  Symbol('vitepress:tabSharedState')
const singleStateKey: InjectionKey<{
  selected: ComputedRef<string>
  uid: string
}> = Symbol('vitepress:tabSingleState')
const renderAllKey: InjectionKey<boolean> = Symbol('wotaku:tabsRenderAll')

const localStorageKey = 'vitepress:tabsSharedState'
const ls = typeof localStorage !== 'undefined' ? localStorage : null

function getLocalStorageValue() {
  const rawValue = ls?.getItem(localStorageKey)
  if (rawValue) {
    try {
      return JSON.parse(rawValue)
    } catch {
      /* ignore invalid stored state */
    }
  }
  return {}
}

function setLocalStorageValue(value: Record<string, string>) {
  if (!ls) return
  ls.setItem(localStorageKey, JSON.stringify(value))
}

export function provideTabsSharedState(app: App, renderAll = false) {
  const state = reactive<{ content?: Record<string, string> }>({})

  watch(
    () => state.content,
    (newStateContent, oldStateContent) => {
      if (newStateContent && oldStateContent) {
        setLocalStorageValue(newStateContent)
      }
    },
    { deep: true }
  )

  app.provide(sharedStateKey, state)
  app.provide(renderAllKey, renderAll)
}

export function useTabsSelectedState(
  acceptValues: ComputedRef<string[]>,
  sharedStateName: Ref<string | undefined>
) {
  const sharedState = inject(sharedStateKey)
  if (!sharedState) {
    throw new Error('[wotaku-tabs] TabsSharedState should be injected')
  }

  onMounted(() => {
    if (!sharedState.content) sharedState.content = getLocalStorageValue()
  })

  const nonSharedState = ref<string>()
  const selected = computed({
    get() {
      const key = sharedStateName.value
      const values = acceptValues.value

      if (key) {
        const value = sharedState.content?.[key]
        if (value && values.includes(value)) return value
      } else if (
        nonSharedState.value && values.includes(nonSharedState.value)
      ) {
        return nonSharedState.value
      }

      return values[0]
    },
    set(value) {
      const key = sharedStateName.value
      if (key) {
        if (sharedState.content) sharedState.content[key] = value
      } else {
        nonSharedState.value = value
      }
    }
  })

  return {
    selected,
    select(value: string) {
      selected.value = value
    }
  }
}

export function provideTabsSingleState(state: {
  selected: ComputedRef<string>
  uid: string
}) {
  provide(singleStateKey, state)
}

export function useTabsSingleState() {
  const state = inject(singleStateKey)
  if (!state) {
    throw new Error('[wotaku-tabs] TabsSingleState should be injected')
  }
  return state
}

export function useTabsRenderAll() {
  return inject(renderAllKey, false)
}

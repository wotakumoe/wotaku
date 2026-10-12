import { inject, type InjectionKey, provide, ref } from 'vue'

interface TooltipState {
  text: string
  x: number
  y: number
}

interface TooltipCtx {
  show: (e: MouseEvent, text: string) => void
  hide: () => void
}

const KEY: InjectionKey<TooltipCtx> = Symbol('ext-tooltip')

let hoverable: boolean | undefined

function canHover(): boolean {
  if (hoverable === undefined) {
    hoverable = typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches
  }
  return hoverable
}

export function provideTooltip() {
  const tooltip = ref<TooltipState | null>(null)

  function show(e: MouseEvent, text: string) {
    if (!canHover()) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    tooltip.value = { text, x: rect.left + rect.width / 2, y: rect.top }
  }

  function hide() {
    tooltip.value = null
  }

  provide(KEY, { show, hide })

  return { tooltip }
}

export function useTooltip(): TooltipCtx {
  const ctx = inject(KEY)
  if (!ctx) {
    throw new Error(
      'useTooltip() must be called within a component tree wrapped by provideTooltip()'
    )
  }
  return ctx
}

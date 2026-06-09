import { nextTick, onBeforeMount, onUnmounted, type Ref, ref } from 'vue'

export function useIsPrint() {
  const matchMedia = typeof window !== 'undefined'
    ? window.matchMedia('print')
    : undefined
  const value = ref(matchMedia?.matches)
  const listener = () => {
    value.value = matchMedia?.matches
  }

  onBeforeMount(() => {
    matchMedia?.addEventListener('change', listener)
  })
  onUnmounted(() => {
    matchMedia?.removeEventListener('change', listener)
  })

  return value
}

export function useStabilizeScrollPosition(
  target: Ref<HTMLElement | undefined>
) {
  if (typeof document === 'undefined') {
    return {
      stabilizeScrollPosition:
        <T extends (...args: any[]) => any>(func: T) =>
        async (...args: Parameters<T>) => func(...args)
    }
  }

  const scrollableElement = document.documentElement
  const stabilizeScrollPosition =
    <T extends (...args: any[]) => any>(func: T) =>
    async (...args: Parameters<T>) => {
      const result = func(...args)
      const element = target.value
      if (!element) return result

      const offset = element.offsetTop - scrollableElement.scrollTop
      await nextTick()
      scrollableElement.scrollTop = element.offsetTop - offset
      return result
    }

  return { stabilizeScrollPosition }
}

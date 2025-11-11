import { useDebounceFn, useMounted } from '@vueuse/core'

export function useLayoutAppearanceChangeAnimation() {
  const mounted = useMounted()

  return {
    trigger: (animateElement: HTMLElement) => {
      animateElement.classList.add(
        'VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated'
      )

      const removeAnimatedClassName = useDebounceFn(() => {
        if (!(mounted.value && animateElement)) return

        animateElement.classList.remove(
          'VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated'
        )
      }, 5000)

      removeAnimatedClassName()
    }
  }
}

import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { EffectsStorageKey } from '../constants'

export function useEffects() {
  const effects = useStorage(EffectsStorageKey, 'off')
  const effectsEnabled = computed(() => effects.value === 'on')

  return { effects, effectsEnabled }
}

import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

import { FaviconsStorageKey } from '../constants'

export function useFavicons() {
  const favicons = useStorage(FaviconsStorageKey, 'off')
  const faviconsEnabled = computed(() => favicons.value === 'on')

  return { favicons, faviconsEnabled }
}

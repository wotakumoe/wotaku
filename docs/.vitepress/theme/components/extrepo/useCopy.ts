import { onUnmounted, ref } from 'vue'
import { COPY_RESET_MS } from './constants'

export function useCopy() {
  const copiedKey = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null
    }, COPY_RESET_MS)
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { copiedKey, copy }
}

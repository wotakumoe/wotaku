/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { computed, onUnmounted, ref } from 'vue'
import { COPY_RESET_MS } from '../../shared/extension-repos/constants'

export function useCopy() {
  const copiedKey = ref<string | null>(null)
  const copyError = ref(false)
  const copyMessage = computed(() =>
    copyError.value
      ? "Couldn't copy. Check your browser's clipboard permissions and try again."
      : copiedKey.value
        ? 'Copied to clipboard'
        : ''
  )
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(key: string, value: string) {
    if (timer) clearTimeout(timer)

    copiedKey.value = null
    copyError.value = false

    try {
      await navigator.clipboard.writeText(value)
      copiedKey.value = key
      timer = setTimeout(() => {
        if (copiedKey.value === key) copiedKey.value = null
      }, COPY_RESET_MS)
    } catch {
      copyError.value = true
    }
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { copiedKey, copyError, copyMessage, copy }
}

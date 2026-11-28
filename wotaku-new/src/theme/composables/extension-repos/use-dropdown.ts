/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { onMounted, onUnmounted, ref } from 'vue'

export function useDropdown() {
  const rootRef = ref<HTMLElement>()
  const triggerRef = ref<HTMLButtonElement>()
  const open = ref(false)

  function toggle() {
    open.value = !open.value
  }

  function close() {
    open.value = false
    triggerRef.value?.focus()
  }

  function onDocClick(e: MouseEvent) {
    if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
      open.value = false
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !open.value || e.defaultPrevented) return

    e.preventDefault()
    close()
  }

  onMounted(() => {
    document.addEventListener('click', onDocClick, true)
    document.addEventListener('keydown', onKey, true)
  })
  onUnmounted(() => {
    document.removeEventListener('click', onDocClick, true)
    document.removeEventListener('keydown', onKey, true)
  })

  return { rootRef, triggerRef, open, toggle, close }
}

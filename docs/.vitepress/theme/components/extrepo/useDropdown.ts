import { onMounted, onUnmounted, ref } from 'vue'

export function useDropdown() {
  const rootRef = ref<HTMLElement>()
  const open = ref(false)

  function toggle() {
    open.value = !open.value
  }

  function onDocClick(e: MouseEvent) {
    if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
      open.value = false
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') open.value = false
  }

  onMounted(() => {
    document.addEventListener('click', onDocClick, true)
    document.addEventListener('keydown', onKey)
  })
  onUnmounted(() => {
    document.removeEventListener('click', onDocClick, true)
    document.removeEventListener('keydown', onKey)
  })

  return { rootRef, open, toggle }
}

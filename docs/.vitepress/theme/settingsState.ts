import { ref } from 'vue'

export const settingsOpen = ref(false)

export function openSettings() {
  settingsOpen.value = true
}

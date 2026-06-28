import { ref } from 'vue'

export const searchOpen = ref(false)

export function openSearch() {
  searchOpen.value = true
}

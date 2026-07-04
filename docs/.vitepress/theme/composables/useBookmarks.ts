import { ref, watch } from 'vue'

export interface Bookmark {
  title: string
  anchor: string
  path: string
}

const STORAGE_KEY = 'wotaku-bookmarks'
export const BOOKMARK_CHANGE_EVENT = 'wotaku-bookmarks-changed'

const bookmarks = ref<Bookmark[]>([])
let initialized = false

function loadFromStorage(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveToStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
}

if (typeof window !== 'undefined') {
  watch(bookmarks, () => {
    window.dispatchEvent(new CustomEvent(BOOKMARK_CHANGE_EVENT))
  }, { deep: true, flush: 'post' })
}

export function useBookmarks() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    bookmarks.value = loadFromStorage()
  }

  function isBookmarked(anchor: string, path: string): boolean {
    return bookmarks.value.some(b => b.anchor === anchor && b.path === path)
  }

  function toggle(bookmark: Bookmark): void {
    const idx = bookmarks.value.findIndex(
      b => b.anchor === bookmark.anchor && b.path === bookmark.path
    )
    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
    } else {
      bookmarks.value.push(bookmark)
    }
    saveToStorage()
  }

  function remove(anchor: string, path: string): void {
    const idx = bookmarks.value.findIndex(b => b.anchor === anchor && b.path === path)
    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
      saveToStorage()
    }
  }

  return { bookmarks, isBookmarked, toggle, remove }
}

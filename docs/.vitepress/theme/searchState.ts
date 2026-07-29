import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'


export type SearchResultHighlightMode = 'off' | 'soft' | 'solid'
export type SearchSortMode = 'exact' | 'fuzzy' | 'url'
export type SearchExcerptPreload = 'off' | 'next' | 'all'

export interface SearchHistoryEntry {
  query: string
  mode: SearchSortMode
  path?: string[]
  href?: string
  resultText?: string
}

export const searchOpen = ref(false)

export const searchResultHighlightMode = useLocalStorage<SearchResultHighlightMode>(
  'vitepress:local-search-result-highlight',
  'off'
)

export const showDetailedList = useLocalStorage(
  'vitepress:local-search-detailed-list',
  true
)

export const searchMode = useLocalStorage<SearchSortMode>(
  'vitepress:local-search-mode',
  'exact'
)

// How many result pages get their excerpts rendered ahead of time
export const excerptPreload = useLocalStorage<SearchExcerptPreload>(
  'vitepress:local-search-excerpt-preload',
  'off'
)

export const saveHistoryEnabled = useLocalStorage(
  'vitepress:local-search-save-history',
  false
)

export const searchHistory = useLocalStorage<SearchHistoryEntry[]>(
  'vitepress:local-search-history',
  []
)

export type RibbonStyle = 'tabs' | 'list'

export const ribbonStyle = useLocalStorage<RibbonStyle>(
  'vitepress:local-search-ribbon-style',
  'list'
)

export function openSearch() {
  searchOpen.value = true
}
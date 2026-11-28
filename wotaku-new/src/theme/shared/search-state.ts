/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

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
  'wotaku:local-search-result-highlight',
  'off'
)

export const showDetailedList = useLocalStorage('wotaku:local-search-detailed-list', true)

export const searchMode = useLocalStorage<SearchSortMode>(
  'wotaku:local-search-mode',
  'exact'
)

// How many result pages get their excerpts rendered ahead of time
export const excerptPreload = useLocalStorage<SearchExcerptPreload>(
  'wotaku:local-search-excerpt-preload',
  'off'
)

export const saveHistoryEnabled = useLocalStorage(
  'wotaku:local-search-save-history',
  false
)

export const searchHistory = useLocalStorage<SearchHistoryEntry[]>(
  'wotaku:local-search-history',
  []
)

export type RibbonStyle = 'tabs' | 'list'

export const ribbonStyle = useLocalStorage<RibbonStyle>(
  'wotaku:local-search-ribbon-style',
  'list'
)

export function openSearch() {
  searchOpen.value = true
}

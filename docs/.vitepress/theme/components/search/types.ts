import type { SearchResult } from 'minisearch'
import type { PageLink } from '../../plugins/urlSearchPlugin'
import type { SearchSortMode } from '../../searchState'

export interface FooterTranslations {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  switchTabsText?: string
  switchTabsKeyAriaLabel?: string
  switchPagesText?: string
  switchPagesKeyAriaLabel?: string
  closeText?: string
  closeKeyAriaLabel?: string
}

export interface ModalTranslations {
  displayDetails?: string
  exactMatchTitle?: string
  resetButtonTitle?: string
  backButtonTitle?: string
  noResultsText?: string
  footer?: FooterTranslations
}

export interface Result {
  tabs?: string[]
  title: string
  titles: string[]
  text?: string
  _linkIndex?: number
}

export interface PageGroupCount {
  key: string
  count: number
}

export interface UrlResult {
  tabs?: string[]
  href: string
  linkText: string
  pageId: string
  anchor: string
  titles: string[]
  highlighted: string
}

export interface TextSearchWorkerPayload {
  results: (SearchResult & Result)[]
  terms: string[]
}

export interface UrlSearchWorkerPayload {
  matches: PageLink[]
  pageGroups: PageGroupCount[]
}

export interface LoadIndexWorkerRequest {
  type: 'load-index'
  localeIndex: string
  indexJson: unknown
  indexVersion: number
  config: ReturnType<typeof getMiniSearchWorkerConfigShape>
}

export interface TextSearchWorkerRequest {
  type: 'text-search'
  query: string
  mode: SearchSortMode
  pageOrderEntries: [string, number][]
}

export interface UrlSearchWorkerRequest {
  type: 'url-search'
  query: string
  pageOrderEntries: [string, number][]
}

export interface PreloadMetadataWorkerRequest {
  type: 'preload-metadata'
  pageOrderEntries: [string, number][]
}

export type SearchWorkerRequest =
  | LoadIndexWorkerRequest
  | TextSearchWorkerRequest
  | UrlSearchWorkerRequest
  | PreloadMetadataWorkerRequest

export function getMiniSearchWorkerConfigShape() {
  return {
    options: {} as Record<string, unknown> | undefined,
    searchOptions: {} as Record<string, unknown> | undefined,
    useDefaultBoostDocument: false as boolean
  }
}

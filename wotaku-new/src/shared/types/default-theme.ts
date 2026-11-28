/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { Options as _MiniSearchOptions } from 'minisearch'
import type { LocalSearchTranslations, PageSplitSection } from './local-search.ts'
import type { MarkdownRenderer } from './markdown.js'
import type { Awaitable, Header, MarkdownEnv } from './shared.ts'

export interface Config {
  logo?: ThemeableImage
  logoLink?: string | { link?: string; rel?: string; target?: string }
  siteTitle?: string | false
  sidebar?: Sidebar
  aside?: boolean | 'left'
  outline?: Outline | Outline['level'] | false
  docFooter?: DocFooter
  lastUpdated?: LastUpdatedOptions
  sidebarMenuLabel?: string
  returnToTopLabel?: string
  skipToContentLabel?: string
  socialLinks?: SocialLink[]
  search?: { provider: 'local'; options?: LocalSearchOptions }
  externalLinkIcon?: boolean
}

export type ThemeableImage =
  | string
  | { src: string; alt?: string; [prop: string]: any }
  | { light: string; dark: string; alt?: string; [prop: string]: any }

export type Sidebar = SidebarItem[] | SidebarMulti

export interface SidebarMulti {
  [path: string]: SidebarItem[] | { items: SidebarItem[]; base: string }
}

export type SidebarItem = {
  text?: string

  link?: string

  items?: SidebarItem[]

  /**
   * If not specified, group is not collapsible.
   *
   * If `true`, group is collapsible and collapsed by default
   *
   * If `false`, group is collapsible but expanded by default
   */
  collapsed?: boolean

  /**
   * Base path for the children items.
   */
  base?: string

  /**
   * Customize text that appears on the footer of previous/next page.
   */
  docFooterText?: string

  rel?: string
  target?: string
}

export interface DocFooter {
  /**
   * Custom label for previous page button. Can be set to `false` to disable.
   *
   * @default 'Previous page'
   */
  prev?: string | boolean

  /**
   * Custom label for next page button. Can be set to `false` to disable.
   *
   * @default 'Next page'
   */
  next?: string | boolean
}

export interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

export type SocialLinkIcon = string | { svg: string }

export interface Outline {
  level?: number | [number, number] | 'deep'
  label?: string
}

export type OutlineItem = Omit<Header, 'slug' | 'children'> & {
  element: HTMLHeadElement
  children?: OutlineItem[]
}

export interface LocalSearchOptions {
  /**
   * Transform content before indexing (server only).
   * Return an empty string to skip indexing.
   */
  _render?: (src: string, env: MarkdownEnv, md: MarkdownRenderer) => Awaitable<string>

  /**
   * @default false
   * @deprecated Use `detailedView: false` instead.
   */
  disableDetailedView?: boolean

  /**
   * If `true`, the detailed view will be enabled by default.
   * If `false`, the detailed view will be disabled.
   * If `'auto'`, the detailed view will be disabled by default, but can be enabled by the user.
   *
   * @default 'auto'
   */
  detailedView?: boolean | 'auto'

  /**
   * @default false
   */
  disableQueryPersistence?: boolean

  translations?: LocalSearchTranslations
  locales?: Record<string, Partial<Omit<LocalSearchOptions, 'locales'>>>

  miniSearch?: MiniSearchOptions
}

interface MiniSearchOptions {
  /**
   * Override the default page splitter with sections from rendered HTML.
   * The path is the absolute Markdown source path.
   */
  _splitIntoSections?: (
    path: string,
    html: string
  ) =>
    | AsyncGenerator<PageSplitSection>
    | Generator<PageSplitSection>
    | Awaitable<PageSplitSection[]>

  /**
   * @see https://lucaong.github.io/minisearch/types/MiniSearch.Options.html
   */
  options?: Pick<_MiniSearchOptions, 'extractField' | 'tokenize' | 'processTerm'>
  /**
   * @see https://lucaong.github.io/minisearch/types/MiniSearch.SearchOptions.html
   */
  searchOptions?: _MiniSearchOptions['searchOptions']
}

export interface LastUpdatedOptions {
  /**
   * Set custom last updated text.
   *
   * @default 'Last updated'
   */
  text?: string

  /**
   * Set options for last updated time formatting.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @default
   * { dateStyle: 'short', timeStyle: 'short' }
   */
  formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
}

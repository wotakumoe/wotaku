/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import rawSiteData from '@/shared/site'
import { useDark, usePreferredDark, useStorage } from '@vueuse/core'
import {
  computed,
  inject,
  type InjectionKey,
  readonly,
  type Ref,
  ref,
  shallowRef,
  toRef,
  watch
} from 'vue'
import {
  APPEARANCE_KEY,
  createTitle,
  inBrowser,
  type PageData,
  resolveSiteDataByRoute,
  type SiteData
} from '../../../shared/client'
import type { Route } from './router'

const siteData = import.meta.env.PROD ? { ...rawSiteData, head: [] } : rawSiteData
export const dataSymbol: InjectionKey<WotakuData> = Symbol()

export interface WotakuData<T = any> {
  /**
   * Site-level metadata
   */
  site: Ref<SiteData<T>>
  /**
   * themeConfig from the site's configuration
   */
  theme: Ref<T>
  /**
   * Page-level metadata
   */
  page: Ref<PageData>
  /**
   * page frontmatter data
   */
  frontmatter: Ref<PageData['frontmatter']>
  /**
   * dynamic route params
   */
  params: Ref<PageData['params']>
  title: Ref<string>
  description: Ref<string>
  lang: Ref<string>
  dir: Ref<string>
  localeIndex: Ref<string>
  isDark: Ref<boolean>
  appearancePreference: Ref<'auto' | 'light' | 'dark'>
  /**
   * Current location hash
   */
  hash: Ref<string>
}

// site data is a singleton
export const siteDataRef: Ref<SiteData> = shallowRef(
  readonly(siteData) as unknown as SiteData
)

if (import.meta.hot) {
  import.meta.hot.accept('@/shared/site', (module) => {
    if (module) siteDataRef.value = readonly(module.default) as unknown as SiteData
  })
}

// per-app data
export function initData(route: Route): WotakuData {
  const site = computed(() =>
    resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath)
  )

  const appearance = site.value.appearance // fine with reactivity being lost here, config change triggers a restart
  const appearanceOptions = {
    storageKey: APPEARANCE_KEY,
    initialValue: () => (appearance === 'dark' ? ('dark' as const) : ('auto' as const)),
    ...(typeof appearance === 'object' ? appearance : {})
  }
  const appearancePreference =
    appearanceOptions.storageRef ??
    (appearanceOptions.storageKey === null
      ? toRef(appearanceOptions.initialValue)
      : useStorage<'auto' | 'light' | 'dark'>(
          appearanceOptions.storageKey,
          appearanceOptions.initialValue,
          appearanceOptions.storage,
          {
            window: appearanceOptions.window,
            listenToStorageChanges: appearanceOptions.listenToStorageChanges
          }
        ))
  const isDark =
    appearance === 'force-dark'
      ? ref(true)
      : appearance === 'force-auto'
        ? usePreferredDark()
        : appearance
          ? useDark({
              ...appearanceOptions,
              storageRef: appearancePreference
            })
          : ref(false)

  const hashRef = ref(inBrowser ? location.hash : '')

  if (inBrowser) {
    window.addEventListener('hashchange', () => {
      hashRef.value = location.hash
    })
  }

  watch(
    () => route.data,
    () => {
      hashRef.value = inBrowser ? location.hash : ''
    }
  )

  return {
    site,
    theme: computed(() => site.value.themeConfig),
    page: computed(() => route.data),
    frontmatter: computed(() => route.data.frontmatter),
    params: computed(() => route.data.params),
    lang: computed(() => site.value.lang),
    dir: computed(() => route.data.frontmatter.dir || site.value.dir),
    localeIndex: computed(() => site.value.localeIndex || 'root'),
    title: computed(() => createTitle(site.value, route.data)),
    description: computed(() => route.data.description || site.value.description),
    isDark,
    appearancePreference,
    hash: computed(() => hashRef.value)
  }
}

export function useData<T = any>(): WotakuData<T> {
  const data = inject(dataSymbol)

  if (!data) {
    throw new Error('wotaku data not properly injected in app')
  }

  return data
}

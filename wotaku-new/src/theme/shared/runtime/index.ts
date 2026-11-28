/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import RawTheme from '@/theme/index'
import pages from '@wotaku/pages'
import {
  type App,
  createApp as createClientApp,
  createSSRApp,
  defineComponent,
  h,
  onMounted,
  watchEffect
} from 'vue'
import { ClientOnly } from '../../components/client-only'
import { Content } from '../../components/content'
import { useCodeGroups } from '../../composables/runtime/code-groups'
import { useCopyCode } from '../../composables/runtime/copy-code'
import { useUpdateHead } from '../../composables/runtime/head'
import { usePrefetch } from '../../composables/runtime/pre-fetch'
import { dataSymbol, initData, siteDataRef, useData } from './data'
import { createRouter, type Router, RouterSymbol, scrollTo } from './router'
import { inBrowser, pathToFile } from './utils'
import type { Theme as ThemeDefinition } from './theme'

function resolveThemeExtends(theme: ThemeDefinition): ThemeDefinition {
  if (theme.extends) {
    const base = resolveThemeExtends(theme.extends)
    return {
      ...base,
      ...theme,
      async enhanceApp(ctx) {
        if (base.enhanceApp) await base.enhanceApp(ctx)

        if (theme.enhanceApp) await theme.enhanceApp(ctx)
      }
    }
  }

  return theme
}

const Theme = resolveThemeExtends(RawTheme)

const WotakuApp = defineComponent({
  name: 'WotakuApp',
  setup() {
    const { site, lang, dir } = useData()

    // change the language on the HTML element based on the current lang
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = lang.value
        document.documentElement.dir = dir.value
      })
    })

    if (import.meta.env.PROD && site.value.router.prefetchLinks) {
      // in prod mode, enable intersectionObserver based pre-fetch
      usePrefetch()
    }

    // setup global copy code handler
    useCopyCode()
    // setup global code groups handler
    useCodeGroups()

    if (Theme.setup) Theme.setup()

    return () => h(Theme.Layout!)
  }
})

export async function createApp() {
  ;(globalThis as any).__WOTAKU__ = true

  const router = newRouter()

  const app = newApp()

  app.provide(RouterSymbol, router)

  const data = initData(router.route)
  app.provide(dataSymbol, data)

  // install global components
  app.component('Content', Content)
  app.component('ClientOnly', ClientOnly)

  // expose $frontmatter & $params
  Object.defineProperties(app.config.globalProperties, {
    $frontmatter: {
      get() {
        return data.frontmatter.value
      }
    },
    $params: {
      get() {
        return data.page.value.params
      }
    }
  })

  if (Theme.enhanceApp) {
    await Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef
    })
  }

  // setup devtools in dev mode
  if (import.meta.env.DEV || __VUE_PROD_DEVTOOLS__) {
    void import('./devtools').then(({ setupDevtools }) =>
      setupDevtools(app, router, data)
    )
  }

  return { app, router, data }
}

function newApp(): App {
  return import.meta.env.PROD && (!inBrowser || window.__WOTAKU_SSG__)
    ? createSSRApp(WotakuApp)
    : createClientApp(WotakuApp)
}

function newRouter(): Router {
  return createRouter((path) => {
    if (inBrowser && import.meta.env.PROD) {
      const file = pathToFile(path)
      // The router refreshes hashmap.json when a newer deployment has
      // removed an old chunk; don't retry a stale manifest closure.
      return file ? import(/* @vite-ignore */ file) : null
    }

    const route = decodeURIComponent(path)
      .replace(/\.html$/, '')
      .replace(/\/index$/, '/')
    const load = pages[route] || pages[route.replace(/\/$/, '')] || pages[route + '/']

    if (load) return load()
    // Unbundled dev has no route map and loads documents by URL. Bundled dev
    // watches its complete map, including sandbox pages and newly added routes.
    if (import.meta.env.DEV && !Object.keys(pages).length) {
      return import(/* @vite-ignore */ pathToFile(path)!)
    }

    return null
  }, Theme.NotFound)
}

if (inBrowser) {
  // Resolve the async components used by this prerender before hydrating.
  // Competing chunk fetches otherwise attach body teleports to each other's
  // SSR anchors (search and repository filters), losing their scoped styles.
  const imports = import.meta.env.PROD ? window.__WOTAKU_SSR_IMPORTS__ || [] : []
  void Promise.all(imports.map((file) => import(/* @vite-ignore */ file)))
    .then(() => createApp())
    .then(({ app, router, data }) => {
      // wait until page component is fetched before mounting
      return router.go(location.href, { initialLoad: true }).then(() => {
        // dynamically update head tags
        useUpdateHead(router.route, data.site)
        app.mount('#app')

        // scroll to hash on new tab during dev
        if (import.meta.env.DEV && location.hash) {
          scrollTo(location.hash)
        }
      })
    })
}

/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { tryOnUnmounted } from '@vueuse/core'
import { type AsyncComponentLoader, h, onMounted, shallowRef } from 'vue'
import { type Awaitable, EXTERNAL_URL_RE, inBrowser } from '../../../shared/client'
import { siteDataRef } from './data'

export { escapeHtml as _escapeHtml, inBrowser } from '../../../shared/client'

/**
 * Join two paths by resolving the slash collision.
 */
export function joinPath(base: string, path: string) {
  return `${base}${path}`.replace(/\/+/g, '/')
}

/**
 * Append base to internal (non-relative) urls
 */
export function withBase(path: string) {
  return EXTERNAL_URL_RE.test(path) || !path.startsWith('/')
    ? path
    : joinPath(siteDataRef.value.base, path)
}

/**
 * Converts a url path to the corresponding js chunk filename.
 */
export function pathToFile(path: string) {
  let pagePath = path.replace(/\.html$/, '')
  pagePath = decodeURIComponent(pagePath)
  pagePath = pagePath.replace(/\/$/, '/index') // /foo/ -> /foo/index
  if (import.meta.env.DEV) {
    return `/@fs${__WOTAKU_PAGES__}${pagePath}.md`
  }

  const key = pagePath.slice(1).replace(/\//g, '_').toLowerCase() + '.md'
  const alternate = key.endsWith('_index.md')
    ? key.slice(0, -9) + '.md'
    : key.slice(0, -3) + '_index.md'
  return inBrowser
    ? window.__WOTAKU_HASH_MAP__?.[key] || window.__WOTAKU_HASH_MAP__?.[alternate] || null
    : null
}

export let contentUpdatedCallbacks: (() => any)[] = []

/**
 * Register callback that is called every time the markdown content is updated
 * in the DOM.
 */
export function onContentUpdated(fn: () => any) {
  contentUpdatedCallbacks.push(fn)
  tryOnUnmounted(() => {
    contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn)
  })
}

export function defineClientComponent(
  loader: AsyncComponentLoader,
  args?: any[],
  cb?: () => Awaitable<void>
) {
  return {
    setup() {
      const comp = shallowRef()
      onMounted(async () => {
        let res = await loader()
        // interop module default
        if (res && (res.__esModule || res[Symbol.toStringTag] === 'Module')) {
          res = res.default
        }

        comp.value = res
        await cb?.()
      })
      return () => (comp.value ? h(comp.value, ...(args ?? [])) : null)
    }
  }
}

export function getScrollOffset() {
  let scrollOffset = siteDataRef.value.scrollOffset
  let offset = 0
  let padding = 24

  if (typeof scrollOffset === 'object' && 'padding' in scrollOffset) {
    padding = scrollOffset.padding
    scrollOffset = scrollOffset.selector
  }

  if (typeof scrollOffset === 'number') {
    offset = scrollOffset
  } else if (typeof scrollOffset === 'string') {
    offset = tryOffsetSelector(scrollOffset, padding)
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding)

      if (res) {
        offset = res
        break
      }
    }
  }

  return offset
}

function tryOffsetSelector(selector: string, padding: number): number {
  const el = document.querySelector(selector)

  if (!el) return 0

  const bot = el.getBoundingClientRect().bottom

  if (bot < 0) return 0

  return bot + padding
}

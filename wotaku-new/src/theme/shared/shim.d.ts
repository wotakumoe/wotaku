/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

declare module 'mark.js/dist/mark.es6.js' {
  import type Mark from 'mark.js'
  const mark: typeof Mark
  export default mark
}

declare module '@wotaku/pages' {
  import type { Component } from 'vue'
  import type { PageData } from '@/theme/shared/client'
  const pages: Record<string, () => Promise<{ default: Component; __pageData: PageData }>>
  export default pages
}

declare const __VUE_PROD_DEVTOOLS__: boolean
declare const __WOTAKU_PAGES__: string

interface Window {
  __WOTAKU_HASH_MAP__?: Record<string, string>
  __WOTAKU_SSG__?: boolean
  __WOTAKU_SSR_IMPORTS__?: string[]
}

declare const __GIT_COMMIT__: string
declare const __GIT_COMMIT_TS__: number

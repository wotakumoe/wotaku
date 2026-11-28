/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { renderToString } from 'vue/server-renderer'
import type { SSRContext } from 'vue/server-renderer'
import { mergeHead } from '../../shared/client.ts'
import { hostname, siteConfig } from '../../shared/constants.ts'
import { createApp } from '../../theme/shared/runtime/index.ts'
import { generateMeta } from '../opengraph/meta.ts'

export async function render(path: string) {
  const { app, router, data } = await createApp()
  await router.go(path)
  const context: SSRContext & {
    wotakuSocialIcons: Set<string>
    teleports: Record<string, string>
  } = { wotakuSocialIcons: new Set<string>(), teleports: {} }
  const html = await renderToString(app, context)
  const pageData = router.route.data
  const head = mergeHead(
    siteConfig.head,
    pageData.frontmatter.head || [],
    generateMeta({ pageData } as any, hostname)
  )
  return {
    html,
    pageData,
    title: data.title.value,
    description: data.description.value,
    head,
    context
  }
}

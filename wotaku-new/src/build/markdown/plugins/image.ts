/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { MarkdownExit } from 'markdown-exit'
import { EXTERNAL_URL_RE } from '../../../shared/client.ts'

export interface Options {
  /**
   * Support native lazy loading for the `<img>` tag.
   * @default false
   */
  lazyLoading?: boolean
}

export const imagePlugin = (md: MarkdownExit, { lazyLoading }: Options = {}) => {
  const imageRule = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    let url = token.attrGet('src')

    if (url && !EXTERNAL_URL_RE.test(url)) {
      if (!/^\.?\//.test(url)) url = './' + url

      token.attrSet('src', decodeURIComponent(url))
    }

    if (lazyLoading) {
      token.attrSet('loading', 'lazy')
    }

    return imageRule(tokens, idx, options, env, self)
  }
}

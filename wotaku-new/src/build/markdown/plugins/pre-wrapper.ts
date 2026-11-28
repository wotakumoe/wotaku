/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { MarkdownExit, RenderRule } from 'markdown-exit'

export interface Options {
  codeCopyButtonTitle: string
}

export function preWrapperPlugin(md: MarkdownExit, options: Options) {
  // The renderer defers async highlighting, so this wrapper receives HTML immediately.
  const fence = md.renderer.rules.fence! as (...args: Parameters<RenderRule>) => string
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    token.info = token.info.replace(/\[.*\]/, '')

    const active = / active( |$)/.test(token.info) ? ' active' : ''
    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

    const lang = extractLang(token.info)

    return (
      `<div class="language-${lang}${active}">` +
      `<button title="${options.codeCopyButtonTitle}" class="copy"></button>` +
      `<span class="lang">${lang}</span>` +
      fence(...args) +
      '<p class="code-copy-feedback visually-hidden" role="status"></p>' +
      '</div>'
    )
  }
}

export function extractTitle(info: string, html = false) {
  if (html) {
    return info.replace(/<!--[^]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
  }

  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt'
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
    .replace(/(-vue|{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '')
}

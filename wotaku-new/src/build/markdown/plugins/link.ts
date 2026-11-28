/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { URL } from 'node:url'
import type { MarkdownExit } from 'markdown-exit'
import {
  EXTERNAL_URL_RE,
  isExternal,
  type MarkdownEnv,
  treatAsHtml
} from '../../../shared/client.ts'

const indexRE = /(^|.*\/)index.md(#?.*)$/i

export const linkPlugin = (
  md: MarkdownExit,
  externalAttrs: Record<string, string>,
  base: string,
  slugify: (str: string) => string
) => {
  md.core.ruler.push('prose_links', ({ tokens }) => {
    for (let i = 0; i < tokens.length; i++) {
      const children = tokens[i].children

      if (!children || tokens[i - 1]?.type === 'heading_open') continue

      let linkDepth = 0
      let tooltipDepth = 0
      const prose = children.some((child) => {
        if (child.type === 'link_open') linkDepth++
        if (child.type === 'link_close') linkDepth--

        if (child.type === 'html_inline') {
          const tooltip = child.content.match(/^<(\/?)(?:tooltip|vtooltip)\b/i)

          if (tooltip && !child.content.endsWith('/>')) {
            tooltipDepth += tooltip[1] ? -1 : 1
          }
        }

        return (
          !linkDepth &&
          !tooltipDepth &&
          ['text', 'code_inline'].includes(child.type) &&
          /[\p{L}\p{N}]/u.test(child.content)
        )
      })

      if (prose) {
        for (const child of children) {
          if (child.type === 'link_open') child.attrJoin('class', 'prose-link')
        }
      }
    }
  })

  md.renderer.rules.link_open = (tokens, idx, options, renderEnv, self) => {
    const env = renderEnv as MarkdownEnv
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')

    if (
      hrefIndex >= 0 &&
      token.attrIndex('target') < 0 &&
      token.attrIndex('download') < 0 &&
      token.attrGet('class') !== 'header-anchor' // header anchors are already normalized
    ) {
      const hrefAttr = token.attrs![hrefIndex]
      const url = hrefAttr[1]

      if (isExternal(url)) {
        Object.entries(externalAttrs).forEach(([key, val]) => {
          token.attrSet(key, val)
        })
        // catch localhost links as dead link
        if (url.replace(EXTERNAL_URL_RE, '').startsWith('//localhost:')) {
          pushLink(url, env)
        }

        hrefAttr[1] = url
      } else {
        const { pathname, protocol } = new URL(url, 'http://a.com')

        if (
          // skip internal anchor links
          !url.startsWith('#') &&
          // skip mail/custom protocol links
          protocol.startsWith('http') &&
          // skip links to files (other than html/md)
          treatAsHtml(pathname)
        ) {
          normalizeHref(hrefAttr, env)
        } else if (url.startsWith('#')) {
          hrefAttr[1] = decodeURI(normalizeHash(hrefAttr[1]))
        }

        // append base to internal (non-relative) urls
        if (hrefAttr[1].startsWith('/')) {
          hrefAttr[1] = `${base}${hrefAttr[1]}`.replace(/\/+/g, '/')
        }
      }
    }

    return self.renderToken(tokens, idx, options)
  }

  function normalizeHref(hrefAttr: [string, string], env: MarkdownEnv) {
    let url = hrefAttr[1]

    const indexMatch = url.match(indexRE)

    if (indexMatch) {
      const [, path, hash] = indexMatch
      url = path + normalizeHash(hash)
    } else {
      let cleanUrl = url.replace(/[?#].*$/, '')
      // transform foo.md -> foo[.html]
      if (cleanUrl.endsWith('.md')) {
        cleanUrl = cleanUrl.replace(/\.md$/, env.cleanUrls ? '' : '.html')
      }
      // transform ./foo -> ./foo[.html]
      if (!env.cleanUrls && !cleanUrl.endsWith('.html') && !cleanUrl.endsWith('/')) {
        cleanUrl += '.html'
      }

      const parsed = new URL(url, 'http://a.com')
      url = cleanUrl + parsed.search + normalizeHash(parsed.hash)
    }

    // ensure leading . for relative paths
    if (!url.startsWith('/') && !url.startsWith('./')) {
      url = './' + url
    }

    // export it for existence check
    pushLink(url.replace(/\.html$/, ''), env)

    // markdown-it encodes the uri
    hrefAttr[1] = decodeURI(url)
  }

  function normalizeHash(str: string) {
    return str ? encodeURI('#' + slugify(decodeURI(str).slice(1))) : ''
  }

  function pushLink(link: string, env: MarkdownEnv) {
    const links = env.links || (env.links = [])
    links.push(link)
  }
}

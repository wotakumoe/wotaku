/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import type { MarkdownRenderer } from 'vitepress'

const excluded = ['Credits']

function getTokenClass(token: { attrGet?: (name: string) => string | null }) {
  return token.attrGet?.('class') ?? ''
}

function hasClass(token: { attrGet?: (name: string) => string | null }, name: string) {
  return getTokenClass(token).split(/\s+/).includes(name)
}

function stripHeadingAttrs(value: string) {
  return value.replace(/\s+\{[^}]*\}\s*$/, '').trim()
}

function escapeHtmlAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export const headersPlugin = (md: MarkdownRenderer) => {
  // Add the Feedback component in the heading, before the link.
  //
  // Adding it after the link is closed prevents vitepress from properly
  // indexing the file's content.

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const result = self.renderToken(tokens, idx, options)

    const idxClose = idx +
      tokens.slice(idx).findIndex((token) => token.type === 'heading_close')
    if (idxClose <= idx) return result

    const level = tokens[idx].tag.slice(1)
    if (excluded.includes(env.frontmatter.title) || level !== '2') return result
    if (hasClass(tokens[idx], 'ignore-header')) return result

    // Find the token for the link.
    //
    // The token after `heading_open` contains the link as a child token.
    const children = tokens[idx + 1].children || []
    const linkOpenToken = children.findLast((c) => c.type === 'link_open')
    if (!linkOpenToken) return result

    const heading = tokens[idxClose - 1]
    const headingText = stripHeadingAttrs(heading.content)
    if (!headingText || /\{[^}]*\bignore-header\b/.test(heading.content)) {
      return result
    }

    linkOpenToken.meta = linkOpenToken.meta || {}
    linkOpenToken.meta.feedback = {
      heading: headingText
    }

    return result
  }

  let defaultRender = md.renderer.rules.link_open as any

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const result = defaultRender(tokens, idx, options, env, self)

    const meta = tokens[idx].meta
    if (!meta || !meta.feedback) return result

    const heading = meta.feedback.heading || ''
    if (!heading) return result

    return `<Feedback heading="${escapeHtmlAttr(heading)}" />${result}`
  }
}

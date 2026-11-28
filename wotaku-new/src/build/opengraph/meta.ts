/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { HeadConfig, PageData } from '@/theme/shared/client'
import { excludedFiles } from '../../shared/constants.ts'

export function generateMeta(context: { pageData: PageData }, hostname: string) {
  const head: HeadConfig[] = []
  const { pageData } = context

  if (
    pageData.isNotFound ||
    excludedFiles.includes(pageData.filePath) ||
    pageData.frontmatter.exclude
  ) {
    return head
  }

  const { relativePath, frontmatter, filePath, lastUpdated } = pageData

  const url = `${hostname}/${relativePath.replace(/((^|\/)index)?\.md$/, '$2')}`

  head.push(
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { name: 'twitter:url', content: url }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  )

  if (frontmatter.theme) {
    head.push(['meta', { name: 'theme-color', content: frontmatter.theme }])
  }

  if (frontmatter.type) {
    head.push(['meta', { property: 'og:type', content: frontmatter.type }])
  }

  head.push(
    [
      'meta',
      {
        property: 'og:description',
        content: frontmatter.customDescription ?? frontmatter.description
      }
    ],
    [
      'meta',
      {
        name: 'twitter:description',
        content: frontmatter.customDescription ?? frontmatter.description
      }
    ],
    ['meta', { property: 'og:title', content: frontmatter.title }],
    ['meta', { name: 'twitter:title', content: frontmatter.title }]
  )

  if (frontmatter.image) {
    head.push([
      'meta',
      {
        property: 'og:image',
        content: `${hostname}/${frontmatter.image.replace(/^\//, '')}`
      }
    ])
    head.push([
      'meta',
      {
        name: 'twitter:image',
        content: `${hostname}/${frontmatter.image.replace(/^\//, '')}`
      }
    ])
  } else {
    const url = filePath.replace('index.md', '').replace('.md', '')
    const imageUrl = `${url}/__og_image__/og.png`.replace(/\/\//g, '/').replace(/^\//, '')

    head.push(['meta', { property: 'og:image', content: `${hostname}/${imageUrl}` }])
    head.push(['meta', { property: 'og:image:width', content: '1098' }])
    head.push(['meta', { property: 'og:image:height', content: '530' }])
    head.push(['meta', { property: 'og:image:type', content: 'image/png' }])
    head.push(['meta', { property: 'og:image:alt', content: frontmatter.title }])
    head.push(['meta', { name: 'twitter:image', content: `${hostname}/${imageUrl}` }])
    head.push(['meta', { name: 'twitter:image:width', content: '1098' }])
    head.push(['meta', { name: 'twitter:image:height', content: '530' }])
    head.push(['meta', { name: 'twitter:image:alt', content: frontmatter.title }])
  }

  if (frontmatter.tag) {
    head.push(['meta', { property: 'article:tag', content: frontmatter.tag }])
  }

  if (frontmatter.date) {
    head.push([
      'meta',
      {
        property: 'article:published_time',
        content: frontmatter.date
      }
    ])
  }

  if (lastUpdated && pageData.frontmatter.lastUpdated !== false) {
    head.push([
      'meta',
      {
        property: 'article:modified_time',
        content: new Date(lastUpdated).toISOString()
      }
    ])
  }

  return head
}

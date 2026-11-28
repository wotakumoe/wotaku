/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { getIconsCSS } from '@iconify/utils'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createBuilder, type Manifest } from 'vite'
import { excludedFiles, hostname } from '../../shared/constants.ts'
import { pagesRoot } from '../paths.ts'
import type { HeadConfig, PageData } from '../../shared/types/shared.ts'

const root = resolve(import.meta.dirname, '../../..')
process.env.NODE_ENV = 'production'
const started = performance.now()
const builder = await createBuilder({
  root,
  configFile: join(root, 'vite.config.ts'),
  configLoader: 'bundle'
})
await builder.buildApp()
const { render } = (await import(
  pathToFileURL(join(root, 'node_modules/.ssr/server.js')).href
)) as typeof import('./server.ts')
const template = readFileSync(join(root, 'dist/index.html'), 'utf8')
const hashmap = readFileSync(join(root, 'dist/hashmap.json'), 'utf8')
const manifest: Manifest = JSON.parse(
  readFileSync(join(root, 'dist/.vite/manifest.json'), 'utf8')
)
const ssrManifest: Record<string, string[]> = JSON.parse(
  readFileSync(join(root, 'dist/.vite/ssr-manifest.json'), 'utf8')
)
const clientChunks = new Set(
  Object.values(manifest)
    .filter(
      (entry) =>
        !entry.isWorker && entry.file.endsWith('.js') && entry !== manifest['index.html']
    )
    .map((entry) => '/' + entry.file)
)
const hydrationImports = (context: Awaited<ReturnType<typeof render>>['context']) =>
  [
    ...new Set([...(context.modules || [])].flatMap((id) => ssrManifest[id] || []))
  ].filter((file) => clientChunks.has(file))
const pages = Object.entries(manifest).filter(([file]) => file.endsWith('.md'))
const escape = (value: string | number | boolean | null | undefined) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
const renderHead = (tags: HeadConfig[]) =>
  tags
    .map(([tag, attrs = {}, children = '']) => {
      const attributes = Object.entries(attrs)
        .filter(([, value]) => value != null)
        .map(([key, value]) => ` ${key}="${escape(value)}"`)
        .join('')
      return `<${tag}${attributes}>${children}${
        tag === 'meta' || tag === 'link' ? '' : `</${tag}>`
      }`
    })
    .join('')
const font = Object.values(manifest).find(
  (entry) =>
    entry.file.includes('inter-roman-latin-') &&
    entry.file.endsWith('.woff2') &&
    !entry.file.includes('latin-ext')
)
const preload = (file: string | undefined, imports: string[] = []) => {
  const files = new Set<string>()
  const visit = (key: string | undefined) => {
    const entry = key === undefined ? undefined : manifest[key]

    if (!entry || files.has(entry.file)) return

    files.add(entry.file)

    for (const dependency of entry.imports || []) visit(dependency)
  }
  visit('index.html')
  visit(file)
  return renderHead([
    [
      'link',
      {
        rel: 'preload stylesheet',
        href: '/wotaku-icons.css',
        as: 'style'
      }
    ],
    ...(font
      ? [
          [
            'link',
            {
              rel: 'preload',
              href: '/' + font.file,
              as: 'font',
              type: 'font/woff2',
              crossorigin: ''
            }
          ] as HeadConfig
        ]
      : []),
    ...[...files].map((file): HeadConfig => [
      'link',
      { rel: 'modulepreload', href: '/' + file }
    ]),
    ...imports.map((href): HeadConfig => ['link', { rel: 'modulepreload', href }])
  ])
}
const renderedPages: {
  url: string
  lastmod?: number
  frontmatter: PageData['frontmatter']
  file: string
}[] = []
const usedIcons = new Set<string>()

for (const [file] of pages) {
  const relative = file.replace(/^.*?src\/content\/pages\//, '')
  const route = '/' + relative.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  const { html, pageData, title, description, head: tags, context } = await render(route)
  const imports = hydrationImports(context)

  for (const icon of context.wotakuSocialIcons) usedIcons.add(icon)

  renderedPages.push({
    url: route,
    lastmod: pageData.lastUpdated,
    frontmatter: pageData.frontmatter,
    file: relative
  })
  const head = `<title>${escape(
    title
  )}</title><meta name="description" content="${escape(description)}"/>${renderHead(
    tags
  )}<script>window.__WOTAKU_SSG__=true;window.__WOTAKU_HASH_MAP__=${hashmap};window.__WOTAKU_SSR_IMPORTS__=${JSON.stringify(
    imports
  )}</script>`
  const document = template
    .replace('<!--wotaku-app-->', html)
    .replace('<body>', `<body>${context.teleports.body || ''}`)
    .replace('<!--wotaku-head-->', preload(file, imports) + head)
  const output = join(root, 'dist', relative.replace(/\.md$/, '.html'))
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, document)
}

const { html, title, description, head, context } = await render('/404')
const imports = hydrationImports(context)

for (const icon of context.wotakuSocialIcons) usedIcons.add(icon)

writeFileSync(
  join(root, 'dist/404.html'),
  template
    .replace('<!--wotaku-app-->', html)
    .replace('<body>', `<body>${context.teleports.body || ''}`)
    .replace(
      '<!--wotaku-head-->',
      `${preload(undefined, imports)}<title>${escape(
        title
      )}</title><meta name="description" content="${escape(description)}"/>${renderHead(
        head
      )}<script>window.__WOTAKU_SSG__=true;window.__WOTAKU_HASH_MAP__=${hashmap};window.__WOTAKU_SSR_IMPORTS__=${JSON.stringify(
        imports
      )}</script>`
    )
)
const icons = createRequire(import.meta.url)('@iconify-json/simple-icons/icons.json')
writeFileSync(
  join(root, 'dist/wotaku-icons.css'),
  getIconsCSS(icons, [...usedIcons].sort(), {
    iconSelector: '.wotaku-icon-social-{name}',
    commonSelector: '.wotaku-icon-social',
    varName: 'icon',
    format: process.env.DEBUG ? 'expanded' : 'compressed',
    mode: 'mask'
  }).replace(/[^]*?}\n*/, '')
)
writeFileSync(
  join(root, 'dist/sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">' +
    renderedPages
      .map(
        (page) =>
          `<url><loc>${hostname}${escape(page.url)}</loc>${
            page.lastmod
              ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>`
              : ''
          }</url>`
      )
      .join('') +
    '</urlset>'
)

if (process.env.CI) {
  const { generateImages } = await import(
    pathToFileURL(join(root, 'node_modules/.ssr/opengraph.js')).href
  )
  await generateImages(
    {
      srcDir: pagesRoot,
      outDir: join(root, 'dist')
    },
    renderedPages.filter((page) => !excludedFiles.includes(page.file))
  )
}

const headersFile = join(root, 'dist/_headers')
writeFileSync(
  headersFile,
  readFileSync(headersFile, 'utf8') +
    '\n/assets/*\n    Cache-Control: public, max-age=31536000, immutable\n/hashmap.json\n    Cache-Control: public, max-age=0, must-revalidate\n/wotaku-icons.css\n    Cache-Control: public, max-age=0, must-revalidate\n'
)
console.log(
  `[wotaku] prerendered ${pages.length} pages in ${(
    (performance.now() - started) /
    1000
  ).toFixed(2)}s; peak RSS ${(process.resourceUsage().maxRSS / 1024).toFixed(1)} MiB`
)

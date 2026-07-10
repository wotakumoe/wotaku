/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Font, render } from 'takumi-js'
import { Renderer } from 'takumi-js/node'
import { createContentLoader } from 'vitepress'
import type { ContentData, SiteConfig } from 'vitepress'
import { excludedFiles } from '../constants'
import { OgImageTemplate } from './OgImageTemplate'

const __dirname = dirname(fileURLToPath(import.meta.url))
const __fonts = resolve(__dirname, '../fonts')
const fonts: Font[] = [
  {
    name: 'Inter',
    data: await readFile(resolve(__fonts, 'Inter-Variable.ttf')),
    weight: 400,
    style: 'normal'
  }
]

const renderer = new Renderer()
await renderer.loadFonts(fonts)

const resourceCache = new Map<string, ArrayBuffer>()
const persistentImageByUrl = new Map<string, string>()
const defaultImage = '/embed/default.png'

export async function generateImages(config: SiteConfig) {
  const pages = await createContentLoader('**/*.md', {
    excerpt: true,
    globOptions: {
      ignore: [...excludedFiles, 'node_modules', 'dist']
    }
  }).load()

  const filteredPages = pages.filter((p) => p.frontmatter.image === undefined)

  await loadPersistentImages(filteredPages, config)

  for (const page of filteredPages) {
    await generateImage({
      page,
      outDir: config.outDir
    })
  }
}

interface GenerateImagesOptions {
  page: ContentData
  outDir: string
}

async function generateImage({
  page,
  outDir
}: GenerateImagesOptions) {
  const { frontmatter, url } = page
  const width = frontmatter.og?.width ?? 1800
  const height = frontmatter.og?.height ?? 900
  const title = String(
    frontmatter.layout === 'home'
      ? (frontmatter.hero.name ?? frontmatter.title)
      : (frontmatter.customMetaTitle ?? frontmatter.title)
  )
  const image = getImage(page)

  const png = await render(
    OgImageTemplate({ title, image: persistentImageByUrl.get(image) ?? image }),
    {
      width,
      height,
      renderer,
      resourcesOptions: {
        cache: resourceCache
      }
    }
  )

  const outputFolder = resolve(outDir, url.substring(1), '__og_image__')
  const outputFile = resolve(outputFolder, 'og.png')

  await mkdir(outputFolder, { recursive: true })

  return await writeFile(outputFile, png)
}

async function loadPersistentImages(pages: ContentData[], config: SiteConfig) {
  const imageUrls = [...new Set(pages.map(getImage))].filter(
    (url) => !persistentImageByUrl.has(url)
  )
  const offset = persistentImageByUrl.size

  await Promise.all(
    imageUrls.map(async (image, index) => {
      const src = `og-background-${offset + index}`
      const data = await loadImageData(image, config)
      await renderer.putPersistentImage({ src, data })
      persistentImageByUrl.set(image, src)
    })
  )
}

async function loadImageData(image: string, config: SiteConfig): Promise<ArrayBuffer> {
  if (/^https?:\/\//.test(image)) {
    const response = await fetch(image, {
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OpenGraph image ${image}: ${response.status} ${response.statusText}`
      )
    }

    return response.arrayBuffer()
  }

  // Root-relative path into /public, e.g. `/f/default.png`
  const filePath = resolve(config.srcDir, 'public', image.replace(/^\//, ''))
  const buffer = await readFile(filePath)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

function getImage(page: ContentData) {
  return String(page.frontmatter.og?.image ?? defaultImage)
}

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
import { createContentLoader } from 'vitepress'
import type { ContentData, SiteConfig } from 'vitepress'
import { excludedFiles } from '../constants'
import { OgImageTemplate } from './OgImageTemplate'

const __dirname = dirname(fileURLToPath(import.meta.url))
const __fonts = resolve(__dirname, '../fonts')
  const fonts: Font[] = [
    {
      name: 'Inter',
      data: await readFile(resolve(__fonts, 'Inter-Regular.otf')),
      weight: 400,
      style: 'normal'
    },
    {
      name: 'Inter',
      data: await readFile(resolve(__fonts, 'Inter-Medium.otf')),
      weight: 500,
      style: 'normal'
    },
    {
      name: 'Inter',
      data: await readFile(resolve(__fonts, 'Inter-SemiBold.otf')),
      weight: 600,
      style: 'normal'
    },
    {
      name: 'Inter',
      data: await readFile(resolve(__fonts, 'Inter-Bold.otf')),
      weight: 700,
      style: 'normal'
    }
  ]


export async function generateImages(config: SiteConfig) {
  const pages = await createContentLoader('**/*.md', {
    excerpt: true,
    globOptions: {
      ignore: [...excludedFiles, 'node_modules', 'dist']
    }
  }).load()

  const filteredPages = pages.filter((p) => p.frontmatter.image === undefined)

  for (const page of filteredPages) {
    await generateImage({
      page,
      outDir: config.outDir,
      fonts
    })
  }
}

interface GenerateImagesOptions {
  page: ContentData
  outDir: string
  fonts: Font[]
}

async function generateImage({
  page,
  outDir,
  fonts
}: GenerateImagesOptions) {
  const { frontmatter, url } = page
  const width = frontmatter.og?.width ?? 1800
  const height = frontmatter.og?.height ?? 900
  const title = String(
    frontmatter.layout === 'home'
      ? (frontmatter.hero.name ?? frontmatter.title)
      : (frontmatter.customMetaTitle ?? frontmatter.title)
  )
  const image = String(
    frontmatter.og?.image ?? 'https://i.wotaku.wiki/f/default.png'
  )

  const png = await render(
    OgImageTemplate({ title, image }),
    {
      width,
      height,
      fonts
    }
  )

  const outputFolder = resolve(outDir, url.substring(1), '__og_image__')
  const outputFile = resolve(outputFolder, 'og.png')

  await mkdir(outputFolder, { recursive: true })

  return await writeFile(outputFile, png)
}

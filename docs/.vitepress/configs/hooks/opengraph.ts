/**
 *  Copyright (c) 2024 taskylizard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'
import type { ContentData, SiteConfig } from 'vitepress'
import { type SatoriOptions, satoriVue } from 'x-satori/vue'
import { renderAsync } from '@resvg/resvg-js'
import { excludedFiles } from '../constants'

const __dirname = dirname(fileURLToPath(import.meta.url))
const __fonts = resolve(__dirname, '../fonts')

export async function generateImages(config: SiteConfig) {
  const pages = await createContentLoader('**/*.md', {
    excerpt: true,
    globOptions: {
      ignore: [...excludedFiles, 'node_modules', 'dist']
    }
  }).load()
  const template = await readFile(
    resolve(__dirname, '../../theme/components/OgImageTemplate.vue'),
    'utf-8'
  )

  const fonts: SatoriOptions['fonts'] = [
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

  const filteredPages = pages.filter((p) => p.frontmatter.image === undefined)

  for (const page of filteredPages) {
    await generateImage({
      page,
      template,
      outDir: config.outDir,
      fonts
    })
  }
}

interface GenerateImagesOptions {
  page: ContentData
  template: string
  outDir: string
  fonts: SatoriOptions['fonts']
}

function getDir(url: string) {
  if (url.startsWith('/glossary/')) {
    return 'Glossary'
  } else if (url.startsWith('/guides/')) {
    return 'Guide'
  }

  // Means we are at root.
  return undefined
}

async function generateImage({
  page,
  template,
  outDir,
  fonts
}: GenerateImagesOptions) {
  const { frontmatter, url } = page

  const options: SatoriOptions = {
    // Use custom dimensions from frontmatter.og if provided
    width: frontmatter.og?.width ?? 1800,
    height: frontmatter.og?.height ?? 900,
    fonts,
    props: {
      title:
        frontmatter.layout === 'home'
          ? frontmatter.hero.name ?? frontmatter.title
          : frontmatter.customMetaTitle ?? frontmatter.title,
      description:
        frontmatter.layout === 'home'
          ? frontmatter.hero.tagline ?? frontmatter.description
          : frontmatter.description,
      // dir: getDir(url)
      image: frontmatter.og?.image ?? 'https://files.catbox.moe/kzhgvy.png'
    }
  }

  const svg = await satoriVue(options, template)

  const render = await renderAsync(svg)

  const outputFolder = resolve(outDir, url.substring(1), '__og_image__')
  const outputFile = resolve(outputFolder, 'og.png')

  await mkdir(outputFolder, { recursive: true })

  return await writeFile(outputFile, render.asPng())
}

/**
*  All Rights Reserved
*
*  Copyright (c) 2025 taskylizard
*
*  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
*/
import { colors } from '@taskylizard/colors'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { resolve } from 'node:path'
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives
} from 'unocss'

// Custom icons collection
const customIcons = {
  circle:
    '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"></circle></svg>'
  // Add more custom icons here as needed
}

const safelist = Object.entries(colors).flatMap(([group, shades]) =>
  Object.keys(shades).flatMap((shade) => [
    `text-${group}-${shade}`,
    `bg-${group}-${shade}`
  ])
)

export default defineConfig({
  content: {
    filesystem: ['.vitepress/configs/constants.ts']
  },
  safelist,
  theme: {
    colors: {
      ...colors,
      primary: 'var(--vp-c-brand-1)',
      bg: 'var(--vp-c-bg)',
      'bg-alt': 'var(--vp-c-bg-alt)',
      'bg-elv': 'var(--vp-c-bg-elv)',
      text: 'var(--vp-c-text-1)',
      'text-2': 'var(--vp-c-text-2)',
      div: 'var(--vp-c-divider)'
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      },
      warn: true,
      collections: {
        custom: FileSystemIconLoader(resolve(__dirname, 'docs/public/custom')),
        inline: customIcons
      }
    })
  ],
  transformers: [transformerDirectives()]
})

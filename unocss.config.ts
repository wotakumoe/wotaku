/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { colors } from '@taskylizard/colors'
import { resolve } from 'node:path'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  presetWind4,
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
    easing: {
      'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)'
    },
    colors: {
      ...colors,
      primary: 'var(--vp-c-brand-1)',
      bg: 'var(--vp-c-bg)',
      'bg-alt': 'var(--vp-c-bg-alt)',
      'bg-elv': 'var(--vp-c-bg-elv)',
      text: 'var(--vp-c-text-1)',
      'text-2': 'var(--vp-c-text-2)',
      div: 'var(--vp-c-divider)',
      // Ayanami Blue
      'brand': {
        '50': 'oklch(0.965 0.011 256.71)',
        '100': 'oklch(0.93 0.024 256.1)',
        '200': 'oklch(0.861 0.048 253.25)',
        '300': 'oklch(0.791 0.076 251.19)',
        '400': 'oklch(0.722 0.105 247.48)',
        '500': 'oklch(0.626 0.098 247.46)',
        '600': 'oklch(0.523 0.081 246.86)',
        '700': 'oklch(0.43 0.066 246.75)',
        '800': 'oklch(0.335 0.052 246.76)',
        '900': 'oklch(0.233 0.035 246.39)',
        '950': 'oklch(0.186 0.029 247.31)'
      }
    }
  },
  presets: [
    presetWind4({
      preflights: {
        theme: true
      }
    }),
    presetAttributify(),
    presetWebFonts({
      fonts: {
        serif: 'Source Serif 4 Variable',
        pacifico: {
          name: 'Pacifico',
          weights: [400],
          italic: true
        }
      }
    }),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'min-width': '1.2rem'
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

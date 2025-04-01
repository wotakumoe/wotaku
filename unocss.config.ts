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
        custom: FileSystemIconLoader(resolve(__dirname, '.docs/public/custom'))
      }
    })
  ],
  transformers: [transformerDirectives()]
})

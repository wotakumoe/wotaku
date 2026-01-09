/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import type { IconifyJSON } from '@iconify-json/octicon'
import type { MarkdownRenderer } from 'vitepress'

// Icons that need to be used should be imported here
import { icons as akar } from '@iconify-json/akar-icons'
import { icons as ic } from '@iconify-json/ic'
import { icons as iconoir } from '@iconify-json/iconoir'
import { icons as logos } from '@iconify-json/logos'
import { icons as lucide } from '@iconify-json/lucide'
import { icons as materials } from '@iconify-json/material-symbols'
import { icons as mdi } from '@iconify-json/mdi'
import { icons as mingcute } from '@iconify-json/mingcute'
import { icons as octicon } from '@iconify-json/octicon'
import { icons as ri } from '@iconify-json/ri'
import { icons as simple } from '@iconify-json/simple-icons'
import { icons as twemoji } from '@iconify-json/twemoji'
import { icons as uil } from '@iconify-json/uil'

// 1. Install emoji pack with `pnpm add -D @iconify-json/<icon>`
// 2. Import them like I did above
// 3. Add it to this emojis array, like I did for octicon, and add a prefix
const emojis: { pack: IconifyJSON; prefix?: string }[] = [
  // Default emojis (twemoji)
  { pack: twemoji },
  // octicon emojis, prefixed with "octicon-"
  { pack: octicon, prefix: 'octicon-' },
  { pack: logos, prefix: 'logos-' },
  { pack: ic, prefix: 'ic-' },
  { pack: mingcute, prefix: 'mingcute-' },
  { pack: mdi, prefix: 'mdi-' },
  { pack: materials, prefix: 'material-symbols-' },
  { pack: simple, prefix: 'simple-icons-' },
  { pack: lucide, prefix: 'lucide-' },
  { pack: uil, prefix: 'uil-' },
  { pack: ri, prefix: 'ri-' },
  { pack: akar, prefix: 'akar-icons-' },
  { pack: iconoir, prefix: 'iconoir-' }
]

// Add aliases here...
const aliases: Record<string, string> = {
  // System
  and: 'simple-icons-android',
  win: 'simple-icons-windows',
  app: 'simple-icons-apple',
  lin: 'simple-icons-linux',
  bsd: 'simple-icons-freebsd',
  cmd: 'material-symbols-terminal-rounded',
  ff: 'simple-icons-firefoxbrowser',
  cr: 'simple-icons-googlechrome',
  web: 'mdi-web',

  // Type
  strm: 'material-symbols-play-circle-outline',
  ddl: 'material-symbols-cloud-download-outline-rounded',
  mag: 'lucide-magnet',
  lcl: 'iconoir-floppy-disk',
  batch: 'material-symbols-package-2-outline',
  sp: `lucide-file`,
  dp: `lucide-book-open`,
  ls: `lucide-scroll`,

  // Price
  paid: 'ic-round-attach-money',
  fm: 'ic-round-add-shopping-cart',
  free: 'ic-round-money-off-csred',
  sub: 'ic-round-currency-exchange',
  coin: 'akar-icons-coin',

  // Source
  src: 'mdi-package-variant',
  cs: 'mdi-package-variant-closed-remove',

  // Platform
  d: 'simple-icons-discord',
  f: 'simple-icons-4chan',
  x: 'simple-icons-twitter',
  tg: 'simple-icons-telegram',
  mal: 'simple-icons-myanimelist',
  al: 'simple-icons-anilist',
  k: 'simple-icons-kitsu',
  simkl: 'simple-icons-simkl',

  // Storage
  sgd: 'simple-icons-googledrive',
  sm: 'simple-icons-mega',
  smf: 'simple-icons-mediafire',
  host: 'mdi-snail',

  // Flag
  fjp: 'twemoji-flag-japan',
  fkr: 'twemoji-flag-south-korea',
  fcn: 'twemoji-flag-china',

  // Code
  py: 'simple-icons-python',
  js: 'simple-icons-javascript',
  css: 'mdi-language-css3',
  dock: 'simple-icons-docker',

  // Others
  s: 'twemoji-glowing-star',
  e: 'mdi-puzzle',
  n: 'material-symbols-science',
  alt: 'ic-round-looks-two',
  ero: 'twemoji-no-one-under-eighteen',
  acc: 'material-symbols-person-add',
  rss: 'simple-icons-rss',
  prx: 'material-symbols-directions-alt',
  tf: 'mdi-airplane',
  more: 'mdi-arrow-right-bold',
  help: 'material-symbols-help',
  yes: 'twemoji-check-mark-button',
  no: 'twemoji-cross-mark',
  global: 'twemoji-globe-showing-asia-australia',
  cc: 'mdi-closed-caption',
  hs: 'mdi-hulu'
}

// Custom icons using UnoCSS inline collection
const customIconAliases: Record<string, string> = {
  'custom-circle': 'inline-circle'
  // Add more custom icon aliases here
}

const defs: Record<string, string> = {}

// Add pack icons to defs
for (const elem of emojis) {
  for (const key in elem.pack.icons) {
    if (elem.prefix) defs[elem.prefix + key] = ''
    else defs[key] = ''
  }
}

// Add custom icon aliases to defs
for (const [alias, _] of Object.entries(customIconAliases)) {
  defs[alias] = ''
}

for (const [alias, fullName] of Object.entries(aliases)) {
  defs[alias] = defs[fullName] !== undefined ? '' : 'INVALID_ALIAS'
}

export { aliases, defs }

export function emojiRender(md: MarkdownRenderer) {
  md.renderer.rules.emoji = (tokens, idx) => {
    const markup = tokens[idx].markup

    // Check for custom icon aliases first
    if (customIconAliases[markup]) {
      return `<span class="i-${customIconAliases[markup]}"></span>`
    }

    // Check for aliases
    if (aliases[markup]) {
      return `<span class="i-${aliases[markup]}"></span>`
    }

    // Check for prefixed icons
    for (const emoji of emojis) {
      if (markup.startsWith(emoji.prefix!)) {
        return `<span class="i-${markup}"></span>`
      }
    }

    // Default to twemoji
    return `<span class="i-twemoji-${markup}"></span>`
  }
}

export function movePlugin(
  plugins: { name: string }[],
  pluginAName: string,
  order: 'before' | 'after',
  pluginBName: string
) {
  const pluginBIndex = plugins.findIndex((p) => p.name === pluginBName)
  if (pluginBIndex === -1) return

  const pluginAIndex = plugins.findIndex((p) => p.name === pluginAName)
  if (pluginAIndex === -1) return

  if (order === 'before' && pluginAIndex > pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0]
    plugins.splice(pluginBIndex, 0, pluginA)
  }

  if (order === 'after' && pluginAIndex < pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0]
    plugins.splice(pluginBIndex, 0, pluginA)
  }
}

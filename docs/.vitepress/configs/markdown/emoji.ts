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
import type { MarkdownRenderer } from 'vitepress'
import type { IconifyJSON } from '@iconify-json/octicon'

// Icons that need to be used should be imported here
import { icons as twemoji } from '@iconify-json/twemoji'
import { icons as octicon } from '@iconify-json/octicon'
import { icons as logos } from '@iconify-json/logos'
import { icons as ic } from '@iconify-json/ic'
import { icons as mingcute } from '@iconify-json/mingcute'
import { icons as mdi } from '@iconify-json/mdi'
import { icons as materials } from '@iconify-json/material-symbols'
import { icons as simple } from '@iconify-json/simple-icons'
import { icons as lucide } from '@iconify-json/lucide'
import { icons as iconoir } from '@iconify-json/iconoir'
import { icons as uil } from '@iconify-json/uil'
import { icons as ri } from '@iconify-json/ri'
import { icons as akar } from '@iconify-json/akar-icons'

// 1. Install emoji pack with `pnpm add -g @iconify-json/<icon>`
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

  // Price
  paid: 'ic-round-attach-money',
  fm: 'ic-round-add-shopping-cart',
  sub: 'ic-round-currency-exchange',
  coin: 'akar-icons-coin',

  // Source
  gh: 'simple-icons-github',
  gl: 'simple-icons-gitlab',
  cb: 'simple-icons-codeberg',
  kde: 'simple-icons-kde',
  gn: 'simple-icons-gnome',
  gt: 'simple-icons-gitea',
  cs: 'material-symbols-lock-outline',

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
  css: 'simple-icons-css',
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

const defs: Record<string, string> = {}

for (const elem of emojis) {
  for (const key in elem.pack.icons) {
    if (elem.prefix) defs[elem.prefix + key] = ''
    else defs[key] = ''
  }
}

for (const [alias, fullName] of Object.entries(aliases)) {
  defs[alias] = defs[fullName] !== undefined ? '' : 'INVALID_ALIAS'
}

export { defs, aliases }

export function emojiRender(md: MarkdownRenderer) {
  md.renderer.rules.emoji = (tokens, idx) => {
    const markup = tokens[idx].markup
    if (aliases[markup]) {
      return `<span class="i-${aliases[markup]}"></span>`
    }

    for (const emoji of emojis) {
      if (markup.startsWith(emoji.prefix!)) {
        return `<span class="i-${markup}"></span>`
      }
    }

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

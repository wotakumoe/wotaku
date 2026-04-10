/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import type { IconifyJSON } from '@iconify-json/octicon'
import type { MarkdownRenderer } from 'vitepress'
import { iconTooltips } from './tooltip'

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

// Add aliases here: [icon, label?]
// Label is optional — omit for icons that don't need a tooltip.
const aliasDefs: Record<string, [string, string?]> = {
  // System
  and: ['simple-icons-android', 'Android'],
  ios: ['simple-icons-apple', 'iOS / iPadOS'],
  win: ['simple-icons-windows', 'Windows'],
  app: ['ri-finder-fill', 'MacOS'],
  lin: ['simple-icons-linux', 'Linux'],
  bsd: ['simple-icons-freebsd', 'BSD'],
  cmd: ['material-symbols-terminal-rounded', 'CLI / TUI'],
  ff: ['simple-icons-firefoxbrowser', 'Firefox'],
  cr: ['simple-icons-googlechrome', 'Chromium'],
  web: ['mdi-web', 'Web'],

  // Type
  strm: ['material-symbols-play-circle-outline', 'Stream'],
  ddl: ['material-symbols-cloud-download-outline-rounded', 'Online / DDL'],
  mag: ['lucide-magnet', 'Torrent / p2p'],
  lcl: ['iconoir-floppy-disk', 'Local file'],
  batch: ['material-symbols-package-2-outline', 'Batch Download'],
  sp: ['lucide-file', 'Single Page Mode'],
  dp: ['lucide-book-open', 'Double Page Mode'],
  ls: ['lucide-scroll', 'Long-Strip Mode'],

  // Tracking
  sync: ['material-symbols-sync', 'Sync'],
  ie: ['material-symbols-arrows-up-down-circle-outline-rounded', 'Import / Export'],

  // Price
  paid: ['ic-round-attach-money', 'Paid'],
  fm: ['ic-round-add-shopping-cart', 'Freemium'],
  free: ['ic-round-money-off-csred', 'Has free content'],
  sub: ['ic-round-currency-exchange', 'Subscription'],
  coin: ['akar-icons-coin', 'Coin / Point'],

  // Source
  src: ['mdi-package-variant', 'Source Code'],
  cs: ['mdi-package-variant-closed-remove', 'Closed Source'],

  // Platform
  d: ['simple-icons-discord', 'Discord'],
  f: ['simple-icons-4chan', '4chan'],
  x: ['simple-icons-twitter', 'Twitter'],
  tg: ['simple-icons-telegram', 'Telegram'],
  mal: ['simple-icons-myanimelist', 'MyAnimeList'],
  al: ['simple-icons-anilist', 'AniList'],
  k: ['simple-icons-kitsu', 'Kitsu'],
  simkl: ['simple-icons-simkl', 'Simkl'],

  // Storage
  sgd: ['simple-icons-googledrive', 'Google Drive'],
  sm: ['simple-icons-mega', 'MEGA'],
  smf: ['simple-icons-mediafire', 'MediaFire'],
  host: ['mdi-snail', 'Other Host'],

  // Region
  fjp: ['twemoji-flag-japan', 'Japan'],
  fkr: ['twemoji-flag-south-korea', 'Korea'],
  fcn: ['twemoji-flag-china', 'China'],

  // Code
  py: ['simple-icons-python', 'Python'],
  js: ['simple-icons-javascript', 'JavaScript'],
  css: ['mdi-language-css3', 'CSS'],
  dock: ['simple-icons-docker', 'Docker'],

  // Others
  s: ['twemoji-glowing-star', 'Favorite'],
  e: ['mdi-puzzle', 'Extension / Plugin'],
  n: ['material-symbols-science', 'Nightly build'],
  alt: ['ic-round-looks-two', 'Alternative'],
  ero: ['twemoji-no-one-under-eighteen', 'R18'],
  acc: ['material-symbols-person-add', 'Needs account'],
  rss: ['simple-icons-rss', 'RSS Feed'],
  prx: ['material-symbols-directions-alt', 'Proxies'],
  tf: ['mdi-airplane', 'Testflight'],
  more: ['mdi-arrow-right-bold', 'Related'],
  help: ['material-symbols-help', 'Help / Docs'],
  yes: ['twemoji-check-mark-button', 'Yes / Available'],
  no: ['twemoji-cross-mark', 'No / Unavailable'],
  global: ['twemoji-globe-showing-asia-australia', 'Global'],
  up: ['material-symbols-upload', 'Self Upload'],
  ms: ['material-symbols-file-copy-rounded', 'Multi Source'],
  ps: ['material-symbols-file-copy-outline-rounded'],
  ss: ['material-symbols-file-copy-off-rounded'],
  cc: ['mdi-closed-caption', 'Soft Subtitle / CC'],
  hs: ['mdi-hulu', 'Hardsubs']
}

// Derived maps from aliasDefs
const aliases: Record<string, string> = {}
const aliasLabels: Record<string, string> = {}
for (const [key, [icon, label]] of Object.entries(aliasDefs)) {
  aliases[key] = icon
  if (label) aliasLabels[key] = label
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
    const label = aliasLabels[markup] || iconTooltips[markup]

    const tip = label?.replace(/"/g, '&quot;')
    const wrap = (cls: string) => tip
      ? `<span class="icon-tip" data-tip="${tip}" tabindex="-1"><span class="${cls}"></span></span>`
      : `<span class="${cls}"></span>`

    // Check for custom icon aliases first
    if (customIconAliases[markup]) return wrap(`i-${customIconAliases[markup]}`)

    // Check for aliases
    if (aliases[markup]) return wrap(`i-${aliases[markup]}`)

    // Check for prefixed icons
    for (const emoji of emojis) {
      if (markup.startsWith(emoji.prefix!)) return wrap(`i-${markup}`)
    }

    // Default to twemoji
    return wrap(`i-twemoji-${markup}`)
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

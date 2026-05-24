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
import { icons as simple } from '@iconify-json/simple-icons'
import { icons as twemoji } from '@iconify-json/twemoji'
import { icons as uil } from '@iconify-json/uil'
import { icons as map } from '@iconify-json/map'
import { icons as bi } from '@iconify-json/bi'
import { icons as sl } from '@iconify-json/streamline-logos'
import { icons as su } from '@iconify-json/streamline-ultimate'
import { icons as ss } from '@iconify-json/streamline-sharp'

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
  { pack: akar, prefix: 'akar-icons-' },
  { pack: map, prefix: 'map-' },
  { pack: bi, prefix: 'bi-' },
  { pack: sl, prefix: 'streamline-logos-' },
  { pack: su, prefix: 'streamline-ultimate-' },
  { pack: ss, prefix: 'streamline-sharp-' },
  { pack: iconoir, prefix: 'iconoir-' }
]

// Add aliases here: [icon, label?]
// Label is optional — omit for icons that don't need a tooltip.
const aliasDefs: Record<string, [string, string?]> = {
 
  // Operating System
  and: ['simple-icons-android', 'Android'],
  ios: ['simple-icons-apple', 'iOS / iPadOS'],
  win: ['streamline-logos-microsoft-windows-logo-1-solid', 'Windows'],
  app: ['streamline-logos-mac-finder-logo-solid', 'MacOS'],
  lin: ['simple-icons-linux', 'Linux'],
  bsd: ['simple-icons-freebsd', 'BSD'],
  cmd: ['lucide-square-terminal', 'CLI / TUI'],

  // Browser
  ff: ['simple-icons-firefoxbrowser', 'Firefox / Gecko-based'],
  cr: ['simple-icons-googlechrome', 'Chrome / Chromium-based'],
  web: ['mdi-web', 'Website / Web-based'],

  // Program
  py: ['simple-icons-python', 'Python'],
  npm: ['mdi-npm-variant', 'npm'],
  js: ['simple-icons-javascript', 'JavaScript'],
  css: ['mdi-language-css3', 'CSS'],
  dock: ['simple-icons-docker', 'Docker'],

  // Source code
  src: ['mdi-package-variant', 'Source Code'],
  cs: ['mdi-package-variant-closed-remove', 'Closed Source'],

  // Network Type
  ddl: ['material-symbols-cloud-download-outline-rounded', 'Direct / HTTP(S) Download'],
  mag: ['lucide-magnet', 'Torrent / Magnet Download'],
  usnt: ['material-symbols-newspaper-rounded', 'Usenet / NZB download'],
  
  // Device
  erdr: ['material-symbols-chrome-reader-mode-outline-rounded', 'E-reader'],

  // Manga & Anime
  sync: ['material-symbols-sync', 'Built-in sync system w/ Tracker(s)'],
  msync: ['material-symbols-rule-settings-rounded', 'Sync using MAL-Sync'],
  ie: ['mingcute-transfer-2-fill', 'Import / Export'],
  cmnt: ['ic-round-mode-comment', 'Comment section'],
  frm: ['ic-round-forum', 'Forum'],

  cc: ['map-closed-captioning', 'Soft Subtitle / CC'],
  oc: ['map-open-captioning', 'Hard Subtitle / OC'],
  hd: ['bi-badge-hd-fill', 'Video quality up to 720p'],
  sup: ['mingcute-server-fill', 'Self-uploaded (Own storage or video host)'],
  scrpr: ['mingcute-shovel-fill', 'Scraper (Pulling from other host sites)'],
  tv: ['material-symbols-tv-gen-outline-rounded', 'Native TV support'],
  cast: ['material-symbols-cast-outline','TV casting support'],
  dlna: ['mdi-dlna','DLNA support'],

  up: ['material-symbols-upload', 'User / scanlator upload'],
  ms: ['material-symbols-file-copy-rounded', 'Multiple chapter sources'],
  ps: ['material-symbols-file-copy-outline-rounded', 'Unlabeled / Poorly labeled / Partial multi-source'],
  ss: ['material-symbols-file-copy-off-rounded', 'Single source'],
  sp: ['lucide-file', 'Single Page Mode'],
  dp: ['lucide-book-open', 'Dual Page Mode'],
  ls: ['lucide-scroll', 'Long-Strip Mode'],
  lsg: ['material-symbols-page-footer-sharp', 'Long-Strip with gaps'],

  // Tracking
  mal: ['simple-icons-myanimelist', 'MyAnimeList'],
  al: ['simple-icons-anilist', 'AniList'],
  k: ['simple-icons-kitsu', 'Kitsu'],
  shiki: ['simple-icons-shikimori','Shikimori'],
  simkl: ['simple-icons-simkl', 'Simkl'],
  tmdb: ['simple-icons-themoviedatabase', 'TMDB'],
  lstfm: ['simple-icons-lastdotfm', 'Lastfm'],
  igdb: ['simple-icons-igdb', 'IGDB'],

  // Social
  d: ['simple-icons-discord', 'Discord'],
  f: ['simple-icons-4chan', '4chan'],
  x: ['simple-icons-twitter', 'Twitter'],
  tg: ['simple-icons-telegram', 'Telegram'],
  vk: ['simple-icons-vk', 'VK'],

  // Other Websites
  steam: ['simple-icons-steam', 'Steam'],
  gog: ['mdi-gog', 'GOG'],
  iarch: ['simple-icons-internetarchive', 'Internet Archive'],
  apple: ['simple-icons-apple','Apple product'],
  wikip: ['simple-icons-wikipedia','WikiPedia'],

  // Price
  paid: ['streamline-ultimate-cash-payment-bills-bold', "Good ol' money"],
  fm: ['ic-round-add-shopping-cart', 'Freemium'],
  free: ['streamline-sharp-tag-free-circle-remix', 'Has free/demo content'],
  sub: ['ic-round-currency-exchange', 'Subscription'],
  coin: ['akar-icons-coin', 'Coin / Point'],

  // Region
  global: ['twemoji-globe-showing-asia-australia', 'Global'],

  ljp: ['twemoji-flag-japan', 'Japanese'],
  lkr: ['twemoji-flag-south-korea', 'Korean'],
  lcn: ['twemoji-flag-china', 'Chinese'],
  ltw: ['twemoji-flag-taiwan', 'Taiwanese'],
  lfr: ['twemoji-flag-france', 'French'],
  lge: ['twemoji-flag-germany', 'German'],
  len: ['twemoji-flag-united-kingdom', 'English'],
  lru: ['twemoji-flag-russia', 'Russian'],
  lgr: ['twemoji-flag-greece', 'Greek'],
  lpo: ['twemoji-flag-poland', 'Polish'],
  lsp: ['twemoji-flag-spain', 'Spanish'],
  lbr: ['twemoji-flag-brazil', 'Brazilian'],

  ccn: ['twemoji-flag-china', 'China'],
  cuk: ['twemoji-flag-united-kingdom', 'United Kingdom'],
  cge: ['twemoji-flag-germany', 'Germany'],
  cus: ['twemoji-flag-united-states', 'United States'],
  ccy: ['twemoji-flag-cyprus', 'Cyprus'],
  cca: ['twemoji-flag-canada', 'Canada'],
  cjp: ['twemoji-flag-japan', 'Japan'],
  ckr: ['twemoji-flag-south-korea', 'Korea'],
  cswi: ['twemoji-flag-switzerland', 'Switzerland'],
  cswe: ['twemoji-flag-sweden', 'Sweden'],
  cit: ['twemoji-flag-italy', 'Italy'],
  cgib: ['twemoji-flag-gibraltar', 'Gibraltar'],
  cukr: ['twemoji-flag-ukraine', 'Ukraine'],
  cindo: ['twemoji-flag-indonesia', 'Indonesia'],
  cindi: ['twemoji-flag-india', 'India'],
  ctur: ['twemoji-flag-turkiye', 'Turkey'],
  cban: ['twemoji-flag-bangladesh', 'Bangladesh'],
  cfr: ['twemoji-flag-france', 'France'],
  cvie: ['twemoji-flag-vietnam', 'Vietnam'],
  cbr: ['twemoji-flag-brazil', 'Brazil'],


  // Storage
  sgd: ['simple-icons-googledrive', 'Google Drive'],
  sm: ['simple-icons-mega', 'MEGA'],
  smf: ['simple-icons-mediafire', 'MediaFire'],
  host: ['mdi-snail', 'Rate-limited / Paywalled Host'],

  
  // General
  s: ['twemoji-glowing-star', 'Favorite'],
  e: ['mdi-puzzle', 'Extension'],
  pin: ['mingcute-classify-add-2-fill', 'Extra plugin/script'],
  n: ['material-symbols-science', 'Nightly build'],
  alt: ['ic-round-looks-two', 'Alternative'],
  ero: ['twemoji-no-one-under-eighteen', 'R18'],
  acc: ['material-symbols-person-add', 'Needs account'],
  rss: ['simple-icons-rss', 'RSS Feed'],
  prx: ['material-symbols-directions-alt', 'Proxies / Mirrors'],
  tf: ['mdi-airplane', 'Testflight'],
  more: ['mdi-arrow-right-bold', 'Related'],
  prev: ['mdi-arrow-right-thick','Related to Prior URL'],
  help: ['material-symbols-help', 'Help / Docs'],
  ded: ['twemoji-headstone','Inactive / Retired'],
  strm: ['material-symbols-play-circle-outline', 'Stream'],
  lcl: ['iconoir-floppy-disk', 'Local file'],
  batch: ['material-symbols-package-2-outline', 'Batch Download'],
  poke: ['ic-sharp-catching-pokemon', 'Pokedex'],
  yes: ['lucide-check', 'Yes / Available'],
  no: ['lucide-x', 'No / Unavailable']
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

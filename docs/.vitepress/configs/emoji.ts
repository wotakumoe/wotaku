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
  { pack: iconoir, prefix: 'iconoir-' }
]

// Add aliases here...
const aliases: Record<string, string> = {
  // System
  and: 'simple-icons-android',
  win: 'simple-icons-windows',
  app: 'simple-icons-apple',
  lin: 'simple-icons-linux',
  ff: 'simple-icons-firefoxbrowser',
  cr: 'simple-icons-googlechrome',
  web: 'mdi-web',

  // Type
  strm: 'material-symbols-play-circle-outline',
  ddl: 'material-symbols-cloud-download-outline-rounded',
  mag: 'lucide-magnet',
  lcl: 'iconoir-floppy-disk',

  // Price
  paid: 'material-symbols-credit-card-outline',
  fm: 'material-symbols-add-shopping-cart-rounded',

  // Source
  gh: 'simple-icons-github',
  gl: 'simple-icons-gitlab',
  cb: 'simple-icons-codeberg',
  kde: 'simple-icons-kde',
  gn: 'simple-icons-gnome',
  cs: 'material-symbols-lock-outline',

  // Platform
  d: 'simple-icons-discord',
  f: 'simple-icons-4chan',
  x: 'simple-icons-twitter',
  tg: 'simple-icons-telegram',
  mal: 'simple-icons-myanimelist',
  al: 'simple-icons-anilist',
  k: 'simple-icons-kitsu',

  // Others
  s: 'twemoji-glowing-star',
  e: 'mdi-puzzle',
  rss: 'simple-icons-rss',
  tf: 'mdi-airplane',
  js: 'simple-icons-javascript',
  css: 'mdi-format-paint'
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

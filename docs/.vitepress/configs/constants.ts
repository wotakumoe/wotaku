import type { DefaultTheme } from 'vitepress'
import { x } from 'tinyexec'

export const hostname: string = 'https://wotaku.wiki'
export const excludedFiles = ['t.md']
export const GIT_COMMIT =
  /** Github actions commit hash */
  process.env.GITHUB_SHA ??
  /** Commit hash from git */
  (await x('git', ['rev-parse', 'HEAD']).then((result) =>
    result.stdout.trim()
  )) ??
  'dev'

// @unocss-include
export const nav: DefaultTheme.NavItem[] = [
  {
    text: 'Pages',
    items: [
      { text: 'Quick Start', link: '/qs' },
      { text: 'FAQs', link: '/faq' },
      { text: 'Websites', link: '/websites' },
      { text: 'Software', link: '/software' },
      { text: 'Misc-sites', link: '/misc' },
      { text: 'Tools', link: '/tools' },
      { text: 'Art', link: '/art' },
      { text: 'Music', link: '/music' },
      { text: 'Games', link: '/games' },
      { text: 'Non-English', link: '/nonen' },
      { text: 'NSFW', link: '/nsfw' },
      { text: 'Merch', link: '/merch' },
      { text: 'Scanlation', link: '/scanlation' },
      { text: 'VTuber', link: '/vtuber' },
      { text: 'Communities', link: '/comms' }
    ]
  },
  {
    text: 'Japan',
    items: [
      { text: 'Language', link: '/japan/language' },
      { text: 'Immersion', link: '/japan/immersion' },
      { text: 'Software', link: '/japan/software' },
      { text: 'Culture', link: '/japan/culture' }
    ]
  },
  {
    text: 'Glossary',
    items: [
      { text: 'General', link: '/glossary/general' },
      { text: 'Anime', link: '/glossary/anime' },
      { text: 'Manga', link: '/glossary/manga' },
      { text: 'Audio', link: '/glossary/audio' },
      { text: 'NSFW', link: '/glossary/nsfw' }
    ]
  },
  {
    text: 'Torrenting',
    items: [
      { text: 'Getting Started', link: '/torrenting/start' },
      { text: 'FAQs', link: '/torrenting/faq' },
      { text: 'Glossary', link: '/torrenting/glossary' },
      { text: 'qBittorrent', link: '/torrenting/qbit' },
      { text: `Trackers`, link: '/torrenting/trackers' }
    ]
  },
  {
    text: 'Guides',
    items: [
      {
        text: 'Anime',
        items: [
          { text: 'Disc Ripping', link: '/guides/anime/discrip' },
          { text: 'Network Streaming', link: '/guides/anime/ns' }
        ]
      },
      {
        text: 'Manga',
        items: [
          { text: 'Cubari guide', link: '/guides/manga/cubari' },
          { text: 'Digital Comic Info', link: '/guides/manga/comicinfo' },
          { text: 'Downloading Manga', link: '/guides/manga/mdl' },
          { text: 'JXL Manga Readers', link: '/guides/manga/jxl' },
          { text: 'Madokami', link: '/guides/manga/madokami' },
          { text: 'Manga Image Editing', link: '/guides/manga/imagedit' },
          { text: 'OPDS to E-reader', link: '/guides/manga/opds' }
        ]
      },
      {
        text: 'Extension Repos',
        items: [
          { text: 'Mihon & Aniyomi', link: '/guides/ext/mihon' },
          { text: 'Mangayomi', link: '/guides/ext/mangayomi' },
          { text: 'Other Android Apps', link: '/guides/ext/misc' },
          { text: 'iOS apps', link: '/guides/ext/ios' }
        ]
      },
      {
        text: 'Music',
        items: [
          { text: 'Echo', link: '/guides/music/echo' },
          { text: 'FB2K Synced Lyrics', link: '/guides/music/fb2klyrics' },
          { text: 'Squidify', link: '/guides/music/squidify' },
          { text: 'Transcoding Audio', link: '/guides/music/transcoding' }
        ]
      },
      {
        text: 'Technical',
        items: [
          { text: 'Blocking Ads', link: '/guides/tech/adblock' },
          { text: 'IRC & XDCC', link: '/guides/tech/irc' },
          { text: 'JDL2 Ad-removal', link: '/guides/tech/jdl' }
        ]
      }
    ]
  },
  {
    text: 'Preferences',
    items: [
      {
        component: 'PreferenceRadio',
        props: {
          text: 'Floating Takodachi',
          group: 'takodachi',
          options: ['Enable', 'Disable'],
          defaultOption: 'Disable'
        }
      }
    ]
  }
]

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: '<span class="i-lucide:zap"></span> Quick Start',
    link: '/qs'
  },
  {
    text: '<span class="i-lucide:message-circle-question"></span> FAQs',
    link: '/faq'
  },
  {
    text: '<span class="i-lucide:earth"></span> Websites',
    link: '/websites'
  },
  {
    text: '<span class="i-lucide:box"></span> Software',
    link: '/software'
  },
  {
    text: '<span class="i-lucide:folder-open"></span> Misc-sites',
    link: '/misc'
  },
  {
    text: '<span class="i-lucide:wrench"></span> Tools',
    link: '/tools'
  },
  {
    text: '<span class="i-lucide:brush"></span> Art',
    link: '/art'
  },
  {
    text: '<span class="i-lucide:music"></span> Music',
    link: '/music'
  },
  {
    text: '<span class="i-lucide:gamepad-2"></span> Games',
    link: '/games'
  },
  {
    text: '<span class="i-lucide:map"></span> Non-English',
    link: '/nonen'
  },
  {
    text: '<span class="i-lucide:ban"></span> NSFW',
    link: '/nsfw'
  },
  {
    text: '<span class="i-lucide:package-2"></span> Merch',
    link: '/merch'
  },
  {
    text: '<span class="i-lucide:scroll-text"></span> Scanlation',
    link: '/scanlation'
  },
  {
    text: '<span class="i-twemoji-comet"></span> VTuber',
    link: '/vtuber'
  },
  {
    text: '<span class="i-uil:letter-japanese-a"></span> Japan',
    collapsed: true,
    items: [
      { text: 'Language', link: '/japan/language' },
      { text: 'Immersion', link: '/japan/immersion' },
      { text: 'Software', link: '/japan/software' },
      { text: 'Culture', link: '/japan/culture' }
    ]
  },
  {
    text: '<span class="i-lucide:book-open"></span> Glossary',
    collapsed: true,
    items: [
      { text: 'General', link: '/glossary/general' },
      { text: 'Anime', link: '/glossary/anime' },
      { text: 'Manga', link: '/glossary/manga' },
      { text: 'Audio', link: '/glossary/audio' },
      { text: 'NSFW', link: '/glossary/nsfw' }
    ]
  },
  {
    text: '<span class="i-lucide:magnet"></span> Torrenting',
    collapsed: true,
    items: [
      { text: 'Getting Started', link: '/torrenting/start' },
      { text: 'FAQs', link: '/torrenting/faq' },
      { text: 'Glossary', link: '/torrenting/glossary' },
      { text: 'qBittorrent', link: '/torrenting/qbit' },
      { text: `Trackers`, link: '/torrenting/trackers' }
    ]
  },
  {
    text: '<span class="i-lucide:book-key"></span> Guides',
    collapsed: true,
    items: [
      {
        text: 'Anime',
        collapsed: true,
        items: [
          { text: 'Disc Ripping', link: '/guides/anime/discrip' },
          { text: 'Network Streaming', link: '/guides/anime/ns' }
        ]
      },
      {
        text: 'Manga',
        collapsed: true,
        items: [
          { text: 'Cubari guide', link: '/guides/manga/cubari' },
          { text: 'Digital Comic Info', link: '/guides/manga/comicinfo' },
          { text: 'Downloading Manga', link: '/guides/manga/mdl' },
          { text: 'JXL Manga Readers', link: '/guides/manga/jxl' },
          { text: 'Madokami', link: '/guides/manga/madokami' },
          { text: 'Manga Image Editing', link: '/guides/manga/imagedit' },
          { text: 'OPDS to E-reader', link: '/guides/manga/opds' }
        ]
      },
      {
        text: 'Extension Repos',
        collapsed: true,
        items: [
          { text: 'Mihon & Aniyomi', link: '/guides/ext/mihon' },
          { text: 'Mangayomi', link: '/guides/ext/mangayomi' },
          { text: 'Other Android Apps', link: '/guides/ext/misc' },
          { text: 'iOS apps', link: '/guides/ext/ios' }
        ]
      },
      {
        text: 'Music',
        collapsed: true,
        items: [
          { text: 'Echo', link: '/guides/music/echo' },
          { text: 'FB2K Synced Lyrics', link: '/guides/music/fb2klyrics' },
          { text: 'Squidify', link: '/guides/music/squidify' },
          { text: 'Transcoding Audio', link: '/guides/music/transcoding' }
        ]
      },
      {
        text: 'Technical',
        collapsed: true,
        items: [
          { text: 'Blocking Ads', link: '/guides/tech/adblock' },
          { text: 'IRC & XDCC', link: '/guides/tech/irc' },
          { text: 'JDL2 Ad-removal', link: '/guides/tech/jdl' }
        ]
      }
    ]
  },
  {
    text: '<span class="i-lucide:messages-square"></span> Communities',
    link: '/comms'
  },
  {
    text: '<span class="i-lucide:heart-handshake"></span> Credits',
    link: '/credits'
  },
  {
    text: '<span class="i-lucide:goal"></span> Getting Started',
    link: '/start'
  }
]

export const siteConfig = {
  title: 'Wotaku',
  description:
    'Wotaku, the one-stop-shop for all your otaku interests. Here you can find websites for Anime, Manga, Light Novels, Music, Soundtracks, Games and Hentai. Our japanese learning section has books and videos about language, history and culture.',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  appearance: true,
  titleTemplate: ':title • Wotaku.wiki by Duck',
  head: [
    ['meta', { name: 'theme-color', content: '#56b4fc' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['link', { rel: 'icon', href: '/asset/fav.png' }],
    // PWA
    ['link', { rel: 'icon', href: '/asset/fav.png', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/asset/fav.png' }],
    ['link', { rel: 'mask-icon', href: '/asset/fav.png', color: '#56b4fc' }],
    // prettier-ignore
    [
			"meta",
			{
				name: "keywords",
				content:
					"Anime, Anime Piracy, Manga, Manga Piracy, VTuber, Hentai, JPOP, Music, Japan, Learning Japanese, Weeb, Otaku",
			},
		],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/asset/fav.png',
        sizes: '192x192'
      }
    ]
  ],
  srcExclude: ['README.md', 'sandbox/**/*.md'],
  sitemap: {
    hostname: hostname
  }
}

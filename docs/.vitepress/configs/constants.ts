/**
 *  All Rights Reserved
 *
 *  Copyright (c) 2025 taskylizard
 *
 *  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */
import type { DefaultTheme } from 'vitepress'

export interface HomeCard {
  id: string
  icon: string
  title: string
  details: string
  link: string
  featured?: boolean
  section?: string
}

// @unocss-include
export const homeCards: HomeCard[] = [
  {
    id: 'websites',
    icon: ':lucide-earth:',
    title: 'Websites',
    details: 'Websites for anime, manga, novels & tokusatsu',
    link: '/websites',
    featured: true
  },
  {
    id: 'software',
    icon: ':lucide-box:',
    title: 'Software',
    details: 'Software for every Operating System',
    link: '/software',
    featured: true
  },
  {
    id: 'misc',
    icon: ':lucide-folder-open:',
    title: 'Misc-sites',
    details: 'Various sites for database, info, tracking news & tools',
    link: '/misc',
    featured: true
  },
  {
    id: 'tools',
    icon: ':lucide-wrench:',
    title: 'Tools',
    details: 'Software to make life easier',
    link: '/tools'
  },
  {
    id: 'art',
    icon: ':lucide-brush:',
    title: 'Art',
    details: 'Everything Art',
    link: '/art'
  },
  {
    id: 'music',
    icon: ':lucide-music:',
    title: 'Music',
    details: 'Wotaku Music Megathread!',
    link: '/music'
  },
  {
    id: 'games',
    icon: ':lucide-gamepad-2:',
    title: 'Games',
    details: 'Wotaku Games Megathread!',
    link: '/games'
  },
  {
    id: 'nonen',
    icon: ':lucide-map:',
    title: 'Non-English',
    details: 'Otaku resources for other regions',
    link: '/nonen'
  },
  {
    id: 'nsfw',
    icon: ':lucide-ban:',
    title: 'NSFW',
    details: 'hen...',
    link: '/nsfw',
    featured: true
  },
  {
    id: 'merch',
    icon: ':lucide-package-2:',
    title: 'Merch',
    details: 'Everything merch related!',
    link: '/merch'
  },
  {
    id: 'vtuber',
    icon: ':comet:',
    title: 'VTuber',
    details: 'Sui-chan wa~',
    link: '/vtuber'
  },
  {
    id: 'ext',
    icon: ':lucide-puzzle:',
    title: 'Extensions',
    details: 'Extensions for everything',
    link: '/ext',
    featured: true
  },
  {
    id: 'guides',
    icon: ':lucide-book-key:',
    title: 'Guides',
    details: 'Various technical guides and tutorials',
    link: '/guides',
    featured: true
  },
  {
    id: 'glossary',
    icon: ':lucide-book-open:',
    title: 'Glossary',
    details: 'Learn the most frequently used otaku terms',
    link: '/glossary',
    featured: true
  },
  {
    id: 'torrenting',
    icon: ':lucide-magnet:',
    title: 'Torrenting',
    details: 'All the basic how-tos about torrenting',
    link: '/torrenting',
    featured: true
  },
  {
    id: 'japan',
    icon: ':uil-letter-japanese-a:',
    title: 'Japan',
    details: 'Everything Japan on one page!',
    link: '/japan'
  },
  {
    id: 'faq',
    icon: ':lucide-message-circle-question-mark:',
    title: 'FAQs',
    details: 'Frequently asked questions about manga and anime',
    link: '/faq'
  },
  {
    id: 'comms',
    icon: ':lucide-messages-square:',
    title: 'Communities',
    details: 'More great otaku communities!',
    link: '/comms'
  },
  {
    id: 'credits',
    icon: ':lucide-heart-handshake:',
    title: 'Credits',
    details: 'All the contributors of Wotaku',
    link: '/credits'
  },
  {
    id: 'ext-mihon',
    icon: ':lucide-puzzle:',
    title: 'Mihon & Aniyomi',
    details: 'Mihon & Aniyomi-based extension repos',
    link: '/ext/mihon',
    section: 'Extensions'
  },
  {
    id: 'ext-mangayomi',
    icon: ':lucide-puzzle:',
    title: 'Mangayomi',
    details: 'Mangayomi-based extension repos',
    link: '/ext/mangayomi',
    section: 'Extensions'
  },
  {
    id: 'ext-ios',
    icon: ':lucide-puzzle:',
    title: 'iOS Extensions',
    details: 'iOS anime and manga repos',
    link: '/ext/ios',
    section: 'Extensions'
  },
  {
    id: 'ext-misc',
    icon: ':lucide-puzzle:',
    title: 'Misc Extensions',
    details: 'Extension repos for other apps',
    link: '/ext/misc',
    section: 'Extensions'
  },
  {
    id: 'glossary-general',
    icon: ':lucide-book-open:',
    title: 'General Glossary',
    details: 'Basic otaku-related terms',
    link: '/glossary/general',
    section: 'Glossary'
  },
  {
    id: 'glossary-anime',
    icon: ':lucide-book-open:',
    title: 'Anime Glossary',
    details: 'Season, release and production terms',
    link: '/glossary/anime',
    section: 'Glossary'
  },
  {
    id: 'glossary-manga',
    icon: ':lucide-book-open:',
    title: 'Manga Glossary',
    details: 'Panel, release and scanlation terms',
    link: '/glossary/manga',
    section: 'Glossary'
  },
  {
    id: 'glossary-audio',
    icon: ':lucide-book-open:',
    title: 'Audio Glossary',
    details: 'Audio files, software and hardware terms',
    link: '/glossary/audio',
    section: 'Glossary'
  },
  {
    id: 'glossary-nsfw',
    icon: ':lucide-book-open:',
    title: 'NSFW Glossary',
    details: 'Things Jesus wouldn\'t want you to know',
    link: '/glossary/nsfw',
    section: 'Glossary'
  },
  {
    id: 'guides-discrip',
    icon: ':lucide-book-key:',
    title: 'Disc Ripping',
    details: 'Guide on how to rip Discs and conversions to MKV and ISO formats',
    link: '/guides/anime/discrip',
    section: 'Guides'
  },
  {
    id: 'guides-cubari',
    icon: ':lucide-book-key:',
    title: 'Cubari Guide',
    details: 'How to proxy comics through Cubari.moe',
    link: '/guides/manga/cubari',
    section: 'Guides'
  },
  {
    id: 'guides-comicinfo',
    icon: ':lucide-book-key:',
    title: 'Digital Comic Info',
    details: 'Information about digital comic publishers & resolutions',
    link: '/guides/manga/comicinfo',
    section: 'Guides'
  },
  {
    id: 'guides-mdl',
    icon: ':lucide-book-key:',
    title: 'Downloading Manga',
    details: 'How to download manga on PC',
    link: '/guides/manga/mdl',
    section: 'Guides'
  },
  {
    id: 'guides-jxl',
    icon: ':lucide-book-key:',
    title: 'JXL Manga Readers',
    details: 'Manga readers with JPEG XL / JXL support for Android, iOS & PC',
    link: '/guides/manga/jxl',
    section: 'Guides'
  },
  {
    id: 'guides-madokami',
    icon: ':lucide-book-key:',
    title: 'Madokami Guide',
    details: 'The joining and downloading guide for Madokami',
    link: '/guides/manga/madokami',
    section: 'Guides'
  },
  {
    id: 'guides-imagedit',
    icon: ':lucide-book-key:',
    title: 'Manga Image Editing',
    details: 'ImageMagick guide for grayscaling, leveling, and optimizing',
    link: '/guides/manga/imagedit',
    section: 'Guides'
  },
  {
    id: 'guides-opds',
    icon: ':lucide-book-key:',
    title: 'OPDS E-reader',
    details: 'How to self-host your library to your Kindle',
    link: '/guides/manga/opds',
    section: 'Guides'
  },
  {
    id: 'guides-transcoding',
    icon: ':lucide-book-key:',
    title: 'Transcoding Audio',
    details: 'Basic guide for transcoding audio files',
    link: '/guides/music/transcoding',
    section: 'Guides'
  },
  {
    id: 'guides-adblock',
    icon: ':lucide-book-key:',
    title: 'Adblocking & Privacy',
    details: 'Adblocking solutions for every device & VPN listing',
    link: '/guides/tech/adblock',
    section: 'Guides'
  },
  {
    id: 'guides-jdl',
    icon: ':lucide-book-key:',
    title: 'JDL2 Ad-Removal',
    details: 'Remove banner & pop-up ads from JDownloader2',
    link: '/guides/tech/jdl',
    section: 'Guides'
  },
  {
    id: 'torrenting-start',
    icon: ':lucide-magnet:',
    title: 'Getting Started',
    details: 'Basic how-to torrent guide to get you started',
    link: '/torrenting/start',
    section: 'Torrenting'
  },
  {
    id: 'torrenting-faq',
    icon: ':lucide-magnet:',
    title: 'Torrenting FAQs',
    details: 'Common questions about torrenting',
    link: '/torrenting/faq',
    section: 'Torrenting'
  },
  {
    id: 'torrenting-glossary',
    icon: ':lucide-magnet:',
    title: 'Torrent Glossary',
    details: 'All the basic torrent related terms',
    link: '/torrenting/glossary',
    section: 'Torrenting'
  },
  {
    id: 'torrenting-nyaa',
    icon: ':lucide-magnet:',
    title: 'Nyaa',
    details: 'A tutorial for navigating nyaa',
    link: '/torrenting/nyaa',
    section: 'Torrenting'
  },
  {
    id: 'torrenting-qbit',
    icon: ':lucide-magnet:',
    title: 'qBittorrent',
    details: 'Various how-tos for qBittorrent',
    link: '/torrenting/qbit',
    section: 'Torrenting'
  },
  {
    id: 'torrenting-trackers',
    icon: ':lucide-magnet:',
    title: 'Trackers',
    details: 'List of public and private trackers',
    link: '/torrenting/trackers',
    section: 'Torrenting'
  },
  {
    id: 'japan-language',
    icon: ':uil-letter-japanese-a:',
    title: 'Learning Japanese',
    details: 'Japanese language learning resources',
    link: '/japan/language',
    section: 'Japan'
  },
  {
    id: 'japan-immersion',
    icon: ':uil-letter-japanese-a:',
    title: 'Immersion',
    details: 'Media to help you learn Japanese',
    link: '/japan/immersion',
    section: 'Japan'
  },
  {
    id: 'japan-software',
    icon: ':uil-letter-japanese-a:',
    title: 'Japan Software',
    details: 'Software to help you learn Japanese',
    link: '/japan/software',
    section: 'Japan'
  },
  {
    id: 'japan-culture',
    icon: ':uil-letter-japanese-a:',
    title: 'Culture',
    details: 'Learn all about Japanese culture, history & customs',
    link: '/japan/culture',
    section: 'Japan'
  }
]

export const hostname: string = 'https://wotaku.wiki'
export const excludedFiles = ['t.md', 'sandbox.md']

// @unocss-include
export const nav: DefaultTheme.NavItem[] = []

export const sidebar: DefaultTheme.Sidebar = [
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
    text: '<span class="i-twemoji-comet"></span> VTuber',
    link: '/vtuber'
  },
    {
    text:
      '<span class="mr-2 w-4 h-4 bg-cover i-lucide:puzzle"></span> Extensions',
    collapsed: true,
    link: '/ext',
    items: [
        { text: 'Mihon & Aniyomi', link: '/ext/mihon' },
          { text: 'Mangayomi', link: '/ext/mangayomi' },
          { text: 'iOS apps', link: '/ext/ios' },
          { text: 'Miscellaneous', link: '/ext/misc' }
    ]
  },
  {
    text:
      '<span class="mr-2 w-4 h-4 bg-cover i-lucide:book-key"></span> Guides',
    collapsed: true,
    link: '/guides',
    items: [
      {
        text: 'Anime',
        collapsed: true,
        items: [
          { text: 'Disc Ripping', link: '/guides/anime/discrip' },
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
        text: 'Music',
        collapsed: true,
        items: [
          { text: 'Transcoding Audio', link: '/guides/music/transcoding' }
        ]
      },
      {
        text: 'Technical',
        collapsed: true,
        items: [
          { text: 'Blocking Ads', link: '/guides/tech/adblock' },
          { text: 'JDL2 Ad-removal', link: '/guides/tech/jdl' }
        ]
      }
    ]
  },
  {
    text:
      '<span class="mr-2 w-4 h-4 bg-cover i-lucide:book-open"></span> Glossary',
    collapsed: true,
    link: '/glossary',
    items: [
      { text: 'General', link: '/glossary/general' },
      { text: 'Anime', link: '/glossary/anime' },
      { text: 'Manga', link: '/glossary/manga' },
      { text: 'Audio', link: '/glossary/audio' },
      { text: 'NSFW', link: '/glossary/nsfw' }
    ]
  },
  {
    text:
      '<span class="mr-2 w-4 h-4 bg-cover i-lucide:magnet"></span> Torrenting',
    collapsed: true,
    link: '/torrenting',
    items: [
      { text: 'Getting Started', link: '/torrenting/start' },
      { text: 'FAQs', link: '/torrenting/faq' },
      { text: 'Glossary', link: '/torrenting/glossary' },
      { text: 'Nyaa', link: '/torrenting/nyaa' },
      { text: 'qBittorrent', link: '/torrenting/qbit' },
      { text: `Trackers`, link: '/torrenting/trackers' }
    ]
  },
    {
    text:
      '<span class="mr-2 w-4 h-4 bg-cover i-uil:letter-japanese-a"></span> Japan',
    collapsed: true,
    link: '/japan',
    items: [
      { text: 'Language', link: '/japan/language' },
      { text: 'Immersion', link: '/japan/immersion' },
      { text: 'Software', link: '/japan/software' },
      { text: 'Culture', link: '/japan/culture' }
    ]
  },
  {
    text: '<span class="i-lucide:message-circle-question"></span> FAQs',
    link: '/faq'
  },
  {
    text: '<span class="i-lucide:messages-square"></span> Communities',
    link: '/comms'
  },
  {
    text: '<span class="i-lucide:heart-handshake"></span> Credits',
    link: '/credits'
  }
]

export const siteConfig = {
  title: 'Wotaku',
  description:
    'Wotaku, your hub for all otaku interests. We list websites for Anime, Manga, Light Novels, Music, Games and Hentai, also Aniyomi and Mihon extensions.',
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
    ['link', { rel: 'icon', href: '/asset/fav.svg' }],
    // PWA
    ['link', { rel: 'icon', href: '/asset/fav.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/asset/fav.svg' }],
    ['link', { rel: 'mask-icon', href: '/asset/fav.svg', color: '#56b4fc' }],
    // prettier-ignore
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Anime, Anime Piracy, Manga, Manga Piracy, VTuber, Hentai, JPOP, Music, Japan, Learning Japanese, Weeb, Otaku'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/asset/fav.svg',
        sizes: '192x192'
      }
    ]
  ],
  srcExclude: ['README.md', 'sandbox/**/*.md'],
  sitemap: {
    hostname: hostname
  }
}

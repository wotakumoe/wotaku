import type { DefaultTheme, UserConfig } from 'vitepress'
import { generateImages, generateMeta } from '../hooks'
import { headersPlugin } from '../markdown/headers'
import { figure } from '@mdit/plugin-figure'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { align } from '@mdit/plugin-align'
import { imgSize } from '@mdit/plugin-img-size'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { emojiRender, defs, movePlugin } from './emoji'
import { x } from 'tinyexec'
import {
  PageProperties,
  PagePropertiesMarkdownSection
} from '@nolebase/vitepress-plugin-page-properties/vite'
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'

export const hostname: string = 'https://wotaku.wiki'
export const excludedFiles = ['t.md']
const GIT_COMMIT =
  /** Github actions commit hash */
  process.env.GITHUB_SHA ??
  /** Commit hash from git */
  (await x('git', ['rev-parse', 'HEAD']).then((result) =>
    result.stdout.trim()
  )) ??
  'dev'

// @unocss-include
const nav: DefaultTheme.NavItem[] = [
  {
    text: 'Pages',
    items: [
      { text: 'Quick Start', link: '/qs' },
      { text: 'FAQs', link: '/faq' },
      { text: 'Websites', link: '/websites' },
      { text: 'Software', link: '/software' },
      { text: 'Misc-sites', link: '/misc' },
      { text: 'Tools', link: '/tools' },
      { text: 'Music', link: '/music' },
      { text: 'Games', link: '/games' },
      { text: 'Non-English', link: '/nonen' },
      { text: 'NSFW', link: '/nsfw' },
      { text: 'Merch', link: '/merch' },
      { text: 'Scanlation', link: '/scanlation' },
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
    // @ts-expect-error
    collapsed: true,
    items: [
      { text: 'Getting Started', link: '/torrenting/start' },
      { text: 'FAQs', link: '/torrenting/faq' },
      { text: 'Glossary', link: '/torrenting/glossary' },
      { text: 'qBittorrent', link: '/torrenting/qbit' }
    ]
  },
  {
    text: 'Guides',
    // @ts-expect-error
    collapsed: true,
    items: [
      {
        text: 'Anime',
        items: [
          { text: 'Disc Ripping', link: '/guides/anime/discrip' },
          { text: 'Fate / Type-Moon', link: '/guides/anime/fate' },
          { text: 'Network Streaming', link: '/guides/anime/ns' }
        ]
      },
      {
        text: 'Manga',
        items: [
          { text: 'Digital Manga Info', link: '/guides/manga/digim' },
          { text: 'Madokami', link: '/guides/manga/madokami' },
          { text: 'Manga Image Editing', link: '/guides/manga/imagedit' }
        ]
      },
      {
        text: 'Music',
        items: [
          { text: 'FB2K Synced Lyrics', link: '/guides/music/fb2klyrics' },
          { text: 'Squidify', link: '/guides/music/squidify' },
          { text: 'Transcoding Audio', link: '/guides/music/transcoding' }
        ]
      },
      {
        text: 'Technical',
        items: [
          { text: 'Blocking Ads', link: '/guides/tech/adblock' },
          { text: 'Extension Repos', link: '/guides/tech/repo' },
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

const sidebar: DefaultTheme.Sidebar = [
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
      { text: 'qBittorrent', link: '/torrenting/qbit' }
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
          { text: 'Fate / Type-Moon', link: '/guides/anime/fate' },
          { text: 'Network Streaming', link: '/guides/anime/ns' }
        ]
      },
      {
        text: 'Manga',
        collapsed: true,
        items: [
          { text: 'Digital Manga Info', link: '/guides/manga/digim' },
          { text: 'Madokami', link: '/guides/manga/madokami' },
          { text: 'Manga Image Editing', link: '/guides/manga/imagedit' }
        ]
      },
      {
        text: 'Music',
        collapsed: true,
        items: [
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
          { text: 'Extension Repos', link: '/guides/tech/repo' },
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
  }
]

export const shared: UserConfig<DefaultTheme.Config> = {
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
    ['link', { rel: 'icon', href: '/asset/inaread.png' }],
    // PWA
    [
      'link',
      { rel: 'icon', href: '/asset/inaread.png', type: 'image/svg+xml' }
    ],
    ['link', { rel: 'alternate icon', href: '/asset/inaread.png' }],
    [
      'link',
      { rel: 'mask-icon', href: '/asset/inaread.png', color: '#56b4fc' }
    ],
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
        href: '/asset/inaread.png',
        sizes: '192x192'
      }
    ],
    [
      'script',
      { id: 'restore-banner-preference' },
      `
(() => {
  const restore = (key, cls, def = false) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      document.documentElement.classList.add(cls);
    }
  };
  restore('ackDomainChange', 'banner-dismissed');
})();`
    ]
  ],
  srcExclude: ['README.md', 'sandbox/**/*.md'],
  sitemap: {
    hostname: hostname
  },
  transformHead: async (context) => generateMeta(context, hostname),
  buildEnd: async (context) => {
    generateImages(context)
  },
  markdown: {
    emoji: { defs },
    config(md) {
      md.use(emojiRender)
      // @ts-expect-error
      md.use(imgLazyload)
      // @ts-expect-error
      md.use(align)
      // @ts-expect-error
      md.use(figure)
      // @ts-expect-error
      md.use(tabsMarkdownPlugin)
      // @ts-expect-error
      md.use(imgSize)
      md.use(headersPlugin)
    }
  },
  themeConfig: {
    search: {
      options: {
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            // @ts-ignore
            boostDocument: (
              _,
              term,
              storedFields: Record<string, string | string[]>
            ) => {
              const titles = (storedFields?.titles as string[])
                .filter((t) => Boolean(t))
                .map((t) => t.toLowerCase())
              // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
              const titleIndex =
                titles
                  .map((t, i) => (t?.includes(term) ? i : -1))
                  .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex

              return 1
            }
          }
        },
        detailedView: true
      },
      provider: 'local'
    },
    logo: { src: '/asset/inaread.png' },
    sidebar,
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wotakumoe/Wotaku' },
      { icon: 'discord', link: 'https://discord.gg/vShRGx8ZBC' },
      {
        ariaLabel: 'Bluesky',
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Bluesky</title><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>'
        },
        link: 'https://bsky.app/profile/wotaku.wiki'
      }
    ],
    footer: {
      message: `Made with love by <a href="https://github.com/wotakumoe">wotaku</a>. <a href="https://github.com/wotakumoe/Wotaku/commit/${GIT_COMMIT}">Commit: ${GIT_COMMIT.slice(0, 7)}</a>`
    }
  },
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-git-changelog/client',
        '@nolebase/vitepress-plugin-page-properties/client'
      ]
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-page-properties',
        '@nolebase/vitepress-plugin-git-changelog',
        '@nolebase/ui',
        '@fmhy/components'
      ]
    },
    plugins: [
      PageProperties(),
      PagePropertiesMarkdownSection(),
      GitChangelog({
        maxGitLogCount: 20,
        repoURL: 'https://github.com/wotakumoe/Wotaku'
      }),
      GitChangelogMarkdownSection({ sections: { disableContributors: true } }),
      UnoCSS({
        configFile: '../unocss.config.ts'
      }),
      {
        name: 'custom:adjust-order',
        configResolved(c) {
          movePlugin(
            c.plugins as any,
            'vitepress',
            'before',
            'unocss:transformers:pre'
          )
        }
      }
    ],
    resolve: {
      alias: [
        {
          find: /^.*\/VPBadge\.vue$/,
          replacement: fileURLToPath(
            new URL('../theme/components/Badge.vue', import.meta.url)
          )
        },
        {
          find: /^.*VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL(
              '../theme/components/VPSwitchAppearance.vue',
              import.meta.url
            )
          )
        }
      ]
    }
  }
}

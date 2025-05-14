import MdMTables from 'markdown-it-multimd-table'
// @ts-expect-error
import MdReg from 'markdown-it-regexp'
import type { MarkdownRenderer } from 'vitepress'
import { headersPlugin } from '../markdown/headers'
import { figure } from '@mdit/plugin-figure'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { align } from '@mdit/plugin-align'
import { imgSize } from '@mdit/plugin-img-size'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { emojiRender } from './emoji'

const tooltips: {
  [key: string]: {
    title?: string
    icon?: string
    content: string
  }
} = {
  miruro: {
    content: `  
  - Nice and minimal UI.  
  - Scrapes HiAnime (Zoro & Bun), AnimeKai (Arc & Gut) Animepahe (Kiwi), Gogo (Gogo & Vid), AnimeZ (Jet).  
  - Has built-in AniList support.`
  },
  AnimeStream: {
    content: `  
  - Scrapes from Crunchyroll.  
  - UI is really basic.  
  - Browser has to support DRM.`
  },
  AnimeNexus: {
    content: `  
  - Generally good video quality.  
  - Has multi-language softsub.  
  - Library size isn't that big. Good for recent airing shows.  
  - ⚠️ Has optimization issues on lower-end phones, may work better on different browsers. Doesn't support Safari / WebKit.`
  },
  KAA: {
    content: `  
  - KAA encodes are on Videstreaming and Catstream. Birdstream scrapes Bilibili.  
  - Good for airing anime.  
  - Has good amount of missing old titles, but you can request them in their support server.`
  },
  AnimeKai: {
    content: `  
  - Huge library.    
  - Re-encodes shows for smaller size.  
  - Mix of Web and Blu-ray releases.  
  - Anilist scraper is buggy. Adds PV, Specials & Extra entries even though it doesn't have the uploads.`
  },
  Zoro: {
    content: `  
  - Huge library.  
  - Has multi-language softsub.  
  - Re-encodes shows for smaller size.`
  },
  Hikari: {
    content: `  
  - Good for new airing.  
  - Uploads from good sources but re-encoded smaller file size.  
  - Large library size.`
  },
  Sudatchi: {
    content: `  
  - Smaller library size. Good for new airing.  
  - Re-encoded to smaller filesize.  
  - Uses IPFS  
  - Only 1080p atm for most.`
  },
  AniZone: {
    content: `  
  - Re-encoded to smaller file size.  
  - Very small library size.  
  - Good for airing shows.`
  },
  Animepahe: {
    content: `  
  - Uploads mini encoded files, best if you want smaller files or have low bandwidth.  
  - Has a good amount of missing titles.  
  - Some titles don't get regular update.`
  },
  AllManga: {
    content: `  
  - UI is really cluttered.  
  - Video quality fluctuates quite a bit.  
  - Players are a mix of self-hosted and scrapers.  
  - Luf-mp4 and Vid-mp4 are gogo scrapers.  
  - OK and AK have multiple resolutions.  
  - SW player is 720p only.`
  },
  Animotvslash: {
    content: `  
  - Small library size.`
  },
  WCO: {
    content: `  
  - Has both anime and cartoons.  
  - Library size is pretty good including old stuff.  
  - Uploads are compressed to mini-encode and low res.  
  - Movie uploads are paywalled. You can bypass some using wco.tv.`
  },
  AnimeZ: {
    content: `  
  Good library size, most are scraped from Aniwave.`
  },
  OtakuStreamers: {
    content: `  
  Although new releases are in 1080p, older releases are a mixed bag, ranging from 480p to 720p.`
  },
  AniPlay: {
    content: `  
  Scrapes HiAnime (Yuki), AnimePahe (Pahe).`
  },
  Enimoe: {
    content: `  
  Scrapes HiAnime (Kaido), AnimeKai (Rose), AniZone (Zone), Anify (Violet), AnimeNoSub (Stack), FireAnime (Fire), Hikari (Cope), AnimeFox (Fox).`
  },
  Gojo: {
    content: `  
  Scrapes AnimeOwl (Strix), AnimePahe (Pahe), AnimeZ (Zaza).`
  },
  ComicK: {
    content: `  
  - Minimal compression  
  - Aggregates from various scanlation groups  
  - There's a 2/3 hour upload delay for most chapters sourced from scanlators' sites  
  - Has official translations  
  - Reader isn't as good as mangadex.`
  },
  MangaDex: {
    content: `  
  - Uploads without compression  
  - Best reader UI (for a web reader)  
  - Uploads from various scanlation groups  
  - No official translations, barring some exceptions.  
  - May remove content if there is a DMCA request by the publisher or doesn't allow upload at all (e.g. One Punch-Man).`
  },
  WeebCentral: {
    content: `  
  - Has official translations  
  - Compresses chapter images  
  - Chapter updates are relatively slow  
  - You can use AL sync with atsu.`
  },
  Batoto: {
    content: `  
  - Has both scanlated and official releases  
  - Has some exclusive uploads  
  - Decent filtering options with site theme options  
  - Indexing is poor.`
  },
  MangaFire: {
    content: `  
  - The UI is very clean with notification system  
  - Uploads both chapter (multi-lang) & volume releases  
  - Basic reader UI  
  - Watermark on almost every manga chapters  
  - Manga uploads are up to x1600.`
  },
  tron: {
    content:
      '[Comikey](https://comikey.com/), [J-Novel Club](https://j-novel.club/), [K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [Manga UP!](https://global.manga-up.com/), [Seven Seas](https://sevenseasentertainment.com/), [SQUARE ENIX](https://squareenixmangaandbooks.square-enix-games.com/en-us), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  anadius: { content: '[VIZ](https://www.viz.com/)' },
  Danke: {
    content:
      '[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  DMF: {
    content:
      '[J-Novel Club](https://j-novel.club/), [Kodansha](https://kodansha.us/), [ONE PEACE BOOKS](https://www.onepeacebooks.com/), [Seven Seas](https://sevenseasentertainment.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  Empy: {
    content:
      '[Glacier Bay Books](https://glacierbaybooks.com/), [MANGA Plus](https://mangaplus.shueisha.co.jp/)'
  },
  Lord_ne: {
    content:
      '[Crunchyroll](https://store.crunchyroll.com/collections/manga/), [Lezhin Comics](https://www.lezhinus.com/en), [Yen Press](https://yenpress.com/)'
  },
  LuCaZ: {
    content:
      '[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)'
  },
  Oakminati: {
    content:
      '[MANGA Plus](https://mangaplus.shueisha.co.jp/), [Manga UP!](https://global.manga-up.com/) (Main), [SQUARE ENIX](https://squareenixmangaandbooks.square-enix-games.com/en-us)'
  },
  Rillant: {
    content:
      '[K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [MANGA Plus](https://mangaplus.shueisha.co.jp/), [VIZ](https://www.viz.com/)'
  },
  Shellshock: {
    content:
      '[Kodansha](https://kodansha.us/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  Shizu: {
    content:
      '[Kodansha](https://kodansha.us/), [SuBLime](https://www.sublimemanga.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  Stick: {
    content:
      '[Cross Infinite World](https://www.crossinfworld.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)'
  },
  SWId: {
    content:
      '[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)'
  },
  TooManyIsekai: {
    content:
      '[J-Novel Club](https://j-novel.club/), [K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [Manga UP!](https://global.manga-up.com/), [ONE PEACE BOOKS](https://www.onepeacebooks.com/), [Seven Seas](https://sevenseasentertainment.com/)'
  },
  Trite: {
    content:
      'Cover-to-cover (c2c) scans of physical-only books by various publishers.'
  },
  Ushi: {
    content:
      '[Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)'
  },
  AGR: {
    content: 'Formerly Animated Glitched Scans and Animated Glitched Comics'
  },
  Scylla: { content: 'Formerly Scylla Scans' },
  Flame: { content: 'Formerly Flame Scans' },
  hive: { content: 'Formerly Infernal Void Scans, Void Scans and Hive toon' },
  realm: { content: 'Formerly Realm Scans, Rizz Comics and Realm Oasis' },
  utoon: { content: 'Formerly Manhwa Freak, freak scans, freak comics' },
  Shiru: { content: 'Hard fork of Miru' },
  Hakuneko: { content: 'For Linux, you have to use old one atm.' },
  HDoujinDownloader: { content: 'Has a limit of 25 chapters per day.' },
  CbxConverter: {
    content:
      'The version of Magick inside is really outdated. If you use it, download ImageMagick-[Latest_Version]-portable-Q8-x64.zip from the Imagemagick site, take the magick.exe from there and replace it in CbxConverter folder.'
  },
  BangumiList: {
    content: 'Maintained by chinese devs, but lists JP schedule too.'
  },
  ComicRanking500: {
    content:
      "The rankings here are based on POS (point-of-sale) data from various bookstore chains in Japan's offline market. Books that primarily sell online or are heavily focused on online stores may rank lower on this list."
  },
  JosuKe: {
    content:
      "The site doesn't get updated often, visit their twitter for more recent graphs."
  },
  vtstats: {
    content: "Doesn't get frequent updates, so there can be missing streamers."
  },
  Flud: { content: 'Has a VPN-only option.' },
  imgdanke: {
    content: "Optional for GUI, but doesn't support Pingo v1+ at the moment."
  },
  Misskey: { content: 'Registrations are currently limited to Japan only.' },
  Boorusphere: {
    content: 'Repo is archived, but still works as of October 25, 2024.'
  },
  VocaloidRadio: {
    content: 'Stream URL (192kbps): https://vocaloid.radioca.st/stream'
  },
  xManager: {
    content:
      "Due to Spotify changes, it doesn't work well in a lot of regions. Switch to echo."
  },
  Nicotine: {
    content: 'Direct peer-to-peer sharing network, primarily used for music.'
  },
  Koisuru: {
    content:
      'Subtitle files only, you need to get the episodes from another source.'
  },
  Spoilerplus: {
    content:
      "Image host is geo-restricted, so won't load pages in every region. Tested for the US."
  },
  Oppai: {
    content: 'Late releases, but less compressed than other aggregators.'
  },
  nHentai: { content: 'Most popular. Decent UI, but compresses images.' },
  Akuma: { content: 'E-Hentai clone.' },
  HDoujin: { content: 'Side project of Schale Network, similar to nHentai.' },
  Hitomi: { content: 'Big library, but difficult to navigate.' },
  IMHentai: { content: 'Big library and great search filters.' },
  PandaBackup: {
    content:
      'Archive of stuff removed from E-Hentai due to DMCA complaints. Has some obscure stuff deleted on most sites.'
  },
  SchaleNetwork: {
    content: 'Formerly Koharu, has Fakku/Irodori rips (official TLs).'
  },
  Yabai: { content: 'E-Hentai clone.' },
  HenTalkNexus: { content: 'Fakku/Irodori rips (official TLs).' },
  EHentai: {
    content:
      "The Mangadex of doujins, almost every doujin is first uploaded here before being scraped by other sites. The online viewer compresses the images, but has the option to download in original quality. [ExHentai](https://exhentai.org/) is its sister site, which also hosts the more extreme and questionable content. You'll need an account on E-Hentai to gain access."
  },
  Rule34xxx: {
    content: `  
  - Boasts a larger content library compared to Paheal.  
  - Features an extensive tagging system, allowing searches based on descriptions or depicted acts.  
  - Allows larger file uploads, up to 100MB.  
  - Searching is more user-friendly compared to Paheal.`
  },
  Rule34Paheal: {
    content:
      'Categorizes content by characters, franchises, events (such as holidays), animations, and sound, but limits uploads to 10MB.'
  },
  YACReader: {
    content: `  
  - Has all the standard features, keeps last read history.  
  - Doesn't have built-in library like MComix, only the history.  
  - The bundled YACLibrary is excellent.  
  - Has lots of customization.  
  - Can act as a local manga server, like Calibre.  
  - But the server client for [Android](https://play.google.com/store/apps/details?id=com.yacreader.yacreader&hl=en&gl=US) and [iOS](https://apps.apple.com/ca/app/yacreader-comic-reader/id635717885) is paid.`
  },
  CDisplayEx: {
    content: `  
  - Has a minimalist UI.  
  - Fast and simple reader with good amount of configuration.  
  - Has Nearest, Draft, linear and Lanczos (with various level) as scaling options.  
  - Not FOSS and not maintained since the development team has marked it as complete.  
  - No library view, only recent reads.`
  },
  OpenComic: {
    content: `  
  - Nice clean UI, has dark mode.  
  - Has all the standard functions, including recent history.  
  - Has long strip mode which is pretty smooth.  
  - Has AniList tracking and controller support.  
  - Supports Lanczos and other scaling methods.`
  },
  MComix: {
    content: `  
  - Minimal & responsive UI with good amount of customization.  
  - Has a nice library option and remembers last reading options.  
  - Has 3 scaling options: Normal, Bilinear (default) and Hyperbolic.`
  },
  SumatraPDF: {
    content: `  
  - Very simple program with all the standard features.  
  - Doesn't have a library, but keeps track of recently opened files.  
  - Includes vertical mode.  
  - Can open a variety of ebook formats (PDF, epub, mobi, cbz/cbr, DjVu, XPS, CHM).`
  },
  Yomikiru: {
    content:
      'Simple UI with all the basic settings. Has longstrip mode and AniList tracking.'
  },
  kohi: { content: 'For now, you need to manually install and update the APK(s) from the "apk" folder in the repository. The install and URL buttons are currently non-functional.' },
  ni3x: { content: 'Focuses on Torrents and Ero anime' },
  secozzi: { content: 'For Jellyfin and Stremio' },
  kei: { content: 'Maintained by former Tachiyomi contributors' },
  yuzono: { content: 'By Komikku dev. Mirrors Keiyoushi repo with a few extra extensions' },
  yuani: { content: 'By Anikku dev. Mirrors Kohi-den repo with a few extra extensions' },
  demo: { content: 'Demo tooltips for start page' },
  mirai: { content: 'Syncs the Mangayomi repository and includes their own plugins' },
  megarepo: { content: 'Adds all the repo present in /recloudstream/cs-repos' },
  dab: { content: 'Downloads from the Qobuz streaming platform, which only supports FLAC, not the other formats mentioned in the About page.' },
  echo: { content: 'Use "extension" as code to load all the extensions.' },
  cubari: { content: 'Scrapes MangaDex, WeebCentral, MangaKatana & scanlators.' },
  mguru: { content: 'Another instance of Cubari maintained by different people. Not much maintained. Scrapes MangaDex and Manga Katana' },
  akari: { content: 'Scrapes MangaKakalot.' },
  mhaven: { content: 'Scrapes MangaFire.' },
  komik: {content: 'Mostly up to the artist. Some of them are R2L too.'},
  atosho: {content: 'Offers both DDL hosts and Usenet as download options, but only keeps uploads up to 16GB. DDL files might be auto-deleted by the hosts due to inactivity, unlike Usenet files. You can try [magicNZB](https://magicnzb.com/) for free Usenet downloads, as it allows temp-mails and does not require a CC.'},
  linew: {content: 'In 2019, they rebranded LINE WEBTOON as WEBTOON. In some regions, it is still branded as LINE WEBTOON.'},
  amdl: {content: 'We have not tested their software, use the web downloader for your own security. Best for downloading separate songs instead of albums. For audio quality, use "Original Quality".'},
  webtooni: {content: 'Not uploading for a while.'},
  hef: {content: 'Does not have all the recent fan projects.'}
}

export function configureMarkdown(md: MarkdownRenderer) {
  md.use(emojiRender)
  md.use(imgLazyload)
  md.use(align)
  md.use(figure)
  md.use(tabsMarkdownPlugin)
  md.use(imgSize)
  md.use(headersPlugin)
  md.use(MdMTables, {
    multiline: true,
    rowspan: true,
    headerless: true,
    multibody: true,
    aotolabel: true
  })
  renderTooltip(md)
  renderInlineTooltip(md)
}

function renderInlineTooltip(md: MarkdownRenderer) {
  md.use(
    MdReg(
      /\^\[(.*?)\]\((.+?)\)/,
      ([, cont, hint]) =>
        '<VTooltip theme="hint">' +
        span(md.renderInline(cont)) +
        '<template v-slot:popper>' +
        md.renderInline(hint) +
        '</template></VTooltip>'
    )
  )
}

function renderTooltip(md: MarkdownRenderer) {
  md.use(
    MdReg(/==(.+?)==/, ([, cont]) => {
      const keys = Object.keys(tooltips)
      if (!keys.includes(cont)) return 'No tooltip found for ' + cont
      const item = tooltips[cont]

      const icon = item.icon ? `icon="${item.icon}"` : ''
      const title = item.title ? `title="${item.title}"` : ''
      const props = icon + title
      const renderedContent = md.render(item.content)

      return `<Tooltip ${props}>` + renderedContent + '</Tooltip>'
    })
  )
}

function span(
  content: string,
  attrs: Record<string, any> | undefined = undefined
) {
  let html = '<span'
  if (attrs)
    for (const [key, value] of Object.entries(attrs)) {
      html += ` ${key}="${value}"`
    }
  html += `>${content}</span>`
  return html
}

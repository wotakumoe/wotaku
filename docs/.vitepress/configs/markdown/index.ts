import MdMTables from "markdown-it-multimd-table";
// @ts-expect-error
import MdReg from "markdown-it-regexp";
import type { MarkdownRenderer } from "vitepress";
import { headersPlugin } from '../markdown/headers'
import { figure } from '@mdit/plugin-figure'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { align } from '@mdit/plugin-align'
import { imgSize } from '@mdit/plugin-img-size'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { emojiRender } from "./emoji";

const tooltips: {
  [key: string]: {
    title?: string
    icon?: string
    content: string
  }
} = {
miruro: { content: `  
  - Nice and minimal UI.  
  - Scrapes HiAnime (Zoro & Bun), AnimeKai (Arc & Gut) Animepahe (Kiwi), Gogo (Gogo & Vid), AnimeZ (Jet).  
  - Has built-in AniList support.` },
AnimeStream: { content: `  
  - Scrapes from Crunchyroll.  
  - UI is really basic.  
  - Browser has to support DRM.` },
AnimeNexus: { content: `  
  - Generally good video quality.  
  - Has multi-language softsub.  
  - Library size isn't that big. Good for recent airing shows.  
  - ⚠️ Has optimization issues on lower-end phones, may work better on different browsers. Doesn't support Safari / WebKit.` },
KAA: { content: `  
  - KAA encodes are on Videstreaming, Birdstream scrapes Bilibili.  
  - Pretty good for airing anime.  
  - Has good amount of missing old titles, but you can request them in their support server.` },  
AnimeKai: { content: `  
  - Huge library.  
  - Anime are hard-subbed.  
  - Re-encodes shows for smaller size.  
  - Mix of Web and Blu-ray releases.  
  - Anilist scraper is buggy. Adds PV, Specials & Extra entries even though it doesn't have the uploads.` },  
Zoro: { content: `  
  - Huge library.  
  - Has multi-language softsub.  
  - Re-encodes shows for smaller size.` },  
Hikari: { content: `  
  - Good for new airing.  
  - Uploads from good sources but re-encoded smaller file size.  
  - Large library size.` },  
Sudatchi: { content: `  
  - Smaller library size. Good for new airing.  
  - Re-encoded to smaller filesize.  
  - Uses IPFS  
  - Only 1080p atm for most.` },  
AniZone: { content: `  
  - Re-encoded to smaller file size.  
  - Very small library size.  
  - Good for airing shows.` },     
Animepahe: { content: `  
  - Uploads mini encoded files, best if you want smaller files or have low bandwidth.  
  - Has a good amount of missing titles.  
  - Some titles don't get regular update.` }, 
AllManga: { content: `  
  - UI is really cluttered.  
  - Video quality fluctuates quite a bit.  
  - Players are a mix of self-hosted and scrapers.  
  - Luf-mp4 and Vid-mp4 are gogo scrapers.  
  - OK and AK have multiple resolutions.  
  - SW player is 720p only.` },    
Animotvslash: { content: `  
  - Small library size.` },   
WCO: { content: `  
  - Has both anime and cartoons.  
  - Library size is pretty good including old stuff.  
  - Uploads are compressed to mini-encode and low res.  
  - Movie uploads are paywalled. You can bypass some using wco.tv.` },
AnimeZ: { content: `  
  Good library size, most are scraped from Aniwave.` },  
OtakuStreamers: { content: `  
  Although new releases are in 1080p, older releases are a mixed bag, ranging from 480p to 720p.` },  
AnimeRealms: { content: `  
  Scrapes HiAnime (Soft), AnimePahe (Pahe), AnimeHeaven (Heaven - 720p).` },  
AniPlay: { content: `  
  Scrapes HiAnime (Yuki), AnimePahe (Pahe).` },  
Enimoe: { content: `  
  Scrapes HiAnime (Kaido), AnimeKai (Rose), AniZone (Zone), Anify (Violet), AnimeNoSub (Stack), FireAnime (Fire), Hikari (Cope), AnimeFox (Fox).` },  
Gojo: { content: `  
  Scrapes HiAnime (Roro), AnimePahe (Pahe), AnimeZ (Zaza).` },  
ComicK: { content: `  
  - Minimal compression  
  - Aggregates from various scanlation groups  
  - There's a 2/3 hour upload delay for most chapters sourced from scanlators' sites  
  - Has official translations  
  - Reader isn't as good as mangadex.` },    
MangaDex: { content: `  
  - Uploads without compression  
  - Best reader UI (for a web reader)  
  - Uploads from various scanlation groups  
  - No official translations, barring some exceptions.  
  - May remove content if there is a DMCA request by the publisher or doesn't allow upload at all (e.g. One Punch-Man).` },    
WeebCentral: { content: `  
  - Has official translations  
  - Compresses chapter images  
  - Chapter updates are relatively slow  
  - You can use AL sync with atsu.` },   
Batoto: { content: `  
  - Has both scanlated and official releases  
  - Has some exclusive uploads  
  - Decent filtering options with site theme options  
  - Indexing is poor.` },    
MangaFire: { content: `  
  - The UI is very clean with notification system  
  - Uploads both chapter (multi-lang) & volume releases  
  - Basic reader UI  
  - Watermark on almost every manga chapters  
  - Manga uploads are up to x1600.` },  
tron: { content: "[Comikey](https://comikey.com/), [J-Novel Club](https://j-novel.club/), [K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [Manga UP!](https://global.manga-up.com/), [Seven Seas](https://sevenseasentertainment.com/), [SQUARE ENIX](https://squareenixmangaandbooks.square-enix-games.com/en-us), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },
anadius: { content: "[VIZ](https://www.viz.com/)" }, 
Danke: { content: "[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },  
DMF: { content: "[J-Novel Club](https://j-novel.club/), [Kodansha](https://kodansha.us/), [ONE PEACE BOOKS](https://www.onepeacebooks.com/), [Seven Seas](https://sevenseasentertainment.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },  
Empy: { content: "[Glacier Bay Books](https://glacierbaybooks.com/), [MANGA Plus](https://mangaplus.shueisha.co.jp/)" },  
Lord_ne: { content: "[Crunchyroll](https://store.crunchyroll.com/collections/manga/), [Lezhin Comics](https://www.lezhinus.com/en), [Yen Press](https://yenpress.com/)" },  
LuCaZ: { content: "[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)" },  
Oakminati: { content: "[MANGA Plus](https://mangaplus.shueisha.co.jp/), [Manga UP!](https://global.manga-up.com/) (Main), [SQUARE ENIX](https://squareenixmangaandbooks.square-enix-games.com/en-us)" },  
Rillant: { content: "[K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [MANGA Plus](https://mangaplus.shueisha.co.jp/), [VIZ](https://www.viz.com/)" },  
Shellshock: { content: "[Kodansha](https://kodansha.us/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },  
Shizu: { content: "[Kodansha](https://kodansha.us/), [SuBLime](https://www.sublimemanga.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },  
Stick: { content: "[Cross Infinite World](https://www.crossinfworld.com/), [VIZ](https://www.viz.com/), [Yen Press](https://yenpress.com/)" },  
SWId: { content: "[Kodansha](https://kodansha.us/), [Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)" },  
TooManyIsekai: { content: "[J-Novel Club](https://j-novel.club/), [K Manga](https://kmanga.kodansha.com/), [Kodansha](https://kodansha.us/), [Manga UP!](https://global.manga-up.com/), [ONE PEACE BOOKS](https://www.onepeacebooks.com/), [Seven Seas](https://sevenseasentertainment.com/)" },  
Trite: { content: "Cover-to-cover (c2c) scans of physical-only books by various publishers." },  
Ushi: { content: "[Seven Seas](https://sevenseasentertainment.com/), [Yen Press](https://yenpress.com/)" },
AGR: { content: "Formerly Animated Glitched Scans and Animated Glitched Comics" },
Scylla: { content: "Formerly Scylla Scans" },
Flame: { content: "Formerly Flame Scans" },
hive: { content: "Formerly Infernal Void Scans and Void Scans" },
realm: { content: "Formerly Realm Scans, Rizz Comics and Rizz Fables" },
utoon: { content: "Formerly Manhwa Freak, freak scans. freak comics" },

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
    aotolabel: true,
  });
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
        "<template v-slot:popper>" +
        md.renderInline(hint) +
        "</template></VTooltip>"
    )
  );
}


function renderTooltip(md: MarkdownRenderer) {
  md.use(
    MdReg(/==(.+?)==/,
      ([, cont,]) => {
        const keys = Object.keys(tooltips);
        if (!keys.includes(cont)) return 'No tooltip found for ' + cont;
        const item = tooltips[cont];

        const icon = item.icon ? `icon="${item.icon}"` : "";
        const title = item.title ? `title="${item.title}"` : ""
        const props = icon + title;
        const renderedContent = md.render(item.content)

        return `<Tooltip ${props}>` +
          renderedContent +
          "</Tooltip>"
      }
    )
  );

}

function span(
  content: string,
  attrs: Record<string, any> | undefined = undefined
) {
  let html = "<span";
  if (attrs)
    for (const [key, value] of Object.entries(attrs)) {
      html += ` ${key}="${value}"`;
    }
  html += `>${content}</span>`;
  return html;
}

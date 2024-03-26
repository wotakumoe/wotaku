import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { figure } from "@mdit/plugin-figure";
import { imgLazyload } from "@mdit/plugin-img-lazyload";
import { align } from "@mdit/plugin-align";
import { imgSize } from "@mdit/plugin-img-size";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import UnoCSS from "unocss/vite";
import { generateImages, generateMeta } from "./hooks";
import { emojiRender, defs, movePlugin, search, hostname, socials } from "./configs";

// @unocss-include

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Wotaku",
  description:
    "Wotaku, the one-stop-shop for all your otaku interests. Here you can find websites for Anime, Manga, Light Novels, Music, Soundtracks, Games and Hentai. Our japanese learning section has books and videos about language, history and culture.",
  lang: "en-US",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  appearance: "dark",
  titleTemplate: ":title • Wotaku.moe by Duck",
  head: [
    ["meta", { name: "theme-color", content: "#a594f9" }],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "og:locale", content: "en" }],
    ["link", { rel: "icon", href: "/asset/podarufav.png" }],
    // PWA
    ["link", { rel: "icon", href: "/asset/podarufav.png", type: "image/svg+xml" }],
    ["link", { rel: "alternate icon", href: "/asset/podarufav.png" }],
    ["link", { rel: "mask-icon", href: "/asset/podarufav.png", color: "#a594f9" }],
    // prettier-ignore
    [
			"meta",
			{ name: "keywords", content: "Anime, Manga, Otaku, Hentai, Weeb" },
		],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: "/asset/podarufav.png",
        sizes: "192x192",
      },
    ],
  ],
  srcExclude: ["README.md"],
  sitemap: {
    hostname: hostname,
  },
  transformHead: async (context) => generateMeta(context, hostname),
  buildEnd: async (context) => {
    generateImages(context);
  },
  markdown: {
    emoji: { defs },
    config(md) {
      md.use(emojiRender);
      md.use(imgLazyload);
      md.use(align);
      md.use(figure);
      md.use(tabsMarkdownPlugin);
      md.use(imgSize);
    },
  },
  vite: {
    optimizeDeps: { exclude: ["workbox-window"] },
    plugins: [
      UnoCSS({
        configFile: "../unocss.config.ts",
      }),
      {
        name: "custom:adjust-order",
        configResolved(c) {
          movePlugin(c.plugins as any, "vitepress", "before", "unocss:transformers:pre");
        },
      },
    ],
    resolve: {
      alias: [
        {
          find: /^.*\/VPBadge\.vue$/,
          replacement: fileURLToPath(new URL("./theme/components/Badge.vue", import.meta.url)),
        },
      ],
    },
  },
  themeConfig: {
    search: search,
    logo: { src: "/asset/inaidle.webp", width: 29, height: 24 },
    sidebar: [
      {
        text: '<span class="i-lucide:zap"></span> Quick Start',
        link: "/qs",
      },
      {
        text: '<span class="i-lucide:message-circle-question"></span> FAQs',
        link: "/faq",
      },
      {
        text: '<span class="i-lucide:earth"></span> Websites',
        link: "/websites",
      },
      {
        text: '<span class="i-lucide:box"></span> Software',
        link: "/software",
      },
      {
        text: '<span class="i-lucide:folder-open"></span> Misc-sites',
        link: "/misc",
      },
      {
        text: '<span class="i-lucide:puzzle"></span> Add-ons',
        link: "/addons",
      },
      {
        text: '<span class="i-lucide:music"></span> Music',
        link: "/music",
      },
      {
        text: '<span class="i-lucide:map"></span> Non-English',
        link: "/nonen",
      },
      {
        text: '<span class="i-lucide:ban"></span> NSFW',
        link: "/nsfw",
      },
      {
        text: '<span class="i-uil:letter-japanese-a"></span> Everything Japan',
        link: "/jp",
      },
      { text: '<span class="i-lucide:package-2"></span> Merch',
        link: "/merch" },
      {
        text: '<span class="i-lucide:scroll-text"></span> Scanlation',
        link: "/scanlation",
      },

      {
        text: '<span class="i-lucide:book-open"></span> Glossary',
        collapsed: true,
        items: [
          { text: "General", link: "/glossary/general" },
          { text: "Anime", link: "/glossary/anime" },
          { text: "Manga", link: "/glossary/manga" },
          { text: "NSFW", link: "/glossary/nsfw" },
          { text: "Torrent", link: "/glossary/torrent" },
        ],
      },
      {
        text: '<span class="i-lucide:book-key"></span> Guides',
        collapsed: true,
        items: [
          { text: "Digital Manga", link: "/guides/digim" },
          { text: "Disc Ripping", link: "/guides/discrip" },
          { text: "Fate / Type-Moon", link: "/guides/fate" },
          { text: "IRC", link: "/guides/irc" },
          { text: "Madokami", link: "/guides/mado" },
          { text: "Manga Image Editing", link: "/guides/imagedit" },
          { text: "Network Stream", link: "/guides/ns" },
          { text: "Squidify", link: "/guides/squidify" },
          { text: "Transcoding Audio", link: "/guides/transcoding" },
        ],
      },
      {
        text: '<span class="i-lucide:flask-conical"></span> Brewing',
        link: "/brewing",
      },
      {
        text: '<span class="i-lucide:messages-square"></span> Communities',
        link: "/comms",
      },
      {
        text: '<span class="i-lucide:heart-handshake"></span> Credits',
        link: "/credits",
      },
    ],
    nav: [
      {
        text: "Pages",
        items: [
          { text: "Quick Start", link: "/qs" },
          { text: "FAQs", link: "/faq" },
          { text: "Websites", link: "/websites" },
          { text: "Software", link: "/software" },
          { text: "Misc-sites", link: "/misc" },
          { text: "Add-ons", link: "/addons" },
          { text: "Music", link: "/music" },
          { text: "Non-English", link: "/nonen" },
          { text: "NSFW", link: "/nsfw" },
          { text: "Everything Japan", link: "/jp" },
          { text: "Merch", link: "/merch" },
          { text: "Scanlation", link: "/scanlation" },
          { text: "Brewing", link: "/brewing" },
          { text: "Communities", link: "/comms" },
        ],
      },
      {
        text: "Glossary",
        items: [
          { text: "General", link: "/glossary/general" },
          { text: "Anime", link: "/glossary/anime" },
          { text: "Manga", link: "/glossary/manga" },
          { text: "NSFW", link: "/glossary/nsfw" },
          { text: "Torrent", link: "/glossary/torrent" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Digital Manga", link: "/guides/digim" },
          { text: "Disc Ripping", link: "/guides/discrip" },
          { text: "Fate / Type-Moon", link: "/guides/fate" },
          { text: "IRC", link: "/guides/irc" },
          { text: "Madokami", link: "/guides/mado" },
          { text: "Manga Image Editing", link: "/guides/imagedit" },
          { text: "Network Stream", link: "/guides/ns" },
          { text: "Squidify", link: "/guides/squidify" },
          { text: "Transcoding Audio", link: "/guides/transcoding" },
        ],
      },
      {
        text: "Updates",
        link: "https://github.com/anotherduckling/Wotaku/commits/main/",
      },
    ],
    socialLinks: socials,
  },
});

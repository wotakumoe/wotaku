import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { figure } from "@mdit/plugin-figure";
import { imgLazyload } from "@mdit/plugin-img-lazyload";
import { align } from "@mdit/plugin-align";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import UnoCSS from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";
import { generateImages, generateMeta } from "./hooks";
import { withPwa } from "@vite-pwa/vitepress";
import { resolve } from "node:path";

import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import { pwa } from "./pwa";

const hostname: string = "https://wotaku.moe";

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
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
      ["meta", { name: "keywords", content: "Anime, Manga, Otaku, Hentai, Weeb" }],
      ["link", { rel: "apple-touch-icon", href: "/asset/podarufav.png", sizes: "192x192" }],
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
      config(md) {
        md.use(align);
        md.use(imgLazyload);
        md.use(figure);
        md.use(tabsMarkdownPlugin);
      },
    },
    vite: {
      plugins: [
        UnoCSS({
          presets: [
            presetUno(),
            presetAttributify(),
            presetIcons({
              warn: true,
              collections: {
                custom: FileSystemIconLoader(resolve(__dirname, "../public/custom")),
              },
              extraProperties: {},
              scale: 1.2,
            }),
          ],
        }),
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
      search: {
        options: { detailedView: true },
        provider: "local",
      },
      logo: { src: "/asset/inaidle.webp", width: 29, height: 24 },
      sidebar: [
        { text: "⚡ Quick Start", link: "/qs" },
        { text: "🌏 Websites", link: "/websites" },
        { text: "💾 Software", link: "/software" },
        { text: "🗃️ Misc-sites", link: "/misc" },
        { text: "🧩 Add-ons", link: "/addons" },
        { text: "🗺️ Non-English", link: "/nonen" },
        { text: "🔞 NSFW", link: "/nsfw" },
        { text: "🗾 Learning Japanese", link: "/jp" },
        { text: "📦 Merch", link: "/merch" },
        { text: "🗣️ Communities", link: "/comms" },
        { text: "📃 Scanlation", link: "/scanlation" },
        {
          text: "📖 Glossary",
          collapsed: true,
          items: [
            { text: "General", link: "/glossary/general" },
            { text: "Anime", link: "/glossary/anime" },
            { text: "Manga", link: "/glossary/manga" },
            { text: "NSFW", link: "/glossary/nsfw" },
            { text: "File Naming", link: "/glossary/file" },
          ],
        },
        {
          text: "📂 Guides",
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
          ],
        },
        { text: "⚗️ Brewing", link: "/brewing" },
        { text: "💖 Credits", link: "/credits" },
      ],
      nav: [
        {
          text: "Pages",
          items: [
            { text: "⚡ Quick Start", link: "/qs" },
            { text: "🌏 Websites", link: "/websites" },
            { text: "💾 Software", link: "/software" },
            { text: "🗃️ Misc-sites", link: "/misc" },
            { text: "🧩 Add-ons", link: "/addons" },
            { text: "🗺️ Non-English", link: "/nonen" },
            { text: "🔞 NSFW", link: "/nsfw" },
            { text: "🗾 Learning Japanese", link: "/jp" },
            { text: "📦 Merch", link: "/merch" },
            { text: "🗣️ Communities", link: "/comms" },
            { text: "📃 Scanlation", link: "/scanlation" },
            { text: "⚗️ Brewing", link: "/brewing" },
          ],
        },
        {
          text: "Glossary",
          items: [
            { text: "General", link: "/glossary/general" },
            { text: "Anime", link: "/glossary/anime" },
            { text: "Manga", link: "/glossary/manga" },
            { text: "NSFW", link: "/glossary/nsfw" },
            { text: "File Naming", link: "/glossary/file" },
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
          ],
        },
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/anotherduckling/Wotaku" },
        { icon: "discord", link: "https://discord.gg/vShRGx8ZBC" },
      ],
    },
    ...pwa,
  }),
);

import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { figure } from "@mdit/plugin-figure";
import { imgLazyload } from "@mdit/plugin-img-lazyload";
import { align } from "@mdit/plugin-align";
import { footnote } from "@mdit/plugin-footnote";
import { imgSize } from "@mdit/plugin-img-size";
import { mark } from "@mdit/plugin-mark";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import UnoCSS from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";
import { generateImages, generateMeta } from "./hooks";
import { withPwa } from "@vite-pwa/vitepress";
import fg from "fast-glob";
import { resolve } from "node:path";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";

// FIXME: remove this after we are done
const hostname: string = "https://wotaku.moe";
export const githubSourceContentRegex = new RegExp(
  "^https://(((raw|user-images|camo).githubusercontent.com))/.*",
  "i",
);
export const googleFontRegex = new RegExp("^https://fonts.googleapis.com/.*", "i");
export const googleStaticFontRegex = new RegExp("^https://fonts.gstatic.com/.*", "i");
export const jsdelivrCDNRegex = new RegExp("^https://cdn.jsdelivr.net/.*", "i");

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    title: "Wotaku",
    description: "The Otaku Index",
    lang: "en-US",
    lastUpdated: true,
    cleanUrls: true,
    ignoreDeadLinks: true,
    appearance: "dark",
    titleTemplate: ":title • Wotaku.moe by Duck",
    head: [
      ["meta", { name: "theme-color", content: "#7bc5e4" }],
      ["meta", { name: "og:type", content: "website" }],
      ["meta", { name: "og:locale", content: "en" }],
      ["link", { rel: "icon", href: "/asset/podarufav.png" }],
      // PWA
      ["link", { rel: "icon", href: "/asset/podarufav.png", type: "image/svg+xml" }],
      ["link", { rel: "alternate icon", href: "/asset/podarufav.png" }],
      ["link", { rel: "mask-icon", href: "/asset/podarufav.png", color: "#7bc5e4" }],
      // prettier-ignore
      ["meta", { name: "keywords", content: "Anime, Manga, Otaku, Hentai, Weeb" }],
      ["link", { rel: "apple-touch-icon", href: "/assets/podarufav.png", sizes: "192x192" }],
    ],
    transformHead: async (context) => generateMeta(context, hostname),
    buildEnd: async (context) => {
      generateImages(context);
    },
    markdown: {
      config(md) {
        md.use(footnote);
        md.use(align);
        md.use(imgLazyload);
        md.use(mark);
        md.use(figure);
        md.use(imgSize);
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
            { text: "File Naming", link: "/glossary/file" },
          ],
        },
        {
          text: "📂 Guides",
          collapsed: true,
          items: [
            { text: "Digital Manga", link: "/guides/digim" },
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
          text: "Glossary",
          items: [
            { text: "General", link: "/glossary/general" },
            { text: "Anime", link: "/glossary/anime" },
            { text: "Manga", link: "/glossary/manga" },
            { text: "File Naming", link: "/glossary/file" },
          ],
        },
        {
          text: "Guides",
          items: [
            { text: "Digital Manga", link: "/guides/digim" },
            { text: "IRC", link: "/guides/irc" },
            { text: "Madokami", link: "/guides/mado" },
            { text: "Manga Image Editing", link: "/guides/imagedit" },
            { text: "Network Stream", link: "/guides/ns" },
            { text: "Squidify", link: "/guides/squidify" },
          ],
        },
        {
          text: "Others",
          items: [
            { text: "Misc-sites", link: "/misc" },
            { text: "Add-ons", link: "/addons" },
            { text: "Learning Japanese", link: "/jp" },
            { text: "Merch", link: "/merch" },
            { text: "Communities", link: "/comms" },
            { text: "Scanlation", link: "/scanlation" },
          ],
        },
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/anotherduckling/Wotaku" },
        { icon: "discord", link: "https://discord.wotaku.moe/" },
      ],
    },
    pwa: {
      base: "/",
      scope: "/",
      outDir: ".vitepress/dist",
      includeAssets: fg.sync("**/*.{png,webp,svg,gif,ico,txt}", {
        cwd: resolve(__dirname, "../public"),
      }),
      registerType: "prompt",
      manifest: {
        name: "Wotaku",
        description: "The Otaku Index",
        categories: ["anime", "manga", "weeb", "hentai", "otaku"],
        short_name: "Wotaku",
        theme_color: "#7bc5e4",
        icons: [
          {
            src: "/asset/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/asset/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/asset/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
        globIgnores: ["**/404.html"],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: googleFontRegex,
            handler: "CacheFirst",
            options: {
              cacheName: "google-font-style-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: googleStaticFontRegex,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: jsdelivrCDNRegex,
            handler: "CacheFirst",
            options: {
              cacheName: "jsdelivr-cdn-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: githubSourceContentRegex,
            handler: "CacheFirst",
            options: {
              cacheName: "githubusercontent-images-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: false,
      },
    },
  }),
);

import type { PwaOptions } from "@vite-pwa/vitepress";
import fg from "fast-glob";
import { resolve } from "node:path";

export const githubSourceContentRegex = new RegExp(
  "^https://(((raw|user-images|camo).githubusercontent.com))/.*",
  "i",
);
export const googleFontRegex = new RegExp("^https://fonts.googleapis.com/.*", "i");
export const googleStaticFontRegex = new RegExp("^https://fonts.gstatic.com/.*", "i");
export const jsdelivrCDNRegex = new RegExp("^https://cdn.jsdelivr.net/.*", "i");

export const pwa: PwaOptions = {
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
    theme_color: "#a594f9",
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
};

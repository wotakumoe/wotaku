/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import { sidebar, siteConfig } from './constants.ts'

// Browser-safe site configuration; build configuration must not be imported here.
export default {
  ...siteConfig,
  base: '/',
  dir: 'ltr',
  locales: {},
  router: { prefetchLinks: true },
  scrollOffset: 134,
  contentProps: undefined,
  themeConfig: {
    logo: { src: '/asset/fav.svg' },
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wotakumoe/Wotaku' },
      { icon: 'discord', link: 'https://discord.gg/vShRGx8ZBC' }
    ],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: false,
            boostDocument(_id: string, term: string, storedFields: Record<string, any>) {
              const titles = (storedFields.titles as string[])
                .filter(Boolean)
                .map((t) => t.toLowerCase())
              const titleIndex = titles.findIndex((t) => t.includes(term))
              return titleIndex >= 0 ? 10000 - titleIndex : 1
            }
          }
        }
      }
    }
  }
}

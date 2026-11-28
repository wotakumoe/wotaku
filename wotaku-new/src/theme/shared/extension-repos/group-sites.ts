/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

import type { RepoSite } from '../../../shared/extension-repos/types'

export interface SiteGroup {
  key: string
  sites: (RepoSite & { repoName?: string })[]
}

export function groupSites(sites: (RepoSite & { repoName?: string })[]): SiteGroup[] {
  const map = new Map<string, SiteGroup>()

  for (const site of sites) {
    const author = site.author ?? ''
    const key = site.copyUrl
      ? 'copy::' + (site.repoName ?? '') + '::' + site.copyUrl
      : site.url
        ? 'url::' + (site.repoName ?? '') + '::' + author + '::' + site.url
        : 'nourl::' +
          site.name +
          '::' +
          site.lang +
          '::' +
          (site.repoName ?? '') +
          '::' +
          author +
          '::' +
          site.icon
    let group = map.get(key)

    if (!group) {
      group = { key, sites: [] }
      map.set(key, group)
    }

    group.sites.push(site)
  }

  return [...map.values()]
}

import type { RepoSite } from './types'

export interface SiteGroup {
  key: string
  sites: (RepoSite & { repoName?: string })[]
}

export function groupSites(
  sites: (RepoSite & { repoName?: string })[]
): SiteGroup[] {
  const map = new Map<string, SiteGroup>()
  for (const site of sites) {
    const key = site.url
      ? 'url::' + (site.repoName ?? '') + '::' + site.url
      : 'nourl::' + site.name + '::' + site.lang + '::' +
        (site.repoName ?? '') + '::' + site.icon
    let group = map.get(key)
    if (!group) {
      group = { key, sites: [] }
      map.set(key, group)
    }
    group.sites.push(site)
  }
  return [...map.values()]
}

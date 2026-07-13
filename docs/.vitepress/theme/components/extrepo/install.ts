import { stripHtml } from './helpers'
import type { Repo, RepoVariant } from './types'

export function paperbackBase(indexUrl: string): string {
  return indexUrl.replace(/\/versioning\.json$/, '')
}

const INSTALL_URL_BUILDERS: Record<string, (repo: Repo) => string> = {
  aidoku: repo => `aidoku://addSourceList?url=${repo.indexUrl}`,
  paperback: repo => `paperback://addRepo?displayName=${encodeURIComponent(stripHtml(repo.name))}&url=${paperbackBase(repo.indexUrl)}`,
  cloudstreamrepo: repo => `cloudstreamrepo://${repo.indexUrl.replace(/^https?:\/\//, '')}`,
  hayase: repo => `hayase://extensions/install?url=${repo.indexUrl}`,
  legado: repo => `legado://import/bookSource?src=${repo.indexUrl}`,
  lnreader: repo => `lnreader://repo/add?url=${repo.indexUrl}`,
  sora: repo => `sora://default_page?url=${new URL(repo.indexUrl).origin}/library/?embed=true`
}

// Apps with no deep-link install scheme;
const MANUAL_ONLY_SCHEMES = new Set(['manual'])

// Schemes with no install or copy action
const BROWSE_ONLY_SCHEMES = new Set(['kotatsu', 'sora'])

export function isBrowseOnly(scheme: string): boolean {
  return BROWSE_ONLY_SCHEMES.has(scheme)
}

export function installHref(scheme: string, repo: Repo): string | null {
  const build = INSTALL_URL_BUILDERS[scheme]
  if (build) return build(repo)
  if (MANUAL_ONLY_SCHEMES.has(scheme) || BROWSE_ONLY_SCHEMES.has(scheme)) return null
  return `${scheme}://add-repo?url=${repo.indexUrl}`
}

export function copyValue(scheme: string, indexUrl: string): string {
  return scheme === 'paperback' ? paperbackBase(indexUrl) : indexUrl
}

export function mangayomiHref(repo: Repo, variant: RepoVariant): string {
  const params: string[] = []
  if (repo.repoName) params.push(`repo_name=${encodeURIComponent(repo.repoName)}`)
  if (repo.repoUrl) params.push(`repo_url=${repo.repoUrl}`)
  if (variant.mangaUrl) params.push(`manga_url=${variant.mangaUrl}`)
  if (variant.animeUrl) params.push(`anime_url=${variant.animeUrl}`)
  if (variant.novelUrl) params.push(`novel_url=${variant.novelUrl}`)
  return `mangayomi://add-repo?${params.join('&')}`
}

export function mangayomiLiveContainerHref(repo: Repo, variant: RepoVariant): string {
  return `livecontainer://open-url?url=${btoa(mangayomiHref(repo, variant))}`
}

// mangayomi all in one
export function mangayomiCopyValue(variant: RepoVariant): string | null {
  const urls = [variant.mangaUrl, variant.animeUrl, variant.novelUrl].filter(Boolean)
  return urls.length === 1 ? urls[0]! : null
}

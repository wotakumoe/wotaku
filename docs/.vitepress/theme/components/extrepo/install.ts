import { stripHtml } from './helpers'
import type { Repo, RepoVariant } from './types'

export function paperbackBase(indexUrl: string): string {
  return indexUrl.replace(/\/versioning\.json$/, '')
}

export function suwatteBase(indexUrl: string): string {
  return indexUrl.replace(/\/sources\.json$/, '')
}

interface InstallOpts {
  suwatteV6?: boolean
  suwatteListUrl?: string
}

const INSTALL_URL_BUILDERS: Record<string, (repo: Repo, opts?: InstallOpts) => string> = {
  aidoku: repo => `aidoku://addSourceList?url=${repo.indexUrl}`,
  paperback: repo => `paperback://addRepo?displayName=${encodeURIComponent(stripHtml(repo.name))}&url=${paperbackBase(repo.indexUrl)}`,
  suwatte: (repo, opts) => {
    const listUrl = opts?.suwatteListUrl ?? suwatteBase(repo.indexUrl)
    return opts?.suwatteV6
      ? `suwatte://list?url=${listUrl}`
      : `suwatte://AddSourceList?list=${encodeURIComponent(listUrl)}`
  },
  cloudstreamrepo: repo => `cloudstreamrepo://${repo.indexUrl.replace(/^https?:\/\//, '')}`,
  hayase: repo => `hayase://extensions/install?url=${repo.indexUrl}`,
  legado: repo => `legado://import/bookSource?src=${repo.indexUrl}`,
  lnreader: repo => `lnreader://repo/add?url=${repo.indexUrl}`
}

// Apps with no deep-link install scheme;
const MANUAL_ONLY_SCHEMES = new Set(['manual'])

// Schemes with no install or copy action
const BROWSE_ONLY_SCHEMES = new Set(['kotatsu', 'sora'])

const NO_COPY_SCHEMES = new Set(['suwatte'])

export function isBrowseOnly(scheme: string): boolean {
  return BROWSE_ONLY_SCHEMES.has(scheme)
}

export function hasCopyButton(scheme: string): boolean {
  return !NO_COPY_SCHEMES.has(scheme)
}

export function installHref(scheme: string, repo: Repo, opts?: InstallOpts): string | null {
  const build = INSTALL_URL_BUILDERS[scheme]
  if (build) return build(repo, opts)
  if (MANUAL_ONLY_SCHEMES.has(scheme) || BROWSE_ONLY_SCHEMES.has(scheme)) return null
  return `${scheme}://add-repo?url=${repo.indexUrl}`
}

export function copyValue(scheme: string, indexUrl: string): string {
  if (scheme === 'paperback') return paperbackBase(indexUrl)
  if (scheme === 'suwatte') return suwatteBase(indexUrl)
  return indexUrl
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

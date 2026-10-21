import { stripHtml } from './helpers'
import type { Repo, RepoVariant } from './types'

export function paperbackBase(indexUrl: string): string {
  return indexUrl.replace(/\/versioning\.json$/, '')
}

export function suwatteBase(indexUrl: string): string {
  return indexUrl.replace(/\/sources\.json$/, '')
}

export function manaBase(indexUrl: string): string {
  return indexUrl.replace(/\/sources\.json$/, '')
}

export function shosetsuBase(indexUrl: string): string {
  return indexUrl.replace(/\/index\.json$/, '/')
}

interface InstallOpts {
  suwatteV6?: boolean
  suwatteListUrl?: string
}

const INSTALL_URL_BUILDERS: Record<
  string,
  (repo: Repo, opts?: InstallOpts) => string
> = {
  aidoku: repo => `aidoku://addSourceList?url=${repo.indexUrl}`,
  mihon: repo => `mihon://extension-store?url=${repo.indexUrl}`,
  paperback: repo =>
    `paperback://addRepo?displayName=${
      encodeURIComponent(stripHtml(repo.name))
    }&url=${paperbackBase(repo.indexUrl)}`,
  suwatte: (repo, opts) => {
    const listUrl = opts?.suwatteListUrl ?? suwatteBase(repo.indexUrl)
    return opts?.suwatteV6
      ? `suwatte://list?url=${listUrl}`
      : `suwatte://AddSourceList?list=${encodeURIComponent(listUrl)}`
  },
  cloudstreamrepo: repo =>
    `cloudstreamrepo://${repo.indexUrl.replace(/^https?:\/\//, '')}`,
  hayase: repo => `hayase://extensions/install?url=${repo.indexUrl}`,
  lnreader: repo => `lnreader://repo/add?url=${repo.indexUrl}`,
  mana: repo =>
    `mana://add-repo?url=${encodeURIComponent(manaBase(repo.indexUrl))}`
}

// Apps with no deep-link install scheme;
const MANUAL_ONLY_SCHEMES = new Set(['manual', 'shosetsu'])

// Schemes with no install or copy action
const BROWSE_ONLY_SCHEMES = new Set(['kotatsu', 'echo'])

const NO_COPY_SCHEMES = new Set(['suwatte', 'echo'])

export function isBrowseOnly(scheme: string): boolean {
  return BROWSE_ONLY_SCHEMES.has(scheme)
}

export function hasCopyButton(scheme: string): boolean {
  return !NO_COPY_SCHEMES.has(scheme)
}

export function installHref(
  scheme: string,
  repo: Repo,
  opts?: InstallOpts
): string | null {
  const build = INSTALL_URL_BUILDERS[scheme]
  if (build) return build(repo, opts)
  if (MANUAL_ONLY_SCHEMES.has(scheme) || BROWSE_ONLY_SCHEMES.has(scheme)) {
    return null
  }
  return `${scheme}://add-repo?url=${repo.indexUrl}`
}

export function copyValue(scheme: string, indexUrl: string): string {
  if (scheme === 'paperback') return paperbackBase(indexUrl)
  if (scheme === 'suwatte') return suwatteBase(indexUrl)
  if (scheme === 'mana') return manaBase(indexUrl)
  if (scheme === 'shosetsu') return shosetsuBase(indexUrl)
  return indexUrl
}

export function mangayomiHref(repo: Repo, variant: RepoVariant): string {
  const params: string[] = []
  if (repo.repoName) {
    params.push(`repo_name=${encodeURIComponent(repo.repoName)}`)
  }
  if (repo.repoUrl) params.push(`repo_url=${repo.repoUrl}`)
  if (variant.mangaUrl) params.push(`manga_url=${variant.mangaUrl}`)
  if (variant.animeUrl) params.push(`anime_url=${variant.animeUrl}`)
  if (variant.novelUrl) params.push(`novel_url=${variant.novelUrl}`)
  return `mangayomi://add-repo?${params.join('&')}`
}

export function mangayomiLiveContainerHref(
  repo: Repo,
  variant: RepoVariant
): string {
  return `livecontainer://open-url?url=${
    b64encodeUnicode(mangayomiHref(repo, variant))
  }`
}

// btoa throws on non-latin1 chars, so encode UTF-8 first.
function b64encodeUnicode(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(bin)
}

// mangayomi all in one
export function mangayomiCopyValue(variant: RepoVariant): string | null {
  const urls = [variant.mangaUrl, variant.animeUrl, variant.novelUrl].filter(
    Boolean
  )
  return urls.length === 1 ? urls[0]! : null
}

import { stripHtml } from './helpers'
import type { Repo } from './types'

export function paperbackBase(indexUrl: string): string {
  return indexUrl.replace(/\/versioning\.json$/, '')
}

const INSTALL_URL_BUILDERS: Record<string, (repo: Repo) => string> = {
  aidoku: repo => `aidoku://addSourceList?url=${encodeURIComponent(repo.indexUrl)}`,
  paperback: repo => `paperback://addRepo?displayName=${encodeURIComponent(stripHtml(repo.name))}&url=${paperbackBase(repo.indexUrl)}`,
  cloudstreamrepo: repo => `cloudstreamrepo://${repo.indexUrl.replace(/^https?:\/\//, '')}`
}

export function installHref(scheme: string, repo: Repo): string {
  const build = INSTALL_URL_BUILDERS[scheme]
  if (build) return build(repo)
  return `${scheme}://add-repo?url=${encodeURIComponent(repo.indexUrl)}`
}

export function copyValue(scheme: string, indexUrl: string): string {
  return scheme === 'paperback' ? paperbackBase(indexUrl) : indexUrl
}

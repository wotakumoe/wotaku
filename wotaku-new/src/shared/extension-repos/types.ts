/**
 * All Rights Reserved
 *
 * Copyright (c) 2026 taskylizard
 *
 * All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
 */

export type Rating = 'safe' | 'mixed' | 'suggestive' | 'nsfw'
export type RatingFilter = 'all' | Rating

export interface RepoVariant {
  label: string
  mangaUrl?: string
  animeUrl?: string
  novelUrl?: string
}

export interface Repo {
  name: string
  indexUrl: string
  note?: string
  repoName?: string
  repoUrl?: string
  variants?: RepoVariant[]
  data?: string
}

export interface RepoSite {
  name: string
  lang: string
  languages?: string[]
  icon: string
  url: string
  rating: Rating
  contentType?: string
  contentTypes?: string[]
  isBroken?: boolean
  installUrl?: string
  author?: string
  copyUrl?: string
}

export interface MatchedSite extends RepoSite {
  repoName: string
}

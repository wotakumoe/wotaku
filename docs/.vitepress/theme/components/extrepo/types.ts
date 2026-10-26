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

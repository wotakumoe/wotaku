export type Rating = 'safe' | 'suggestive' | 'nsfw'
export type RatingFilter = 'all' | Rating

export interface RepoVariant {
  label: string
  mangaUrl?: string
  animeUrl?: string
  novelUrl?: string
  labelUrl?: string
}

export interface Repo {
  name: string
  indexUrl: string
  note?: string
  repoName?: string
  repoUrl?: string
  variants?: RepoVariant[]
}

export interface RepoSite {
  name: string
  lang: string
  icon: string
  url: string
  rating: Rating
  contentType?: string
  isBroken?: boolean
  installUrl?: string
}

export interface MatchedSite extends RepoSite {
  repoName: string
}

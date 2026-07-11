export type Rating = 'safe' | 'suggestive' | 'nsfw'
export type RatingFilter = 'all' | Rating

export interface Repo {
  name: string
  indexUrl: string
  note?: string
}

export interface RepoSite {
  name: string
  lang: string
  icon: string
  url: string
  rating: Rating
}

export interface MatchedSite extends RepoSite {
  repoName: string
}

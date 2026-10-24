import { computed, type ComputedRef, type Ref } from 'vue'
import { langLabel } from './helpers'
import type { MatchedSite, RatingFilter } from './types'

export interface RepoFilterState {
  query: Ref<string>
  langFilter: Ref<string>
  ratingFilter: Ref<RatingFilter>
  contentTypeFilter: Ref<string>
  showBroken: Ref<boolean>
}

export interface IndexedSite extends MatchedSite {
  hay: string
}

export function indexSites(sites: MatchedSite[]): IndexedSite[] {
  return sites.map(site => ({
    ...site,
    hay: `${site.name ?? ''} ${site.url ?? ''}`.toLowerCase()
  }))
}

// dedupes seanime marketplace
export function dedupeSites<T extends MatchedSite>(sites: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const site of sites) {
    if (site.copyUrl) {
      if (seen.has(site.copyUrl)) continue
      seen.add(site.copyUrl)
    }
    out.push(site)
  }
  return out
}

export function useRepoFilter(
  allSites: ComputedRef<IndexedSite[]>,
  state: RepoFilterState
) {
  // Single pass over allSites for every facet + flag.
  const facets = computed(() => {
    const contentTypes = new Set<string>()
    const langs = new Set<string>()
    let hasRatings = false
    let hasMixed = false
    let hasSuggestive = false
    let hasMultiLanguage = false
    let hasBroken = false
    for (const site of allSites.value) {
      if (site.contentType) contentTypes.add(site.contentType)
      if (site.rating !== 'safe') hasRatings = true
      if (site.rating === 'mixed') hasMixed = true
      if (site.rating === 'suggestive') hasSuggestive = true
      if (site.isBroken) hasBroken = true
      if (typeof site.lang !== 'string') continue
      if (site.lang.toLowerCase() === 'all') hasMultiLanguage = true
      if (site.lang !== 'all') langs.add(site.lang)
    }
    return {
      availableContentTypes: [...contentTypes].sort(),
      availableLangs: [...langs].sort((a, b) =>
        langLabel(a).localeCompare(langLabel(b))
      ),
      hasRatings,
      hasMixed,
      hasSuggestive,
      hasMultiLanguage,
      hasBroken
    }
  })

  const isFiltering = computed(() => {
    return state.query.value.trim() !== '' || state.langFilter.value !== '' ||
      state.ratingFilter.value !== 'all' ||
      state.contentTypeFilter.value !== ''
  })

  const filteredSites = computed(() => {
    const q = state.query.value.trim().toLowerCase()
    const lang = state.langFilter.value
    const rating = state.ratingFilter.value
    const ctype = state.contentTypeFilter.value
    const showBroken = state.showBroken.value
    const filtered = allSites.value.filter((site) => {
      if (site.isBroken && !showBroken) return false
      if (q && !site.hay.includes(q)) return false
      if (lang && site.lang !== lang) return false
      if (rating !== 'all' && site.rating !== rating) return false
      if (ctype && site.contentType !== ctype) return false
      return true
    })
    return dedupeSites(filtered)
  })

  return { facets, isFiltering, filteredSites }
}

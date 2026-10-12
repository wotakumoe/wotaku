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

export function useRepoFilter(
  allSites: ComputedRef<IndexedSite[]>,
  state: RepoFilterState
) {
  // Single pass over allSites for every facet + flag.
  const facets = computed(() => {
    const contentTypes = new Set<string>()
    const langs = new Set<string>()
    let hasRatings = false
    let hasSuggestive = false
    let hasMultiLanguage = false
    let hasBroken = false
    for (const site of allSites.value) {
      if (site.contentType) contentTypes.add(site.contentType)
      if (site.rating !== 'safe') hasRatings = true
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
    return allSites.value.filter((site) => {
      if (site.isBroken && !showBroken) return false
      if (q && !site.hay.includes(q)) return false
      if (lang && site.lang !== lang) return false
      if (rating !== 'all' && site.rating !== rating) return false
      if (ctype && site.contentType !== ctype) return false
      return true
    })
  })

  return { facets, isFiltering, filteredSites }
}

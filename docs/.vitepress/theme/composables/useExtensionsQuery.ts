import type { UseQueryOptions } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import {
  type ExtensionSource,
  mergeExtensionSources,
  filterDuplicateExtensions
} from '../../types/ExtensionSources'

export type ReleaseType = 'stable' | 'preview'

export interface Extension {
  name: string
  pkg: string
  apk: string
  lang: string
  code: number
  version: string
  nsfw: number
  hasReadme: number
  hasChangelog: number
  sources: Source[]
  sourceInfo?: ExtensionSource
}

export interface Source {
  name: string
  lang: string
  id: string
  baseUrl: string
  versionId: number
}

type UseExtensionsRepositoryQueryOptions<S = Extension[]> = UseQueryOptions<
  Extension[],
  Error,
  S
> & {
  sources: ExtensionSource[]
}

export default function useExtensionsRepositoryQuery<S = Extension[]>(
  options: UseExtensionsRepositoryQueryOptions<S>
) {
  return useQuery<Extension[], Error, S>({
    queryKey: ['extensions', options.sources],
    queryFn: async () => {
      const sourceGroups = await mergeExtensionSources(options.sources)
      const uniqueGroups = filterDuplicateExtensions(sourceGroups)

      return uniqueGroups.flatMap((group) =>
        group.extensions.map((ext) => ({
          ...ext,
          sourceInfo: group.source
        }))
      )
    },
    initialData: () => [],
    refetchOnWindowFocus: false,
    ...options
  })
}

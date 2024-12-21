import axios from 'axios'
import type { Extension } from '../theme/composables/useExtensionsQuery'

export interface ExtensionSource {
  name: string
  url: string
}

export interface ExtensionSourceGroup {
  extensions: Extension[]
  source: ExtensionSource
}

export function mergeExtensionSources(
  sources: ExtensionSource[]
): Promise<ExtensionSourceGroup[]> {
  return Promise.all(
    sources.map(async (source) => {
      try {
        const response = await axios.get<Extension[]>(source.url)
        return {
          extensions: response.data,
          source
        }
      } catch (error) {
        console.error(`Failed to fetch extensions from ${source.name}:`, error)
        return {
          extensions: [],
          source
        }
      }
    })
  )
}

export function filterDuplicateExtensions(
  groups: ExtensionSourceGroup[]
): ExtensionSourceGroup[] {
  const seen = new Map<string, Extension>()

  return groups.map((group) => {
    const uniqueExtensions = group.extensions.filter((extension) => {
      const key = extension.pkg
      if (!seen.has(key)) {
        seen.set(key, extension)
        return true
      }
      // Keep the newer version if we've seen this package before
      const existing = seen.get(key)!
      if (extension.code > existing.code) {
        seen.set(key, extension)
        return true
      }
      return false
    })

    return {
      ...group,
      extensions: uniqueExtensions
    }
  })
}

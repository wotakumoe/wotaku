import {
  inject,
  type InjectionKey,
  onMounted,
  provide,
  type ShallowRef,
  shallowRef
} from 'vue'
import {
  assembleSchemeData,
  fetchJsonHttp
} from '../../../../ext/extensionRepos/parsers'
import type { ExtensionRepoData } from '../../../../ext/extensionRepos/shared'

import { LOAD_TIMEOUT_MS } from './constants'

export interface RepoStore {
  store: ShallowRef<ExtensionRepoData | null>
  loading: ShallowRef<boolean>
  refreshing: ShallowRef<boolean>
  refreshFailed: ShallowRef<boolean>
  loadFailed: ShallowRef<boolean>
  updatedAt: ShallowRef<number | null>
  loadMs: ShallowRef<number | null>
  refresh: () => Promise<void>
  retry: () => Promise<void>
}

const KEY: InjectionKey<RepoStore> = Symbol('ext-store')

const schemeModules = import.meta.glob<{ data: ExtensionRepoData }>(
  '../../../../ext/extensionRepos/*.data.ts'
)

function emptyData(): ExtensionRepoData {
  return { sites: {}, soraAuthors: {}, echoAuthors: {}, repoLists: {} }
}

// Never let a hung chunk or upstream fetch spin forever.
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms)
  })
  return Promise.race([p, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  })
}

async function loadSchemeData(scheme: string): Promise<ExtensionRepoData> {
  const load = schemeModules[`../../../../ext/extensionRepos/${scheme}.data.ts`]
  if (!load) return emptyData()
  try {
    const mod = await load()
    return mod.data ?? emptyData()
  } catch {
    return emptyData()
  }
}

export function provideRepoStore(scheme: string): RepoStore {
  const store = shallowRef<ExtensionRepoData | null>(null)
  const loading = shallowRef(false)
  const refreshing = shallowRef(false)
  const refreshFailed = shallowRef(false)
  const loadFailed = shallowRef(false)
  const updatedAt = shallowRef<number | null>(null)
  const loadMs = shallowRef<number | null>(null)

  async function loadInitial() {
    if (loading.value) return
    loading.value = true
    loadFailed.value = false
    const t0 = performance.now()
    try {
      const data = await withTimeout(loadSchemeData(scheme), LOAD_TIMEOUT_MS)
      if (data === null) {
        store.value = emptyData()
        loadFailed.value = true
      } else {
        store.value = data
        loadFailed.value = Object.keys(data.sites).length === 0
      }
    } catch {
      store.value = emptyData()
      loadFailed.value = true
    } finally {
      loadMs.value = Math.round(performance.now() - t0)
      loading.value = false
    }
  }

  async function refresh() {
    const prev = store.value
    if (!prev || refreshing.value) return
    refreshing.value = true
    refreshFailed.value = false
    try {
      const urls = Object.keys(prev.sites).filter(k => !k.includes('#'))
      const fresh = await withTimeout(
        assembleSchemeData(urls, Object.keys(prev.repoLists), fetchJsonHttp),
        LOAD_TIMEOUT_MS
      )
      if (fresh === null) {
        refreshFailed.value = true
        return
      }
      if (Object.keys(fresh.sites).length === 0 && urls.length > 0) {
        refreshFailed.value = true
        return
      }
      const sites = { ...prev.sites }
      for (const u of urls) {
        if (u in fresh.sites) {
          for (const k of Object.keys(sites)) {
            if (k === u || k.startsWith(`${u}#`)) delete sites[k]
          }
        }
      }
      store.value = {
        sites: { ...sites, ...fresh.sites },
        soraAuthors: { ...prev.soraAuthors, ...fresh.soraAuthors },
        echoAuthors: { ...prev.echoAuthors, ...fresh.echoAuthors },
        repoLists: { ...prev.repoLists, ...fresh.repoLists }
      }
      updatedAt.value = Date.now()
    } finally {
      refreshing.value = false
    }
  }

  onMounted(loadInitial)
  const ctx: RepoStore = {
    store,
    loading,
    refreshing,
    refreshFailed,
    loadFailed,
    updatedAt,
    loadMs,
    refresh,
    retry: loadInitial
  }
  provide(KEY, ctx)
  return ctx
}

export function useRepoStore(): RepoStore {
  const ctx = inject(KEY)
  if (!ctx) {
    throw new Error('useRepoStore() must be used within provideRepoStore()')
  }
  return ctx
}

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import {
  DEFAULT_THEME,
  resolveThemeColors
} from '../../../../ext/themeRepos/defaults'
import type {
  ManaTheme,
  ThemeRepoEntry
} from '../../../../ext/themeRepos/types'
import { screens } from './screens'
import ThemePreview from './ThemePreview.vue'
import ThemeRow from './ThemeRow.vue'

type ThemeIndexEntry = {
  name?: string
  author?: string | { name?: string }
  url?: string
}
type ThemeFile = {
  theme?: { name?: string; colors?: { values?: Record<string, string> } }
}
type LoadedTheme = ManaTheme & { raw: string }

const props = withDefaults(defineProps<{ themes?: ThemeRepoEntry[] }>(), {
  themes: () => []
})

const themes = ref<LoadedTheme[]>([])
const loading = ref(props.themes.length > 0)
const loadFailed = ref(false)
const selectedKey = ref<string | null>(null)
const screenIndex = ref(0)
const isPhone = useMediaQuery('(max-width: 767px)')

const previewTheme = computed(
  () =>
    themes.value.find(theme => theme.raw === selectedKey.value) ??
      DEFAULT_THEME
)
const screen = computed(() => screens[screenIndex.value] ?? screens[0])

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function loadRepo(entry: ThemeRepoEntry): Promise<LoadedTheme[]> {
  if (!entry.raw) return []

  const index = await fetchJson<{ themes?: ThemeIndexEntry[] }>(entry.raw)
  const loaded = await Promise.all(
    (index.themes ?? [])
      .filter((item): item is ThemeIndexEntry & { url: string } =>
        Boolean(item.url)
      )
      .map(async item => {
        const file = await fetchJson<ThemeFile>(item.url)
        const values = file.theme?.colors?.values
        const name = item.name ?? file.theme?.name
        return values && name
          ? {
            name,
            author: typeof item.author === 'string'
              ? item.author
              : item.author?.name,
            colors: resolveThemeColors(values),
            raw: item.url
          }
          : null
      })
  )

  return loaded.filter((theme): theme is LoadedTheme => theme !== null)
}

onMounted(async () => {
  if (props.themes.length === 0) return

  loading.value = true
  const results = await Promise.allSettled(props.themes.map(loadRepo))
  const unique = new Map<string, LoadedTheme>()
  for (
    const theme of results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
  ) {
    unique.set(theme.raw, theme)
  }
  themes.value = [...unique.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  loadFailed.value = results.some(r => r.status === 'rejected')
  loading.value = false
})

function showScreen(delta: number): void {
  screenIndex.value = (screenIndex.value + delta + screens.length) %
    screens.length
}

function toggleTheme(theme: LoadedTheme): void {
  selectedKey.value = selectedKey.value === theme.raw ? null : theme.raw
}
</script>

<template>
  <div class="theme-repos">
    <div v-if="themes.length" class="theme-showcase">
      <div class="theme-stage">
        <ThemePreview
          :theme="previewTheme"
          :screen="screen"
          @prev="showScreen(-1)"
          @next="showScreen(1)"
        />
      </div>

      <div class="theme-panel">
        <div
          class="theme-list"
          :class="{ 'theme-list-open': isPhone && selectedKey }"
        >
          <template v-for="theme in themes" :key="theme.raw">
            <ThemeRow
              :theme="theme"
              :selected="theme.raw === selectedKey"
              @select="toggleTheme(theme)"
            />
            <div
              v-if="isPhone && theme.raw === selectedKey"
              class="theme-dropdown"
            >
              <ThemePreview
                :theme="theme"
                :screen="screen"
                @prev="showScreen(-1)"
                @next="showScreen(1)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>

    <p v-else-if="loading" class="theme-repos-empty">Loading themes…</p>
    <p v-else-if="loadFailed" class="theme-repos-empty">
      Couldn't load themes from this repo.
    </p>
    <p v-else class="theme-repos-empty">No themes found.</p>
  </div>
</template>

<style scoped>
.theme-repos {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl, 12px);
  overflow: hidden;
}
.theme-showcase {
  display: grid;
  grid-template-columns: minmax(220px, 0.82fr) minmax(0, 1.18fr);
  min-height: 100%;
}
.theme-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 34px;
  background-color: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
}
.theme-panel {
  position: relative;
  min-width: 0;
  min-height: 0;
}
.theme-list {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
.theme-list > .theme-row:not(:first-child) {
  border-top: 1px solid var(--vp-c-divider);
}
.theme-dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 40px 22px;
  background-color: var(--vp-c-bg-soft);
}
.theme-repos-empty {
  margin: 0;
  padding: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

@media (max-width: 767px) {
  .theme-showcase {
    grid-template-columns: minmax(0, 1fr);
  }
  .theme-stage {
    display: none;
  }
  .theme-panel {
    position: static;
  }
  .theme-list {
    position: static;
    max-height: 60vh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .theme-dropdown {
    border-top: 1px solid var(--vp-c-divider);
    --theme-phone-width: min(250px, calc(40vh - 64px));
  }
  .theme-list-open {
    max-height: 85vh;
  }
}
</style>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import { data as platformMap } from './platforms.data'

interface Repo {
  name: string
  icon: string | null
  href: string | null
}

interface AppEntry {
  id: string
  name: string
  platforms: string[]
  icon: string | null
  repos: string[]
  notes: string[]
}

interface Payload {
  version: number
  repos: Record<string, Repo>
  apps: AppEntry[]
}

const DEFAULT_SRC = 'https://wotaku-ext.duckling.workers.dev/data.json'
const CACHE_KEY = 'wotaku:crossapp:v1'
const CACHE_TTL_MS = 5 * 60 * 1000
const FETCH_TIMEOUT_MS = 10000

const props = withDefaults(defineProps<{ src?: string }>(), {
  src: DEFAULT_SRC
})

const payload = ref<Payload | null>(null)
const loading = ref(true)
const failed = ref(false)
const openId = ref<string | null>(null)
const brokenIcons = ref(new Set<string>())
const brokenRepoIcons = ref(new Set<string>())
const gridRef = ref<HTMLElement | null>(null)
const columnCount = ref(1)

const apps = computed(() => payload.value?.apps ?? [])
const openApp = computed(() =>
  apps.value.find(app => app.id === openId.value) ?? null
)

const openRepos = computed(() => {
  if (!openApp.value || !payload.value) return []
  return openApp.value.repos
    .map(id => payload.value!.repos[id])
    .filter((repo): repo is Repo => Boolean(repo))
})

const openRowEnd = computed(() => {
  const app = openApp.value
  if (!app) return -1
  const index = apps.value.findIndex(item => item.id === app.id)
  if (index < 0) return -1
  const cols = Math.max(1, columnCount.value)
  return Math.min(Math.floor(index / cols) * cols + cols, apps.value.length) - 1
})

function syncColumns() {
  const el = gridRef.value
  if (!el) return
  const tracks = getComputedStyle(el).gridTemplateColumns
  const count = tracks && tracks !== 'none' ? tracks.split(' ').filter(Boolean).length : 1
  if (count > 0) columnCount.value = count
}

function platformInfo(token: string) {
  return platformMap[token] ?? { icon: 'lucide-monitor', label: token }
}

function iconUrl(path: string) {
  try {
    return new URL(path, props.src).toString()
  } catch {
    return path
  }
}

function readCache(): Payload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as { at: number; data: Payload }
    if (!cached?.data || Date.now() - cached.at > CACHE_TTL_MS) return null
    return cached.data
  } catch {
    return null
  }
}

function writeCache(data: Payload) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {}
}

let inFlight = false

async function load(force = false) {
  if (inFlight) return
  inFlight = true
  loading.value = true
  failed.value = false

  if (!force) {
    const cached = readCache()
    if (cached) {
      payload.value = cached
      loading.value = false
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(props.src, {
      signal: controller.signal,
      cache: 'no-cache'
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const data = (await response.json()) as Payload
    if (!Array.isArray(data?.apps)) throw new Error('invalid payload')
    payload.value = data
    writeCache(data)
  } catch {
    if (!payload.value) failed.value = true
  } finally {
    clearTimeout(timer)
    loading.value = false
    inFlight = false
  }
}

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
  if (!openId.value) return
  void nextTick(() => {
    const panel = gridRef.value?.querySelector<HTMLElement>('.ca-panel')
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    if (rect.bottom > window.innerHeight || rect.top < 0) {
      panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

function onIconError(id: string) {
  brokenIcons.value = new Set(brokenIcons.value).add(id)
}

function onRepoIconError(name: string) {
  brokenRepoIcons.value = new Set(brokenRepoIcons.value).add(name)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  void load()
  void nextTick(syncColumns)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(syncColumns)
    if (gridRef.value) resizeObserver.observe(gridRef.value)
  }
})

watch(apps, () => {
  void nextTick(() => {
    syncColumns()
    if (resizeObserver) {
      resizeObserver.disconnect()
      if (gridRef.value) resizeObserver.observe(gridRef.value)
    }
  })
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="ca-root" @keydown.esc="openId = null">
    <div v-if="loading && !apps.length" class="ca-box" aria-busy="true">
      <div class="ca-grid">
        <div v-for="n in 8" :key="n" class="ca-app ca-skeleton">
          <span class="ca-sk-row">
            <span class="ca-sk-icon" />
            <span class="ca-sk-line" />
          </span>
          <span class="ca-sk-line short" />
        </div>
      </div>
    </div>

    <div v-else-if="failed && !apps.length" class="ca-error" role="status">
      <span>Couldn't load cross-app support.</span>
      <button type="button" @click="load(true)">Retry</button>
    </div>

    <template v-else>
      <div class="ca-box">
        <div ref="gridRef" class="ca-grid">
          <template v-for="(app, index) in apps" :key="app.id">
            <button
              type="button"
              class="ca-app"
              :class="{
                'is-open': openId === app.id,
                'is-dimmed': openId && openId !== app.id
              }"
              :aria-expanded="openId === app.id"
              :aria-controls="openId === app.id ? 'ca-panel' : undefined"
              @click="toggle(app.id)"
            >
              <span class="ca-app-row">
                <span class="ca-app-icon">
                  <span class="ca-app-mono">{{ app.name.charAt(0) }}</span>
                  <img
                    v-if="app.icon && !brokenIcons.has(app.id)"
                    class="ca-app-img no-zoom"
                    :src="iconUrl(app.icon)"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    @error="onIconError(app.id)"
                  />
                </span>
                <span class="ca-app-name" :title="app.name">{{ app.name }}</span>
                <span v-if="app.platforms.length" class="ca-app-platforms">
                  <span
                    v-for="token in app.platforms"
                    :key="token"
                    class="icon-tip ca-platform"
                    :data-tip="platformInfo(token).label"
                  >
                    <span :class="`i-${platformInfo(token).icon}`" />
                  </span>
                </span>
              </span>
              <span class="ca-app-sub">
                {{ app.repos.length }}
                {{ app.repos.length === 1 ? 'type' : 'types' }}
              </span>
            </button>

            <section
              v-if="openApp && index === openRowEnd"
              id="ca-panel"
              class="ca-panel"
              role="region"
              :aria-label="`${openApp.name} supported repos`"
            >
              <header class="ca-panel-head">
                <h3 class="ca-panel-title">{{ openApp.name }}</h3>
                <button
                  type="button"
                  class="ca-panel-close"
                  aria-label="Close"
                  @click="openId = null"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z"
                    />
                  </svg>
                </button>
              </header>

              <ul v-if="openApp.notes.length" class="ca-notes">
                <li v-for="note in openApp.notes" :key="note">{{ note }}</li>
              </ul>

              <div class="ca-repos">
                <component
                  :is="repo.href ? 'a' : 'div'"
                  v-for="repo in openRepos"
                  :key="repo.name"
                  class="ca-repo"
                  :class="{ 'is-disabled': !repo.href }"
                  :href="repo.href ?? undefined"
                  :title="repo.href ? repo.name : 'No page yet'"
                >
                  <span class="ca-repo-icon">
                    <span class="ca-repo-mono">{{ repo.name.charAt(0) }}</span>
                    <img
                      v-if="repo.icon && !brokenRepoIcons.has(repo.name)"
                      class="ca-repo-img no-zoom"
                      :src="iconUrl(repo.icon)"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      @error="onRepoIconError(repo.name)"
                    />
                  </span>
                  <span class="ca-repo-name">{{ repo.name }}</span>
                </component>
              </div>
            </section>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ca-root {
  margin: 16px 0;
}

.ca-box {
  padding: 8px;
  border: 2px solid #3d3d3d;
  border-radius: var(--radius-xl, 12px);
  background-color: var(--vp-c-bg);
}

@media (max-width: 767px) {
  .ca-box {
    max-height: min(360px, 55vh);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
}

.ca-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px;
}

.ca-app {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 6px;
  border: 1.5px solid #3d3d3d;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, opacity 0.2s;
}

.ca-app.is-dimmed {
  opacity: 0.45;
}

.ca-app.is-dimmed:hover,
.ca-app.is-dimmed:focus-visible {
  opacity: 0.85;
}

.ca-app:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ca-app:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.ca-app.is-open {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ca-app-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.ca-app-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--vp-c-bg-alt);
}

.ca-app-img {
  position: absolute;
  inset: 0;
  width: 18px;
  height: 18px;
  object-fit: contain;
  background-color: var(--vp-c-bg-alt);
}

.ca-app-mono {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.ca-app-name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ca-app-platforms {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.ca-platform {
  line-height: 1;
}

.ca-platform > span {
  min-width: 0;
  width: 13px;
  height: 13px;
  font-size: 13px;
  line-height: 1;
}

.ca-app-sub {
  display: block;
  padding-left: 24px;
  font-size: 10.5px;
  font-weight: 400;
  line-height: 1.1;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ca-panel {
  grid-column: 1 / -1;
  padding: 8px;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 10px;
  background-color: var(--vp-c-bg);
  animation: ca-panel-in 0.18s ease-out;
}

@keyframes ca-panel-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.ca-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 4px 0;
}

.ca-panel-title {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
}

.ca-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.ca-panel-close:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.ca-notes {
  margin: 8px 4px 0;
  padding: 8px 10px 8px 24px;
  border: 1px solid var(--vp-custom-block-warning-border);
  border-radius: 8px;
  background-color: var(--vp-custom-block-warning-bg);
  color: var(--vp-custom-block-warning-text);
  font-size: 12px;
  line-height: 1.5;
}

.ca-notes li + li {
  margin-top: 2px;
}

.ca-repos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
  margin-top: 8px;
  padding: 0 4px 4px;
}

.ca-repo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 32px;
  padding: 6px 8px;
  border: 1.5px solid #3d3d3d;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-align: left;
  text-decoration: none !important;
  transition: border-color 0.2s, background-color 0.2s;
}

.ca-repo:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ca-repo.is-disabled {
  opacity: 0.55;
}

.ca-repo-name {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ca-repo-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--vp-c-bg-alt);
}

.ca-repo-img {
  position: absolute;
  inset: 0;
  width: 18px;
  height: 18px;
  object-fit: contain;
  background-color: var(--vp-c-bg-alt);
}

.ca-repo-mono {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-text-2);
}

.ca-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl, 12px);
  background-color: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.ca-error button {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.ca-skeleton {
  cursor: default;
}

.ca-sk-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ca-sk-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-alt);
}

.ca-sk-line {
  flex: 1;
  height: 9px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
}

.ca-sk-line.short {
  display: block;
  width: 38%;
  height: 7px;
  margin-top: 3px;
  margin-left: 24px;
}

html.effects-disabled .ca-panel {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .ca-panel {
    animation: none;
  }
}
</style>

<script lang="ts" setup>
import MiniSearch, { type SearchResult } from 'minisearch'
import { dataSymbol, inBrowser, useRouter } from 'vitepress'
import {
  computed,
  createApp,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
// @ts-ignore
import { pathToFile } from 'vitepress/dist/client/app/utils'
// @ts-ignore
import { escapeRegExp } from 'vitepress/dist/client/shared'

import {
  computedAsync,
  onKeyStroke,
  useEventListener,
  useLocalStorage,
  useScrollLock,
  useSessionStorage,
  watchDebounced
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { AnimatePresence, motion } from 'motion-v'

// @ts-ignore
import localSearchIndex from '@localSearchIndex'

import {
  ArrowRight,
  Delete,
  File,
  Hash,
  Regex,
  TextAlignStart
} from 'lucide-vue-next'
import Mark from 'mark.js/dist/mark.es6.js'
import { LRUCache } from '../composables/search/lru-cache'
import { createSearchTranslate } from '../composables/search/translation'
import { useData } from '../composables/search/use-data'

export interface FooterTranslations {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  closeText?: string
  closeKeyAriaLabel?: string
}

export interface ModalTranslations {
  displayDetails?: string
  resetButtonTitle?: string
  backButtonTitle?: string
  noResultsText?: string
  footer?: FooterTranslations
}

const showSearch = defineModel<boolean>()

const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()

/* Search */
const searchIndexData = shallowRef(localSearchIndex)

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept('@localSearchIndex', (m) => {
    if (m) {
      searchIndexData.value = m.default
    }
  })
}

interface Result {
  title: string
  titles: string[]
  text?: string
}

const vitePressData = useData()
const { activate } = useFocusTrap(el, {
  immediate: true,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
  initialFocus: () => {
    return searchInput.value
  }
})
const { localeIndex, theme } = vitePressData
const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[localeIndex.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          // Conditional fuzzy search based on matchExact value
          fuzzy: matchExact.value ? false : 0.07,
          // Conditional prefix search based on matchExact value
          prefix: matchExact.value ? false : (term) => term.length > 3,
          // Disable max fuzzy if match exact is enabled
          maxFuzzy: matchExact.value ? 0 : 1,
          boost: { title: 4, text: 2, titles: 1 },
          ...(theme.value.search?.provider === 'local' &&
            theme.value.search.options?.miniSearch?.searchOptions)
        },
        ...(theme.value.search?.provider === 'local' &&
          theme.value.search.options?.miniSearch?.options)
      }
    )
  )
)

const disableQueryPersistence = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.disableQueryPersistence === true
  )
})

const filterText = disableQueryPersistence.value
  ? ref('')
  : useSessionStorage('vitepress:local-search-filter', '')

const showDetailedList = useLocalStorage(
  'vitepress:local-search-detailed-list',
  theme.value.search?.provider === 'local' &&
    theme.value.search.options?.detailedView === true
)

const matchExact = useLocalStorage(
  'vitepress:local-search-match-exact',
  false // disabled by default
)

const disableDetailedView = computed(() => {
  return (
    theme.value.search?.provider === 'local' &&
    theme.value.search.options?.detailedView === false
  )
})

const buttonText = computed(() => {
  const options = theme.value.search?.options

  return (
    options?.locales?.[localeIndex.value]?.translations?.button?.buttonText ||
    options?.translations?.button?.buttonText ||
    'Search'
  )
})

watchEffect(() => {
  if (disableDetailedView.value) {
    showDetailedList.value = false
  }
})

const results: Ref<(SearchResult & Result)[]> = shallowRef([])

const enableNoResults = ref(false)

watch(filterText, () => {
  enableNoResults.value = false
})

const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

const cache = new LRUCache<string, Map<string, string>>(16) // 16 files

watchDebounced(
  () => [searchIndex.value, filterText.value, showDetailedList.value] as const,
  async ([index, filterTextValue, showDetailedListValue], old, onCleanup) => {
    if (old?.[0] !== index) {
      // in case of hmr
      cache.clear()
    }

    let canceled = false
    onCleanup(() => {
      canceled = true
    })

    if (!index) return

    // Search
    const _result = index
      .search(filterTextValue)
      .slice(0, 16) as (SearchResult & Result)[]
    enableNoResults.value = true

    if (!_result) {
      results.value = []
      return
    }

    // Highlighting
    const mods = showDetailedListValue
      ? await Promise.all(results.value.map((r) => fetchExcerpt(r.id)))
      : []
    if (canceled) return
    for (const { id, mod } of mods) {
      const mapId = id.slice(0, id.indexOf('#'))
      let map = cache.get(mapId)
      if (map) continue
      map = new Map()
      cache.set(mapId, map)
      const comp = mod.default ?? mod
      if (comp?.render || comp?.setup) {
        const app = createApp(comp)
        // Silence warnings about missing components
        app.config.warnHandler = () => {}
        app.provide(dataSymbol, vitePressData)
        Object.defineProperties(app.config.globalProperties, {
          $frontmatter: {
            get() {
              return vitePressData.frontmatter.value
            }
          },
          $params: {
            get() {
              return vitePressData.page.value.params
            }
          }
        })
        const div = document.createElement('div')
        app.mount(div)
        const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings.forEach((el) => {
          const href = el.querySelector('a')?.getAttribute('href')
          const anchor = href?.startsWith('#') && href.slice(1)
          if (!anchor) return
          let html = ''
          while (
            (el = el.nextElementSibling!) &&
            !/^h[1-6]$/i.test(el.tagName)
          ) {
            html += el.outerHTML
          }
          map!.set(anchor, html)
        })
        app.unmount()
      }
      if (canceled) return
    }

    const terms = new Set<string>()

    results.value = _result.map((r) => {
      const [id, anchor] = r.id.split('#')
      const map = cache.get(id)
      const text = map?.get(anchor) ?? ''
      for (const term in r.match) {
        terms.add(term)
      }
      return { ...r, text }
    })

    await nextTick()
    if (canceled) return

    await new Promise((r) => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: r })
        }
      })
    })

    const excerpts = el.value?.querySelectorAll('.result .excerpt') ?? []
    // @ts-expect-error
    for (const excerpt of excerpts) {
      excerpt
        .querySelector('mark[data-markjs="true"]')
        ?.scrollIntoView({ block: 'center' })
    }
    // FIXME: without this whole page scrolls to the bottom
    resultsEl.value?.firstElementChild?.scrollIntoView({ block: 'start' })
  },
  { debounce: 180, immediate: true }
)

const excerptCache = new LRUCache<string, unknown>(60) // 60 excerpts

async function fetchExcerpt(id: string) {
  const cache = excerptCache.get(id)
  if (cache) return { id, mod: cache }

  const file = pathToFile(id.slice(0, id.indexOf('#')))
  try {
    if (!file) throw new Error(`Cannot find file for id: ${id}`)
    const mod = await import(/*@vite-ignore*/ file)

    excerptCache.set(id, mod)

    return { id, mod }
  } catch (e) {
    console.error(e)
    return { id, mod: {} }
  }
}

/* Search input focus */

const searchInput = ref<HTMLInputElement>()
const disableReset = computed(() => {
  return filterText.value?.length <= 0
})
function focusSearchInput(select = true) {
  searchInput.value?.focus()
  select && searchInput.value?.select()
}

onMounted(() => {
  focusSearchInput()
})

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    focusSearchInput()
  }
}

/* Search keyboard selection */

const selectedIndex = ref(-1)
const disableMouseOver = ref(true)

watch(results, (r) => {
  selectedIndex.value = r.length ? 0 : -1
  scrollToSelectedResult()
})

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector('.result.selected')
    selectedEl?.scrollIntoView({ block: 'nearest' })
  })
}

onKeyStroke('ArrowUp', (event) => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0) {
    selectedIndex.value = results.value.length - 1
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', (event) => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= results.value.length + 1) {
    selectedIndex.value = 0
  }
  disableMouseOver.value = true
  scrollToSelectedResult()
})

const router = useRouter()

onKeyStroke('Enter', (e) => {
  if (e.isComposing) return

  if (e.target instanceof HTMLButtonElement && e.target.type !== 'submit') {
    return
  }

  const index = selectedIndex.value - 1

  if (index === -1) {
    // @ts-ignore
    window.toggleAI({ value: filterText.value })
    showSearch.value = false
    return
  }

  const selectedPackage = results.value[index]
  if (e.target instanceof HTMLInputElement && !selectedPackage) {
    e.preventDefault()
    return
  }

  if (selectedPackage) {
    router.go(selectedPackage.id)
    showSearch.value = false
  }
})

onKeyStroke('Escape', () => {
  showSearch.value = false
})

// Translations
const defaultTranslations = {
  modal: {
    displayDetails: 'Display detailed list',
    exactMatchTitle: 'Match exact phrases',
    resetButtonTitle: 'Reset search',
    backButtonTitle: 'Close search',
    noResultsText: 'No results for',
    footer: {
      selectText: 'to select',
      selectKeyAriaLabel: 'enter',
      navigateText: 'to navigate',
      navigateUpKeyAriaLabel: 'up arrow',
      navigateDownKeyAriaLabel: 'down arrow',
      closeText: 'to close',
      closeKeyAriaLabel: 'escape'
    }
  }
}

const translate = createSearchTranslate(defaultTranslations)

// Back

onMounted(() => {
  // Prevents going to previous site
  window.history.pushState(null, '', null)
})

useEventListener('popstate', (event) => {
  event.preventDefault()
  showSearch.value = false
})

/** Lock body */
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  () => showSearch.value,
  (val) => {
    if (!val) {
      isLocked.value = false
      return
    }

    nextTick(() => {
      isLocked.value = true
      nextTick().then(() => activate())
    })
  }
)

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map((term) => `(${escapeRegExp(term)})`)
      .join('|'),
    'gi'
  )
}

function resetSearch() {
  filterText.value = ''
  nextTick().then(() => focusSearchInput(false))
}

function onMouseMove(e: MouseEvent) {
  if (!disableMouseOver.value) return
  const el = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('.result')
  const index = Number.parseInt(el?.dataset.index!)
  if (index >= 0 && index !== selectedIndex.value) {
    selectedIndex.value = index
  }
  disableMouseOver.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      role="button"
      :aria-owns="results?.length ? 'localsearch-list' : undefined"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-labelledby="localsearch-label"
      class="VPLocalSearchBox"
      :class="{ 'pointer-events-none': !showSearch }"
    >
      <AnimatePresence>
        <motion.div
          v-if="showSearch"
          class="backdrop"
          @click="showSearch = false"
          :initial="{
            opacity: 0
          }"
          :animate="{
            opacity: 1
          }"
          :exit="{
            opacity: 0
          }"
          :transition="{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1]
          }"
        />
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          v-if="showSearch"
          layout="size"
          class="shell"
          :initial="{
            opacity: 0,
            scale: 0.9375
          }"
          :animate="{
            opacity: 1,
            scale: 1
          }"
          :exit="{
            opacity: 0,
            scale: 0.9375
          }"
          :transition="{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1]
          }"
        >
          <motion.form
            layout="position"
            class="search-bar"
            @pointerup="onSearchBarClick($event)"
            @submit.prevent=""
          >
            <label
              :title="buttonText"
              id="localsearch-label"
              for="localsearch-input"
            >
              <span
                aria-hidden="true"
                class="vpi-search search-icon local-search-icon"
              />
            </label>
            <div class="search-actions before">
              <button
                class="back-button"
                :title="translate('modal.backButtonTitle')"
                @click="showSearch = false"
              >
                <span class="vpi-arrow-left local-search-icon" />
              </button>
            </div>
            <input
              ref="searchInput"
              v-model="filterText"
              :aria-activedescendant="selectedIndex > -1
              ? 'localsearch-item-' + selectedIndex
              : undefined"
              aria-autocomplete="both"
              :aria-controls="results?.length ? 'localsearch-list' : undefined"
              aria-labelledby="localsearch-label"
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              class="search-input"
              id="localsearch-input"
              enterkeyhint="go"
              maxlength="64"
              :placeholder="buttonText"
              spellcheck="false"
              type="search"
            />
            <div class="search-actions">
              <button
                v-if="!disableDetailedView"
                class="toggle-layout-button"
                type="button"
                :class="{ 'detailed-list': showDetailedList }"
                :title="translate('modal.displayDetails')"
                @click="selectedIndex > -1 &&
                (showDetailedList = !showDetailedList)"
              >
                <TextAlignStart :size="19" stroke-width="1.25" />
              </button>
              <button
                class="exact-match-button"
                type="button"
                :class="{ 'exact-match-active': matchExact }"
                :title="translate('modal.exactMatchTitle')"
                @click="matchExact = !matchExact"
              >
                <Regex :size="19" stroke-width="1.25" />
              </button>
              <button
                class="clear-button"
                type="reset"
                :disabled="disableReset"
                :title="translate('modal.resetButtonTitle')"
                @click="resetSearch"
              >
                <Delete :size="19" stroke-width="1.25" />
              </button>
            </div>
          </motion.form>

          <ul
            ref="resultsEl"
            :id="results?.length ? 'localsearch-list' : undefined"
            :role="results?.length ? 'listbox' : undefined"
            :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
            class="results"
            @mousemove="onMouseMove"
          >
            <AnimatePresence>
              <motion.div
                class="flex flex-col justify-center items-center h-47.5 gap-2 font-medium text-sm text-gray-500 dark:text-gray-300 m-auto md:mt-10 md:mb-6 opacity-90"
                v-if="!filterText || (filterText && !results.length)"
                :initial="{
                  opacity: 0
                }"
                :animate="{
                  opacity: 1,
                  transition: {
                    delay: 0.1
                  }
                }"
                :exit="{
                  opacity: 0,
                  height: 0,
                  transition: {
                    duration: 0.2
                  }
                }"
                :transition="{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }"
              >
                <img
                  class="h-40 object-contain object-center -translate-x-2"
                  src="/asset/smolame.png"
                  alt="Smol ame"
                />
                <h1 v-if="filterText && !results.length">
                  Couldn't find anything, try again?
                </h1>
                <h1 v-else>Looking for something?</h1>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              <motion.li
                v-for="(p, index) in results"
                :key="p.id"
                layout
                class="result-layout"
                :id="'localsearch-item-' + (index + 1)"
                :aria-selected="selectedIndex === index + 1 ? 'true' : 'false'"
                role="option"
                :initial="{
                  opacity: 0,
                  scale: 0.9375
                }"
                :animate="{
                  opacity: 1,
                  scale: 1
                }"
                :exit="{
                  opacity: 0,
                  scale: 0.9375,
                  height: 0,
                  transition: {
                    duration: 0.25
                  }
                }"
                :transition="{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.02
                }"
              >
                <a
                  :href="p.id"
                  class="result"
                  :class="{
                    selected: selectedIndex === index + 1
                  }"
                  :aria-label="[...p.titles, p.title].join(' > ')"
                  @mouseenter="!disableMouseOver &&
                  (selectedIndex = index + 1)"
                  @focusin="selectedIndex = index + 1"
                  @click="showSearch = false"
                  :data-index="index + 1"
                >
                  <div>
                    <div class="titles">
                      <Hash
                        v-if="p.titles.length > 0"
                        stroke-width="1.25"
                        :size="18"
                      />
                      <File v-else stroke-width="1.25" :size="18" />

                      <span
                        v-for="(t, index) in p.titles"
                        :key="index"
                        class="title"
                      >
                        <span class="text" v-html="t" />
                        <ArrowRight
                          stroke-width="1.25"
                          :size="18"
                          class="mx-0.5"
                        />
                      </span>
                      <span class="title main">
                        <span class="text" v-html="p.title" />
                      </span>
                    </div>

                    <div v-if="showDetailedList" class="excerpt-wrapper">
                      <motion.div
                        v-if="p.text"
                        layout
                        class="excerpt"
                        inert
                        :initial="{
                          height: 0
                        }"
                        :animate="{
                          height: '84px'
                        }"
                        :exit="{
                          height: 0
                        }"
                        :transition="{
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1]
                        }"
                      >
                        <div class="vp-doc" v-html="p.text" />
                      </motion.div>
                      <div class="excerpt-gradient-bottom" />
                      <div class="excerpt-gradient-top" />
                    </div>
                  </div>
                </a>
              </motion.li>
            </AnimatePresence>
          </ul>

          <motion.div layout class="search-keyboard-shortcuts">
            <span>
              <kbd
                :aria-label="translate(
                  'modal.footer.navigateUpKeyAriaLabel'
                )"
              >
                <span class="vpi-arrow-up navigate-icon" />
              </kbd>
              <kbd
                :aria-label="translate(
                  'modal.footer.navigateDownKeyAriaLabel'
                )"
              >
                <span class="vpi-arrow-down navigate-icon" />
              </kbd>
              {{ translate('modal.footer.navigateText') }}
            </span>
            <span>
              <kbd :aria-label="translate('modal.footer.selectKeyAriaLabel')">
                <span class="vpi-corner-down-left navigate-icon" />
              </kbd>
              {{ translate('modal.footer.selectText') }}
            </span>
            <span>
              <kbd :aria-label="translate('modal.footer.closeKeyAriaLabel')">
                esc
              </kbd>
              {{ translate('modal.footer.closeText') }}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button v-if="!showSearch" />
    </div>
  </Teleport>
</template>

<style scoped>
.VPLocalSearchBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
  transition: opacity 0.5s;
  will-change: opacity;
}

.shell {
  position: relative;
  padding: 12px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-local-search-bg);
  width: min(100vw - 60px, 900px);
  height: min-content;
  max-height: min(100vh - 128px, 900px);
  border-radius: 6px;
  will-change: transform, opacity, height;
}

@media (max-width: 767px) {
  .shell {
    margin: 0;
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}

.search-bar {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
  will-change: height;
}

@media (max-width: 767px) {
  .search-bar {
    padding: 0 8px;
  }
}

.search-bar:focus-within {
  border-color: var(--vp-c-brand-1);
}

.local-search-icon {
  display: block;
  font-size: 18px;
}

.navigate-icon {
  display: block;
  font-size: 14px;
}

.search-icon {
  margin: 8px;
}

@media (max-width: 767px) {
  .search-icon {
    display: none;
  }
}

.search-input {
  padding: 6px 12px;
  font-size: inherit;
  width: 100%;
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

@media (max-width: 767px) {
  .search-input {
    padding: 6px 4px;
  }
}

.search-actions {
  display: flex;
  gap: 4px;
}

@media (any-pointer: coarse) {
  .search-actions {
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .search-actions.before {
    display: none;
  }
}

.search-actions button {
  padding: 8px;
}

.search-actions button:not([disabled]):hover,
.toggle-layout-button.detailed-list {
  color: var(--vp-c-brand-1);
}

.search-actions button.clear-button:disabled {
  opacity: 0.37;
}

.search-keyboard-shortcuts {
  font-size: 0.8rem;
  opacity: 75%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  line-height: 14px;
}

.search-keyboard-shortcuts span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 767px) {
  .search-keyboard-shortcuts {
    display: none;
  }
}

.search-keyboard-shortcuts kbd {
  background: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  padding: 3px 6px;
  min-width: 24px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border: 1px solid rgba(128, 128, 128, 0.15);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.result-layout {
  will-change: transform, opacity, height;
}

.result {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  transition: none;
  line-height: 1rem;
  border: solid 2px var(--vp-local-search-result-border);
  outline: none;
}

.result > div {
  margin: 12px;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 767px) {
  .result > div {
    margin: 8px;
  }
}

.titles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: relative;
  z-index: 1001;
  padding: 2px 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.title.main {
  font-weight: 500;
}

.title-icon {
  opacity: 1;
  font-weight: 500;
}

.title svg {
  opacity: 0.5;
}

.result.selected {
  --vp-local-search-result-bg: var(--vp-local-search-result-selected-bg);
  border-color: var(--vp-local-search-result-selected-border);
}

.excerpt-wrapper {
  position: relative;
}

.excerpt {
  opacity: 50%;
  pointer-events: none;
  max-height: 84px;
  overflow: hidden;
  position: relative;
  margin-top: 4px;
  will-change: height;
}

.result.selected .excerpt {
  opacity: 1;
}

.excerpt :deep(*) {
  font-size: 0.8rem !important;
  line-height: 130% !important;
}

.titles :deep(mark),
.excerpt :deep(mark) {
  background-color: var(--vp-local-search-highlight-bg);
  color: var(--vp-local-search-highlight-text);
  border-radius: 2px;
  padding: 0 2px;
}

.excerpt :deep(.vp-code-group) .tabs {
  display: none;
}

.excerpt :deep(.vp-code-group) div[class*="language-"] {
  border-radius: 8px !important;
}

.excerpt > .vp-doc > *:first-child {
  margin-top: 6px !important;
}

.excerpt-gradient-bottom {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(transparent, var(--vp-local-search-result-bg));
  z-index: 1000;
}

.excerpt-gradient-top {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(var(--vp-local-search-result-bg), transparent);
  z-index: 1000;
}

.result.selected .titles,
.result.selected .title-icon {
  color: var(--vp-c-brand-1) !important;
}

.no-results {
  font-size: 0.9rem;
  text-align: center;
  padding: 12px;
}

svg {
  flex: none;
}

.exact-match-button.exact-match-active {
  color: var(--vp-c-brand-1);
  background-color: rgba(var(--vp-c-brand-1), 0.1);
  border-radius: 4px;
}
</style>

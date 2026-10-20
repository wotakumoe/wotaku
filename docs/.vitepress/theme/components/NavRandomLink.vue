<script setup lang="ts">
import { Dice5 } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted } from 'vue'
import type { RandomLinkPage } from '../../plugins/urlSearchPlugin'
import {
  disabledPages,
  ensureDisabledPagesLoaded,
  normalizePageId
} from '../randomLinksState'

const ICON_SIZE = 18
const ICON_STROKE = 2
const RANDOM_LINKS_URL = '/random-links.json'

let pages: RandomLinkPage[] | null = null
let pagesPromise: Promise<RandomLinkPage[]> | null = null
let idleHandle: number | undefined

function loadPages() {
  if (pages) return Promise.resolve(pages)
  if (pagesPromise) return pagesPromise

  pagesPromise = fetch(RANDOM_LINKS_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then((data: RandomLinkPage[]) => {
      pages = data.filter(
        (page) =>
          !!page &&
          typeof page.pageId === 'string' &&
          Array.isArray(page.links)
      )
      return pages
    })
    .catch(() => {
      pages = []
      return pages
    })
    .finally(() => {
      pagesPromise = null
    })

  return pagesPromise
}

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function enabledLinks() {
  const disabled = disabledPages.value
  const hrefs = new Set<string>()

  for (const page of pages ?? []) {
    if (disabled.has(normalizePageId(page.pageId))) continue
    for (const href of page.links) {
      if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
        hrefs.add(href)
      }
    }
  }

  return [...hrefs]
}

function openRandom() {
  const tab = window.open('about:blank', '_blank')
  if (!tab) return
  tab.opener = null

  const links = enabledLinks()
  if (links.length) {
    tab.location.replace(pick(links))
    return
  }

  loadPages().then(() => {
    const available = enabledLinks()
    if (available.length) {
      tab.location.replace(pick(available))
    } else {
      tab.close()
    }
  })
}

onMounted(() => {
  ensureDisabledPagesLoaded()

  const preload = () => {
    ensureDisabledPagesLoaded()
    void loadPages()
  }

  if ('requestIdleCallback' in window) {
    idleHandle = window.requestIdleCallback(preload, { timeout: 5000 })
  } else {
    idleHandle = window.setTimeout(preload, 2000)
  }
})

onBeforeUnmount(() => {
  if (idleHandle === undefined) return
  if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle)
  else clearTimeout(idleHandle)
})
</script>

<template>
  <button
    type="button"
    class="nav-action-btn"
    aria-label="Open a random link in a new tab"
    title="Random links"
    @click="openRandom"
    @pointerenter="loadPages"
    @focus="loadPages"
  >
    <Dice5 :size="ICON_SIZE" :stroke-width="ICON_STROKE" aria-hidden="true" />
  </button>
</template>

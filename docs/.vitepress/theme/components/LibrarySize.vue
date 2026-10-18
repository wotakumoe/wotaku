<script setup lang="ts">

import { onMounted, ref } from 'vue'

const props = defineProps<{ name: string }>()

const LIBRARY_URL = 'https://library-sizes.duckling.workers.dev/'

interface Entry {
  size: string
  updated: string
}
type Library = {
  anime: Record<string, Entry>
  manga: Record<string, Entry>
  donghua: Record<string, Entry>
}

// One shared request per page, regardless of how many markers are used.
let pending: Promise<Library> | null = null

function load(): Promise<Library> {
  if (!pending) {
    pending = fetch(LIBRARY_URL)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .catch(() => ({ anime: {}, manga: {}, donghua: {} }) as Library)
  }
  return pending
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function lookup(lib: Library, name: string): string | undefined {
  const wanted = normalize(name)
  for (const section of [lib.manga, lib.anime, lib.donghua]) {
    for (const [site, entry] of Object.entries(section ?? {})) {
      if (normalize(site) === wanted) return entry.size
    }
  }
  return undefined
}

const size = ref('')

onMounted(async () => {
  size.value = lookup(await load(), props.name) ?? ''
})
</script>

<template>
  <span class="library-size">{{ size }}</span>
</template>

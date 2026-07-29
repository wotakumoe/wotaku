<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  urlSearchMode: boolean
  urlTotalPages: number
  urlCurrentPage: number
  urlPageList: (number | '…')[]
  normalTotalPages: number
  normalCurrentPage: number
  normalPageList: (number | '…')[]
}>()

const emit = defineEmits<{
  goToUrlPage: [page: number]
  goToNormalPage: [page: number]
}>()
</script>

<template>
  <nav
    class="url-pagination"
    aria-label="Search result pages"
  >
    <div
      v-if="(urlSearchMode
      ? urlTotalPages
      : normalTotalPages) > 1"
      class="url-pagination-segment"
    >
      <button
        type="button"
        class="url-page-btn url-page-nav"
        :disabled="(urlSearchMode
        ? urlCurrentPage
        : normalCurrentPage) <= 1"
        aria-label="Previous page"
        @click="urlSearchMode
        ? emit('goToUrlPage', urlCurrentPage - 1)
        : emit('goToNormalPage', normalCurrentPage - 1)"
      >
        <ChevronRight
          :size="14"
          stroke-width="2"
          style="transform: rotate(180deg)"
        />
      </button>

      <template
        v-for="(p, pi) in urlSearchMode ? urlPageList : normalPageList"
        :key="pi"
      >
        <span v-if="p === '…'" class="url-page-ellipsis">…</span>
        <button
          v-else
          type="button"
          class="url-page-btn"
          :class="{
            active: p === (urlSearchMode
              ? urlCurrentPage
              : normalCurrentPage)
          }"
          :aria-current="p === (urlSearchMode
            ? urlCurrentPage
            : normalCurrentPage)
          ? 'page'
          : undefined"
          @click="urlSearchMode
          ? emit('goToUrlPage', p as number)
          : emit('goToNormalPage', p as number)"
        >
          {{ p }}
        </button>
      </template>

      <button
        type="button"
        class="url-page-btn url-page-nav"
        :disabled="(urlSearchMode
        ? urlCurrentPage
        : normalCurrentPage) >=
        (urlSearchMode
          ? urlTotalPages
          : normalTotalPages)"
        aria-label="Next page"
        @click="urlSearchMode
        ? emit('goToUrlPage', urlCurrentPage + 1)
        : emit('goToNormalPage', normalCurrentPage + 1)"
      >
        <ChevronRight :size="14" stroke-width="2" />
      </button>
    </div>
  </nav>
</template>

<style>
.url-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto !important;
}

.url-pagination:has(.url-pagination-segment) {
  padding-top: 8px;
}

.url-pagination-segment {
  display: flex;
  align-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  overflow: hidden;
  background: transparent;
}

.url-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  border-radius: 0;
}

.url-page-btn + .url-page-btn,
.url-page-ellipsis + .url-page-btn,
.url-page-btn + .url-page-ellipsis {
  border-left: 1px solid var(--vp-c-divider);
}

.url-page-btn:hover:not(:disabled):not(.active) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.url-page-btn.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  font-weight: 500;
  cursor: default;
}

.url-page-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  background: transparent;
}

.url-page-nav {
  padding: 0 6px;
}

.url-page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  user-select: none;
  background: transparent;
}
</style>

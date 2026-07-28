<script setup lang="ts">
import { ArrowRight, Globe, LocateOff, Regex, X } from 'lucide-vue-next'
import { searchHistory, type SearchHistoryEntry } from '../../searchState'
import type { SearchSortMode } from '../../searchState'

defineProps<{
  searchMotionDiv: string | object
  emptyStateMotion: Record<string, unknown>
  filterText: string
}>()

const emit = defineEmits<{
  applyHistory: [entry: SearchHistoryEntry]
  removeFromHistory: [index: number]
}>()
</script>

<template>
  <component
    :is="searchMotionDiv"
    v-if="!filterText && searchHistory.length > 0"
    class="history-list"
    v-bind="emptyStateMotion"
  >
    <div class="history-header">
      <span>Recent searches</span>
      <button
        class="history-clear-all"
        title="Clear all history"
        @click.stop="searchHistory = []"
      >
        <X :size="16" stroke-width="2" />
      </button>
    </div>
    <ul class="history-items">
      <li
        v-for="(entry, index) in searchHistory"
        :key="index"
        class="history-item"
        @click="emit('applyHistory', entry)"
      >
        <div class="history-main">
          <span class="history-query">{{ entry.query }}</span>
          <template v-if="entry.path?.length">
            <ArrowRight :size="13" stroke-width="1.5" class="history-arrow" />
            <template v-for="(seg, si) in entry.path" :key="si">
              <span
                class="history-path-seg"
                :class="{
                  'history-path-end': si === entry.path.length - 1,
                  'history-path-only': entry.path.length === 1
                }"
                v-html="seg"
              />
              <span v-if="si < entry.path.length - 1" class="history-path-sep">›</span>
            </template>
          </template>
        </div>
        <component
          :is="entry.mode === 'exact' ? Regex : entry.mode === 'fuzzy' ? LocateOff : Globe"
          :size="14"
          stroke-width="2"
          class="history-mode-icon"
        />
        <button
          class="history-remove"
          :title="`Remove '${entry.query}' from history`"
          @click.stop="emit('removeFromHistory', index)"
        >
          <X :size="16" stroke-width="2" />
        </button>
      </li>
    </ul>
  </component>
</template>

<style>
.history-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4px 0;
}

.history-header {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  padding: 4px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-clear-all {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  opacity: 0.7;
  transition: color 0.15s;
}

.history-clear-all:hover {
  color: var(--vp-c-text-1);
  opacity: 1;
}

.history-items {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.history-item:hover {
  background: var(--vp-c-default-soft);
}

.history-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.history-query {
  flex-shrink: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.history-arrow {
  flex-shrink: 0;
  opacity: 0.5;
  color: var(--vp-c-text-3);
}

.history-path-seg {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.history-path-sep {
  flex-shrink: 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

.history-path-end {
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.history-path-only {
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-mode-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  opacity: 0.7;
}

.history-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  opacity: 0.7;
  transition: color 0.15s;
}

.history-remove:hover {
  color: var(--vp-c-text-1);
  opacity: 1;
}
</style>

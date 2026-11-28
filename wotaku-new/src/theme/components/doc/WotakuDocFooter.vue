<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../../composables/base/data'
import { usePrevNext } from '../../composables/base/prev-next'
import WotakuLink from '../link/WotakuLink.vue'
import WotakuDocFooterLastUpdated from './WotakuDocFooterLastUpdated.vue'

const { theme, page } = useData()
const control = usePrevNext()

const hasLastUpdated = computed(() => page.value.lastUpdated)
const showFooter = computed(
  () => hasLastUpdated.value || control.value.prev || control.value.next
)
</script>

<template>
  <footer v-if="showFooter" class="WotakuDocFooter">
    <slot name="doc-footer-before" />

    <div v-if="hasLastUpdated" class="edit-info">
      <div v-if="hasLastUpdated" class="last-updated">
        <WotakuDocFooterLastUpdated />
      </div>
    </div>

    <nav
      v-if="control.prev?.link || control.next?.link"
      class="prev-next"
      aria-labelledby="doc-footer-aria-label"
    >
      <span class="visually-hidden" id="doc-footer-aria-label">Pager</span>

      <div class="pager">
        <WotakuLink
          v-if="control.prev?.link"
          class="pager-link prev"
          :href="control.prev.link"
        >
          <span class="desc" v-html="theme.docFooter?.prev || 'Previous page'"></span>
          <span class="title" v-html="control.prev.text"></span>
        </WotakuLink>
      </div>
      <div class="pager">
        <WotakuLink
          v-if="control.next?.link"
          class="pager-link next"
          :href="control.next.link"
        >
          <span class="desc" v-html="theme.docFooter?.next || 'Next page'"></span>
          <span class="title" v-html="control.next.text"></span>
        </WotakuLink>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.WotakuDocFooter {
  margin-top: 64px;
}

.edit-info {
  padding-bottom: 18px;
}

@media (min-width: 640px) {
  .edit-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
  }
}

.edit-link-button {
  display: flex;
  align-items: center;
  border: 0;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--wotaku-c-brand-1);
  transition: color 0.25s;
}

.edit-link-button:hover {
  color: var(--wotaku-c-brand-2);
}

.edit-link-icon {
  margin-right: 8px;
}

.prev-next {
  border-top: 1px solid var(--wotaku-c-divider);
  padding-top: 24px;
  display: grid;
  grid-row-gap: 8px;
}

@media (min-width: 640px) {
  .prev-next {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 16px;
  }
}

.pager-link {
  display: block;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 8px;
  padding: 11px 16px 13px;
  width: 100%;
  height: 100%;
  transition: border-color 0.25s;
}

.pager-link:hover {
  border-color: var(--wotaku-c-brand-1);
}

.pager-link.next {
  margin-left: auto;
  text-align: right;
}

.desc {
  display: block;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--wotaku-c-text-2);
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--wotaku-c-link);
  transition: color 0.25s;
}
</style>

<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import type { ButtonTranslations } from '../../../shared/types/local-search'
import { Search } from 'lucide-vue-next'
import { createSearchTranslate } from '../../shared/search/translation'

const defaultTranslations: { button: ButtonTranslations } = {
  button: {
    buttonText: 'Search',
    buttonAriaLabel: 'Search'
  }
}

const translate = createSearchTranslate(defaultTranslations)
</script>

<template>
  <button
    type="button"
    :aria-label="translate('button.buttonAriaLabel')"
    aria-keyshortcuts="/ control+k meta+k"
    class="nav-search-button"
  >
    <span class="nav-search-content">
      <Search
        :size="15"
        stroke-width="1.375"
        aria-hidden="true"
        class="inline -translate-y-0.25 scale-125 sm:scale-100"
      />
      <span class="nav-search-label">{{ translate('button.buttonText') }}</span>
    </span>
    <kbd class="nav-search-shortcut" aria-hidden="true" />
  </button>
</template>

<style scoped>
.nav-search-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: auto;
  padding: 2px 12px;
  border: none;
  border-radius: 8px;
  color: var(--wotaku-c-text-2);
}

.nav-search-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nav-search-button:focus-visible {
  outline: 2px solid var(--wotaku-c-brand-1);
  outline-offset: 2px;
}

.nav-search-label {
  font-size: 13px;
}

.nav-search-shortcut {
  padding: 4px 6px;
  border: 1px solid var(--wotaku-c-divider);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  color: var(--wotaku-c-text-2);
}

.nav-search-shortcut::after {
  /*rtl:ignore*/
  direction: ltr;
  content: 'Ctrl K';
}

:global(.mac) .nav-search-shortcut::after {
  content: '\2318  K';
}
</style>

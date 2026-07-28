<script setup lang="ts">
import { ArrowLeft, ArrowLeftToLine, ArrowRight, ArrowRightToLine } from 'lucide-vue-next'
import type { FooterTranslations } from './types'

defineProps<{
  searchMotionDiv: string | object
  footerMotion: Record<string, unknown>
  translate: (key: string) => string
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <component
    :is="searchMotionDiv"
    class="search-keyboard-shortcuts"
    v-bind="footerMotion"
  >
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
      <kbd :aria-label="translate('modal.footer.switchTabsKeyAriaLabel')">
        <ArrowLeftToLine class="navigate-icon" :size="14" stroke-width="2" />
      </kbd>
      <kbd :aria-label="translate('modal.footer.switchTabsKeyAriaLabel')">
        <ArrowRightToLine class="navigate-icon" :size="14" stroke-width="2" />
      </kbd>
      {{ translate('modal.footer.switchTabsText') }}
    </span>
    <span>
      <kbd :aria-label="translate('modal.footer.switchPagesKeyAriaLabel')">
        <ArrowLeft class="navigate-icon" :size="14" stroke-width="2" />
      </kbd>
      <kbd :aria-label="translate('modal.footer.switchPagesKeyAriaLabel')">
        <ArrowRight class="navigate-icon" :size="14" stroke-width="2" />
      </kbd>
      {{ translate('modal.footer.switchPagesText') }}
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
  </component>
</template>

<style>
.search-keyboard-shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  user-select: none;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .search-keyboard-shortcuts {
    display: none;
  }
}

.search-keyboard-shortcuts span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-keyboard-shortcuts kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-size: 0.7rem;
  font-family: inherit;
  color: var(--vp-c-text-2);
  line-height: 1;
  min-width: 20px;
}

.navigate-icon {
  flex: none;
}
</style>

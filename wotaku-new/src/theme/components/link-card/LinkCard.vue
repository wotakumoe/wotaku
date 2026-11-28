<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { DECK_MINI_KEY } from '../../shared/link-card/deck'
import { renderCardIcon } from '../../shared/link-card/icon-markup'

const props = withDefaults(
  defineProps<{
    href: string
    title: string
    icon?: string
    download?: boolean
    mini?: boolean
  }>(),
  {
    mini: undefined
  }
)

const deckMini = inject(DECK_MINI_KEY, ref(false))
const isMini = computed(() => props.mini ?? deckMini.value)

const isImageIcon = computed(() => {
  const icon = props.icon

  if (!icon) return false

  return icon.startsWith('/') || icon.startsWith('http') || icon.startsWith('data:')
})
</script>

<template>
  <a
    :href="props.href"
    :aria-label="props.title"
    :download="props.download ? '' : undefined"
    class="wotaku-card"
    :class="{ 'wotaku-card--mini': isMini }"
  >
    <article
      class="wotaku-card-container"
      :class="{
        'wotaku-card-container--no-details': !$slots.default,
        'wotaku-card-container--mini': isMini
      }"
    >
      <div v-if="props.icon" class="wotaku-card-icon">
        <img
          v-if="isImageIcon"
          class="wotaku-card-icon-img no-zoom"
          :src="props.icon"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span v-else v-html="renderCardIcon(props.icon)" />
      </div>
      <h3 class="wotaku-card-title">{{ props.title }}</h3>
      <p v-if="$slots.default" class="wotaku-card-details"><slot /></p>
    </article>
  </a>
</template>

<style scoped>
.wotaku-card,
.wotaku-card:hover,
.wotaku-card:focus,
.wotaku-card:visited {
  display: block;
  border: 2px solid #3d3d3d;
  border-radius: var(--radius-xl);
  height: 100%;
  background-color: var(--wotaku-c-bg-soft);
  transition:
    border-color 0.25s,
    background-color 0.25s;
  text-decoration: none !important;
  color: inherit !important;
}

.wotaku-card:hover {
  border-color: var(--wotaku-c-brand-1, #1473e6);
}

.wotaku-card-container {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.wotaku-card-container--no-details {
  justify-content: center;
}

.wotaku-card-container--no-details .wotaku-card-title {
  margin-bottom: 0;
}

.wotaku-card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--wotaku-c-default-soft);
  width: 40px;
  height: 40px;
  font-size: 22px;
  transition: background-color 0.25s;
}

.wotaku-card-icon-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wotaku-card-title {
  margin: 0 0 8px;
  padding: 0;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--wotaku-c-text-1);
  border: none;
  letter-spacing: 0;
}

.wotaku-card-details {
  margin: 0;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--wotaku-c-text-2);
}

.wotaku-card-container--mini {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.wotaku-card-container--mini.wotaku-card-container--no-details {
  justify-content: flex-start;
}

.wotaku-card--mini .wotaku-card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
  font-size: 18px;
  flex-shrink: 0;
}

.wotaku-card--mini .wotaku-card-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
}

.wotaku-card--mini .wotaku-card-details {
  display: none;
}
</style>

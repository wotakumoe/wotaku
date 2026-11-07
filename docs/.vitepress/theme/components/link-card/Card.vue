<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { DECK_MINI_KEY } from './deck'
import { renderCardIcon } from './iconMarkup'

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
  return icon.startsWith('/') || icon.startsWith('http') ||
    icon.startsWith('data:')
})
</script>

<template>
  <a
    role="article"
    :href="props.href"
    :download="props.download ? '' : undefined"
    class="vp-card"
    :class="{ 'vp-card--mini': isMini }"
  >
    <article
      class="vp-card-container"
      :class="{
        'vp-card-container--no-details': !$slots.default,
        'vp-card-container--mini': isMini
      }"
    >
      <div
        v-if="props.icon"
        class="vp-card-icon"
      >
        <img
          v-if="isImageIcon"
          class="vp-card-icon-img no-zoom"
          :src="props.icon"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span v-else v-html="renderCardIcon(props.icon)" />
      </div>
      <h3 class="vp-card-title">{{ props.title }}</h3>
      <p v-if="$slots.default" class="vp-card-details"><slot /></p>
    </article>
  </a>
</template>

<style scoped>
.vp-card,
.vp-card:hover,
.vp-card:focus,
.vp-card:visited {
  display: block;
  border: 2px solid #3d3d3d;
  border-radius: var(--radius-xl);
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-decoration: none !important;
  color: inherit !important;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1, #1473e6);
}

.vp-card-container {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.vp-card-container--no-details {
  justify-content: center;
}

.vp-card-container--no-details .vp-card-title {
  margin-bottom: 0;
}

.vp-card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--vp-c-default-soft);
  width: 40px;
  height: 40px;
  font-size: 22px;
  transition: background-color 0.25s;
}

.vp-card-icon-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.vp-card-title {
  margin: 0 0 8px;
  padding: 0;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border: none;
  letter-spacing: 0;
}

.vp-card-details {
  margin: 0;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vp-card-container--mini {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.vp-card-container--mini.vp-card-container--no-details {
  justify-content: flex-start;
}

.vp-card--mini .vp-card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
  font-size: 18px;
  flex-shrink: 0;
}

.vp-card--mini .vp-card-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
}

.vp-card--mini .vp-card-details {
  display: none;
}
</style>

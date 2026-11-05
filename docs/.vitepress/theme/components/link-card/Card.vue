<script setup lang="ts">
import { renderCardIcon } from './iconMarkup'

const props = defineProps<{
  href: string
  title: string
  icon?: string
  download?: boolean
}>()
</script>

<template>
  <a
    role="article"
    :href="props.href"
    :download="props.download ? '' : undefined"
    class="vp-card"
  >
    <article
      class="vp-card-container"
      :class="{ 'vp-card-container--no-details': !$slots.default }"
    >
      <div
        v-if="props.icon"
        class="vp-card-icon"
        v-html="renderCardIcon(props.icon)"
      />
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
  background-color: var(--vp-c-default-soft);
  width: 40px;
  height: 40px;
  font-size: 22px;
  transition: background-color 0.25s;
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
</style>

<script setup lang="ts">
const props = defineProps<{
  href: string
  title: string
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
    <article class="vp-card-container">
      <h3 class="vp-card-title">{{ props.title }}</h3>
      <p class="vp-card-details"><slot /></p>
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
  border-radius: 12px;
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
<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const open = ref(false)

const slug = computed(() => {
  const text = props.title || 'Details'
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
})
</script>

<template>
  <details class="details custom-block" :open="open || undefined" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary>
      <span v-if="open" class="i-iconoir-nav-arrow-down collapsible-icon" />
      <span v-else class="i-iconoir-nav-arrow-right collapsible-icon" />
      <h3 :id="slug" class="collapsible-title">
        <a :href="`#${slug}`" class="header-anchor" aria-hidden="true"></a>
        {{ title || 'Details' }}
      </h3>
    </summary>
    <slot />
  </details>
</template>

<style scoped>
summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.4em;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

.collapsible-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.collapsible-title {
  margin: 0;
  padding: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  letter-spacing: inherit;
  border: none;
  text-decoration: none;
  display: inline;
}

/* Hide the anchor icon VitePress would normally show on hover */
.collapsible-title .header-anchor {
  display: none;
}
</style>
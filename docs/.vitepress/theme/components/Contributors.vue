<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { contribs, type Contributors } from '../../credits'

const contributors = computed(() => contribs || ({} as Contributors))
</script>

<template>
  <h1 class="text-center">Core Team</h1>
  <hr />
  <div class="contrib-grid">
    <a
      v-for="c of contributors.core"
      :key="c.name"
      :href="c.site || undefined"
      :target="c.site ? '_blank' : undefined"
      class="contrib-card"
      :class="{ 'no-link': !c.site }"
    >
      <img
        :src="c.avatar"
        :alt="c.name"
        width="36"
        height="36"
        loading="lazy"
        decoding="async"
        class="contrib-avatar"
      />
      <span class="contrib-name">{{ c.name }}</span>
    </a>
  </div>

  <h1 class="mt-section text-center">Contributors</h1>
  <hr />
  <div class="contrib-grid">
    <a
      v-for="c of contributors.contributors"
      :key="c.name"
      :href="c.site || undefined"
      :target="c.site ? '_blank' : undefined"
      class="contrib-card"
      :class="{ 'no-link': !c.site }"
    >
      <img
        :src="c.avatar"
        :alt="c.name"
        width="36"
        height="36"
        loading="lazy"
        decoding="async"
        class="contrib-avatar"
      />
      <span class="contrib-name">{{ c.name }}</span>
    </a>
  </div>

  <h1 class="mt-section text-center">Special Thanks to</h1>
  <hr />
  <div class="contrib-grid">
    <a
      v-for="c of contributors.special"
      :key="c.name"
      :href="c.site || undefined"
      :target="c.site ? '_blank' : undefined"
      class="contrib-card"
      :class="{ 'no-link': !c.site }"
    >
      <img
        :src="c.avatar"
        :alt="c.name"
        width="36"
        height="36"
        loading="lazy"
        decoding="async"
        class="contrib-avatar"
      />
      <span class="contrib-name">{{ c.name }}</span>
    </a>
  </div>
</template>

<style scoped>
.contrib-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
}

.mt-section {
  margin-top: 30px;
}

.contrib-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 10px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: border-color 0.25s;
  cursor: pointer;
}

.contrib-card:hover {
  border-color: var(--vp-c-brand-1, #3c8dff);
}

.contrib-card.no-link {
  cursor: default;
}

.contrib-card.no-link:hover {
  border-color: var(--vp-c-bg-soft);
}

.contrib-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.contrib-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}
</style>

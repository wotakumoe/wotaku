<!--
  All Rights Reserved

  Copyright (c) 2025 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->
<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <a
    v-if="frontmatter.hero.announcement"
    :href="frontmatter.hero.announcement.link"
    class="mb-3 inline-flex items-center rounded-lg bg-[var(--vp-c-default-soft)] px-4 py-1 text-sm font-semibold"
  >
    {{ frontmatter.hero.announcement.title }}
  </a>
</template>

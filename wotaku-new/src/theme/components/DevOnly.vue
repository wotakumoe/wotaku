<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
defineProps<{
  fallback?: string
}>()

const isDev = import.meta.env.DEV
</script>

<template>
  <div v-if="isDev" class="wotaku-doc wotaku-doc-content">
    <slot />
  </div>
  <div v-else-if="fallback" class="wotaku-doc wotaku-doc-content" v-html="fallback"></div>
</template>

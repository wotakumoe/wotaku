<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import WotakuDocAsideOutline from './WotakuDocAsideOutline.vue'
</script>

<template>
  <div class="WotakuDocAside">
    <slot name="aside-top" />

    <slot name="aside-outline-before" />
    <WotakuDocAsideOutline />
    <slot name="aside-outline-after" />

    <div class="spacer" />

    <slot name="aside-bottom" />
  </div>
</template>

<style scoped>
.WotakuDocAside {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.spacer {
  flex-grow: 1;
}
</style>

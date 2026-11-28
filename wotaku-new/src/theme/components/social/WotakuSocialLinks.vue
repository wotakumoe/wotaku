<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import type * as DefaultTheme from '@/shared/types/default-theme'
import WotakuSocialLink from './WotakuSocialLink.vue'

withDefaults(
  defineProps<{
    links: DefaultTheme.SocialLink[]
    me?: boolean
  }>(),
  {
    me: true
  }
)
</script>

<template>
  <div class="WotakuSocialLinks">
    <WotakuSocialLink
      v-for="{ link, icon, ariaLabel } in links"
      :key="link"
      :icon
      :link
      :ariaLabel
      :me
    />
  </div>
</template>

<style scoped>
.WotakuSocialLinks {
  display: flex;
  justify-content: center;
}
</style>

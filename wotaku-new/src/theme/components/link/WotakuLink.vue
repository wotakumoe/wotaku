<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import { computed } from 'vue'
import { normalizeLink } from '../../shared/base/utils'
import { EXTERNAL_URL_RE } from '../../../shared/client'

const props = defineProps<{
  tag?: string
  href?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))
const isExternal = computed(
  () => (props.href && EXTERNAL_URL_RE.test(props.href)) || props.target === '_blank'
)
</script>

<template>
  <component
    :is="tag"
    class="WotakuLink"
    :class="{
      link: href,
      'wotaku-external-link-icon': isExternal,
      'no-icon': noIcon
    }"
    :href="href ? normalizeLink(href) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
  >
    <slot />
  </component>
</template>

<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { Tooltip } from 'floating-vue'
import { withBase } from '@/theme/shared/client'

defineProps<{
  title: string
  link: string
  target?: string
  description: string
}>()
</script>

<template>
  <span class="sr-only">{{ title }}</span>
  <ClientOnly>
    <Tooltip class="inline-block" theme="twoslash">
      <a
        :href="withBase(link)"
        :target
        class="bg-$wotaku-c-default-soft hover:bg-$wotaku-c-brand-soft/25 rounded px2 py1 decoration-none!"
      >
        {{ title }}
      </a>

      <template #popper>
        <a :href="withBase(link)" :target flex flex-col p4 gap-2 max-w-100>
          <div flex gap-2>
            <div>
              {{ title }}
            </div>
            <div flex-grow />
          </div>
          <div op75 text-sm>
            {{ description }}
          </div>
        </a>
      </template>
    </Tooltip>
  </ClientOnly>
</template>

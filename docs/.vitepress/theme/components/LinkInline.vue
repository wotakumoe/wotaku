<script setup lang="ts">
import { Tooltip } from 'floating-vue'
import { withBase } from 'vitepress'

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
        class="bg-$vp-c-default-soft hover:bg-$vp-c-brand-soft/25 rounded px2 py1 decoration-none!"
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

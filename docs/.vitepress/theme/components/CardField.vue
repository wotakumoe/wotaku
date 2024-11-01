<script setup lang="ts">
defineProps<{
  icon: string
  iconClass?: string
}>()
</script>

<template>
  <div class="g-[12px] mb-[8px] flex items-center">
    <span class="flex items-center">
      <span class="text-2xl" :class="[icon, iconClass]" />
      <div class="ml-2 text-sm text-[var(--vp-c-text-2)]">
        <slot />
      </div>
    </span>
  </div>
</template>

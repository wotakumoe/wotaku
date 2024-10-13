<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    icon: string;
  }>(),
  {
    title: "Tooltip",
    icon: "i-lucide-info",
  },
);
</script>

<template>
  <VTooltip theme="info-tooltip">
    <button
      class="w-7 h-7 rounded-full bg-$vp-c-default-soft hover:bg-$vp-c-default-soft/40 text-primary border-$vp-c-default-soft hover:border-primary select-none rounded border-2 border-solid font-bold transition-all duration-300">
      <div :class="icon" />
    </button>

    <template #popper>
      <div class="p-4 max-w-xs border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 border-2 border-solid">
        <h3 class="text-lg font-semibold text-$vp-c-text-1 mb-2" v-text="title" />
        <p class="text-sm text-$vp-c-text-2">
          <slot />
        </p>
      </div>
    </template>
  </VTooltip>
</template>

<style>
.v-popper__popper {
  --uno: z-10;
}

.v-popper {
  display: inline-flex !important;
}
</style>

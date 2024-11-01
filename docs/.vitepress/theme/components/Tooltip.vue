<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    icon: string
  }>(),
  {
    title: 'Info',
    icon: 'i-material-symbols-info-i'
  }
)
</script>

<template>
  <VTooltip theme="info-tooltip">
    <button
      class="bg-$vp-c-default-soft hover:bg-$vp-c-default-soft/40 text-primary border-$vp-c-default-soft hover:border-primary ml-2 h-7 w-7 select-none rounded rounded-full border-2 border-solid font-bold transition-all duration-300">
      <div :class="icon" />
    </button>

    <template #popper>
      <div class="border-$vp-c-divider bg-$vp-c-bg-alt b-rd-4 max-w-lg border-2 border-solid p-4">
        <h3 class="text-$vp-c-text-1 mb-2 text-lg font-semibold" v-text="title" />
        <p class="text-$vp-c-text-2 text-sm">
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

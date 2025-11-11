<script setup lang="ts">
const props = defineProps<{
  title?: string
  disabled?: boolean
}>()
</script>

<template>
  <h3
    class="VPNolebaseEnhancedReadabilitiesMenuTitle"
    :class="{ disabled: !!props.disabled }"
    text="[14px] $vp-nolebase-enhanced-readabilities-menu-text-color"
    inline-flex
    select-none
    items-center
    align-middle
    font-medium
  >
    <slot name="icon" />
    <span v-if="props.title">{{ props.title }}</span>
    <slot />
  </h3>
</template>

<style scoped less>
.VPNolebaseEnhancedReadabilitiesMenuTitle {
  &.disabled {
    opacity: 0.5;
  }
}
</style>

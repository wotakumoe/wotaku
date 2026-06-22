<script setup lang="ts">
import MenuTitle from './MenuTitle.vue'
</script>

<template>
  <div space-y-2>
    <MenuTitle title="Layout Switch" aria-label="Layout Switch" disabled>
      <template #icon>
        <slot i-icon-park-outline:layout-one mr-1 aria-hidden="true" />
      </template>
    </MenuTitle>
    <div
      border="1 red/50 solid"
      bg="red/30"
      flex
      items-center
      rounded-lg
      p-2
      opacity-50
    >
      <span text-xs>No available layout can be switched in mobile screen.</span>
    </div>
  </div>
</template>

<template>
  <div class="vp-grid">
    <slot />
  </div>
</template>

<style scoped>
.vp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  gap: 8px;
}

@media (min-width: 640px) {
  .vp-grid {
    gap: 8px;
  }
}

@media (min-width: 768px) {
  .vp-grid {
    gap: 8px;
  }
}
</style>
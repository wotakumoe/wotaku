<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
    type?: "info" | "tip" | "warning" | "danger";
    link: string;
    icon?: string;
  }>(),
  { icon: "i-octicon-link-external-16", type: "tip" },
);
</script>

<template>
  <a
    target="_blank"
    :href="link"
    :class="type"
    class="VButton px4 py3 rounded-md block mt2 flex items-center gap2">
    <div :class="icon" />
    <slot>{{ text }}</slot>
  </a>
</template>

<style scoped>
.VButton.info {
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
}

.VButton.tip {
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.VButton.warning {
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.VButton.danger {
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}
</style>

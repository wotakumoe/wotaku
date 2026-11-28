<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
defineProps<{
  active: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    class="WotakuNavBarHamburger"
    :class="{ active }"
    aria-label="mobile navigation"
    :aria-expanded="active"
    aria-controls="WotakuNavScreen"
    @click="$emit('click')"
  >
    <span class="container">
      <span class="top" />
      <span class="middle" />
      <span class="bottom" />
    </span>
  </button>
</template>

<style scoped>
.WotakuNavBarHamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: var(--wotaku-nav-height);
}

@media (min-width: 768px) {
  .WotakuNavBarHamburger {
    display: none;
  }
}

.container {
  position: relative;
  width: 16px;
  height: 14px;
  overflow: hidden;
}

.WotakuNavBarHamburger:hover .top {
  top: 0;
  left: 0;
  transform: translateX(4px);
}
.WotakuNavBarHamburger:hover .middle {
  top: 6px;
  left: 0;
  transform: translateX(0);
}
.WotakuNavBarHamburger:hover .bottom {
  top: 12px;
  left: 0;
  transform: translateX(8px);
}

.WotakuNavBarHamburger.active .top {
  top: 6px;
  transform: translateX(0) rotate(225deg);
}
.WotakuNavBarHamburger.active .middle {
  top: 6px;
  transform: translateX(16px);
}
.WotakuNavBarHamburger.active .bottom {
  top: 6px;
  transform: translateX(0) rotate(135deg);
}

.WotakuNavBarHamburger.active:hover .top,
.WotakuNavBarHamburger.active:hover .middle,
.WotakuNavBarHamburger.active:hover .bottom {
  background-color: var(--wotaku-c-text-2);
  transition:
    top 0.25s,
    background-color 0.25s,
    transform 0.25s;
}

.top,
.middle,
.bottom {
  position: absolute;
  width: 16px;
  height: 2px;
  background-color: var(--wotaku-c-text-1);
  transition:
    top 0.25s,
    background-color 0.5s,
    transform 0.25s;
}

.top {
  top: 0;
  left: 0;
  transform: translateX(0);
}
.middle {
  top: 6px;
  left: 0;
  transform: translateX(8px);
}
.bottom {
  top: 12px;
  left: 0;
  transform: translateX(4px);
}
</style>

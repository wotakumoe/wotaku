<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { ref, watchPostEffect } from 'vue'
import { useLayout } from '../../composables/base/layout'
import WotakuNavBarHamburger from './WotakuNavBarHamburger.vue'
import WotakuNavBarSearch from './NavBarSearch.vue'
import WotakuNavBarTitle from './WotakuNavBarTitle.vue'

const props = defineProps<{
  isScreenOpen: boolean
}>()

defineEmits<{
  (e: 'toggle-screen'): void
}>()

const { y } = useWindowScroll()
const { isHome, hasSidebar } = useLayout()

const classes = ref<Record<string, boolean>>({})

watchPostEffect(() => {
  classes.value = {
    'has-sidebar': hasSidebar.value,
    home: isHome.value,
    top: y.value === 0,
    'screen-open': props.isScreenOpen
  }
})
</script>

<template>
  <div class="WotakuNavBar" :class="classes">
    <div class="wrapper">
      <div class="container">
        <div class="title">
          <WotakuNavBarTitle>
            <template #nav-bar-title-before
              ><slot name="nav-bar-title-before"
            /></template>
            <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
          </WotakuNavBarTitle>
        </div>

        <div class="content">
          <div class="content-body">
            <slot name="nav-bar-content-before" />
            <WotakuNavBarSearch class="search" />
            <slot name="nav-bar-content-after" />
            <WotakuNavBarHamburger
              class="hamburger"
              :active="isScreenOpen"
              @click="$emit('toggle-screen')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="divider">
      <div class="divider-line" />
    </div>
  </div>
</template>

<style scoped>
.WotakuNavBar {
  position: relative;
  height: var(--wotaku-nav-height);
  pointer-events: none;
  white-space: nowrap;
  transition: background-color 0.25s;
}

.WotakuNavBar.screen-open {
  transition: none;
  background-color: var(--wotaku-nav-bg-color);
  border-bottom: 1px solid var(--wotaku-c-divider);
}

.WotakuNavBar:not(.home) {
  background-color: var(--wotaku-nav-bg-color);
}

@media (min-width: 960px) {
  .WotakuNavBar:not(.home) {
    background-color: transparent;
  }

  .WotakuNavBar:not(.has-sidebar):not(.home.top) {
    background-color: var(--wotaku-nav-bg-color);
  }
}

.wrapper {
  padding: 0 8px 0 24px;
}

@media (min-width: 768px) {
  .wrapper {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .WotakuNavBar.has-sidebar .wrapper {
    padding: 0;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: calc(var(--wotaku-layout-max-width) - 64px);
  height: var(--wotaku-nav-height);
  pointer-events: none;
}

.container > .title,
.container > .content {
  pointer-events: none;
}

.container :deep(*) {
  pointer-events: auto;
}

@media (min-width: 960px) {
  .WotakuNavBar.has-sidebar .container {
    max-width: 100%;
  }
}

.title {
  flex-shrink: 0;
  height: calc(var(--wotaku-nav-height) - 1px);
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .WotakuNavBar.has-sidebar .title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 0 32px;
    width: var(--wotaku-sidebar-width);
    height: var(--wotaku-nav-height);
    background-color: transparent;
  }
}

@media (min-width: 1440px) {
  .WotakuNavBar.has-sidebar .title {
    padding-left: max(32px, calc((100% - (var(--wotaku-layout-max-width) - 64px)) / 2));
    width: calc(
      (100% - (var(--wotaku-layout-max-width) - 64px)) / 2 + var(--wotaku-sidebar-width) -
        32px
    );
  }
}

.content {
  flex-grow: 1;
}

@media (min-width: 960px) {
  .WotakuNavBar.has-sidebar .content {
    position: relative;
    z-index: 1;
    padding-left: var(--wotaku-sidebar-width);
  }

  .WotakuNavBar.has-sidebar .content-body {
    padding-right: 32px;
  }
}

@media (min-width: 1440px) {
  .WotakuNavBar.has-sidebar .content {
    padding-left: calc(
      (100vw - var(--wotaku-layout-max-width)) / 2 + var(--wotaku-sidebar-width)
    );
  }

  .WotakuNavBar.has-sidebar .content-body {
    padding-right: calc((100vw - var(--wotaku-layout-max-width)) / 2 + 32px);
  }
}

.content-body {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: var(--wotaku-nav-height);
  transition: background-color 0.5s;
}

@media (min-width: 960px) {
  .WotakuNavBar:not(.home.top) .content-body {
    position: relative;
    background-color: var(--wotaku-nav-bg-color);
  }

  .WotakuNavBar:not(.has-sidebar):not(.home.top) .content-body {
    background-color: transparent;
  }
}

@media (max-width: 767px) {
  .content-body {
    column-gap: 0.5rem;
  }
}

.menu + .translations::before,
.menu + .appearance::before,
.menu + .social-links::before,
.translations + .appearance::before,
.appearance + .social-links::before {
  margin-right: 8px;
  margin-left: 8px;
  width: 1px;
  height: 24px;
  background-color: var(--wotaku-c-divider);
  content: '';
}

.menu + .appearance::before,
.translations + .appearance::before {
  margin-right: 16px;
}

.appearance + .social-links::before {
  margin-left: 16px;
}

.social-links {
  margin-right: -8px;
}

.divider {
  width: 100%;
  height: 1px;
}

@media (min-width: 960px) {
  .WotakuNavBar.has-sidebar .divider {
    padding-left: var(--wotaku-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .WotakuNavBar.has-sidebar .divider {
    padding-left: calc(
      (100vw - var(--wotaku-layout-max-width)) / 2 + var(--wotaku-sidebar-width)
    );
  }
}

.divider-line {
  width: 100%;
  height: 1px;
  transition: background-color 0.5s;
}

.WotakuNavBar:not(.home) .divider-line {
  background-color: var(--wotaku-c-gutter);
}

@media (min-width: 960px) {
  .WotakuNavBar:not(.home.top) .divider-line {
    background-color: var(--wotaku-c-gutter);
  }

  .WotakuNavBar:not(.has-sidebar):not(.home.top) .divider {
    background-color: var(--wotaku-c-gutter);
  }
}
</style>

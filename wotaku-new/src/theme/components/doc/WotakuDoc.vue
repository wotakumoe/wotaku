<!--
  All Rights Reserved

  Copyright (c) 2026 taskylizard

  All rights reserved. This code and its associated files may not be copied, modified, distributed, sublicensed, or used in any form, in whole or in part, without prior written permission from the copyright holder.
-->

<script setup lang="ts">
import { useRoute } from '@/theme/shared/client'
import { computed } from 'vue'
import { useData } from '../../composables/base/data'
import { useLayout } from '../../composables/base/layout'
import WotakuDocAside from './WotakuDocAside.vue'
import WotakuDocFooter from './WotakuDocFooter.vue'

const { theme } = useData()

const route = useRoute()
const { hasSidebar, hasAside, leftAside } = useLayout()

const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>

<template>
  <div class="WotakuDoc" :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }">
    <slot name="doc-top" />
    <div class="container">
      <div v-if="hasAside" class="aside" :class="{ 'left-aside': leftAside }">
        <div class="aside-curtain" />
        <div class="aside-container">
          <div class="aside-content">
            <WotakuDocAside>
              <template #aside-top><slot name="aside-top" /></template>
              <template #aside-bottom><slot name="aside-bottom" /></template>
              <template #aside-outline-before
                ><slot name="aside-outline-before"
              /></template>
              <template #aside-outline-after
                ><slot name="aside-outline-after"
              /></template>
            </WotakuDocAside>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <slot name="doc-before" />
          <main class="main">
            <Content
              class="wotaku-doc"
              :class="[pageName, theme.externalLinkIcon && 'external-link-icon-enabled']"
            />
          </main>
          <WotakuDocFooter>
            <template #doc-footer-before><slot name="doc-footer-before" /></template>
          </WotakuDocFooter>
          <slot name="doc-after" />
        </div>
      </div>
    </div>
    <slot name="doc-bottom" />
  </div>
</template>

<style scoped>
.WotakuDoc {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .WotakuDoc {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .WotakuDoc {
    padding: 48px 32px 0;
  }

  .WotakuDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .WotakuDoc:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .WotakuDoc .container {
    display: flex;
    justify-content: center;
  }

  .WotakuDoc .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .WotakuDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .WotakuDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(
    var(--wotaku-nav-height) + var(--wotaku-layout-top-height, 0px) +
      var(--wotaku-doc-top-height, 0px) + 48px
  );
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--wotaku-c-bg) 70%);
  pointer-events: none;
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(
    100vh - (var(--wotaku-nav-height) + var(--wotaku-layout-top-height, 0px) + 48px)
  );
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

.WotakuDoc.has-aside .content-container {
  max-width: 688px;
}
</style>

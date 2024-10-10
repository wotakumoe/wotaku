<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import SidebarCard from "./components/SidebarCard.vue";
import AnnouncementPill from "./components/AnnouncementPill.vue";
import NotFoundComponent from "./components/NotFound.vue";
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import Takodachi from "./components/Takodachi.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-top>
      <Takodachi />
    </template>
    <template #not-found>
      <NotFoundComponent />
    </template>
    <template #sidebar-nav-after>
      <SidebarCard />
    </template>
    <template #home-hero-info-before>
      <AnnouncementPill />
    </template>
    <template #nav-bar-content-after>
      <NolebaseEnhancedReadabilitiesMenu />
    </template>
    <template #nav-bar-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
  </Layout>
</template>

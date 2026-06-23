---
title: Wotaku
layout: page
sidebar: false
aside: false

customDescription: A wiki that covers everything weeb-related!
---

<script setup>
import HomeFeatures from './.vitepress/theme/components/HomeFeatures.vue'
import DevOnly from './.vitepress/theme/components/DevOnly.vue'
import { homeCards } from './.vitepress/configs/constants'
</script>

<main class="wotaku-home">
  <section class="wotaku-hero" aria-labelledby="wotaku-hero-title">
    <img class="wotaku-hero-logo" src="/asset/hero.svg" alt="Wotaku" />
  </section>

  <HomeFeatures :cards="homeCards" />
</main>

<DevOnly>
  <div class="vp-doc vp-doc-content">
    Sandbox: <a href="/sandbox">/sandbox</a>
  </div>
</DevOnly>

<style scoped>
.wotaku-home {
  padding: 48px 0 72px;
}

.wotaku-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 56px;
  padding: 0 24px;
  max-width: 960px;
  text-align: center;
}

.wotaku-hero-logo {
  margin-bottom: 24px;
  width: min(280px, 72vw);
  height: auto;
}

@media (min-width: 640px) {
  .wotaku-hero-logo {
    width: 420px;
  }
}

.wotaku-hero h1 {
  margin: 0;
  max-width: 760px;
  border-top: 0;
  padding-top: 0;
  line-height: 1.05;
  font-size: clamp(48px, 8vw, 76px);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
}

.wotaku-hero-description {
  margin: 20px 0 0;
  max-width: 620px;
  line-height: 1.6;
  font-size: 20px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (min-width: 640px) {
  .wotaku-home {
    padding-top: 72px;
  }

  .wotaku-hero {
    margin-bottom: 72px;
    padding: 0 48px;
  }
}
</style>
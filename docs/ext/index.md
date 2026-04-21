---
title: Extensions
description: Extension repos for various apps
og:
    image: https://i.wotaku.wiki/f/extension.png
---

<script setup>
    import Card from '../.vitepress/theme/components/link-card/Card.vue'
    import Deck from '../.vitepress/theme/components/link-card/Grid.vue'

</script>

## Extension Repos

<Deck>
  <Card title="Mihon" href="/ext/mihon">
    Mihon & Aniyomi-based repos
  </Card>
  <Card title="Mangayomi" href="/ext/mangayomi">
    Mangayomi-based repos
  </Card>
  <Card title="iOS" href="/ext/ios">
    iOS anime and manga repos
  </Card>
  <Card title="Miscellaneous" href="/ext/misc">
    Repos for the rest of the apps
  </Card>
</Deck>


## Cross-app Support
<ScrapeTable :sites="[
  { name: 'Anymex', scrapes: { 'Mihon': '', 'Aniyomi': '', 'Mangayomi': '', 'Sora': '', 'Cloudstream': '', 'LNreader': '' } },
  { name: 'Cloudstream', scrapes: { 'Cloudstream': '', 'Aniyomi': '' } },
  { name: 'Dantotsu', scrapes: { 'Mihon': '', 'Aniyomi': '' } },
  { name: 'IReader', scrapes: { 'IReader': '', 'LNreader': '', 'Legado': ''  } },
  { name: 'Kototoro', scrapes: { 'Mihon': '', 'Aniyomi': '', 'Kotatsu': '', 'LNReader': '', 'Legado': '', 'IReader': '' } },
  { name: 'Mangayomi', scrapes: { 'Mihon': '', 'Aniyomi': '', 'Mangayomi': '' } },
  { name: 'Usagi', scrapes: { 'Kotatsu': '', 'Mihon': '', 'LNreader': ''  } }
]" />


::: tip README
- [**Anymex**](https://github.com/RyanYuuki/AnymeX) doesn't support Mihon, Aniyomi and Cloudstream extensions in iOS.
- Similarly [**Mangayomi**](https://github.com/kodjodevf/mangayomi) doesn't support Mihon and Aniyomi extensions in iOS.

:::
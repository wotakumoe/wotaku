---
title: Extensions
description: Extension repos for various apps
feedback: no
og:
    image: /embed/extension.png
---

<script setup>
    import Card from '../.vitepress/theme/components/link-card/Card.vue'
    import Deck from '../.vitepress/theme/components/link-card/Grid.vue'

</script>

# Extension Repos

## Android

<Deck>
  <Card title="Mihon & Aniyomi" href="/ext/mihon">
    Manga & Anime
  </Card>
  <Card title="Cloudstream" href="/ext/cloudstream">
    Anime & Live Action
  </Card>
  <Card title="Echo" href="/ext/echo">
    Music, Anime & Live Action
  </Card>
  <Card title="IReader" href="/ext/ireader">
    Novels
  </Card>
  <Card title="Kotatsu" href="/ext/kotatsu">
    Manga
  </Card>
  <Card title="LNReader" href="/ext/lnreader">
    Novels
  </Card>
  <Card title="Tsundoku" href="/ext/tsundoku">
    Novels
  </Card>
</Deck>

## iOS

<Deck>
  <Card title="Aidoku" href="/ext/aidoku">
    Manga
  </Card>
  <Card title="Paperback" href="/ext/paperback">
    Manga
  </Card>
  <Card title="Suwatte" href="/ext/suwatte">
    Manga & Novels
  </Card>
</Deck>

## Multi

<Deck>
  <Card title="Hayase" href="/ext/hayase">
    Anime & Live Action
  </Card>
  <Card title="Mangayomi" href="/ext/mangayomi">
    Manga, Anime & Novels
  </Card>
</Deck>


## Cross-app Support
::: scrapetable
- Anymex : (Mihon), (Aniyomi), (Mangayomi), (Kotatsu), (Cloudstream), (LNReader);
- Cloudstream : (Cloudstream), (Aniyomi);
- Dantotsu : (Mihon), (Aniyomi), (LNreader);
- Futon : (Kotatsu), (Mihon);
- IReader : (IReader), (LNreader);
- Mangayomi : (Mihon), (Aniyomi), (Mangayomi);
- Tsundoku : (Mihon), (LNReader), (Tsundoku), (Shosetsu);
- Usagi : (Kotatsu), (Mihon), (LNreader);
:::


::: tip README
- To use Mihon/Aniyomi extensions in Mangayomi, Anymex or Dartotsu, you have to enable apkbridge.
- [**Anymex**](https://github.com/RyanYuuki/AnymeX) doesn't support Mihon, Aniyomi and Cloudstream extensions in iOS.
- Similarly [**Mangayomi**](https://github.com/kodjodevf/mangayomi) doesn't support Mihon and Aniyomi extensions in iOS.

:::
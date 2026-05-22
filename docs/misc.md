---
title: Misc-sites
description: Various sites for info, news & tools
customDescription: Discover a mix of info, news and tools for anime, manga & illustrations.
outline: [1,2]
---

![](/banner/db.webp)

# Database

## General
- [AniList](https://anilist.co/) :s:
- [MyAnimeList](https://myanimelist.net/)
- [MangaBaka](https://mangabaka.org/?utm_source=wotaku) :s:
- [Wikipedia](https://www.wikipedia.org/) :s:

<collapsible title="More">

- [Anime News Network](https://www.animenewsnetwork.com/)
- [Anime Planet](https://www.anime-planet.com/)
- [aniSearch](https://www.anisearch.com/)
- [Bookmeter](https://bookmeter.com/) :ljp:
- [Kitsu](https://kitsu.app/explore/anime)
- [Kurozora](https://kurozora.app/)
- [NamuWiki](https://namu.wiki/) :lkr:
- [Sakuhin Database](https://sakuhindb.com/) :ljp:

</collapsible>

<ScrapeTable corner-label="Topics" :sites="[
  { name: 'AniList', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '' } },
  { name: 'Anime Planet', scrapes: { 'Anime': '', 'Manga': '' } },
  { name: 'aniSearch', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '', 'Live Action': '', 'Tokusatsu': '' } },
  { name: 'ANN', scrapes: { 'Anime': '', 'Manga': ''} },
  { name: 'Bookmeter', scrapes: { 'Manga': '', 'Novels': '' } },
  { name: 'Kitsu', scrapes: { 'Anime': '', 'Manga': '' } },
  { name: 'Kurozora', scrapes: { 'Anime': '', 'Manga': '', 'Games': '' } },
  { name: 'MangaBaka', scrapes: { 'Manga': '', 'Novels': '' } },
  { name: 'MyAnimeList', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '' } },
  { name: 'NamuWiki', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '', 'Games': '', 'Live Action': '', 'Tokusatsu': '' } },
  { name: 'Sakuhin Database', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '', 'Games': '', 'Live Action': '', 'Tokusatsu': '' } },
  { name: 'Wikipedia', scrapes: { 'Anime': '', 'Manga': '', 'Novels': '', 'Games': '', 'Live Action': '', 'Tokusatsu': '' } }
]" />

::: tip README
- **Novels**: All the types of novels (LN, WN etc.) are grouped in one category.
- **Live-Action**: General movies & tv series are merged as Live-Action. Tokusatsu is kept as independent since it is a special sub-genre.
:::

<Collapsible title="The More You Know">


| Section      | Database     | Rules |
| :---         | :---         | :--- |
| Anime        | AniList      | Only adds professionally produced animation where a Japanese studio has significant control. Example: Star Wars: Visions. |
| Manga        | Anime-Planet | Does not add lolicon, shotacon, or ero manga. |
| OEL          | MyAnimeList  | Does not add OEL. |
| ^^           | AniList      | Adds OEL but has a lot of criteria. |
| Doujinshi    | MyAnimeList  | Only adds Japanese doujinshi published physically, sold via events, online retailers, or mailing. |
| ^^           | ^^           | Staff has to have professional background. |
| ^^           | AniList      | Only adds Japanese doujinshi if staff has a professional background or has published via a publisher. |
| ^^           | ^^           | Must be original work with a proper story. |
| ^^           |              | Adds doujin webcomics that were later serialized without much modification. |
| ^^           | ^^           | Does not add any other types of doujinshi. |
| ^^           | Anime-Planet | Only Japanese doujinshi; no parodies, no webtoon doujinshi, and staff must have a professional background. |
| Novels       | MyAnimeList  | Adds direct adaptations / prequels / sequels / spin-offs of existing database entries (1980+ only); no interpretations. |
| ^^           | AniList      | Does not add novels with manga-style aesthetics except for Light Novels. |
| ^^           | Anime-Planet | Does not add Japanese web novels until picked up by a publisher as Light Novels. |
| ^^           | ^^           | Adds Korean web novels (official or unofficial translations). |
| ^^           | ^^           | Adds Chinese web novels only if officially licensed. |
| Light Novels | MyAnimeList  | Adds Light Novels and Korean / Chinese novels only if they have an adaptation. |
| ^^           | ^^           | Must be published in volumes/magazines under a recognized Light Novel label. |
| ^^           | ^^           | Unlabeled series considered if they meet regular novel criteria and have sufficient illustrations for Art credits. |
| ^^           | AniList      | Only adds Japanese light novels from reputed publishers. |
| ^^           | ^^           | If explicitly labeled as Light Novel by publishers or retailers. |

</Collapsible>

::: info Tracker related utility sites
Visit the [**tracker utility**](#tracker) section for tracker stats and data transfer between sites.
:::

## Anime
- [aniDB](https://anidb.net/) :s:
- [AnimeSongs.org](https://animesongs.org/)
- [Aniplaylist](https://aniplaylist.com/)
- [AnimeDB](https://animedb.jp/) :ljp:
- [NeoApo](https://neoapo.com/) :ljp:

<Collapsible title="More">

- [Flubber’s Fluttering Anime Pilgrimage](https://furaba-animeseichi.blog.jp/) :ljp:
- [Anime Filler Guide](https://www.animefillerguide.com/)
- [Anikore](https://www.anikore.jp/) :ljp:
- [Annict](https://annict.com/) :ljp:
- [SIMKL](https://simkl.com/)
- [The Movie Database](https://www.themoviedb.org/)
- [TheTVDB.com](https://www.thetvdb.com/)

</Collapsible>

## Manga
- [MangaUpdates](https://www.mangaupdates.com/) :s:
- [Manba](https://manba.co.jp/) :s::ljp:
- [Manga Properties](https://manga.properties/)

<Collapsible title="More">

- [Chill Chill](https://www.chil-chil.net/) :ljp::ero:
- [Comic Bibliographic and Cover Archives](http://www.eshita.jp/comics/index.html) :ljp:
- [Comic Vine](https://comicvine.gamespot.com/)
- [Kazamkase Comic Database](https://kazemakase.wjg.jp/comics/) :ljp:
- [Shounen Manga Encyclopedia](https://allcomic.noor.jp/)

</Collapsible>

## Novels
- [Novel Updates](https://www.novelupdates.com/) :s:
- [RanobeDB](https://ranobedb.org/) :s: [:src:](https://github.com/Blastose/ranobedb)
- [Ranobe Mori](https://ranobe-mori.net/) :ljp:
- [Goodreads](https://www.goodreads.com/)

## Production
| Category | Resource |
| :--- | :--- |
| General | [Anisil](https://www.anisil.com/) :ljp: |
| Animation | [Anime Production Company Database](https://animeco.link/) :ljp: |
| ^^ | [Anime Staff Matcher](https://staff.iklone.org/) :mal: [:src:](https://github.com/iklone/anime-staff-matcher) |
| ^^ | [KeyFrame Staff List](https://keyframe-staff-list.com/) :s: |
| Seiyuu / Voice Actor | [Maumau ☆ Anime Viewing Record](https://www.mau2.com/) :s::ljp: |
| ^^ | [Anime Hack](https://anime.eiga.com/person/) :ljp: |
| ^^ | [AVAC.moe](https://avac.moe/index.php) :mal: |
| ^^ | [Seiyuu.moe](https://seiyuu.moe/) :mal: |
| ^^ | [Seiyuu Comparison](https://chiaki.site/?/tools/seiyuu_comparison) ||chiaki|| :al: |
| ^^ | [Seiyuu Database](http://www.usagi.org/doi/seiyuu/index.html) |
| ^^ | [Behind The Voice Actors](https://www.behindthevoiceactors.com/) <tooltip>Focuses on English VAs more.</tooltip> |

## Others
| Section | Websites |
|-|-|
| Cons    | [FanCons](https://fancons.com/) [:alt:](https://animecons.com/) |
| ^^      | [UpcomingCons](https://upcomingcons.com/) |
| Drama / Live action | [LAMA - Live Action Manga Adaptations](https://lama.watch/) | 
| ^^      | [MyDramaList](https://mydramalist.com/) |
| ^^      | [TV Drama Database](http://www.tvdrama-db.com/) :ljp: |
| Games / VN | [VNDB](https://vndb.org/) :s: |
| ^^      | [Nepchan](https://nepchan.org/) |
| ^^      | [EroGamescape](https://erogamescape.org/) :ljp::ero: [:alt:](https://erogamescape.dyndns.org/) [:help:](https://www.youtube.com/watch?v=oPIWgXDllzQ) |

<Collapsible title="Related resources">

- [Tracker apps for phone](/software#trackers)
- [Tracker software for pc](/software#trackers-1)

</Collapsible>

![](/banner/calendar.webp)

# Calendar

## Anime

| Category | Websites |  
|----------|----------|  
| **Weekly** | [AniChart](https://anichart.net/airing) :s: | 
| ^^ | [Livechart](https://www.livechart.me/schedule) :s: [:rss:](https://www.livechart.me/pages/rss) |   
| ^^ | [AnimeSchedule](https://animeschedule.net/) [:rss:](https://animeschedule.net/rss) [:rss:](https://github.com/RockinChaos/AniSchedule) |  
| ^^ | [Anime Countdown](https://animecountdown.com/) |  
| ^^ | [Anisaki](https://anisaki.vercel.app/) [:src:](https://github.com/BayuDC/anisaki) |  
| **Monthly** | [Anica](https://anica.jp/) :acc: |  
| **Dub** | [Anime Dubs Release Calendar](https://teamup.com/ksdhpfjcouprnauwda) |  
| ^^ | [English Dubbed Anime Lovers](https://english-dubbed.com/) | 
| ^^ | [Kenny Stryker’s English dublist](https://myanimelist.net/forum/?topicid=1692966) |
| **Japanese** | [Anime Hack](https://anime.eiga.com/) ==AnimeHack== |
| ^^ | [Bangumi List](https://bgmlist.com/) :lcn: [:src:](https://github.com/wxt2005/bangumi-list-v3) ||OTT|| |  
| ^^ | [CoolJapan](https://cooljapanportal.com/) ||OTT|| |
| ^^ | [Kansou](https://www.kansou.me/) ||General|| |
| ^^ | [Moon Phase](https://m-p.sakura.ne.jp/) ||TV|| |  
| ^^ | [Syoboi Calendar](https://cal.syoboi.jp/) [:rss:](https://docs.cal.syoboi.jp/spec/rss.php/) ||General|| |  
| **Others** | [Blu-ray.com](https://www.blu-ray.com/movies/movies.php?genre=Anime&sortby=releasetimestamp) |
| ^^ | [TVmaze](https://www.tvmaze.com/) |
| ^^ | [Yatta-Tachi Movie Schedule](https://yattatachi.com/2026-anime-japanese-films-coming-to-u-s-theaters-online) |

## Manga & Novels

### Third-party
| Type | Website |
|-|-|
| General | [Mynewworm](https://myneworm.katsurin.com/) [:src:](https://github.com/Butterstroke/Myneworm) |
| ^^      | [Otaku Calendar](https://otakucalendar.com/Release/?filterCategory=2) :s: [:rss:](https://otakucalendar.com/rss) |
| ^^      | [Yatta-Tachi](https://yattatachi.com/tag/releases) | 
| Manga   | [Otaku Calendar](https://otakucalendar.com/) |
| ^^      | [Whakoom](https://en.whakoom.com/) :fm: |
| ^^      | [Sumikko Comic](https://comic.sumikko.info/) :s::ljp: [:rss:](https://comic.sumikko.info/rss.xml) |
| Light Novel | [RanobeDB](https://ranobedb.org/releases/calendar) :s: [:src:](https://github.com/Blastose/ranobedb) |
| ^^      | [Light Novel Releases](https://lnrelease.github.io/) [:src:](https://github.com/LNRelease/lnrelease.github.io) |
| ^^      | [Sumikko Novel](https://novel.sumikko.info/) :ljp: [:rss:](https://novel.sumikko.info/rss.xml) |
| ^^      | [Sumikko Bunko](https://bunko.sumikko.info/) :ljp: [:rss:](https://bunko.sumikko.info/rss.xml) |

### Publisher
- [Cross Infinite World](https://www.crossinfworld.com/Calendar.html)
- [Dark Horse](https://www.darkhorse.com/books/upcoming/)
- [J-Novel Club](https://j-novel.club/calendar)
- [Kodansha](https://kodansha.us/calendar/)
- [Omoi](https://www.omoi.com/release-calendar) ||CaaS||
- [Renta!](https://www.ebookrenta.com/renta/sc/frm/upcoming/)
- [Seven Seas](https://sevenseasentertainment.com/release-dates/)
- [SuBLime](https://www.sublimemanga.com/calendar) :ero:
- [SQUARE ENIX](https://squareenixmangaandbooks.square-enix-games.com/en-us/release-calendar)
- [TITAN Comics](https://titan-comics.com/manga/)
- [TOKYOPOP](https://tokyopop.com/collections/comingsoon)
- [VIZ](https://www.viz.com/calendar/ )
- [Yen Press](https://yenpress.com/calendar)


![](/banner/portals.webp)
# Portals

## General

| Category | Websites |  
|----------|----------|  
| **Info / News** | [animate Times](https://www.animatetimes.com/) :ljp: |
| ^^ | [Anime News Network](https://www.animenewsnetwork.com/) :s: [:x:](https://x.com/anime) [:rss:](https://www.animenewsnetwork.com/newsfeed/) |  
| ^^ | [Anime UK News](https://animeuknews.net/) :cuk: |  
| ^^ | [Crunchyroll News](https://www.crunchyroll.com/news) [:rss:](https://www.crunchyroll.com/feed) |  
| ^^ | [GUNDAM.INFO](https://en.gundam-official.com/) |  
| ^^ | [Kanzenshuu](https://www.kanzenshuu.com/) [:rss:](https://www.kanzenshuu.com/feed/) |  
| ^^ | [MAL News](https://myanimelist.net/news) [:x:](https://x.com/myanimelist) [:rss:](https://myanimelist.net/rss/news.xml) |  
| ^^ | [Otaku News](https://www.otakunews.com/) :cuk: [:rss:](https://www.otakunews.com/Rss) |  
| **Blog / Interview** | [Anime Blog Tracker](https://aniblogtracker.app/index.php) :s: ||Aggregator|| [:src:](https://github.com/AniBlogTracker) |  
| ^^ | [Anime Nano](https://www.animenano.com/) ||Aggregator|| |  
| ^^ | [Halcyon Realms](https://halcyonrealms.com/) :s: [:rss:](https://halcyonrealms.com/subscribe/) |  


## Anime

| Category | Websites |  
|----------|----------|  
| **General** | [Anitrendz](https://anitrendz.net/news/) [:x:](https://x.com/anitrendz) |
| ^^ | [Catsuka](https://www.catsuka.com/) :lfr: |
| **Info / News** | [Anime Corner](https://animecorner.me/) [:x:](https://x.com/animecorner_ac) |  
| ^^ | [Anime Freaks](https://times.abema.tv/anime) :ljp: |  
| ^^ | [Anime News by AIR](https://x.com/AIR_News01) :x: |  
| ^^ | [AnimeTV](https://animetv-jp.net/) [:x:](https://x.com/animetv_jp) |  
| ^^ | [Toonami Squad](https://toonamisquad.com/) [:x:](https://x.com/ToonamiSquad) |  
| **Blog / Interview** | [Animation Obsessive](https://animationobsessive.substack.com/) :fm::sub: [:x:](https://x.com/ani_obsessive) |  
| ^^ | [Anime Herald](https://www.animeherald.com/) |  
| ^^ | [Anime Mind Probe](https://www.youtube.com/@ANIMEMINDPROBE) :s: |
| ^^ | :prev: [Full Frontal](https://fullfrontal.moe/) :s::ded: |  
| ^^ | [NHK: Anime & Manga](https://www3.nhk.or.jp/nhkworld/en/shows/category/31/) :s: |
| ^^ | [Sakuga Blog](https://blog.sakugabooru.com/) :s: [:x:](https://x.com/SakugaBlog) [:rss:](https://blog.sakugabooru.com/feed/) |  


## Manga & Novels

| Category | Websites |  
|----------|----------|  
| **Info / News** | [Deb Aoki](https://x.com/debaoki) :x: |  
| ^^ | [Manga Alerts](https://x.com/MangaAlerts) :x: |  
| ^^ | [Manga Mogura](https://x.com/MangaMoguraRE) [:alt:](https://x.com/MangaReporter) :x: |  
| ^^ | [Ecchi & Smut Mogura](https://x.com/EcchiMogura) :x: |  
| ^^ | [Shonen Jump News](https://x.com/WSJ_manga) :s::x: |  
| **Blog / Interview** | [BehindTheManga](https://www.behindthemanga.com/) |  
| ^^ | [Manga Bookshelf](https://mangabookshelf.com/) |  
| ^^ | [Mangasplaining](https://www.mangasplaining.com/) [:x:](https://x.com/mangasplaining) |
| ^^ | :prev: [Mangasplaining Extra](https://mangasplaining.substack.com/) |
| ^^ | [TheOASG](https://www.theoasg.com/) [:x:](https://x.com/TheOASG) |  


## Stats & More

| Category | Websites |  
|----------|----------|  
| **General** | [Animenomics](https://news.animenomics.com/) :fm::sub: |   
| ^^ |[ORICON NEWS](https://www.oricon.co.jp/) :s: :ljp: |  
| ^^ | :prev: [Japan Anime News](https://us.oricon-group.com/) [:x:](https://x.com/JapanAnimeNews_) |  
| ^^ | :prev: [Randomanga](https://randomanga.wordpress.com/) :lfr: |
| ^^ | [UzuRepo](https://x.com/UzuRepo) :x: |
| **Anime** | [Animation Business Journal](http://animationbusiness.info/) :ljp: |
| ^^ | [Animerank](https://animerank.top/) :mal: |
| ^^ | [Anime Karma List](https://animekarmalist.com/) |
| ^^ | [Anime Stats](https://anime-stats.net/) :s::mal::al::k: |
| **Manga & Novels** | [Josu Ke](https://x.com/Josu_ke) :s::x: [:web:](https://www.mangacodex.com/) ==JosuKe== |  
| ^^ | [CR500 Manga Ranking](http://shosekiranking.blog.fc2.com/) :ljp: [:rss:](http://shosekiranking.blog.fc2.com/?xml) [:x:](https://x.com/ComicRanking500) ==ComicRanking500== |
| ^^ | :prev: [Paperback Ranking](http://bunkoranoberanking.blog.fc2.com/) :ljp: [:rss:](http://bunkoranoberanking.blog.fc2.com/?xml) |
| **Shueisha** | [Jajanken - Weekly Shonen Jump Lab](https://www.jajanken.net/en/) |
| ^^ | [MANGA Plus Top 40](https://manga.tumeo.space/) [:src:](https://github.com/williamd1k0/manga-plus-top40) |
| ^^ | [MANGA Plus Views](https://mangaplustracker.github.io/) [:src:](https://github.com/MangaplusTracker/MangaplusTracker.github.io) |


## Retro Archives & Blogs

| Category | Websites |
| :--- | :--- |
| **General** | [CosmoDNA](https://www.ourstarblazers.com/vault/) |
| ^^ |[MAD ANGLER PRESS](https://retroanimechris.blogspot.com/) [:iarch:](https://archive.org/details/@madanglerpress) [:x:](https://x.com/retroanimechris) |
| ^^ | [Media Monster](https://archive.org/details/@media-monster_alt) :iarch: [:x:](https://x.com/nuwawawon) |
| ^^ | [Otaku Archive](https://archive.org/details/otaku-archive) :iarch: <tooltip>By Gerald Rathkolb (Anime World Order)</tooltip> |
| ^^ | [Otaku Print Archive](https://archive.org/details/@nicole_turkowski/uploads) :iarch: [:x:](https://x.com/OtakuPrintArchv) [||Docs||](https://docs.google.com/spreadsheets/d/1NFcv7gTI_oGYyNpg64O6YI0JBDh-i0h8NavWw0OA5Gk/edit?gid=0#gid=0) |
| ^^ | [The Magazine Rack](https://archive.org/details/magazine_rack) :s::iarch: |
| ^^ | [Tuxedo Unmasked](https://www.tuxedounmasked.com/) :ded: |
| ^^ | [Zimmerit](https://www.zimmerit.moe/) |  
| **Anime** | [80s OVA](https://80s-ova.com/) :ljp: [:x:](https://x.com/KuraiSue) |
| ^^ | [Anime Magazine Archive](https://animagarchive.com/) [:x:](https://x.com/animemagarchive) |
| ^^ | [Animétudes](https://animetudes.com/) :ded: |   
| ^^ | [Anime World by Tim Eldred](https://timeldred.com/category/anime-world/) |
| ^^ | [Let's Anime](https://letsanime.blogspot.com/) |
| ^^ | :prev: [**More in Arts**](/art#official-art--cover--poster) |
| **Games** | [Old Game Mags](https://oldgamemags.tumblr.com/) [:x:](https://x.com/OldGameMags) |
| ^^ | [Forgotten Worlds](https://www.forgottenworlds.net/) [:x:](https://x.com/american80s) |
| ^^ | [Gaming Alexandria](https://www.gamingalexandria.com/wp/) [:x:](https://x.com/dushubz) |
| ^^ | [VGHF Archive](https://archive.gamehistory.org/) |


![](/banner/utility.webp)
# Utility

## Anime & Manga
| Category  | Websites | Service(s) |  
|-----------|----------|------------|  
| **General** | [Anime Bingo](https://anime-bingo.aikats.us/) [:src:](https://github.com/walfie/anime-bingo) | :al: |  
| ^^        | [due.moe](https://due.moe/) | :al: |  
| ^^        | [GomiTier](https://www.gomitier.tech/) | :mal::al: |
| ^^        | [Related Anime](https://relatedanime.com/) | :mal: |
| ^^        | [WikiTimeline](https://wiki-timeline.com/) [:src:](https://github.com/wenzhenl/wikitimeline) | :wikip: |
| **Anime** | [Manga Adaptations](https://anilist-adaptations.timschneeberger.me/) [:src:](https://github.com/timschneeb/manga-adaptations-anilist) | :al: |  
| ^^        | [MyDubList](https://mydublist.com/) [:src:](https://github.com/Joelis57/MyDubList) | :no: |
| ^^        | [Randime](https://randime.moe/) | :no: |  
| ^^        | [Spin.moe](https://spin.moe/) | :mal::al::k: |  


## Image
| Category    | Websites |
|------------|----------|
| **Search** | [SauceNAO](https://saucenao.com/) :s: |
| ^^         | [Trace](https://trace.moe/) [:src:](https://github.com/soruly/trace.moe) |
| ^^         | [ascii2d](https://ascii2d.net/) |
| ^^         | [Multi-service image search](https://iqdb.org/) |
| **Others** | [Imgtrans](https://touhou.ai/imgtrans/) [:src:](https://github.com/zyddnys/manga-image-translator) |
| ^^        | [Slowpoke Pics](https://slow.pics/) |


## Tracker
 
| Category  | Websites | Tracker |  
|-----------|----------|---------|  
| **Stats** | [Sekai](https://sekai.rl404.com/) [:src:](https://github.com/rl404/sekai) :s: | :mal: |  
| ^^        | [Anistats](https://mayudev.github.io/anistats/) [:src:](https://github.com/mayudev/anistats) | :al: |  
| ^^        | [anime.plus](https://anime.plus/) [:src:](https://github.com/anime-plus/graph) | :mal: |  
| ^^        | [KitsuStats](https://drumber.github.io/KitsuStats/#/) [:src:](https://github.com/Drumber/KitsuStats) | :k: |  
| ^^        | [MAL Badges](https://www.mal-badges.com/) | :mal: |  
| **Tools** | [AniCheck](https://anicheck.moe/) [:src:](https://github.com/gubo97000/aniCheck) | :al: |
| ^^        | [AniListDiff](https://animelistdiff.zerolabs.fyi/) | :mal::al: |
| ^^        | [AniTools](https://anitools.koopz.rocks/) | :al: |  
| ^^        | [aniTrakt](https://anitrakt.huere.net/) [:src:](https://github.com/ryuuganime/aniTrakt-IndexParser) | :mal: |  
| ^^        | [MAL Exporter](https://malscraper.azurewebsites.net/) | :mal::al::k: |  


## 3x3
| Category | Websites | Customizable | Max RxC |
| :--- | :--- | :---: | :---: |
| **General** | [3x3 Generator](https://gqgs.github.io/3x3-generator/) [:src:](https://github.com/gqgs/3x3-generator/) | :no: | 5x5 |
| ^^ | [lists.fun](https://lists.fun/) | :no: | 5x10 |
| ^^ | :prev: [grids.fun](https://grids.fun/) | :yes: | 6x6 |
| ^^ | :prev: [placeit.fun](https://placeit.fun/) | - | - |
| ^^ | [Topsters 3](https://topsters.org/) | :yes: | 12x12 |
| **Games** | [My 9 Games](https://my9games.com/) | :no: | 3x3 |
| **Music** | [My Top 9 Otaku Songs](https://otaku-song.pages.dev/) :ljp: | :no: | 3x3 |

<ScrapeTable :sites="[
  { name: '3x3 Generator', scrapes: { 'Anime': 'AniList, MyAnimeList & Kitsu', 'Manga': 'AniList, MyAnimeList & Kitsu', 'Music': 'LastFM', 'Game': 'RAWG & IGDB', 'Visual Novel': 'VNDB' } },
  { name: 'Lists.fun', scrapes: { 'Anime': 'MyAnimeList', 'Music': 'MusicBrainZ', 'Live Action': 'TMDB', 'Game': 'IGDB', 'Tabletop': 'BoardGameGeek, Scryfall & Pokeapi' } },
  { name: 'Topsters 3', scrapes: { 'Live Action': 'TMDB', 'Music': 'LastFM', 'Book': 'Internet Archive', 'Game': 'IGDB' } },
  { name: 'My 9 Games', scrapes: { 'Game': 'IGDB' } },
  { name: 'My Top 9 Otaku Songs', scrapes: { 'Music': 'Apple Music' } }
]" />

## Recommendations

| Type | Resource |
| :--- | :--- |
| Anime | [r/Anime](https://old.reddit.com/r/anime/wiki/recommendations/) |
| ^^ | [/r/anime Awards](https://animeawards.moe/) [:src:](https://github.com/r-anime/awards-web) |
| ^^ | [The Ultimate Anime Recommendation Flowchart](https://old.reddit.com/r/anime/comments/o16ipm/rebuild_of_the_ultimate_anime_recommendation/) [:alt:](https://rentry.org/ultimatebackup) |
| ^^ | [Sprout Anime Recommender](https://anime.ameo.dev/) :s::mal::al: |
| Manga | [Mitsukeru](https://mitsukeru.timschneeberger.me/) [:src:](https://github.com/timschneeb/Mitsukeru) :al: |
| Visual Novel | [VNDB](https://vndb.org/v?f=022gja3gja&s=34w) |
| ^^ | [r/Visualnovels](https://sites.google.com/view/rvisualnovels-recs/home) |
| ^^ | [r/VN's 2018](https://vnrecs.github.io/) |
| ^^ | [What are you reading?](https://some-guy.org/vnswayrarchive/recommendations) |


![](/banner/others.webp)
# Others

## 4chan

::: warning README
Only use this if you know what you're getting yourselves into. Recommended boards are listed [**here**](/comms#boards).
:::

- [4chan archive search](https://4search.neocities.org/)
- [4plebs](https://archive.4plebs.org/)
- [arch.b4k](https://arch.b4k.dev/)
- [Archive of Sins](https://archiveofsins.com/)
- [Archived.Moe](https://archived.moe/)
- [Desuarchive](https://desuarchive.org/) :s:
- [Palanq.win](https://archive.palanq.win/)
- [The /b/ Archive](https://thebarchive.com/)
- [Warosu](https://warosu.org/)

<collapsible title="Related Software">

| Category | URL | Platform |
| :--- | :--- | :--- |
| Clients | [Anychans](https://anychans.github.io/4chan/) [:src:](https://github.com/catamphetamine/anychan) | :web: |
| ^^ | [DashchanFork](https://github.com/TrixiEther/DashchanFork) | :and: |
| ^^ | [Read Chan](https://play.google.com/store/apps/details?id=com.deezus.pchan) :cs: | :and: |
| ^^ | [TUI-Chan](https://github.com/tuqqu/tui-chan) | :win: |
| Extension / Script | [4chan X](https://github.com/ccd0/4chan-x) | :cr::js: |
| ^^ | [Desu X](https://greasyfork.org/en/scripts/483282-desu-x-enhancement-script-for-desuarchive-org) | :js: |
| ^^ | [Dollchan](https://github.com/SthephanShinkufag/Dollchan-Extension-Tools/) | :ff::js: |
| 4chan X themeing | [OneeChan](https://github.com/KevinParnell/OneeChan) | :js: |
| ^^ | [StyleChan](https://github.com/3nly/StyleChan) | :js: |
| ^^ | [SS21](https://github.com/saxamaphone69/ss21) | :js::mdi-format-paint: |
| Others | [4stats.io](https://4stats.io/) | :web: |

</collapsible>

## Encoding & Fansubbing

- [JET Encoding Guide](https://jaded-encoding-thaumaturgy.github.io/JET-guide/) :s:
- [Advanced Encoding Guide](https://silentaperture.gitlab.io/mdbook-guide/introduction.html)
- [Fansubbing Guide](https://guide.encode.moe/)
- [Good Job! Media](https://www.goodjobmedia.com/fansubbing/)
- [Subarashii Tutorial](https://subarashii-no-fansub.github.io/Subbing-Tutorial/)
- [Unanimated](https://unanimated.github.io/guides.htm)
- [Yuki Subs](https://yukisubs.wordpress.com/guides/)
- [Zeriyu's Fansub Guide](https://github.com/zeriyu/fansub-guide)
- :more: [Fansubbing tools](/tools#video-tools)

## Fun sites

### Quiz
| Category  | Website |
|-----------|---------|
| General   | [AniGuessr](https://aniguessr.com/) |
| Song      | [Anime Music Quiz](https://animemusicquiz.com/) [:pin:](https://github.com/Shaykaden/AMQ-tabify-anime-selection) |
| ^^        | [AnimeSongs Quiz](https://quiz.animesongs.org/) |
| ^^        | [Eroge Music Quiz](https://erogemusicquiz.com/) :ero: |
| ^^        | [Guess The Anime Opening](https://guesstheopening.com/anime) |
| Character | [Chiaki Anime Quiz](https://chiaki.site/?/quiz) |
| Scene     | [AnimeGuess](https://www.animeguess.moe/) |
| Others    | [Animerdle](https://www.animerdle.com/) |
| ^^        | [Rule34dle](https://rule34dle.vercel.app/) |


### Miscellaneous
- [AIDN](https://aidn.jp/contents/)
- [AniAnimals.moe](https://www.anianimals.moe/)
- [Anime Bath Scene Wiki](https://animebathscenewiki.com/index.php?title=Main_Page)
- [HUNTER×HUNTER Hiatus Chart](https://hiatus-hiatus.github.io/)
- [Inazuma](https://inazuma.rl404.com/) [:src:](https://github.com/rl404/inazuma)
- [Maid Spin](https://iklone.org/)
- [One Piece Wanted Poster Maker](https://yuskawu.github.io/one-piece-wanted-poster/dist/) [:src:](https://github.com/YuskaWu/one-piece-wanted-poster)
- [Song Bottle](https://song-bottle.app/)
- [True Harem](https://trueharem.carrd.co/)
- [TV Tropes](https://tvtropes.org/)
- [Vagabond Hiatus Chart](https://vagabond-hiatus-chart.vercel.app/) :ded: [:src:](https://github.com/falsepopsky/vagabond-hiatus-chart)
- [Wired Sound For Wired People](https://fauux.neocities.org/)


## Scanlation

| Category | Websites |
|-|-|
| **SFX** | [Jaded Network's SFX library](http://thejadednetwork.com/sfx/)
| ^^  | [Japanese Onomatopoeia Search](https://nsk.sh/tools/jp-onomatopoeia/)
| ^^  | [Japanese SFX](https://gist.github.com/UserUnknownFactor/093a2296c5a4d9ef7b404728ebde94a3)
| **Resources** | [Scanner Usage School](https://discord.gg/NCzxVB9) :d:
| ^^        | [Quick Sand Scans](https://quicksandscans.wordpress.com/resources/)
| ^^        | [Inside Scanlation](https://www.insidescanlation.com/backgrounds/)
| **Fonts** | [Manga Fonts Dictionary](https://mangafonts.carrd.co/)
| ^^    | [Font Spring](https://www.fontspring.com/matcherator)
| ^^    | [Font Squirrel](https://www.fontsquirrel.com/matcherator)
| ^^    | [MyFonts](https://www.myfonts.com/pages/whatthefont)
| ^^    | [WhatFontIs](https://www.whatfontis.com/)

<collapsible title="Related resources">

- [Rusty Smart Stitch](https://github.com/kevinmartz/Rusty-Smart-Stitch)
- [SmartStitch](https://github.com/MechTechnology/SmartStitch)
- [TypeR](https://typer.hayasaku.fr/) [:src:](https://github.com/ScanR/TypeR)
- [Panel Cleaner](https://github.com/VoxelCubes/PanelCleaner)

</collapsible>
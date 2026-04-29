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
- [MyAnimeList](https://myanimelist.net/) :s:
- [MangaBaka](https://mangabaka.org/) :s:
- [aniSearch](https://www.anisearch.com/)
- [Anime Planet](https://www.anime-planet.com/)
- [Kitsu](https://kitsu.app/explore/anime)
- [Kurozora](https://kurozora.app/)
- [Wikipedia](https://www.wikipedia.org/) :s:
- [Sakuhin Database](https://sakuhindb.com/) :ljp:

<ScrapeTable :sites="[
  { name: 'AniList', scrapes: { 'Anime': '', 'Manga': '', 'Novel': '' } },
  { name: 'MyAnimeList', scrapes: { 'Anime': '', 'Manga': '', 'Novel': '' } },
  { name: 'MangaBaka', scrapes: { 'Manga': '', 'Novel': '' } },
  { name: 'aniSearch', scrapes: { 'Anime': '', 'Manga': '', 'Novel': '', 'Live Action': '', 'Tokusatsu': '' } },
  { name: 'Anime Planet', scrapes: { 'Anime': '', 'Manga': '' } },
  { name: 'Kitsu', scrapes: { 'Anime': '', 'Manga': '' } },
  { name: 'Kurozora', scrapes: { 'Anime': '', 'Manga': '', 'Games': '' } },
  { name: 'Wikipedia', scrapes: { 'Anime': '', 'Manga': '', 'Novel': '', 'Games': '', 'Live Action': '', 'Tokusatsu': '' } },
  { name: 'Sakuhin Database', scrapes: { 'Anime': '', 'Manga': '', 'Novel': '', 'Games': '', 'Live Action': '', 'Tokusatsu': '' } }
]" />

::: details The More You Know :s:

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


:::

::: tip Tracker related utility sites
Visit the [**tracker utility**](#tracker) section for tracker stats and data transfer between sites.
:::

## Anime
- [aniDB](https://anidb.net/) :s:
- [Anikore](https://www.anikore.jp/) :ljp:
- [AnimeDB](https://animedb.jp/) :ljp:
- [AnimeSongs.org](https://animesongs.org/)
- [Annict](https://annict.com/) :ljp:
- [Aniplaylist](https://aniplaylist.com/)
- [Simkl](https://simkl.com/)
- [TMDB](https://www.themoviedb.org/)
- [TVDB](https://www.thetvdb.com/)

## Manga
- [MangaUpdates](https://www.mangaupdates.com/) :s:
- [Manba](https://manba.co.jp/) :s::ljp:
- [Bookmeter](https://bookmeter.com/) :ljp:

::: details More
- [Chill Chill](https://www.chil-chil.net/) :ero::ljp:
- [Comic Bibliographic and Cover Archives](https://web.archive.org/web/20220928162853/http://www.eshita.jp/comics/index.html)
- [Comic Vine](https://comicvine.gamespot.com/)
- [Kazamkase Comic Database](https://kazemakase.wjg.jp/comics/) ==kazamakase==
- [LAMA](https://lama.watch/)
- [Shounen Manga Encyclopedia](https://comicdate.web.fc2.com/) `fc2`
- [Shounen Manga Encyclopedia](https://allcomic.noor.jp/) `noor`
- [Touhou Doujinshi Index](https://scarlet.nsk.sh/) [:src:](https://github.com/nanoskript/touhou-doujinshi-index) <Badge type="tip" text="Terms" link="https://nanoskript.dev/touhou/" />
:::

## Novels
- [Novel Updates](https://www.novelupdates.com/) :s:
- [MangaBaka](https://mangabaka.org/) :s:
- [RanobeDB](https://ranobedb.org/) :s: [:src:](https://github.com/Blastose/ranobedb)
- [Ranobe Mori](https://ranobe-mori.net/) :ljp:
- [Bookmeter](https://bookmeter.com/) :ljp:
- [Goodreads](https://www.goodreads.com/)

## Production
| Category | Resource |
| :--- | :--- |
| General | [Anisil](https://www.anisil.com/) :ljp: |
| Animation | [Anime Staff Matcher](https://staff.iklone.org/) :mal: [:src:](https://github.com/iklone/anime-staff-matcher) |
| ^^ | [KeyFrame Staff List](https://keyframe-staff-list.com/) :s: |
| Seiyuu / Voice Actor | [Maumau ☆ Anime Viewing Record](https://www.mau2.com/) :s::ljp: |
| ^^ | [Anime Hack](https://anime.eiga.com/person/) :ljp: |
| ^^ | [AVAC.moe](https://avac.moe/index.php) :mal: |
| ^^ | [Seiyuu.moe](https://seiyuu.moe/) :mal: |
| ^^ | [Seiyuu Database](http://www.usagi.org/doi/seiyuu/index.html) |
| ^^ | [Behind The Voice Actors](https://www.behindthevoiceactors.com/) <tooltip>Focuses on English VAs more.</tooltip> |

## Others
| Section | Websites |
|-|-|
| Cons    | [FanCons](https://fancons.com/) [:alt:](https://animecons.com/) |
| ^^      | [UpcomingCons](https://upcomingcons.com/) |
| Drama / Live action | [MyDramaList](https://mydramalist.com/) |
| ^^      | [TV Drama Database](http://www.tvdrama-db.com/) :ljp: |
| Games / VN | [VNDB](https://vndb.org/) :s: |
| ^^      | [Nepchan](https://nepchan.org/) |

::: details Related resources
- [Tracker apps for phone](/software#trackers)
- [Tracker software for pc](/software#trackers-1)
:::


![](/banner/info.webp)
# Info

## Anime

### Stats & Watch guide

| Category        | Links |
|-----------------|-------|
| **Watch Order** | [Chiaki](https://chiaki.site/) |
| ^^             | [Related Anime](https://relatedanime.com/) |
| ^^             | [r/Anime Watch Order](https://old.reddit.com/r/anime/wiki/watch_order/) |
| **Filler**     | [Anime Filler Guide](https://www.animefillerguide.com/) |
| ^^             | [Anime Filler List](https://www.animefillerlist.com/) |
| **Ranking**    | [Anime Karma List](https://animekarmalist.com/) |
| ^^             | [Anime Stats](https://anime-stats.net/) :s: |
| ^^             | [Anime Corner](https://animecorner.me/category/anime-corner/rankings/) |
| ^^             | [Anitrendz](https://anitrendz.com/charts/top-anime) |

## Manga & LN

- [ComicRanking500](https://x.com/ComicRanking500) ==ComicRanking500==
  - [Manga Ranking](http://shosekiranking.blog.fc2.com/) :ljp: [:rss:](http://shosekiranking.blog.fc2.com/?xml)
  - [Novel Ranking](http://bunkoranoberanking.blog.fc2.com/) :ljp: [:rss:](http://bunkoranoberanking.blog.fc2.com/?xml)
- [Jajanken](https://www.jajanken.net/en/) <Badge text="WSJ" />
- [Manga Codex](https://mangacodex.com/)
- [Manga Properties](https://manga.properties/)
- [MANGA Plus Top 40](https://manga.tumeo.space/) [:src:](https://github.com/williamd1k0/manga-plus-top40)
- [MANGA Plus Views](https://mangaplustracker.github.io/) [:src:](https://github.com/MangaplusTracker/MangaplusTracker.github.io)
- [Mannavi](https://mannavi.net/) :ljp:
- [Randomanga](https://randomanga.wordpress.com/) :flag-france: <Badge text="Oricon" /> 

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
| ^^ | [Bangumi List](https://bgmlist.com/) :lcn: [:src:](https://github.com/wxt2005/bangumi-list-v3) <Badge type="info" text="OTT" /> |  
| ^^ | [CoolJapan](https://cooljapanportal.com/) <Badge type="info" text="OTT" /> |
| ^^ | [Kansou](https://www.kansou.me/) <Badge type="info" text="General" /> |
| ^^ | [Moon Phase](https://m-p.sakura.ne.jp/) <Badge type="info" text="TV" /> |  
| ^^ | [Syoboi Calendar](https://cal.syoboi.jp/) [:rss:](https://docs.cal.syoboi.jp/spec/rss.php/) <Badge type="info" text="General" /> |  
| **Others** | [Blu-ray.com](https://www.blu-ray.com/movies/movies.php?genre=Anime&sortby=releasetimestamp) |
| ^^  | [Yatta-Tachi Movie Schedule](https://yattatachi.com/2026-anime-japanese-films-coming-to-u-s-theaters-online) |

## Manga & LN

### Third-party
| Type | Website |
|-|-|
| General | [Mynewworm](https://myneworm.katsurin.com/) [:src:](https://github.com/Butterstroke/Myneworm) |
| ^^      | [Otaku Calendar](https://otakucalendar.com/Release/?filterCategory=2) :s: [:rss:](https://otakucalendar.com/rss) |
| ^^      | [Yatta-Tachi](https://yattatachi.com/tag/releases) | 
| Manga   | [Von's Manga Calendar](https://v0n.notion.site/Manga-297a9ad3a4904173b3a4ce319f9b2879) |
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
- [Omoi](https://www.omoi.com/release-calendar) <Badge type="info" text="CaaS" />
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
| ^^ | [GUNDAM.INFO](https://en.gundam.info/) |  
| ^^ | [Kanzenshuu](https://www.kanzenshuu.com/) [:rss:](https://www.kanzenshuu.com/feed/) |  
| ^^ | [MAL News](https://myanimelist.net/news) [:x:](https://x.com/myanimelist) [:rss:](https://myanimelist.net/rss/news.xml) |  
| ^^ | [ORICON NEWS](https://www.oricon.co.jp/) :ljp: |  
| ^^ | [Japan Anime News](https://us.oricon-group.com/) [:x:](https://x.com/JapanAnimeNews_) |  
| ^^ | [Otaku News](https://www.otakunews.com/) :cuk: [:rss:](https://www.otakunews.com/Rss) |  
| **Blog / Interview** | [Anime Blog Tracker](https://aniblogtracker.app/index.php) :s: <Badge text="Aggregator" /> [:src:](https://github.com/AniBlogTracker) |  
| ^^ | [Anime Nano](https://www.animenano.com/) <Badge text="Aggregator" /> |  
| ^^ | [Halcyon Realms](https://halcyonrealms.com/) :s: [:rss:](https://halcyonrealms.com/subscribe/) |  
| ^^ | [Zimmerit](https://www.zimmerit.moe/) |  

## Anime

| Category | Websites |  
|----------|----------|  
| **General** | [Anitrendz](https://anitrendz.net/news/) [:x:](https://x.com/anitrendz) |
| ^^ | [Catsuka](https://www.catsuka.com/) :lfr: |
| **Info / News** | [Animation Business Journal](http://animationbusiness.info/) :ljp: |
| ^^ | [Anime Corner](https://animecorner.me/) [:x:](https://x.com/animecorner_ac) |  
| ^^ | [Anime Freaks](https://times.abema.tv/anime) :ljp: |  
| ^^ | [Anime News by AIR](https://x.com/AIR_News01) :x: |  
| ^^ | [Animenomics](https://news.animenomics.com/) :fm::sub: |  
| ^^ | [AnimeTV](https://animetv-jp.net/) [:x:](https://x.com/animetv_jp) |  
| ^^ | [Toonami Squad](https://toonamisquad.com/) [:x:](https://x.com/ToonamiSquad) |  
| **Blog / Interview** | [Animation Obsessive](https://animationobsessive.substack.com/) :fm::sub: [:x:](https://x.com/ani_obsessive) |  
| ^^ | [Anime Herald](https://www.animeherald.com/) |  
| ^^ | [Anime Mind Probe](https://www.youtube.com/@ANIMEMINDPROBE) :s: |
| ^^ | :prev: [Full Frontal](https://fullfrontal.moe/) :s::ded: |  
| ^^ | [Animétudes](https://animetudes.com/) :s::ded: |  
| ^^ | [Furaba Anime search](https://furaba-animeseichi.blog.jp/) :ljp: |  
| ^^ | [Let's Anime](https://letsanime.blogspot.com/) |  
| ^^ | [NHK: Anime & Manga](https://www3.nhk.or.jp/nhkworld/en/shows/category/31/) :s: |
| ^^ | [Sakuga Blog](https://blog.sakugabooru.com/) :s: [:x:](https://x.com/SakugaBlog) [:rss:](https://blog.sakugabooru.com/feed/) |  


## Manga & LN

| Category | Websites |  
|----------|----------|  
| **Info / News** | [Deb Aoki](https://x.com/debaoki) :x: |  
| ^^ | [Josu Ke](https://x.com/Josu_ke) :s::x: [:web:](https://www.mangacodex.com/) ==JosuKe== |  
| ^^ | [Manga Alerts](https://x.com/MangaAlerts) :x: |  
| ^^ | [Manga Mogura](https://x.com/MangaMoguraRE) [:alt:](https://x.com/MangaReporter) :x: |  
| ^^ | [Ecchi & Smut Mogura](https://x.com/EcchiMogura) :x: |  
| ^^ | [Shonen Jump News](https://x.com/WSJ_manga) :s::x: |  
| **Blog / Interview** | [BehindTheManga](https://www.behindthemanga.com/) |  
| ^^ | [Manga Bookshelf](https://mangabookshelf.com/) |  
| ^^ | [Mangasplaining](https://www.mangasplaining.com/) [:x:](https://x.com/mangasplaining) |
| ^^ | :prev: [Mangasplaining Extra](https://mangasplaining.substack.com/) |
| ^^ | [TheOASG](https://www.theoasg.com/) [:x:](https://x.com/TheOASG) |  


![](/banner/utility.webp)
# Utility

<br>

## Anime & Manga
| Category  | Websites | Service(s) |  
|-----------|----------|------------|  
| **General** | [Anime Bingo](https://anime-bingo.aikats.us/) [:src:](https://github.com/walfie/anime-bingo) | :al: |  
| ^^        | [due.moe](https://due.moe/) | :al: |  
| ^^        | [GomiTier](https://www.gomitier.tech/) | :mal::al: |
| ^^        | [Related Anime](https://relatedanime.com/) | :mal: |
| ^^        | [WikiTimeline](https://wiki-timeline.com/) [:src:](https://github.com/wenzhenl/wikitimeline) | :wikip: |
| **Anime** | [Animerank](https://animerank.top/) | :mal: |
| ^^        | [Manga Adaptations](https://anilist-adaptations.timschneeberger.me/) [:src:](https://github.com/timschneeb/manga-adaptations-anilist) | :al: |  
| ^^        | [MyDubList](https://mydublist.com/) [:src:](https://github.com/Joelis57/MyDubList) | - |
| ^^        | [Randime](https://randime.moe/) | - |  
| ^^        | [Spin.moe](https://spin.moe/) | :mal::al::k: |  
| **Manga** | [Mihon Local Source JSON Generator](https://mihonlocal.netlify.app/) | - |
| ^^        | [Tachibk Viewer](https://backup.mihon.tools/) [:src:](https://github.com/Animeboynz/Mihon-Backup-Viewer) | - |
| **Manga Covers** | [Big Book Covers](https://covers.roler.dev/) :s: [:src:](https://github.com/rRoler/bbc-frontend) | General |
| ^^        | [Ermitteln](https://ermitteln.ihateani.me/) [:src:](https://github.com/noaione/cmx-ermitteln) | Comixology |  
| ^^        | [iTunes Artwork Finder](https://bendodson.com/projects/itunes-artwork-finder/) | :apple: |

::: details Related resources {open}
- [Image Max URL](https://github.com/qsniyg/maxurl) :js::ff::cr:
- [Image Picka](https://github.com/eight04/image-picka) :ff::cr:
- [rRoler Bookmarklets](https://bookmarklets.roler.dev/) :js:
:::

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

## Encoding & Fansubbing Guides

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

### 3x3
| Category  | Websites | Service(s) |  
|-----------|----------|------------|  
| **General** | [3x3 Generator](https://gqgs.github.io/3x3-generator/) [:src:](https://github.com/gqgs/3x3-generator/) | :mal::al::k: |
| ^^        | [Topsters](https://topsters.org/) | :tmdb::lstfm::igdb::iarch: |
| **Games** | [My 9 Games](https://my9games.com/) | :igdb: |
| **Music** | [My Top 9 Otaku Songs](https://otaku-song.pages.dev/) :ljp: | :apple: |

### Quiz
| Category  | Website |
|-----------|---------|
| General   | [AniGuessr](https://aniguessr.com/) |
| Song      | [Anime Music Quiz](https://animemusicquiz.com/) <Badge type="tip" text="Script" link="https://github.com/Shaykaden/AMQ-tabify-anime-selection" /> |
| ^^        | [AnimeSongs Quiz](https://quiz.animesongs.org/) |
| ^^        | [Eroge Music Quiz](https://erogemusicquiz.com/) :ero: |
| ^^        | [Guess The Anime Opening](https://guesstheopening.com/anime) |
| Character | [Chiaki Anime Quiz](https://chiaki.site/?/quiz) |
| Scene     | [AnimeGuess](https://www.animeguess.moe/) |
| Others    | [Rule34dle](https://rule34dle.vercel.app/) |

### Others
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

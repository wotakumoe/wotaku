---
title: Frequently Asked Questions
customDescription: Answers to some of the most commonly asked questions about manga and anime we've seen in the otaku community.
outline: 1
---

<GradientCard title="FAQs" description="Answers to some of the most commonly asked questions about otaku topics." theme="turquoise" variant="thin"/>

![](/banner/general.webp)

# General

<br>

:::details Why does X site have so many ads?
**Use an Adblocker**. We have added a [**full adblock resource list**](/guides/tech/adblock). Ads keep the websites running, but sometimes the ad ruin the experience or even link malware. If you want ad-free experience you can do take these steps.

:::

:::details Do I need to use VPN while direct downloading?
The necessity of using a VPN depends on the method of downloading. For direct downloads, a VPN is typically unnecessary.
:::

:::details Why's the download so slow?
Use a download manager. Some websites impose file transfer limits for a single thread, thereby restricting download speeds. Download managers overcome this limitation by leveraging multiple threads for downloading, resulting in faster download speeds. We have listed the recommended ones for [**pc**](/tools#downloader-1) and [**android**](/tools#downloader).
:::

:::details What does X term mean?
We have explained meanings of a lot a weeb related terms in our glossary section.
- [**General glossary**](/glossary/general) for terms that are common in every medium
- [**Anime glossary**](/glossary/anime) for only anime specific terms
- [**Manga glossary**](/glossary/manga) for manga specific terms

:::

:::details Can I track my anime/manga progress on websites?
Yes. Try [**MAL-Sync**](https://malsync.moe/). It has support for MyAnimeList, AniList, Kitsu, Simkl & Shikimori.
:::

:::details Why are some of the torrents red and some green on Nyaa.si?

### Green
Uploaded by trusted uploader. Also it's not a re-encoded version of the original file.
![](/ss/nyaagreen.png)

### Red
For anime, it indicates a re-encoded video. For manga, it indicates that an edit of someone else's release, usually for the purposes of joining spread pages. Sometimes it's indicated with "ED" tag.
![](/ss/nyaared.png)
:::

:::details What is PT, IRC & Usenet?
### PT / Private Tracker
Torrent trackers that don't allow you to freely make an account, but require you to get an invitation from an existing member or pass an interview. Some PTs also have specific periods where they allow for open signups.

### IRC
IRC (Internet Relay Chat) is a really old messaging protocol. It uses client and server connection to communicate. You can use various bot to download files in high speed. Follow [**our guide**](/guides/tech/irc) to get started.

### Usenet
Usenet is a subscription-based service. Though really old, it's still very reliable. Its system consists of a few elements:

- **.nzb:** The file you need in order to download your wanted file, similar to `.torrent` files. In usenet, files are hosted in multiple parts. These parts are stored as different articles, each having its own message ID. `.nzb` contains all the message IDs, so that the provider can locate the parts.
- **Indexers:** The search engines of usenet, either paid or free (with limits).
- **Providers:** The hosts of all the content, all of them are paid.

:::

:::details What is seedbox & debrid service?
### Seedbox
A seedbox is a remote service that can download (leech) & upload (seed) from p2p networks. Since it's always online, it keeps the torrents alive, thus helping you keep a high ratio in [PTs](#pt-private-tracker). Examples: [Ultra.cc](https://ultra.cc/), [RapidSeedbox](https://www.rapidseedbox.com/) & [Pulsed Media](https://pulsedmedia.com/).

### Debrid
Like a seedbox, it's also a remote service. It can download from p2p and various host sites (e.g. [MEGA](https://mega.io/), [RapidGator](https://rapidgators.net/)). One of the big differences is that they (generally) don't seed p2p files and keep the downloaded files cached on their servers, meaning you can download currently dead torrents that have already been cached in the past. Examples: [Real-Debrid](https://real-debrid.com/) & [AllDebrid](https://alldebrid.com/).

:::


![](/banner/manga.webp)

# Manga

<br>

:::details Where can I get the highest quality manga releases?
[Nyaa.si](https://nyaa.si/), [:mdi-clover:/co/](https://boards.4channel.org/co/) & [Madokami](/guides/manga/madokami). Manga image quality depends on the [**source**](/guides/digim) and how it's been ripped, with volume release usually being better than [**CaaS**](/glossary/manga#publisher) release. If you want to download officially translated manga, [**Nyaa**](https://nyaa.si/) is always the best source, though some of the rippers upload upscaled SD rips. 

We have listed the most trusted rippers in the [**Nyaa section**](/websites#nyaa). Madokami mainly mirrors the nyaa releases.
:::

:::details What's the best website to read manga?
Personal preference. Good online manga reading sites generally reupload nyaa releases (when it's available replacing/alongside the fantranslated one), but with added compression (e.g. [**Comick**](https://comick.io/home), [**Weeb Central**](https://weebcentral.com/), [**MangaFire**](https://mangafire.to/home), [**Batoto**](https://battwo.com/v3x), [**Mangapark**](https://mangapark.net/)) & watermark on (almost) every page (mangafire :slightly-smiling-face: ). On the other hand, generic ones only keep the fan-translated ones. You can read a short description about the sites [**here**](/websites#manga).
:::

:::details When will the new volume of "X" get ripped?
Rippers upload what they like, without following any specific schedule (even in the case of chapter uploaders). Generally speaking there's a good chance, but no guarantee, of seeing an upload after a new volume is officially released. A series can also be uploaded by multiple rippers (with no or very little differences due to image processing or the source of the file).
:::

:::details What's the best reader for manga?

### Android
[**Perfect viewer**](https://play.google.com/store/apps/details?id=com.rookiestudio.perfectviewer). Why? Because it has better scaling algorithm than others (including tachiyomi / mihon and kotatsu). But you wont get the luxury of directly reading from online sources in Perfect viewer. So, you have to balance between the sources.

### iOS
[**YACReader**](https://apps.apple.com/app/id635717885) is recommended as local reader. You can use [Paperback](https://github.com/Paperback-iOS/app) as your komga or kavita client and [Aidoku](https://github.com/Aidoku/Aidoku) as an online reader.

### PC
There are a few options. [**CDisplayEx**](https://www.cdisplayex.com/), [**YACReader**](https://www.yacreader.com/), [**MComix**](https://sourceforge.net/projects/mcomix/files/). You should give them a try and see which ones works the best for you. There is also [**OpenComic**](https://github.com/ollm/OpenComic) which is really good for long strip comic.
:::

:::details What's the best extension for mihon / tachiyomi?
Like websites, it's also personal preference. But to us, [**Madokami**](/guides/manga/madokami) (in terms of quality) & [**Comick**](https://comick.io/home) (in terms of flexibility). There are also mangadex, batoto & others.
:::

:::details Why are the manga pages filled with squares / artifacts?
Moiré. It generally happens during image downscaling. You can read about it in more detail [**here**](/glossary/manga#moire-moire).
:::

:::details Where can I download manga in bulk?
You can use multiple sources. [**Nyaa.si**](https://nyaa.si/), [**Madokami**](/guides/manga/madokami) or any other direct download websites like Comick or mangadex.

### PC
- For Nyaa.si, just use [**qBittorrent**](https://www.qbittorrent.org/). It's more than enough.
- For other DDL sites (mangadex, comick, madokami), use [**Free Manga Downloader 2**](https://github.com/dazedcat19/FMD2).

### Android
- For Nyaa.si, you can use [**libretorrent**](https://github.com/proninyaroslav/libretorrent), [**Flud**](https://play.google.com/store/apps/details?id=com.delphicoder.flud) or [**1DM**](https://play.google.com/store/apps/details?id=idm.internet.download.manager&hl=en&gl=US).
- For DDL sites, tachiyomi / mihon is more than enough.
:::

:::details Where can I download manga in PDF?
Use CBZ / CBR / ZIP for manga. PDF can create issues in spread and other scenarios. If you really wanna read manga in PDF, use [**Free Manga Downloader 2**](https://github.com/dazedcat19/FMD2) to download as PDF (you have to select PDF format in settings) or [**ACBR**](https://github.com/binarynonsense/comic-book-reader) to convert CBZ into pdf.
:::

:::details How to compress cbz / cbr easily?
You can use [**CBconvert**](https://github.com/gen2brain/cbconvert) to compress your comic files. By default, it will use `.jpeg` and `-quality 75` as output parameters. You can configure these settings in the options menu.
:::

:::details How do I setup my own manga server?
Use [**Komga**](https://komga.org/). Read their [**docs**](https://komga.org/docs/introduction) to understand the setup process. You can join their [:ic-outline-discord:**discord server**](https://discord.gg/TdRpkDu) for further support.
:::

<br>

![](/banner/anime.webp)

# Anime

<br>

:::details Where can I get the highest quality anime releases?
The quality of the anime file depends on the [**source**](/glossary/anime#source) as well as how it's been ripped and encoded. In general blu-ray release contains the best quality with reanimated, uncensored or extra scenes. [**Nyaa**](https://nyaa.si/), IRC and some DDL websites don't compress the uploaded file.

<br>

On the other hand, aggregators like [**KickAssAnime**](https://kickassanime.am/), [**Miruro**](https://www.miruro.tv/) & [**HiAnime**](https://hianime.to/home) re-encode them further. They sacrifice some of the quality in favor of smaller file sizes, thereby maintaining a smoother user experience on their sites.

<br>

[**SeaDex**](https://releases.moe/) & [**Sneedex**](https://sneedex.moe/) rank their picks of the best quality rips for a variety of shows.
:::

:::details Which player should I use?

### PC
[**mpv**](https://mpv.io/) kinda covers everything for pc. We have listed everything you need for mpv in the [**tools page**](/tools#mpv).

### Android
For android, there is also [mpvKt](https://github.com/abdallahmehiz/mpvKt) but the UI is too limited. You can use [**Aniyomi**](https://github.com/aniyomiorg/aniyomi)'s local option to watch anime. The UI is optimized with a good amount of options.
:::


<br>

![](/banner/msuic.webp)

# Music

<br>

:::details What's the best source for anime songs / OST?
- [**Nyaa**](https://nyaa.si/) has a huge library of OST and is the best place to get them. Submitters upload both lossy and lossless versions from different sources such as digital album purchase, CD or Vinyl. 
- [**Sitting on Clouds**](https://www.sittingonclouds.net/), [SquidBoard](https://www.squid-board.org/) & [**Sukidesu OST**](https://sukidesuost.info/) upload ripped music from hi-res sources.
- Most of the current anime songs (sometime background scores too) are uploaded on legal music streaming services. You can rip from these services using [Squid.wtf](https://squid.wtf/), [Lucida](https://lucida.to/) & [**DoubleDouble**](https://doubledouble.top/), which can rip multiple hi-res sources.
- You can also check out [**Nicotine+**](https://nicotine-plus.org/), a [**Soulseek**](https://www.slsknet.org/) client. People share their downloaded/own rips here. It uses P2P to transfer files, so a VPN is recommended. You may find really old or rare ones.
- More sources are listed [**here**](/websites#music). If you want more ripping tools, you can check out more ripping tools in [others section](/music#downloader).
:::

:::details What player should I use for music?
Personal preference.

### Android
There are FOSS player [**Oto Music**](https://play.google.com/store/apps/details?id=com.piyush.music), [**Musicolet Music Player**](https://play.google.com/store/apps/details?id=in.krosbits.musicolet) & [**Retro Music Player**](https://play.google.com/store/apps/details?id=code.name.monkey.retromusic). There is also [**Poweramp**](https://play.google.com/store/apps/details?id=com.maxmpz.audioplayer.unlock) which is paid but it's really good.

### PC
You can try [**Foobar2000**](https://www.foobar2000.org/), [**Musicbee**](https://www.getmusicbee.com/) or [**AIMP**](https://www.aimp.ru/). Foobar2000, out of the box, has very outdated UI out of the box. You can sideload skins to make it more cool looking. Example: [Georgia-ReBORN](https://github.com/TT-ReBORN/Georgia-ReBORN), [Eole](https://github.com/Ottodix/Eole-foobar-theme) etc.
:::

:::details Can I track my music like anime or manga?
Yes. [**Last.fm**](https://www.last.fm/). It's not anime songs centric but a general music tracker.
:::

:::details What should I use to convert my music files?
Most of the PC music player can convert music files to your desired formats. For example [**Foobar2000**](https://www.foobar2000.org/) & [**Musicbee**](https://www.getmusicbee.com/). For Foobar200, you have to install [encoder pack](https://www.foobar2000.org/encoderpack). 

<Button link="/guides/music/transcoding" icon="i-fxemoji-lightbulb">Read our transcoding audio guide to learn the basics.</Button>

:::
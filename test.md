---
title: Frequently Asked Questions
customDescription: Answers to some of the most commonly asked questions about manga and anime we've seen in the otaku community.
---

<GradientCard title="よくある質問" tag="FAQs" description="Answers to some of the most commonly asked questions about manga, anime & other topics." theme="turquoise"/>

![](/banner/general.png)

## General

### Why does X site have so many ads?
**Use an Adblocker**. Ads keep websites running, but sometimes they ruin the experience or even link to malware. For an ad-free experience, you can take these steps:

#### Android
- Install [**Firefox**](https://play.google.com/store/apps/details?id=org.mozilla.firefox) and add [**uBlock Origin**](https://addons.mozilla.org/en-US/android/addon/ublock-origin/). This should be more than enough.
- For system-wide support, try [**Adguard**](https://adguard.com/en/adguard-android/overview.html) or [**NextDNS**](https://nextdns.io/).
- You can watch [**this video**](https://youtu.be/WUG57ynLb8I) for guidance.

#### PC
- Install [**uBlock Origin**](https://github.com/gorhill/uBlock) in your browser and you're done!
- For a system-wide solution, you *can* use [**NextDNS**](https://nextdns.io/), but it won't be as effective as uBlock Origin.
- You can also use [FastForward](https://fastforward.team/) or [Bypass.city](https://bypass.city/) to *bypass* redirects.

#### iOS
- [**NextDNS**](https://nextdns.io/) should cover everything for system-wide ads & trackers.
- You can also try [**AhaDNS**](https://ahadns.com/).

### Do I need to use VPN while direct downloading?
The necessity of using a VPN depends on the method of downloading. For direct downloads, a VPN is typically unnecessary.

### Why's the download so slow?
Use a download manager. Some websites impose file transfer limits for a single thread, thereby restricting download speeds. Download managers overcome this limitation by leveraging multiple threads for downloading, resulting in faster download speeds. We have listed the recommended ones for [**PC**](/tools.md#downloader-1) and [**Android**](/tools.md#downloader).

### What does X term mean?
We have explained the meanings of many weeb-related terms in our glossary section:
- [**General glossary**](/glossary/general.md) for terms common in every medium.
- [**Anime glossary**](/glossary/anime.md) for anime-specific terms.
- [**Manga glossary**](/glossary/manga.md) for manga-specific terms.

### Can I track my anime/manga progress on websites?
Yes. Try [**MAL-Sync**](https://malsync.moe/). It supports MyAnimeList, AniList, Kitsu, Simkl, and Shikimori.

### Why are some of the torrents red and some green on Nyaa.si?

#### Green
Uploaded by a trusted uploader. It is not a re-encoded version of the original file.
![](/ss/nyaagreen.png)

#### Red
For anime, it indicates a re-encoded video. For manga, it indicates an edit of someone else's release, usually for joining spread pages. Sometimes it's indicated with the "ED" tag.
![](/ss/nyaared.png)

### What is PT, IRC & Usenet?

#### PT / Private Tracker
Torrent trackers that don't allow you to freely create an account, requiring an invitation from an existing member or passing an interview. Some PTs have specific periods for open signups.

#### IRC
IRC (Internet Relay Chat) is a very old messaging protocol. It uses client and server connections to communicate. You can use various bots to download files at high speed. Follow [**our guide**](/guides/irc.md) to get started.

#### Usenet
Usenet is a subscription-based service, though very old, it's still reliable. Its system consists of several elements:
- **.nzb:** The file you need to download your desired file, similar to `.torrent` files.
- **Indexers:** The search engines of Usenet, either paid or free (with limits).
- **Providers:** The hosts of all the content, all of them are paid.

### What is a Seedbox & Debrid service?

#### Seedbox
A seedbox is a remote service that can download (leech) & upload (seed) from P2P networks. Since it's always online, it keeps torrents alive, helping you maintain a high ratio in [PTs](#pt-private-tracker). Examples: [Ultra.cc](https://ultra.cc/), [RapidSeedbox](https://www.rapidseedbox.com/), and [Pulsed Media](https://pulsedmedia.com/).

#### Debrid
Like a seedbox, it's also a remote service. It can download from P2P and various host sites (e.g., [MEGA](https://mega.io/), [RapidGator](https://rapidgators.net/)). One significant difference is that they generally don't seed P2P files and keep the downloaded files cached on their servers, allowing you to download currently dead torrents that have been cached. Examples: [Real-Debrid](https://real-debrid.com/) & [AllDebrid](https://alldebrid.com/).

![](/banner/general.png)
## Torrent

### What does X term mean?
Check out our [torrent glossary](/glossary/torrent), where you should find all the important terms.

### What torrent client should I use?
- **Android**: [LibreTorrent](https://play.google.com/store/apps/details?id=org.proninyaroslav.libretorrent)
- **iOS**: [iTorrent](https://github.com/XITRIX/iTorrent)
- **Windows / Linux / MacOS**: [qBittorrent](https://www.qbittorrent.org/)

### Can I stream torrent files?
You *can* stream torrent files by downloading the files sequentially.

#### Android
[Aniyomi](https://aniyomi.org/) & [Dantotsu](https://dantotsuapp.netlify.app/) can stream torrents from various sources including Nyaa.si. For that, install the Torrentio extension and customize the settings as needed.

#### PC
There are a few listed in the [**software page**](/software.md#anime-streaming-2). [Miru](https://miru.watch/) is the most feature-rich one. You can also use [qBittorrent](https://www.qbittorrent.org/), [TorrServer](https://github.com/YouROK/TorrServer), and [WebTorrent](https://webtorrent.io/). Check the info tab below the software list for instructions.

### Do I need a VPN while torrenting?
The distribution (seeding/uploading) of pirated content is illegal. In peer-to-peer (P2P) connections like torrenting, it exposes your IP to everyone connected. So, it's advisable to use a VPN to mask your IP. However, if your country/ISP doesn't care about pirating stuff, you can skip the VPN. To know whether your country/ISP cares, ask in your local forum.

### What VPN should I use? Free or Paid?
This depends on various factors. Free VPNs have limitations such as untrusted ownership, data caps, few servers, or slow speed. Not all paid VPNs are great either. The ownership, transparency, and handling of government bodies matter.

#### Paid VPNs
- [Proton VPN](https://protonvpn.com/) <Badge type="tip" text="Freemium" />
- [IVPN](https://www.ivpn.net/)
- [Windscribe](https://windscribe.com/) <Badge type="tip" text="Freemium" />
- [AirVPN](https://airvpn.org/)

#### Free VPNs
- [WARP](https://one.one.one.one/) <Badge type="tip" text="WireGuard" link="https://rentry.co/foss-warp" /><Badge type="tip" text="Generate" link="https://github.com/nxvvvv/warp-plus" />
- [RiseupVPN](https://riseup.net/en/vpn)

<Button link="https://www.techlore.tech/vpn" icon="i-fxemoji-lightbulb">Go through Techlore's VPN comparison for more details</Button>

::: danger Never use Cracked / Modded VPN {open}
You should never use cracked or modded VPNs because all of your traffic will go through that VPN. Using a compromised VPN is extremely risky.
:::

![](/banner/general.png)

## Anime

### Where can I get high-quality anime releases?
[Nyaa.si](https://nyaa.si/) is a primary source for high-quality anime releases. It hosts many raw and subbed anime files uploaded by trusted groups. If you're looking for specific anime, checking the trusted uploaders on Nyaa.si can help ensure you're getting high-quality files.

### What's the best way to stream anime?
Use reliable streaming websites or dedicated apps to stream anime. Some popular options include:
- **Android**: [Aniyomi](https://aniyomi.org/) is a great app for streaming anime from various sources.
- **PC**: Use web-based streaming sites or apps like [Miru](https://miru.watch/), which also supports streaming from torrent files.

### What's the best anime player?
**PC**: [MPV](https://mpv.io/) is highly recommended for its flexibility and performance.
**Android**: [VLC](https://www.videolan.org/vlc/) or [MX Player](https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad) are popular choices.

### How do I watch anime with external subtitles?
Use players like MPV or VLC, which support external subtitle files. You can find subtitles on sites like [SubScene](https://subscene.com/) or [OpenSubtitles](https://www.opensubtitles.org/).

![](/banner/general.png)

## Manga

### Where can I find manga?
Here are some places to find manga:
- [Mangadex](https://mangadex.org/): A popular site for reading manga online with a large collection of titles.
- [ComicWalker](https://comic-walker.com/): Another good source for manga, especially if you prefer reading in Japanese.

<Button link="https://updating-rules.github.io/reading_sites">Here is a list of online reading sites</Button>

### What's the best manga reader?
**Android**: Tachiyomi, TachiyomiSY, and Neko are excellent open-source apps. Install TachiyomiSY for reading manga from your library and Neko for reading from Mangadex. [Detailed guide](https://tch.2fa.moe/)

**iOS**: There are no good apps. Use Tachidesk (a Tachiyomi server) to read from your browser.

**PC**: YACReader is the most feature-rich app. Check the guide in the info tab.

![](/banner/general.png)

## Light Novel

### Where can I find light novels?

#### English
Jnovels Club (Paid): [website](https://j-novel.club/)
Nyaa.si: [website](https://nyaa.si/) (Unlicensed ones)

#### Japanese
[あにれこ](https://anime-recorder.com/), [Haiten](https://manga.gamestlike.com/)

### What reader should I use?
**Android**: [Reasily](https://play.google.com/store/apps/details?id=com.gmail.jxlab.app.reasily), [KOReader](https://github.com/koreader/koreader)

**PC**: [SumatraPDF](https://www.sumatrapdfreader.org/download-free-pdf-viewer.html), [KOReader](https://github.com/koreader/koreader) 

**iOS**: [Hyphen](https://apps.apple.com/us/app/hyphen/id941893796)

![](/banner/general.png)

## Retro

### What's the best way to download retro games?
Use ROM websites. If you can't find what you need, ask in our Retro Games Channel.

### What emulator should I use?
We have listed the recommended emulators in the [**Software page**](/software.md#emulators-1). 
For older consoles, Retroarch is your best bet. 

<Button link="https://emulation.gametechwiki.com/index.php/Main_Page" icon="i-fluent-emoji-smile">Learn more about emulators</Button>

![](/banner/general.png)
## Music

### Where can I download anime soundtracks and J-pop?
You can download anime soundtracks and J-pop from various websites. Some popular sources include:
- **Nyaa.si**: Often has a wide selection of anime soundtracks.
- **Tokyo Toshokan**: Another great source for Japanese media, including music.

### What's the best music player?
**Android**: [Poweramp](https://play.google.com/store/apps/details?id=com.maxmpz.audioplayer) or [BlackPlayer](https://play.google.com/store/apps/details?id=com.kodarkooperativet.blackplayerfree)
**PC**: [Foobar2000](https://www.foobar2000.org/) or [MusicBee](https://getmusicbee.com/)
**iOS**: [Cs Music Player](https://apps.apple.com/us/app/cs-music-player/id287196876)

### Where can I find lyrics and translations?
For lyrics and translations, sites like [AnimeLyrics](http://www.animelyrics.com/) and [Genius](https://genius.com/) are good resources.


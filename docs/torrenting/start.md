---
title: Getting Started
customDescription: Basic how-to torrent guide to get you started 
og:
    image: https://files.catbox.moe/d3zs1e.png
---


<GradientCard title="Getting Started" description="Basic how-to torrent guide to get you started" theme="turquoise" variant="thin"/>

## Intro

This is a quick start guide. If you have any questions, check out our [**FAQs**](/torrenting/faq) or [**Glossary**](/torrenting/glossary) if you want to learn the meaning of a specific term.

::: info TL;DR
1. Download and install torrent [client](#client).
2. Get a `.torrent` file or magnet URL.
3. Open the file/URL in your torrent client.
4. Confirm your download.
:::

::: tip Quick Dos and Don'ts
1. Always try to seed as much as you can (if you're on a non-metered connection).
2. Try to use a VPN (if your ISP goes after torrents, then you must).
3. If you are downloading from private trackers, make sure to read the rules.
4. Don't use torrent streaming software like Miru, Webtorrent, Stremio for private torrents.
:::

## Client

Dedicated clients are recommended since they have a lot torrent-centric features.

### Dedicated

| Platform | Client |
|-|-|
| Android   | [BiglyBT](https://play.google.com/store/apps/details?id=com.biglybt.android.client) |
| ^^        | [LibreTorrent](https://github.com/proninyaroslav/libretorrent) :s: |
| ^^        | [Flud](https://play.google.com/store/apps/details?id=com.delphicoder.flud) ==Flud== |
| iOS       | [iTorrent](https://github.com/XITRIX/iTorrent) |
| PC        | [qBittorrent](https://www.qbittorrent.org/) :s: [:gh:](https://github.com/qbittorrent/qBittorrent/) |
| ^^        | [Deluge](https://www.deluge-torrent.org/) [:gh:](https://github.com/deluge-torrent/deluge) |
| ^^        | [Transmission](https://transmissionbt.com/) [:gh:](https://github.com/transmission/transmission) |

### General

| Platform | Client |
|-|-|
| Android  | [1DM](https://play.google.com/store/apps/details?id=idm.internet.download.manager) :cs: |
| ^^       | [ADM](https://play.google.com/store/apps/details?id=com.dv.adm) :cs: |
| ^^       | [Aria2App](https://github.com/devgianlu/Aria2App) |
| ^^       | [Gopeed](https://gopeed.com/) [:gh:](https://github.com/GopeedLab/gopeed) |
| iOS      | [Gopeed](https://gopeed.com/) [:gh:](https://github.com/GopeedLab/gopeed) |
| PC       | [aria2](https://aria2.github.io/) [:gh:](https://github.com/aria2/aria2) |
| ^^       | [File centipede](https://filecxx.com/en_US/index.html) [:gh:](https://github.com/filecxx/FileCentipede) |
| ^^       | [Gopeed](https://gopeed.com/) [:gh:](https://github.com/GopeedLab/gopeed) |


## PC guide

For this guide, we will use [**qBittorrent**](https://www.qbittorrent.org/) `v5.0.1` and download files from [**Nyaa**](https://nyaa.si/). Other clients should work in a similar manner, with minor UI changes.

::: details Basic UI guide

![](/torrenting/start/0.png)

The columns are customizable. You can rearrange them, adjust width or choose which ones to keep (by right clicking on them).

1. You add Magnet URL here
2. You open `.torrent` file here
3. Delete selected torrent file(s)
4. You can start downloading a paused torrent or start seeding a completed torrent
5. You can pause a downloading torrent or stop seeding a completed torrent
6. Settings of qBittorrent
7. Status of the particular torrent, which can be:

| Status                  | Description                                                                                              |
|-------------------------|----------------------------------------------------------------------------------------------------------|
| **Downloading**         | The torrent is actively downloading files from peers. |
| **Seeding**             | The download is complete and the torrent is now sharing data with other peers. |
| **Paused**              | The torrent is inactive, ready to resume if started again. |
| **Queued**              | The torrent is waiting for its turn to download or seed, due to queue settings. |
| **Checking**            | The torrent data is being verified to ensure data integrity. |
| **Downloading Metadata** | The torrent is fetching metadata (file names, sizes) from peers before starting the download. |
| **Stalled**             | The torrent is trying to download or seed, but can’t progress due to lack of peers or poor connection. |
| **Error**               | There’s an issue with the torrent, often related to file system or tracker problems. |
| **Missing Files**       | qBittorrent cannot find the files, due to moved/modified/deleted files. |

8. The number of people seeding (uploading) the files. The number inside the () means total people seeding, outside one means the number of people you are downloading from.
9. The number of people leeching (downloading) from you. The brackets work the same as in the previous column.
10. The amount of Uploaded divided by Downloaded data. In general, it's good practice to keep it higher. Not necessary for public trackers, but you need to keep it above 1 for private trackers.
11. Availability indicates the health of the given torrent. Being equal or greater than 1 means that all files are available for download. If it's less than 1, you can't fully download the torrent.

:::

::: details Why does qBittorrent look different?
Default dark mode of qBittorrent is just too ugly. So we are using a custom theme, [**Iceberg**](https://github.com/CyberSeas/qBittorrentDarktheme).

0. Download ICEBERG.qbtheme from [**here**](https://github.com/CyberSeas/qBittorrentDarktheme/blob/master/ICEBERG.qbtheme).
1. Open qBittorrent, press `Alt + o` & check **Use custom UI theme**
2. Select your downloaded ICEBERG.qbtheme from File explorer
3. Press Apply and restart qBittorrent

![](/torrenting/start/100.png)

:::


:::tabs

== Magnet URL

1. Click on the ":mdi-magnet: Magnet".
2. Choose your torrent client (if it's your first time).
3. It will open a pop-up window in qBittorent. Client will retrieve all the metadata and then show all the files and folders, where to download them, and other settings. After adjusting everything, click **OK**.

![](/torrenting/mag1.png)

![](/torrenting/mag2.png)

![](/torrenting/mag3.png)

== .torrent File

1. Click on ":ic-sharp-download: Download Torrent". It will download a `.torrent` file.
2. Open the file.
3. Choose your torrent client (if it's your first time).
4. It will open a pop-up window in qBittorent. It will show all the files and folders, where to download them, and other settings. After adjusting everything, click **OK**.

![](/torrenting/tor1.png)

![](/torrenting/tor2.png)

![](/torrenting/tor3.png)
:::

## Android guide

For this guide, we are using [LibreTorrent](https://play.google.com/store/apps/details?id=org.proninyaroslav.libretorrent) v3.6. Other clients should work similarly.

:::tabs

== Magnet URL

1. Click on the ":mdi-magnet: Magnet".
2. Choose your torrent client (if it's your first time).
3. It will open a pop-up window in LibreTorrent. It will show file count and download location. After adjusting everything, click ":material-symbols-check:".

![](/torrenting/lib1.png)

![](/torrenting/lib2.png)

![](/torrenting/lib3.png)

== .torrent File

1. Click on ":ic-sharp-download: Download Torrent". It will download a `.torrent` file.
2. Open the file.
3. Choose your torrent client (if it's your first time).
4. It will open a pop-up window in qBittorent. It will show file count and download location. After adjusting everything, click ":material-symbols-check:".

![](/torrenting/lib4.png)

![](/torrenting/lib5.png)

![](/torrenting/lib6.png)

![](/torrenting/lib7.png)
:::

## iOS guide

For this guide, we will use [iTorrent](https://github.com/XITRIX/iTorrent). *Not like they have any better choice.*

:::tabs

== Magnet URL

1. Click on the ":mdi-magnet: Magnet".
2. Click **Open** when it asks "Open in iTorrent?"
3. It will start downloading automatically.

![](/torrenting/ipad1.jpg)

![](/torrenting/ipad2.jpg)

![](/torrenting/ipad3.jpg)

== .torrent file

1. Click on ":ic-sharp-download: Download Torrent". It will download a `.torrent` file.
2. Then it will ask "Open in iTorrent". Click on it.
3. It will start downloading automatically.

![](/torrenting/ipad1.jpg)

![](/torrenting/ipad4.jpg)

![](/torrenting/ipad3.jpg)

:::
---
title: Getting Started
customDescription: Basic how-to torrent guide to get you started 
---

<GradientCard tag="Getting Started" description="Basic how-to torrent guide to get you started" theme="turquoise" variant="thin"/>

To start downloading torrents, you will need two things:
1. Torrent link
2. Torrent client


Torrent link is basically the download link for the torrent file or folder. It carries all the metadata and comes in two types:
1. Magnet URL <tooltip>Magnet URL is the link that starts with `magnet:`</tooltip>
2. `.torrent` file


The client can be a dedicated torrent downloader or it can support both torrent and direct downloading. For example [**qBittorrent**](https://www.qbittorrent.org/) & [**LibreTorrent**](https://github.com/proninyaroslav/libretorrent) is dedicated torrent downloader. On the other hand, [**aria2**](https://aria2.github.io/) & [**1DM**](https://play.google.com/store/apps/details?id=idm.internet.download.manager) support both torrent and direct downloading.

___

For this guide, we will use [**qBittorrent**](https://www.qbittorrent.org/) `v4.3.9` and download files from [**Nyaa**](https://nyaa.si/). Other clients should work in a similar manner, with minor UI changes.

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
11. Availability indicates the health of the given torrent. Being eqaul or greater than 1 means that all files are available for download. If it's less than 1, you can't fully download the torrent.

:::

## Downloading Files

### Using Magnet URL

1. Go to the torrent page
2. **Right click** on :mdi-magnet: Magnet
3. Cick **Copy Link**
4. Go to qBittorent
5. Click on **Add Torrent Link**
6. The magnet URL should be auto pasted in the filed. If not, paste it there manually. Click **Download**.
7. After loading for a few seconds (depending on the seeds) it will show all the files and folders, where to download them, and other setings. After adjusting everything, click **OK**

::: details Image Preview

![](/torrenting/start/1.png)

![](/torrenting/start/2.png)

![](/torrenting/start/3.png)

:::

You can also open the magent link just by clicking on it, after selecting your default torrent downloader:
1. left click on it
2. Check "Always allow https://nyaa.si/ to open **magnet** links"
3. Click **Choose Application**
4. Click **Choose...**
5. Go to `C:\Program Files\qBittorrent`
6. Select **qbittorrent.exe**
7. Click **Open**
8. Check "Always use this application to open **magnet** links"
9. Click **Open Link**

::: details Image Preview

![](/torrenting/start/5.png)

![](/torrenting/start/6.png)

![](/torrenting/start/7.png)

![](/torrenting/start/8.png)

:::

### Using .torrent File
1. Click on **Download Torrent**. It will download a `.torrent` file.
2. Double click on it.
3. It will show all the files and folders, where to download them, and other setings. After adjusting everything, click **OK**
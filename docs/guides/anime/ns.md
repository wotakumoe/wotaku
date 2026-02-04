---
title: Network Stream
customDescription: Stream video files through DDL, IRC, and Torrent. Enjoy seamless online video streaming!
og:
    image: https://i.wotaku.wiki/f/guide.png
---

## DDL
The basic process:

:::steps
1. Copy the download link
2. Put it in the stream button
:::

You can't play videos from some sources like Google drive, Mega etc. For this example, we will use [Tokyo Insider](https://www.tokyoinsider.com/).

<div class="video_wrapper"><iframe src="https://youtube.com/embed/1dsTb8YoNDM" frameborder="0" allowfullscreen></iframe></div>

## IRC
When you start the download, a file will be created in the download destination. If you open the file while it is still downloading, you can play the downloaded sections. Technically, you are only able to play the parts that have been downloaded, so you cannot skip ahead and play the non-downloaded parts. This method works because the downloader downloads the file sequentially.


## Torrent
You can use [qBittorrent](https://www.qbittorrent.org/) to stream a video you're currently downloading. For this, check the "**Download in sequential order**" and go to the containing folder. Now open the file and it will play as more chunks are downloaded.

![](/ss/seq.png)

[TorrServer](https://github.com/YouROK/TorrServer) & [WebTorrent](https://github.com/webtorrent/webtorrent-cli) can also be used to stream torrents.
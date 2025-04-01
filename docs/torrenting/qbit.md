---
title: qBittorrent
customDescription: Various how-tos for qBittorrent
og:
    image: https://files.catbox.moe/d3zs1e.png
---


<GradientCard title="qBittorrent" description="Various how-tos for qBittorrent" theme="turquoise" variant="thin"/>

## RSS Feed
You can use [RSS Feed](https://en.wikipedia.org/wiki/RSS) to get an upload feed from supported sites. In this case, we're gonna use [Nyaa](https://nyaa.si/) to fetch from [1r0n's](https://nyaa.si/user/tsuna69) profile. You can fetch from other pages too in a similar way.

___

#### Step 1: Enabling RSS
- Press `Alt + O` to open settings and then go to **RSS** section.
- Check "**Enable fetching RSS feeds**" and "**Enable auto downloading of RSS torrents**".
- You can also customize the refresh interval and max article number there.

::: details Image preview
![](/ss/qbit/rss1.png)
:::

#### Step 2: Adding feed URL
- Close the settings and go to the **RSS** tab.
- To get the RSS feed URL of a page in [**Nyaa**](https://nyaa.si/), click on the **RSS** button.
- Copy the feed URL from the address bar.

::: details Image preview
![](/ss/qbit/rss2.png)
:::

- Now to add the feed URL, click on **New subscription**.
- Then rename it to a relevant name. For that right click on feed URL, then **Edit feed URL...**

::: details Image preview
![](/ss/qbit/rss3.png)
:::

#### Step 3: Adding Rules
- Go to the **RSS Downloader** (at the top right) and add a new download rule.
- Go to the bottom section of the middle column and select feed URLs.
- To filter the feed, you have to add some rules. Hover over the rule field to get writing instruction. The right column will show the selected article preview for that specific rule.
- Then click **Close** and it will start downloading those.

::: details Image preview
![](/ss/qbit/rss4.png)
:::

## Torrent Creator

The torrent creator is used to generate **.torrent** files that let you download files from a tracker. This guide is generalized, so **read the rules of your tracker before uploading to see if they have any tracker specific rules.**

___

#### Steps
- Press `Ctrl + N` to open up the **Torrent Creator**.
- Select the file or folder you wanna upload.
- You should adjust the piece size in order to keep the piece count between 1000 and 2000.
- Depending on your tracker, check the Private tracker option.
- Check **Optimize Alignment** and keep it **Disabled**
- Add your announce URL given by the tracker in **Tracker URLs**. For public trackers, it's the same for everyone. For PTs, you get a personal announce URL, which you should keep private. Note that you should only add the announce URLs for the specific tracker you are uploading to. If one tracker has multiple announce URLs, add each in a new line.
- Comment field gets filled by the tracker with the exact torrent URL.
- Source field can have a tracker-specific requirement, or it can be fully optional.
- Click on **Create** and set the destination.

::: details Image preview
![](/ss/qbit/creator.png)
:::

::: details Extra: Seeding your torrent
After submitting your torrent with the **.torrent**,
- Download the **.torrent** file from the new generated page.
- Open the **.torrent** and set the download destination where the file/folder is kept

qBittorrent will check the file/folder and start seeding.
:::

## VPN Binding

VPN binding is used so that your client only leeches and seeds through your desired VPN and isn't connecting to the internet otherwise.
___

#### Steps
- Press `Alt + O` to open settings and then go to **Advanced** section.
- Click on the value of **Network Interface**
- Select your desired VPN interface
- Hit **OK** and restart qBittorrent.

::: details Image preview
![](/ss/qbit/bind.png)
:::
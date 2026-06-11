---
title: qBittorrent
customDescription: Various how-tos for qBittorrent
og:
    image: https://i.wotaku.wiki/f/tor.png
---

## RSS Feed
You can use [RSS Feed](https://en.wikipedia.org/wiki/RSS) to get an upload feed from supported sites. In this case, we're gonna use [Nyaa](https://nyaa.si/) to fetch from [1r0n's](https://nyaa.si/user/tsuna69) profile. You can fetch from other pages too in a similar way.

::: tabs

== Enabling RSS

::: steps
1. Press `Alt + O` to open settings and then go to **RSS** section.
2. Check "**Enable fetching RSS feeds**" and "**Enable auto downloading of RSS torrents**".
3. You can also customize the refresh interval and max article number there.
:::

<Collapsible title="Image preview">

![](/ss/qbit/rss1.png)

</Collapsible>

== Adding feed URL

::: steps
1. Close the settings and go to the **RSS** tab.
2. To get the RSS feed URL of a page in [**Nyaa**](https://nyaa.si/), click on the **RSS** button.
3. Copy the feed URL from the address bar.
4. Now to add the feed URL, click on **New subscription**.
5. Then rename it to a relevant name. For that right click on feed URL, then **Edit feed URL...**
:::

<Collapsible title="Image preview">

![](/ss/qbit/rss2.png)

![](/ss/qbit/rss3.png)

</Collapsible>

== Adding Rules

:::steps
1. Go to the **RSS Downloader** (at the top right) and add a new download rule.
2. Go to the bottom section of the middle column and select feed URLs.
3. To filter the feed, you have to add some rules. Hover over the rule field to get writing instruction. The right column will show the selected article preview for that specific rule.
4. Then click **Close** and it will start downloading those.
:::

<Collapsible title="Image preview">

![](/ss/qbit/rss4.png)

</Collapsible>

:::

## Torrent Creator

The torrent creator is used to generate **.torrent** files that let you download files from a tracker. This guide is generalized, so **read the rules of your tracker before uploading to see if they have any tracker specific rules.**


::: steps
1. Press `Ctrl + N` to open up the **Torrent Creator**.
2. Select the file or folder you wanna upload.
3. You should adjust the piece size in order to keep the piece count between 1000 and 2000.
4. Depending on your tracker, check the Private tracker option.
5. Check **Optimize Alignment** and keep it **Disabled**
6. Add your announce URL given by the tracker in **Tracker URLs**. For public trackers, it's the same for everyone. For PTs, you get a personal announce URL, which you should keep private. Note that you should only add the announce URLs for the specific tracker you are uploading to. If one tracker has multiple announce URLs, add each in a new line.
7. Comment field gets filled by the tracker with the exact torrent URL.
8. Source field can have a tracker-specific requirement, or it can be fully optional.
9. Click on **Create** and set the destination.
:::

<Collapsible title="Image preview">

![](/ss/qbit/creator.png)

</Collapsible>

<Collapsible title="Extra: Seeding your torrent">

After submitting your torrent with the **.torrent**,
- Download the **.torrent** file from the new generated page.
- Open the **.torrent** and set the download destination where the file/folder is kept

qBittorrent will check the file/folder and start seeding.

</Collapsible>

## VPN Binding

VPN binding is used so that your client only leeches and seeds through your desired VPN and isn't connecting to the internet otherwise.
___

::: steps
1. Press `Alt + O` to open settings and then go to **Advanced** section.
2. Click on the value of **Network Interface**
3. Select your desired VPN interface
4. Hit **OK** and restart qBittorrent.
:::
<Collapsible title="Image preview">

![](/ss/qbit/bind.png)

</Collapsible>
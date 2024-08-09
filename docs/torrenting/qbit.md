---
title: qBittorrent
customDescription: Various how-tos for qBittorrent
---

<GradientCard tag="qBittorrent" description="Various how-tos for qBittorrent" theme="turquoise"/>

## RSS Feed
You can use [RSS Feed](https://en.wikipedia.org/wiki/RSS) to get an upload feed from supported sites. In this case, we're gonna use [Nyaa](https://nyaa.si/) to fetch from [1r0n's](https://nyaa.si/user/tsuna69) profile. You can fetch from other pages too in a similar way.

___

#### Step 1: Enabling RSS
- Press `Alt + O` to open settings and then go to **RSS** section.
- Check "**Enable fetching RSS feeds**" and "**Enable auto downloading of RSS torrents**".
- You can also customize the refresh interval and max article number there.

::: details Image preview
![](/ss/rss/p1.png)
:::

#### Step 2: Adding feed URL
- Close the settings and go to the **RSS** tab.
- To get the RSS feed URL of a page in [**Nyaa**](https://nyaa.si/), click on the **RSS** button.
- Copy the feed URL from the address bar.

::: details Image preview
![](/ss/rss/nyaa.png)
:::

- Now to add the feed URL, click on **New subscription**.
- Then rename it to a relevant name. For that right click on feed URL, then **Edit feed URL...**

::: details Image preview
![](/ss/rss/p2.png)
:::

#### Step 3: Adding Rules
- Go to the **RSS Downloader** (at the top right) and add a new download rule.
- Go to the bottom section of the middle column and select feed URLs.
- To filter the feed, you have to add some rules. Hover over the rule field to get writing instruction. The right column will show the selected article preview for that specific rule.
- Then click **Close** and it will start downloading those.

::: details Image preview
![](/ss/rss/p3.png)
:::


## VPN Binding

VPN binding is used so that your client only leeches and seeds through your desired VPN and isn't connecting to the internet otherwise.
___

#### Steps
- Press `Alt + O` to open settings and then go to **Advanded** section.
- Click on the value of **Network Interface**
- Select your desired VPN interface
- Hit **OK** and restart qBittorent.

::: details Image preview
![](/ss/bind.png)
:::
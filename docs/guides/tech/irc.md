---
title: IRC & XDCC
customDescription: Basic guide on how to use IRC.
---

<GradientCard title="IRC & XDCC" description="Basic guide on how to use IRC" theme="turquoise" variant="thin"/>

IRC (Internet Relay Chat) is a real-time messaging protocol, while XDCC (eXtended DCC) is a method used on IRC to facilitate file sharing through direct client-to-client connections. In this guide, we explained how to use bots in IRC.
<br>

## Getting Started
1. Install an [**IRC Client**](#irc-client) on your device.
2. Go to a [**XDCC Packlists**](#xdcc-packlists) and search for your content
3. Click on the search result for the command message 

**Standard XDCC command** `/msg [bot name] xdcc send #[packet number]`


1. Join the server and the channel of the bot and send the command message
2. It will show a pop up for the download.

::: info SSL issue
If you face any issues when connecting, try enabling **"Accept invalid SSL certificates"** in the network options.
:::


## IRC Client
- [Revolution IRC](https://f-droid.org/packages/io.mrarm.irc/) <Badge type="info" text="Android" />
- [IRCCloud](https://github.com/irccloud/android) <Badge type="info" text="Android" />
- [HexChat](https://hexchat.github.io/)	<Badge type="info" text="Windows" /><tooltip>Repo is archived, but still works properly.</tooltip>
- [mIRC](https://www.mirc.com/)	<Badge type="info" text="Windows" />
- [AdiIRC](https://adiirc.com/)	<Badge type="info" text="Windows" />
- [KVIrc](https://github.com/kvirc/KVIrc/releases) <Badge type="info" text="Windows" /><Badge type="info" text="Linux" /><Badge type="info" text="macOS" />
- [Irssi](https://irssi.org/) <Badge type="info" text="Linux" />
- [WeeChat](https://weechat.org/) <Badge type="info" text="Linux" /><Badge type="info" text="macOS" />
- [LimeChat](https://apps.apple.com/us/app/limechat/id414030210) <Badge type="info" text="macOS" />


::: info Client info
[**Click here**](https://ircv3.net/software/clients) more clients.
:::


## XDCC Packlists
- [**nibl**](https://nibl.co.uk/search)	<Badge type="info" text="Anime" />
	- Server: `irc.rizon.net`
	- Port: `6697`
	- Channel: `#nibl`
- [**subsplease**](https://subsplease.org/xdcc/) <Badge type="info" text="Anime" />
	- Server: `irc.rizon.net`
	- Port: `6697`
	- Channel: `#subsplease`
- [**animk**](https://animk.info/xdcc/) <Badge type="info" text="Anime" />
	- Server: `irc.xertion.org`
	- Port: `6697`
	- Channel: `#MK` or `XDCCLeech`
- [**XDCC EU**](https://www.xdcc.eu/) <Badge type="info" text="General" />
- [**SunXDCC**](https://sunxdcc.com/) <Badge type="info" text="General" />


::: warning Both XDCC EU and SunXDCC don't have a single bot channel. They mention the server and the channel address in the search result<
:::


:::info XDCC EU
1. Click on the ℹ️ button
2. Join the server and the channel of the bot
3. copy and send the bot command in the channel
    ![XDCC EU](/ss/irc/xdcceu.png)
:::

::: info SunXDCC
1. Join the server and the channel of the bot. 
2. Make the bot command according to the standard form. For this screenshot the bot command will be `/msg [FutureBot]-[C21] xdcc send #530`
	![SunXDCC](/ss/irc/sunxdcc.png)
:::

## Batch DL

- `/msg [botname] XDCC BATCH [a]-[b]` → Request packs with numbers a to b, including a and b, from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]` → Request packs with numbers [a],[b] and [c] from the bot.
- `/msg [botname] XDCC BATCH [a]-[b] [password]` → Request passworded packs with numbers a to b, including a and b, with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c] [password]` → Request packs with numbers [a],[b] and [c], with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]-[d]` → Request packs with numbers a, b and c to d from the bot. (i.e, you can combine the two methods of saying which set of packs you want)


::: info More commands [here](https://wiki.xertion.org/w/XDCC_Commands).
:::


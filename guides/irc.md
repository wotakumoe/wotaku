---
title: IRC
customDescription: Learn how to use IRC and XDCC for real-time messaging and file sharing. Install an IRC client, search for XDCC packlists, and download files through direct client-to-client connections.
---

![](/thumb/irc.webp)
# IRC & XDCC
IRC (Internet Relay Chat) is a real-time messaging protocol, while XDCC (eXtended DCC) is a method used on IRC to facilitate file sharing through direct client-to-client connections. In this guide, we explaned how to use bots in IRC.
<br>

## Getting Started
1. Install an [**IRC Client**](#irc-client) on your device.
2. Go to a [**XDCC Packlists**](#xdcc-packlists) and search for your content
3. Click on the search result for the command message 

<Button icon="i-fxemoji-lightbulb">Standard XDCC command `/msg [bot name] xdcc send #[packet number]`</Button>
4. Join the server and the channel of the bot and send the command message
5. It will show a pop up for the download.

<Button icon="i-fxemoji-warningsign">You may face some issue if you turn on SSL while logging in</Button>

## IRC Client
- [Revolution IRC](https://play.google.com/store/apps/details?id=io.mrarm.irc)		<Badge type="info" text="Android" />
- [AndroIRC](https://play.google.com/store/apps/details?id=com.androirc&hl=en&gl=US)		<Badge type="info" text="Android" />
- [HexChat](https://hexchat.github.io/)		<Badge type="info" text="Windows" />
- [mIRC](https://www.mirc.com/)		<Badge type="info" text="Windows" />
- [AdiIRC](https://adiirc.com/)	<Badge type="info" text="Windows" />
- [KVIrc](https://github.com/kvirc/KVIrc/releases) <Badge type="info" text="Windows" /><Badge type="info" text="Linux" /><Badge type="info" text="macOS" />
- [Irssi](https://irssi.org/)	<Badge type="info" text="Linux" />
- [WeeChat](https://weechat.org/)	<Badge type="info" text="Linux" /><Badge type="info" text="macOS" />
- [LimeChat](https://apps.apple.com/us/app/limechat/id414030210) <Badge type="info" text="macOS" />

<Button link="https://ircv3.net/software/clients" icon="i-fxemoji-lightbulb">Click here more clients</Button>

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
- [**XDCC EU**](https://www.xdcc.eu/)	<Badge type="info" text="General" />
- [**SunXDCC**](https://sunxdcc.com/)	<Badge type="info" text="General" />


<Button icon="i-fxemoji-warningsign">Both XDCC EU and SunXDCC don't have a single bot channel. They mention the server and the channel address in the search result</Button>


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


<Button link="https://wiki.xertion.org/w/XDCC_Commands" icon="i-octicon-command-palette-16">More commands here. </Button>

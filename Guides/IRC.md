---
label: IRC
author:  
  name: "Duck"
  link: https://github.com/anotherduckling
  avatar: https://avatars.githubusercontent.com/u/57977673?v=4
---
![](https://cdn.apollo.moe/img/irc.png)
# IRC & XDCC

>IRC stands for Internet Relay Chat. It's a real-time chat protocol that allows people to communicate with each other in online chat rooms. IRC has been around since the late 1980s and is still used today, although it has largely been replaced by newer chat technologies like Discord.

>XDCC is a file-sharing protocol that is often used on IRC. XDCC stands for "eXtended DCC," and it allows users to send and receive files through direct client-to-client (DCC) transfers. This is typically done using a bot, which acts as a file server and manages the file transfers. XDCC has been used for many years as a way to share files, but it has become less popular over time due to the rise of other file-sharing technologies.


# Getting Started
1. Install an [**IRC Client**](#irc-client) on your device.
2. Go to a [**XDCC Packlists**](#xdcc-packlists) and search for your content
3. Click on the search result for the command message 
!!!info
Standard XDCC command `/msg [bot name] xdcc send #[packet number]`
!!!
4. Join the server and the channel of the bot and send the command message
5. It will show a pop up for the download.

!!!warning
You may face some issue if you turn on SSL while logging in.
!!!


## IRC Client
- [Revolution IRC](https://play.google.com/store/apps/details?id=io.mrarm.irc)		[!badge variant="ghost" text="Android"]
- [AndroIRC](https://play.google.com/store/apps/details?id=com.androirc&hl=en&gl=US)		[!badge variant="ghost" text="Android"]
- [hexchat](https://hexchat.github.io/)		[!badge variant="ghost" text="Windows"]
- [mIRC](https://www.mirc.com/)		[!badge variant="ghost" text="Windows"]
- [AdiIRC](https://adiirc.com/)	[!badge variant="ghost" text="Windows"]
- [KVIrc](https://github.com/kvirc/KVIrc/releases) [!badge variant="ghost" text="Windows"] [!badge variant="ghost" text="Linux"] [!badge variant="ghost" text="macOS"]
- [Irssi](https://irssi.org/)	[!badge variant="ghost" text="Linux"]
- [WeeChat](https://weechat.org/)	[!badge variant="ghost" text="Linux"] [!badge variant="ghost" text="macOS"]
- [LimeChat](https://apps.apple.com/us/app/limechat/id414030210) [!badge variant="ghost" text="macOS"]
!!!info
More clients [**here.**](https://ircv3.net/software/clients)
!!!


## XDCC Packlists
- [**nibl**](https://nibl.co.uk/search)	[!badge variant="ghost" text="Anime"]
	- Server: `irc.rizon.net`
	- Port: `6697`
	- Channel: `#nibl`
- [**subsplease**](https://subsplease.org/xdcc/) [!badge variant="ghost" text="Anime"]
	- Server: `irc.rizon.net`
	- Port: `6697`
	- Channel: `#subsplease`
- [**animk**](https://animk.info/xdcc/) [!badge variant="ghost" text="Anime"]
	- Server: `irc.xertion.org`
	- Port: `6697`
	- Channel: `#MK` or `XDCCLeech`
- [**XDCC EU**](https://www.xdcc.eu/)	[!badge variant="ghost" text="General"]
- [**SunXDCC**](https://sunxdcc.com/)	[!badge variant="ghost" text="General"]

!!!light Both **XDCC EU** and **SunXDCC** don't have a single bot channel. They mention the server and the channel address in the search result.
!!!

!!!info XDCC EU
1. Click on the ℹ️ button
2. Join the server and the channel of the bot
3. copy and send the bot command in the channel
    ![XDCC EU](/static/ss/irc/xdcceu.png)
!!!
!!!info SunXDCC
1. Join the server and the channel of the bot. 
2. Make the bot command according to the standard form. For this screenshot the bot command will be `/msg [FutureBot]-[C21] xdcc send #530`
	![SunXDCC](/static/ss/irc/sunxdcc.png)
!!!

## Batch DL

- `/msg [botname] XDCC BATCH [a]-[b]` → Request packs with numbers a to b, including a and b, from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]` → Request packs with numbers [a],[b] and [c] from the bot.
- `/msg [botname] XDCC BATCH [a]-[b] [password]` → Request passworded packs with numbers a to b, including a and b, with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c] [password]` → Request packs with numbers [a],[b] and [c], with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]-[d]` → Request packs with numbers a, b and c to d from the bot. (i.e, you can combine the two methods of saying which set of packs you want)

!!!light More commands are [**here**](https://wiki.xertion.org/w/XDCC_Commands).
!!!
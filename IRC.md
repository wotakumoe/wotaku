---
label: IRC
visibility: hidden
---
![](/static/thumb/irc.png)
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
- [Revolution IRC](https://play.google.com/store/apps/details?id=io.mrarm.irc)		`Android`
- [AndroIRC](https://play.google.com/store/apps/details?id=com.androirc&hl=en&gl=US)		`Android`
- [hexchat](https://hexchat.github.io/)		`Windows`
- [mIRC](https://www.mirc.com/)		`Windows`
- [AdiIRC](https://adiirc.com/)	`Windows`
- [KVIrc](https://github.com/kvirc/KVIrc/releases) `Windows	| Linux	| macOS`
- [Irssi](https://irssi.org/)		`Linux`
- [WeeChat](https://weechat.org/)		`Linux | macOS`
- [LimeChat](https://apps.apple.com/us/app/limechat/id414030210) `macOS`
- [KiwiIRC](https://kiwiirc.com/)	`Web`
!!!info
More clients [**here.**](https://ircv3.net/software/clients)
!!!

## XDCC Packlists
- [**nibl**](https://nibl.co.uk/search)	`Anime`
	> Server: irc.rizon.net Port:**6697**
	> Channel: **#nibl**
- [**subsplease**](https://subsplease.org/xdcc/)	`Anime`
	> Server: irc.rizon.net Port:**6697**
	> Channel: **#subsplease**
- [**animk**](https://animk.info/xdcc/)	`Anime`
	> Server: irc.xertion.org Port:**6697**
	> Channel: **#MK** or **XDCCLeech**
- [**XDCC EU**](https://www.xdcc.eu/)	`General`
- [**SunXDCC**](https://sunxdcc.com/)	`General`


!!!light Both **XDCC EU** and **SunXDCC** don't have a single bot channel. They mention the server and the channel address in the search result.
!!!

!!!info XDCC EU
1. Click on the ℹ️ button
2. Join the server and the channel of the bot
3. copy and send the bot command in the channel
    ![XDCC EU](https://media.discordapp.net/attachments/1015131233824538624/1076836987685842954/09ZIEDV.png)
!!!
!!!info SunXDCC
1. Join the server and the channel of the bot. 
2. Make the bot command according to the standard form. For this screenshot the bot command will be `/msg [FutureBot]-[C21] xdcc send #530`
	![SunXDCC](https://media.discordapp.net/attachments/1015131233824538624/1076842622389342278/GZC9SSf.png)
!!!

## Batch DL

- `/msg [botname] XDCC BATCH [a]-[b]` → Request packs with numbers a to b, including a and b, from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]` → Request packs with numbers [a],[b] and [c] from the bot.
- `/msg [botname] XDCC BATCH [a]-[b] [password]` → Request passworded packs with numbers a to b, including a and b, with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c] [password]` → Request packs with numbers [a],[b] and [c], with password "password" from the bot.
- `/msg [botname] XDCC BATCH [a],[b],[c]-[d]` → Request packs with numbers a, b and c to d from the bot. (i.e, you can combine the two methods of saying which set of packs you want)

!!!light More commands are [**here**](https://wiki.xertion.org/w/XDCC_Commands).
!!!
---
title: IRC & XDCC
customDescription: Basic guide on how to use IRC.
og:
    image: https://files.catbox.moe/l2g45x.png
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
- [Revolution IRC](https://f-droid.org/packages/io.mrarm.irc/) :and:
- [IRCCloud](https://github.com/irccloud/android) :and:
- [HexChat](https://hexchat.github.io/)	:win:<tooltip>Repo is archived, but still works properly.</tooltip>
- [mIRC](https://www.mirc.com/)	:win:
- [AdiIRC](https://adiirc.com/)	:win:
- [KVIrc](https://github.com/kvirc/KVIrc/releases) :win::lin::app:
- [Irssi](https://irssi.org/) :lin:
- [WeeChat](https://weechat.org/) :lin::app:
- [LimeChat](https://apps.apple.com/us/app/limechat/id414030210) :app:


::: info Client info
[**Click here**](https://ircv3.net/software/clients) more clients.
:::


## XDCC Packlists
| Website | Server | Port | Channel |
|-|-|-|-|
| [nibl](https://nibl.co.uk/search) | irc.rizon.net | 6697 / 9999 | #nibl |
| [subsplease](https://subsplease.org/xdcc/) | ^^ | ^^ | #subsplease |
| [Anidex](https://xdcc.anidex.moe/) | ^^ | ^^ | #Doki |
| [animk](https://animk.info/xdcc/) | irc.xertion.org | 6667 | #MK / #XDCCLeech |

## XDCC Indexers
- [SkullXDCC](https://skullxdcc.com/)
- [SunXDCC](https://sunxdcc.com/)
- [XDCC.EU](https://www.xdcc.eu/)

::: details SkullXDCC
1. Click on your desired file.
2. Join the server and the channel of the bot. 
3. Click on the marked place to copy the cmd. Then paste the cmd in that channel.

![SkullXDCC](/ss/irc/skull.webp)
:::

::: details SunXDCC
1. Join the server and the channel of the bot. 
2. Make the bot command according to the standard form. For this screenshot the bot command will be `/msg [FutureBot]-[C21] xdcc send #530`

![SunXDCC](/ss/irc/sunxdcc.png)
:::

::: details XDCC.EU
1. Click on the :mingcute-information-line: button
2. Join the server and the channel of the bot
3. copy and send the bot command in the channel

![XDCC.EU](/ss/irc/xdcceu.png)
:::

## Batch DL

| Command                                      | Action                                                             |
|----------------------------------------------|--------------------------------------------------------------------|
| `/msg [botname] XDCC BATCH [a]-[b]`         | Request packs with numbers a to b, including a and b.             |
| `/msg [botname] XDCC BATCH [a],[b],[c]`     | Request packs with numbers a, b, and c.                           |
| `/msg [botname] XDCC BATCH [a]-[b] [password]` | Request passworded packs with numbers a to b, including a and b. |
| `/msg [botname] XDCC BATCH [a],[b],[c] [password]` | Request packs with numbers a, b, and c, with a password. |
| `/msg [botname] XDCC BATCH [a],[b],[c]-[d]` | Request packs with numbers a, b, and c to d.                      |

::: info More commands [here](https://wiki.xertion.org/w/XDCC_Commands).
:::


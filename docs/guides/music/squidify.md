---
title: Squidify
customDescription: Guide on how to use squidify on various devices. 
og:
    image: https://files.catbox.moe/q4b9bu.png
---


<GradientCard title="Squidify" description="Guide on how to use squidify on various devices" theme="turquoise" variant="thin"/>


Squidify is a public music streaming service that offers a vast collection of Anime, Video Game, Movie & TV Soundtracks. You listen to your music collection from any browser or mobile device. Squidify is compatible with the Subsonic/Airsonic API, allowing you to use a wide range of third-party mobile apps to access your music.
<br>

## Clients

Squidify is based on Navidrome which has its own set of third-party Apps besides its own [Web UI](https://www.squidify.org/). It should be compatible with all Subsonic clients. The following clients are tested and confirmed to work properly:


::: tabs
== Android
- [Subtracks](https://github.com/austinried/subtracks#readme)
- [substreamer](https://substreamerapp.com/)
- [Ultrasonic](https://ultrasonic.gitlab.io/)
- [Symfonium](https://symfonium.app/) :paid:
- [Tempo](https://github.com/CappielloAntonio/tempo)
- [Chora](https://github.com/CraftWorksMC/Chora)

== iOS

- [play:Sub](https://michaelsapps.dk/playsubapp/)
- [substreamer](https://substreamerapp.com/)
- [Amperfy](https://github.com/BLeeEZ/amperfy#readme)
- [iSub](https://isub.app)


== Desktop

- [Sonixd](https://github.com/jeffvli/sonixd) :win::app::lin:
- [Feishin](https://github.com/jeffvli/feishin) :win::app::lin:
- [Sublime Music](https://sublimemusic.app/) :app::lin:
- [Supersonic](https://github.com/dweymouth/supersonic) :win::app::lin:
- [Submariner](https://submarinerapp.com/) :app:
- [Aonsoku](https://github.com/victoralvesf/aonsoku) :win::app::lin:
- [ampcast](https://ampcast.app/) :win::app::lin::web: [:gh:](https://github.com/rekkyrosso/ampcast)
- **CLI**
    - [Jellycli](https://github.com/tryffel/jellycli#readme) :win::app::lin:
    - [STMP](https://github.com/wildeyedskies/stmp#readme) :app::lin::app:

== Others

- [SonicLair](https://github.com/thelinkin3000/SonicLair) :material-symbols-google-tv:
- **Connected Speakers**
  - [bonob](https://github.com/simojenki/bonob#readme) :simple-icons-sonos:
  - [AskSonic](https://github.com/srichter/asksonic#readme) :simple-icons-amazonalexa:
- [Subsonic Kodi Plugin](https://github.com/warwickh/plugin.audio.subsonic#readme)
- [Navidrome Kodi Plugin](https://github.com/BobHasNoSoul/plugin.audio.navidrome#readme)
- [HTTPDirFS](https://github.com/fangfufu/httpdirfs#readme)
- [upmpdcli](https://www.lesbonscomptes.com/upmpdcli/index.html)
    - Expose Navidrome as a UPnP/DLNA media library. See the [**discussion**](https://github.com/navidrome/navidrome/discussions/2324).
:::

::: info More clients
For more options, look at the [**list of clients**](https://airsonic.github.io/docs/apps/) maintained by the Airsonic project
:::


## Credentials

Connecting to Squidify is very easy, just login with the following credentials:

- Server Address: `https://www.squidify.org` or `https://www.squidify.net`
- Port (If needed): `443`
- Username: `Guest`
- Password: `Guest`
- Force Clear Text Password<sup>1</sup>: Disabled / Off

> 1. We recommend sending the Password as Token + Salt. Not all Clients have this option though.

::: info More info
To request additional soundtracks or inquire about Squidify, join [SquidBoard](https://www.squid-board.org/).
:::





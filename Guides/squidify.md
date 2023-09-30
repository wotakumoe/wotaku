---
label: Squidify
---

![](/static/ss/squidify.png)
# Squidify

Squidify is a public music streaming service that offers a vast collection of Anime, Video Game, Movie & TV Soundtracks. You listen to your music collection from any browser or mobile device. Squidify is compatible with the Subsonic/Airsonic API, allowing you to use a wide range of third-party mobile apps to access your music.

## Clients

Squidify is based on Navidrome which has its own set of third-party Apps besides its own [Web UI](https://www.squidify.org/){target="_blank"}. It should be compatible with all Subsonic clients. The following clients are tested and confirmed to work properly:

+++ Android

- [Subtracks](https://github.com/austinried/subtracks#readme){target="_blank"}
- [substreamer](https://substreamerapp.com/){target="_blank"}
- [Ultrasonic](https://ultrasonic.gitlab.io/){target="_blank"}
- [DSub](https://play.google.com/store/apps/details?id=github.daneren2005.dsub){target="_blank"}
- [Symfonium](https://symfonium.app/){target="_blank"} [!badge variant="ghost" size="xs" text="Paid"]

+++ iOS

- [play:Sub](http://michaelsapps.dk/playsubapp/){target="_blank"}
- [substreamer](https://substreamerapp.com/){target="_blank"}
- [Amperfy](https://github.com/BLeeEZ/amperfy#readme){target="_blank"}
- [iSub](https://isub.app){target="_blank"}


+++ Desktop

- [Sonixd](https://github.com/jeffvli/sonixd){target="_blank"} [!badge variant="ghost" size="xs" text="Windows"] [!badge variant="ghost" size="xs" text="Linux"] [!badge variant="ghost" size="xs" text="MacOS"]
- [Sublime Music](https://sublimemusic.app/){target="_blank"} [!badge variant="ghost" size="xs" text="Linux"]
- [Supersonic](https://github.com/dweymouth/supersonic){target="_blank"} [!badge variant="ghost" size="xs" text="Windows"] [!badge variant="ghost" size="xs" text="Linux"] [!badge variant="ghost" size="xs" text="MacOS"]
- [Submariner](https://submarinerapp.com/){target="_blank"} [!badge variant="ghost" size="xs" text="MacOS"]
- [Feishin](https://github.com/jeffvli/feishin){target="_blank"} [!badge variant="danger" size="xs" text="Buggy"] [!badge variant="ghost" size="xs" text="Linux"] [!badge variant="ghost" size="xs" text="MacOS"]

+++ CLI

- [Jellycli](https://github.com/tryffel/jellycli#readme){target="_blank"} [!badge variant="ghost" size="xs" text="Windows"] [!badge variant="ghost" size="xs" text="Linux"]
- [STMP](https://github.com/wildeyedskies/stmp#readme){target="_blank"} [!badge variant="ghost" size="xs" text="Linux"] [!badge variant="ghost" size="xs" text="MacOS"]

+++ Others

- **Connected Speakers**
  - [bonob](https://github.com/simojenki/bonob#readme){target="_blank"} [!badge variant="ghost" size="xs" text="Sonos"]
  - [AskSonic](https://github.com/srichter/asksonic#readme){target="_blank"} [!badge variant="ghost" size="xs" text="Alexa"]
- [Subsonic Kodi Plugin](https://github.com/warwickh/plugin.audio.subsonic#readme){target="_blank"}
- [Navidrome Kodi Plugin](https://github.com/BobHasNoSoul/plugin.audio.navidrome#readme){target="_blank"}
- [HTTPDirFS](https://github.com/fangfufu/httpdirfs#readme){target="_blank"}
- [upmpdcli](https://www.lesbonscomptes.com/upmpdcli/index.html)
    - Expose Navidrome as a UPnP/DLNA media library. See the [!badge variant="dark" target="blank" text="discussion"](https://github.com/navidrome/navidrome/discussions/2324){target="_blank"}

+++

> For more options, look at the [list of clients](https://airsonic.github.io/docs/apps/){target="_blank"} maintained by the Airsonic project.

## Credentials

Connecting to Squidify is very easy, just login with the following credentials:

- Server Address: `https://www.squidify.org`
- Port (If needed): `443`
- Username: `Guest`
- Password: `Guest`
- Force Clear Text Password^1^: Disabled / Off

 1. We recommend sending the Password as Token + Salt. Not all Clients have this option though.

!!! Query
To request additional soundtracks or inquire about Squidify, join [**SquidBoard**](https://www.squid-board.org/){target="_blank"}.
!!!




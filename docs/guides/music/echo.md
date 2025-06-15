---
title: Echo
customDescription: Guide on how to use echo. 
outline: [2,3]
og:
    image: https://files.catbox.moe/60r3ra.png
---


<GradientCard title="Echo" description="Guide on how to use echo" theme="turquoise" variant="thin"/>

[**Echo**](https://github.com/brahmkshatriya/echo) is an extension-based music player app. It can play music from streaming websites (e.g., YouTube, Spotify, Deezer) and self-hosted servers (e.g., Jellyfin). Echo also supports external lyrics and music tracking (e.g., Last.fm).

## Getting started

### Installing Echo
- Download the first ZIP file from the [**nightly**](https://nightly.link/brahmkshatriya/echo/workflows/nightly/main/artifact) page.
- Unzip the downloaded file. If your file manager doesn't support unzipping, try using [MiXplorer](https://forum.xda-developers.com/showpost.php?p=23109280).
- You will find an `.apk` file inside. Install it on your device.


### Installing extension
Extensions are mix of `.eapk` and `.apk`. `.eapk` ones will be installed without any extra steps. But for `.apk`, you have to install it like normal apps.

::: tabs

== Link / Code

| Extension | Code | Manual |
|-|-|-|
| All-in-one :s: | `extension` | [Link](https://raw.githubusercontent.com/itsmechinmoy/echo-extensions/main/echo_extensions.json) |
| EchoDown | `echodown` | [Link](https://paste.rs/9x6hj) |

== Repositories

| Dev            | Extensions                                                                 |
|----------------|------------------------------------------------------------------------|
| brahmkshatriya | [Cineby](https://github.com/brahmkshatriya/echo-cineby-extension/releases)         |
| ^^             | [Discord](https://github.com/brahmkshatriya/echo-discord/releases)                 |
| ^^             | [Spotify](https://github.com/brahmkshatriya/echo-spotify-extension/releases)       |
| ^^             | [YouTube](https://github.com/brahmkshatriya/echo-youtube-extension/releases)       |
| GrimXer0       | [TuneIn](https://github.com/GrimXer0/EchoTuneIn-extension/releases)                |
| LuftVerbot     | [Deezer](https://github.com/LuftVerbot/echo-deezer-extension/releases)             |
| ^^             | [Echodown](https://github.com/LuftVerbot/echo-echodown-extension/releases)         |
| rebelonion     | [ASMR One](https://github.com/rebelonion/echo-asmr-one/releases)                   |
| ^^             | [Last.fm](https://github.com/rebelonion/echo-lastfm/releases)                      |
| ^^             | [Lyrics Translator](https://github.com/rebelonion/echo-lyrics-translator/releases) |
| Secozzi        | [Jellyfin](https://github.com/Secozzi/echo-jellyfin-extension/releases)            |
| shub39         | [Genius](https://github.com/shub39/echo-genius-extension/releases)                 |
| ^^             | [Kugou](https://github.com/shub39/echo-kugou-extension/releases)                   |
| ^^             | [Lrclib](https://github.com/shub39/echo-lrclib-extension/releases)                 |
| ^^             | [Musixmatch](https://github.com/shub39/echo-musixmatch-extension/releases)         |


:::

#### Steps

::: tabs

== Link / Code

- Open the Echo app.
- Tap the :material-symbols-stream-rounded: **Extension** icon.
- Tap :material-symbols-add-circle-outline-rounded: **Add Extension** and enter the shortcode or URL from [**here**](#installing-extension).
- Tap **Add**.
- A menu will appear displaying all available extensions.  
- Select the extensions you want to install.  
- Tap **Add** to install the selected extensions. 
- The **Extension Installer** menu will pop up for each extension. Tap **Install**.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/l9WsxYekKfY" frameborder="0" allowfullscreen></iframe></div>

== File
- Go to [repositories](#installing-extension) tab and tap on the repo you want to add in the player.
- Download the latest `.apk` / `.eapk` from there.
- Open the Echo app.
- Tap the :material-symbols-stream-rounded: **Extension** icon.
- Tap :material-symbols-add-circle-outline-rounded: **Add Extension** and tap on **File**.
- Tap "**Add**" then select the downloaded `.apk` / `.eapk`.
- The **Extension Installer** menu will pop up. Tap **Install**.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/QTP9PruoH8c" frameborder="0" allowfullscreen></iframe></div>
:::

### Updating extension
Echo automatically checks for extension updates every 6 hours. If you'd like to check for updates manually,
- Go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-info-outline-rounded: **Misc**
- Hold tap "**Check for Extensions Updates**"
- If it finds new update, it will give prompt to install the update.
- After installation, restart Echo.


### Playing music
By default, Echo is an offline music player. You have to install [music extensions](#installing-extension) to stream music.

- Click :material-symbols-stream-rounded: **Extension** icon and select a music streaming extension.
- Depending on the extension:
  - It can show and play songs without login (e.g., YouTube Music).
  - It may show playlists and songs but cannot play any tracks (e.g., Spotify).
  - It may not show anything without login (e.g., Deezer).

To access personalized content, playlists, and streaming features, add your account. To add an account,
- Go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-stream-rounded: **Extension**
- Then click on the music streaming extension you want to link.
- Click :material-symbols-login-rounded: **Login** and follow the instructions.

::: info Unified Extension
The Unified Extension lets you browse all extensions from the top bar. In the library, you can create playlists and add songs from multiple services there.
:::

## Important

#### Spotify Account Suspension
The Spotify extension violates Spotify’s Terms of Service. Accounts are typically suspended in waves. The Echo development team is not responsible for any account suspension. If your account is suspended, you will need to contact Spotify Support directly.


## Miscellaneous

::: tabs

== Downloading
To download songs in Echo, you have to install [EchoDown](#installing-extension) extension.

- Open any song/album you want to download.
- Press :material-symbols-more-horiz: to open the menu and then click :material-symbols-download-for-offline-outline-rounded: **Download**

You can see the progress in :material-symbols-settings-outline-rounded: **Settings** ->  :material-symbols-download-for-offline-outline-rounded: **Downloads**. Once done, you'll find them in :material-symbols-files-outline: **Offline**. If you can't find offline section, click the extension icon, and select :material-symbols-files-outline: **Offline** from there.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/-TamZ_J7NmA" frameborder="0" allowfullscreen></iframe></div>

== Lyrics Provider
Echo supports multiple lyrics provider. You can select the lyrics provider from the player.
- Play a song and click on **Lyrics**.
- Then scroll up and you will see :material-symbols-queue-music-rounded: Music Provider "Logo".
- Click on the logo and select the lyrics provider.

Last selected lyrics provider will be set as default lyrics provider.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/t0lBUbf4HLs" frameborder="0" allowfullscreen></iframe></div>

== Spotify transfer
### Export
- Go to [**Exportify**](https://exportify.net)
- Login with Spotify
- Click "**Export**" beside each playlist
- Save the CSV files

### Import
- Go to [**TuneMyMusic**](https://www.tunemymusic.com)
- Select "**File**" as source
- Upload your CSV file
- Select "**Spotify**" as destination
- Login to new account
- Name playlist and click "Start Moving My Music"
- Repeat for each playlist

You can also use [Trikatuka](https://trikatuka.aknakn.eu/#/) to transfer data from one Spotify account to another.
:::



## Troubleshooting

### General

#### Extension Update Issue
Some ISPs might block GitHub raw or gist URLs, which can prevent extension updates. To work around this, use a [VPN](/qs#vpn).

___

### Deezer

#### Deezer not available in my country
Use a [VPN](/qs#vpn) to create your Deezer account. After that, you can access Deezer without a VPN by using a proxy server. To set up a proxy, go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-stream-rounded: **Extension** -> **Deezer** -> **Use Proxy**, and select a proxy server from the list.

---
title: Echo
customDescription: Guide on how to use echo. 
outline: [2,3]
og:
    image: https://files.catbox.moe/60r3ra.png
---


<GradientCard title="Echo" description="Guide on how to use echo" theme="turquoise" variant="thin"/>

[**Echo**](https://github.com/brahmkshatriya/echo) is an extension-based music player app. It can play music from streaming websites (e.g., YouTube, Spotify, Deezer) and self-hosted servers (e.g., Jellyfin). Echo also supports external lyrics and music tracking (e.g., Last.fm).

## Setup

### Installing Echo
- Download the first ZIP file from the [**nightly**](https://nightly.link/brahmkshatriya/echo/workflows/nightly/main/artifact) page.
- Unzip the downloaded file. If your file manager doesn't support unzipping, try using [MiXplorer](https://forum.xda-developers.com/showpost.php?p=23109280).
- You will find an `.apk` file inside. Install it on your device.


### Installing extension
Extensions are a mix of `.eapk` and `.apk` files. `.eapk` files are installed automatically, but `.apk` files need to be installed manually like regular apps.

::: tabs

== Link / Code

| Extension | Code | Manual |
|-|-|-|
| All-in-one :s: | `extension` | [Link](https://raw.githubusercontent.com/itsmechinmoy/echo-extensions/main/echo_extensions.json) |
| EchoDown | `echodown` | [Link](https://paste.rs/9x6hj) |

== Repositories

#### Music Streaming

| Dev            | Extensions                                                                                   |
|----------------|----------------------------------------------------------------------------------------------|
| brahmkshatriya | [Spotify](https://github.com/brahmkshatriya/echo-spotify-extension/releases)                |
| ^^             | [YouTube](https://github.com/brahmkshatriya/echo-youtube-extension/releases)                |
| GrimXer0       | [TuneIn](https://github.com/GrimXer0/EchoTuneIn-extension/releases)                         |
| LuftVerbot     | [Deezer](https://github.com/LuftVerbot/echo-deezer-extension/releases)                      |
| Secozzi        | [Jellyfin](https://github.com/Secozzi/echo-jellyfin-extension/releases)                     |

#### Lyrics

| Dev        | Extensions                                                                                   |
|------------|----------------------------------------------------------------------------------------------|
| rebelonion | [Lyrics Translator](https://github.com/rebelonion/echo-lyrics-translator/releases)          |
| shub39     | [Genius](https://github.com/shub39/echo-genius-extension/releases)                          |
| ^^         | [Kugou](https://github.com/shub39/echo-kugou-extension/releases)                            |
| ^^         | [LRCLIB](https://github.com/shub39/echo-lrclib-extension/releases)                          |
| ^^         | [MusixMatch](https://github.com/shub39/echo-musixmatch-extension/releases)                  |

#### Tracking

| Dev        | Extensions                                                                                   |
|------------|----------------------------------------------------------------------------------------------|
| rebelonion | [Last.fm](https://github.com/rebelonion/echo-lastfm/releases)                               |

#### Others
| Dev            | Extensions                                                                                   |
|----------------|----------------------------------------------------------------------------------------------|
| brahmkshatriya | [Cineby](https://github.com/brahmkshatriya/echo-cineby-extension/releases)                  |
| brahmkshatriya | [Discord RPC](https://github.com/brahmkshatriya/echo-discord/releases)                          |
| LuftVerbot     | [Echodown](https://github.com/LuftVerbot/echo-echodown-extension/releases)                  |
| rebelonion     | [ASMR One](https://github.com/rebelonion/echo-asmr-one/releases)                            |

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
- Go to the [Repositories](#installing-extension) tab and tap on the repository you want to add to the player.
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
- Tap and hold "**Check for Extension Updates**".
- If a new update is found, you'll be prompted to install it.
- After installation, restart Echo.

### Adding account
To access personalized content, playlists, and streaming features, add your account. To add an account,
- Go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-stream-rounded: **Extension**
- Then click on the music streaming extension you want to link.
- Click :material-symbols-login-rounded: **Login** and follow the instructions.

### Playing music
By default, Echo is an offline music player. You have to install [music extensions](#installing-extension) to stream music.

- Click :material-symbols-stream-rounded: **Extension** icon and select a music streaming extension.
- Depending on the extension:
  - It can show and play songs without login (e.g., YouTube Music).
  - It may show playlists and songs but cannot play any tracks (e.g., Spotify).
  - It may not show anything without login (e.g., Deezer).

::: info Unified Extension
The Unified Extension lets you browse all extensions from the top bar. In the library, you can create playlists and add songs from multiple services there.
:::

::: tip Audio glossary
If you wanna learn about the audio basics, read our [**audio glossary**](/glossary/audio)
:::

## Important

#### Spotify Account Suspension
The Spotify extension violates Spotify’s Terms of Service. Accounts are typically suspended in waves. The Echo development team is not responsible for any account suspension. If your account is suspended, you will need to contact Spotify Support directly.

::: warning False Negative
Sometimes the app may show a false negative about account suspension. Check your email for any message from Spotify with the subject "**Notice under Spotify Terms and Conditions of Use**". If you haven't received such an email, simply log out and log back in. This resolves the issue.
:::


## Other guides

### Changing lyrics provider
Echo supports multiple lyrics providers. You can select your preferred provider from the player.
- Play a song and click on **Lyrics**.
- Then scroll up and you will see :material-symbols-queue-music-rounded: Music Provider "Logo".
- Click on the logo and select the lyrics provider.

The last selected lyrics provider will be set as the default.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/t0lBUbf4HLs" frameborder="0" allowfullscreen></iframe></div>

___

### Downloading music
To download songs in Echo, you have to install [EchoDown](#installing-extension) extension.

- Open any song/album you want to download.
- Press :material-symbols-more-horiz: to open the menu and then click :material-symbols-download-for-offline-outline-rounded: **Download**

You can see the progress in :material-symbols-settings-outline-rounded: **Settings** ->  :material-symbols-download-for-offline-outline-rounded: **Downloads**. Once done, you'll find them in :material-symbols-files-outline: **Offline**. If you can't find the Offline section, click :material-symbols-stream-rounded: **Extension** icon, and select :material-symbols-files-outline: **Offline** from there.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/-TamZ_J7NmA" frameborder="0" allowfullscreen></iframe></div>

___

### Transferring playlist

Using the Spotify extension can lead to account suspension. It’s best to use an alternate account and transfer all your data there.

___

#### General

- Go to [**TuneMyMusic**](https://www.tunemymusic.com/transfer).  
- Select the source service. A pop-up window will open. Grant the necessary permissions.  
- Click **Load from Source Account**.  
- Once the new page loads, click **Choose Destination**.  
- Select the destination service and grant permissions, just like for the source.  
- Click **Start Transfer** to begin.

::: tip TuneMyMusic Limit Bypass
TuneMyMusic lets you transfer 500 songs for free. You can reset this limit by clearing the website’s data and cookies — available in your browser’s site settings (usually found next to the address bar).
:::

___

#### Spotify

::: tabs
== CSV
- Go to [**Exportify**](https://exportify.net)
- Login with Spotify
- Click "**Export**" beside each playlist
- Save the CSV files

== Acc-to-Acc
Alternatively, you can use [Trikatuka](https://trikatuka.aknakn.eu/#/) to transfer data between Spotify accounts.
:::

## Troubleshooting

### General

#### Extension Update Issue
Some ISPs might block GitHub raw or gist URLs, which can prevent extension updates. To work around this, use a [VPN](/qs#vpn).

___

### Deezer

#### Deezer not available in my country
Use a [VPN](/qs#vpn) to create your Deezer account. After that, you can access Deezer without a VPN by using a proxy server. To set up a proxy, go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-stream-rounded: **Extension** -> **Deezer** -> **Use Proxy**, and select a proxy server from the list.

___

### Spotify

#### Missing Argument
Go to :material-symbols-settings-outline-rounded: **Settings** -> :material-symbols-stream-rounded: **Extension** -> :simple-icons-spotify: **Spotify**, and enable **Show Widevine Streams** and set the "**Stream Quality**" as **Medium**. This should solve the playback issue.

Revert it again once the spotify extension is fixed, as some songs may not play audio while "**Show Widevine Streams**" is enabled.
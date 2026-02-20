---
title: Echo
customDescription: Guide on how to use echo. 
outline: [1,2]
og:
    image: https://i.wotaku.wiki/f/echo.png
---

[**Echo**](https://github.com/brahmkshatriya/echo) is an extension-based music player app. It can play music from streaming websites (e.g., YouTube, Spotify, Deezer) and self-hosted servers (e.g., Jellyfin). Echo also supports external lyrics and music tracking (e.g., Last.fm).

<br>

# Setup

## Installing Echo
1. Visit the [**Echo Nightly Builds**](https://github.com/itsmechinmoy/echo-nightly) page and download the latest ZIP file (usually the first one listed).
2. Extract the ZIP file using your file manager. If extraction isn't supported, consider using an app like [MiXplorer](https://forum.xda-developers.com/showpost.php?p=23109280).
3. Inside the extracted folder, locate the `.apk` file.
4. Open the `.apk` file to begin installation. If prompted, allow installation from unknown sources in your device settings.
5. Once installed, launch Echo and proceed to install extensions as needed (see below).
::: info
To install apps from outside the Play Store, you may need to enable the "Unknown Sources" option in your device settings.
:::

## Installing Extensions

Echo supports two types of extension files:
- `.eapk` files: Installed automatically by Echo.
- `.apk` files: Must be installed manually, like any other Android app.

Follow the steps below to install extensions using either a link/code or by downloading files directly.

::: tabs

== Link / Code

**Quick Add via Code or Link**

1. **Open the Echo app.**
2. Tap the :material-symbols-stream-rounded: **Extension** icon in the app.
3. Tap :material-symbols-add-circle-outline-rounded: **Add Extension**.
4. Enter a shortcode or paste a URL from the table below.
5. Tap **Add**.
6. A list of available extensions will appear.
7. Select the extensions you want to install.
8. Tap **Add** again.
9. For each extension, the **Extension Installer** will appear. Tap **Install** to complete.

| Extension         | Code         | Direct Link                                                                                   |
|-------------------|-------------|----------------------------------------------------------------------------------------------|
| All-in-one :s:    | `extension` | [All-in-one](https://raw.githubusercontent.com/itsmechinmoy/echo-extensions/main/echo_extensions.json) |
| EchoDown          | `echodown`  | [EchoDown](https://gist.githubusercontent.com/LuftVerbot/81f8748205dc7fc419269c59e7cffdb1/raw/993b221af28a01a6380fd36692935b670a18ee43/echo_extensions.json) |

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/l9WsxYekKfY" frameborder="0" allowfullscreen></iframe></div>

== File

**Manual Install via File**

1. Go to the [Repositories](#extension-repositories) tab below and choose a repository for the extension you want.
2. Download the latest `.apk` or `.eapk` file from the repository link.
3. Open the Echo app.
4. Tap the :material-symbols-stream-rounded: **Extension** icon.
5. Tap :material-symbols-add-circle-outline-rounded: **Add Extension**, then select **File**.
6. Tap **Add** and select the downloaded `.apk` or `.eapk` file.
7. The **Extension Installer** will appear. Tap **Install** to finish.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/QTP9PruoH8c" frameborder="0" allowfullscreen></iframe></div>
:::

---

### Extension Repositories

Below are official and community repositories for various types of extensions. Use these links to download extension files or find more information.

::: tabs

== Music

| Developer        | Extension                                                                                  | Description                                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Abhishek         | [YouTube](https://github.com/Abhishek890/Eco-Youtube_Music/releases)                       | Play and browse music from YouTube and YouTube Music, often works without login.                              |
| ^^               | [Saavn](https://github.com/Abhishek890/Echo-Saavn-Extension/releases)                      | Listen to streams from Saavn on Echo.                                                                         |
| BitFable         | [DAB](https://github.com/BitFable/echo-dab-yeet-extension/releases)                        | Play and browse music from DAB Music on Echo.                                                                 |
| brahmkshatriya   | [Spotify](https://github.com/brahmkshatriya/echo-spotify-extension/releases)               | Stream music from Spotify. Requires login for full access.                                                    |
| LuftVerbot       | [Deezer](https://github.com/LuftVerbot/echo-deezer-extension/releases)                     | Access and stream music from Deezer. Login required to browse and play tracks.                                |
| Secozzi          | [Jellyfin](https://github.com/Secozzi/echo-jellyfin-extension/releases)                    | Connect to your Jellyfin server to stream your personal music library.                                        |

== Radio

| Developer        | Extension                                                                                  | Description                                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| m-tki            | [iHeartRadio](https://github.com/m-tki/echo-iheart-extension/releases)                     | Play music from iHeartRadio on Echo.                                                                          |
| ^^               | [Radio Browser](https://github.com/m-tki/echo-radiobrowser-extension/releases)             | Play and browse radio from Radio Browser on Echo.                                                             |
| ^^               | [TuneIn](https://github.com/m-tki/echo-tunein-extension/releases)                          | Listen to live radio stations and streams via TuneIn.                                                         |

== Tracking

| Developer    | Extension                                                                                      | Description                                                                                                   |
|--------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| rebelonion   | [Last.fm](https://github.com/rebelonion/echo-lastfm/releases)                                  | Scrobble your listening activity to Last.fm for music tracking and recommendations.                           |

== Lyrics

| Developer    | Extension                                                                                      | Description                                                                                                   |
|--------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| rebelonion   | [Lyrics Translator](https://github.com/rebelonion/echo-lyrics-translator/releases)             | View and translate song lyrics in real time while listening.                                                  |
| shub39       | [Genius](https://github.com/shub39/echo-genius-extension/releases)                             | Fetch lyrics and annotations from Genius for your currently playing song.                                     |
| ^^           | [Kugou](https://github.com/shub39/echo-kugou-extension/releases)                               | Get lyrics from Kugou, including support for Chinese and international tracks.                                |
| ^^           | [LRCLIB](https://github.com/shub39/echo-lrclib-extension/releases)                             | Access a large open-source lyrics database (LRCLIB) for synced and unsynced lyrics.                           |
| ^^           | [MusixMatch](https://github.com/shub39/echo-musixmatch-extension/releases)                     | Display synced lyrics from MusixMatch, supporting many languages and artists.                                 |

== Others

| Developer        | Extension                                                                                  | Description                                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| brahmkshatriya   | [Cineby](https://github.com/brahmkshatriya/echo-cineby-extension/releases)                 | Watch and manage movies and TV shows directly within Echo.                                                    |
| ^^               | [Discord RPC](https://github.com/brahmkshatriya/echo-discord/releases)                     | Show your currently playing music as a status on Discord using Rich Presence.                                 |
| LuftVerbot       | [Echodown](https://github.com/LuftVerbot/echo-echodown-extension/releases)                 | Download music from supported streaming services for offline listening.                                       |
| m-tki            | [IPTV](https://github.com/m-tki/echo-iptv-extension/releases)                              | Watch IPTV streams from IPTV-org on Echo.                                                                     |
| rebelonion       | [ASMR One](https://github.com/rebelonion/echo-asmr-one/releases)                           | Stream relaxing ASMR audio content from ASMR One.                                                             |

:::

## Updating Extensions

- Echo automatically checks for extension updates every 6 hours.
- To check for updates manually:
  1. Go to :material-symbols-settings-rounded: **Settings**.
  2. Tap :material-symbols-stream-rounded: **Extension**.
  3. Tap :material-symbols-sync-rounded: to check for updates.
- If an update is available, you will be prompted to install it.
- If the app still shows an extension as out of date, try restarting Echo.

## Adding your music accounts

To enjoy personalized features like playlists, recommendations, and streaming, you’ll need to link your music service accounts to Echo. Here’s how to get started:

1. Open :material-symbols-settings-rounded: **Settings** in Echo.
2. Tap :material-symbols-stream-rounded: **Extension**.
3. Select the music streaming extension you want to connect (for example, Spotify, YouTube, or Deezer).
4. Tap :material-symbols-login-rounded: **Login** and follow the on-screen instructions to sign in.

Once your account is linked, you’ll have access to your personal music library and streaming features, depending on the service.

## How to Play Music in Echo

Echo works as an offline music player by default, letting you play music stored on your device. To stream music from online services, you’ll need to install [music extensions](#installing-extensions).

To play music from a streaming service:

1. Tap the :material-symbols-stream-rounded: **Extension** icon.
2. Choose a music streaming extension from the list.

Depending on the extension you select:
- Some services (like YouTube Music) let you browse and play songs without logging in.
- Others (like Spotify) may let you browse playlists and songs, but require you to log in before you can play anything.
- Some (like Deezer) may not show any content until you log in.

::: info Unified Extension
With the Unified Extension, you can browse all your installed music services from the top bar. In your library, you can create playlists and add songs from multiple services in one place.
:::

::: tip Audio Glossary
New to audio terms? Check out our [**audio glossary**](/glossary/audio) to learn the basics!
:::

---

<br>

# Essential Information & Troubleshooting for Echo

## 1. Account Safety & Spotify Usage

### Spotify Extension Risks

::: warning Important
The Spotify extension violates Spotify’s Terms of Service. Using it may result in your Spotify account being suspended, often in waves.
:::

::: info Responsibility
The Echo team is not responsible for any account suspensions. If your account is suspended, you must open email about your account suspension and contact Spotify Support directly from there (it will open a live chat).
:::

### False Suspension Warnings

Sometimes Echo may incorrectly report your account as suspended. To check:
- Look for an email from Spotify with the subject "**Notice under Spotify Terms and Conditions of Use**".
- If you haven’t received such an email, log out and log back in to Echo. This usually resolves the issue.

### Safer Usage: Use an Alternate Account

To protect your main Spotify account:
- Create and use an alternate (alt) Spotify account for Echo.
- Transfer your playlists, albums, and artists using the [**transfer guide**](#transferring-playlists).
- Or, add your alt account as a collaborator on your playlists:
  1. Open the official Spotify app or website.
  2. Go to one of your own playlists.
  3. Click the :ic-baseline-person-add: **Invite Collaborators** button.
  4. Copy the collaboration link and open it while logged into your alt account.

## 2. Managing Your Music & Echo Features

### Blacklisting Folders

Echo scans all your music folders for offline playback. To exclude a folder:
- Go to :material-symbols-settings-rounded: **Settings** → :material-symbols-stream-rounded: **Extension** → :material-symbols-files-outline: **Offline**.
- Tap **Blacklist Folders** and select folders you want to exclude.

### Changing Lyrics Provider

Echo supports multiple lyrics sources. To switch:
1. Play a song and tap **Lyrics**.
2. Scroll up to see the :material-symbols-queue-music-rounded: Music Provider "Logo".
3. Tap the logo and select your preferred lyrics provider.
::: info
The last selected provider becomes the default.
:::

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/t0lBUbf4HLs" frameborder="0" allowfullscreen></iframe></div>

### Downloading Music

To download songs:
1. Install the [EchoDown extension](#installing-extensions).
2. Open any song/album you want to download.
3. Press :material-symbols-more-horiz: and select :material-symbols-download-for-offline-outline-rounded: **Download**.

- Track download progress in :material-symbols-settings-rounded: **Settings** → :material-symbols-download-for-offline-outline-rounded: **Downloads**.
- Find completed downloads in :material-symbols-files-outline: **Offline**. If you can't find this section, tap :material-symbols-stream-rounded: **Extension** and select :material-symbols-files-outline: **Offline**.

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/-TamZ_J7NmA" frameborder="0" allowfullscreen></iframe></div>

### Transferring Playlists

If you use an alternate Spotify account, transfer your data as follows:

### Exporting Playlists as CSV

- Visit [**Exportify**](https://exportify.net)
- Log in with Spotify
- Click "**Export**" beside each playlist
- Save the CSV files

### Account To Account Playlist Transfer

::: tabs

== Trikatuka

To transfer playlists between Spotify accounts using Trikatuka:

1. Go to [Trikatuka](https://trikatuka.aknakn.eu/#/).
2. Log in with your source Spotify account.
3. Select the playlists you want to transfer.
4. Log out and log in with your destination Spotify account.
5. Import the previously selected playlists into the new account.

== SpotMyBackup

To transfer playlists using SpotMyBackup:

1. Visit [SpotMyBackup](http://www.spotmybackup.com/).
2. Log in with your source Spotify account.
3. Click "Backup" to export your playlists as a file.
4. Log out and log in with your destination Spotify account.
5. Click "Restore" and upload the backup file to import your playlists.


== SpotifyMigrator (Advanced)

>[!INFO]
This guide is more advanced than the other two and requires some more time to setup and configure. This guide is here as an alternative in case the other two no longer work. For more details and troubleshooting, see the [official documentation](https://github.com/JustSxm/SpotifyMigrator#readme).

[SpotifyMigrator](https://github.com/JustSxm/SpotifyMigrator) is an application to help you transfer your data from an account to another account. It requires some technical setup.

**Steps:**

1. **Spotify App Configuration**  
   - Create an app on the [Spotify Developer Website](https://developer.spotify.com/dashboard/applications).
   - Fill out the **App Name**, **App Description** and **Redirect URI**. For the **Redirect URI**, use `http://localhost:5009/api/Spotify`
   - Click on **Settings**, then **User Management**. Add the email of the other account you are **not currently logged in with** (new or old) to give it access to the application. Once you filled out the details, click **Add User**.

2. **Migrator App Configuration**  
   - Download the [Release](https://github.com/JustSxm/SpotifyMigrator/releases).
   - Open `wwwroot/appsettings.json`.
   - Put the **Client ID** of the application you just created (found in **Basic Information**).
   - If you are using the application for migrating your liked songs into **multiple playlists**, put the **ID** of a playlist where all the songs migrated will be put. If you don't need it, just create a **temporary playlist** and delete it after using the application.
   - Once done, save and exit.
   - Now open `appsettings.json`.
   - Put the **Client ID & Client Secret** of the application you just created (found in **Basic Information**).

3. **Running The Migration Tool**  
   - If you are on Windows, simply open `SpotifyMigrator.Server.exe`. Then visit `localhost:3000` on your browser.
   - If you are on Linux or Mac, simply run `dotnet SpotifyMigrator.Server.dll` in the command line
   >[!INFO]
   You will need [dotnet](https://dotnet.microsoft.com/en-us/download) installed to run the application on Linux or Mac.
   - Then visit `localhost:3000` on your browser.

4. **Demo:**
   ![SpotifyMigrator Demo](https://raw.githubusercontent.com/JustSxm/SpotifyMigrator/master/meta/demo.gif)

:::

## 3. Troubleshooting Common Issues

### General Issues

#### Extension Update Problems

- Some ISPs block GitHub Raw/Gist URLs, which can prevent extension updates.
- **Solution:** Use a [VPN](/qs#vpn) to bypass these restrictions.

#### Extensions Out of Date

- Update your extensions ([see instructions](#updating-extensions)).
- Force stop the app and re-open Echo.

---

### Deezer Issues

#### Deezer Not Available in Your Country

- Use a [VPN](/qs#vpn) to create your Deezer account.
- Afterward, you can use a proxy server for access:
  - Go to :material-symbols-settings-rounded: **Settings** → :material-symbols-stream-rounded: **Extension** → **Deezer** → **Use Proxy** and select a server.

#### Null Error

- Usually caused by network issues, a non-functional proxy, or incorrect login credentials.

---

### Downloading / EchoDown Issues

#### Downloaded File Not Highest Quality

- By default, EchoDown uses medium quality.
- To change: :material-symbols-settings-rounded: **Settings** → :material-symbols-stream-rounded: **Extension** → **Misc** → **EchoDown** → **Download Quality** → select **Highest**.

#### "open failed: ENOENT (No such file or directory)"

- This happens if you move or delete the downloaded folder.
- Fix: Move the folder back, or remove it from :material-symbols-download-for-offline-outline-rounded: **Downloads** and use :material-symbols-files-outline: **Offline** to play files.

---

### Spotify Issues

#### Extension Outdated Despite Being Latest

- Go to your [Spotify Personal Info Settings](https://www.spotify.com/account/profile/).
- Change your "Country or region".

#### "Oops! Something went wrong"

- If you see this error while logging in, try using the password method instead of OTP.
- If it persists, force close and reopen the app, then try again.

#### Socket Closed

- Force close and reopen Echo.
- Or, switch to incognito mode in the extension and log back in:
  - Tap :material-symbols-account-circle-full: at the top right
  - Select :mdi-incognito: **Incognito**

#### "Spotify stored token required"

- Log out of the Spotify extension, force close Echo, reopen, and log back in.

---

### YouTube Music Issues

::: info
The extension has recently been updated to fix all the errors users faced. As time goes, this part will be updated for any common error codes that pop up.
:::

### Discord RPC Issues

::: info
There is a known issue, specifically with logging into the extension. You'll have to wait for an update that fixes this before you're able to use the RPC features again in Echo.
:::

---

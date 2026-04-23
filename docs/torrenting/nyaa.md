---
title: nyaa
customDescription: A tutorial for navigating nyaa
og:
    image: https://i.wotaku.wiki/f/tor.png
---

## Categories

| Category | Subcategory | Icon | Description |
| :--- | :--- | :--- | :--- |
| Anime | Anime Music Video | ![](/nyaa/1_1.png) | Anime clips set to music. |
| ^^ | English-translated | ![](/nyaa/1_2.png) | Anime with English sub/dub. |
| ^^ | Non-English-translated | ![](/nyaa/1_3.png) | Anime in other languages. |
| ^^ | Raw | ![](/nyaa/1_4.png) | Anime with the original audio and no subs. |
| Audio | Lossless | ![](/nyaa/2_1.png) | High-fidelity audio formats. |
| ^^ | Lossy | ![](/nyaa/2_2.png) | Compressed audio formats. |
| Literature | English-translated | ![](/nyaa/3_1.png) | Books/Manga in English. |
| ^^ | Non-English-translated | ![](/nyaa/3_2.png) | Books/Manga in other languages. |
| ^^ | Raw | ![](/nyaa/3_3.png) | Original-language scans/digitals. |
| Live Action | English-translated | ![](/nyaa/4_1.png) | Asian movies/dramas with English sub/dub. |
| ^^ | Idol/Promotional Video | ![](/nyaa/4_2.png) | Idol performances or promo material. |
| ^^ | Non-English-translated | ![](/nyaa/4_3.png) | Asian movies/dramas in other languages. |
| ^^ | Raw | ![](/nyaa/4_4.png) | Asian movies/dramas in their original language. |
| Pictures | Graphics | ![](/nyaa/5_1.png) | Digital art and CG. |
| ^^ | Photos | ![](/nyaa/5_2.png) | High-resolution photography/scans. |
| Software | Applications | ![](/nyaa/6_1.png) | Software-related uploads in general. |
| ^^ | Games | ![](/nyaa/6_2.png) | Games-specific category. |

## Color Codes

| Color | Meaning & Example |
|-|-|
| Green | The uploader is trusted by staff, a profile-based tag rather than upload-based. |
| ^^    | Subsplease's upload of Frieren WEB-dl in x264 without transcoding. <br> ![](/nyaa/green.png) |
| ^^    | Erai-raw's upload was transcoded from x264 but marked as green since the account is marked as trusted. <br> ![](/nyaa/green2.png)
| Red   | This mainly indicates it's a modified version of the source (doesn't mean it's bad by default). For anime, it indicates a re-encoded video. For manga, it indicates that an edit of someone else's release, usually for the purposes of joining spread pages. It's added by the uploader (rarely by staff), so not every qualifying torrent will have it. Sometimes it's indicated with "ED" tag instead.|
| ^^    | Here, ASW has transcoded the original WEB-dl from x264 to x265. <br> ![](/nyaa/red.png) |
| ^^    | Here, Raze has transcoded the video to x265 as well as interpolated it from 24fps to 144fps. <br> ![](/nyaa/red2.png) |
| ^^    | In this case, Shellshock has just merged the spreads and repacked the volumes. <br> ![](/nyaa/red3.png) |
| Blue  | Rated best by [Seadex](https://releases.moe/), visible with their [script](https://releases.moe/nyaablue.user.js). <br> ![](/nyaa/blu.png) |
| Uncoded | Most of the torrents are uncoded, which means you have to judge by the title and description. |
| ^^    | Varyg's WEB-dl upload of frieren in x264. <br> ![](/nyaa/unc.png) |
| ^^    | Interpolated upload of Bang Dream <br> ![](/nyaa/unc1.png) |
| ^^    | 1r0n's Kingdom manga upload with color leveling and spread joined. <br> ![](/nyaa/unc2.png) |
| ^^    | Modified version of tronboy's upload.![](/nyaa/unc3.png) |
| ^^    | 0v3r's upscalled manga upload. ![](/nyaa/unc4.png) | 

## Anime File Naming

![Anime file name sections](/diagram/anifile.svg)

| Part | Description |
|-|-|
| Release group | The individual or team behind the release, also called Encoder in the case of encodes. Example: SubsPlease, Erai-raws, EMBER, Yameii, etc. Sometimes, the release group name is mentioned at the end. |
| Source | **WEB-DL**: Untouched videos, downloaded from streaming sites without encoding
| ^^     | **WEB-Rip**: Videos sourced from streaming sites that went through screen-capture and/or encoding methods
| ^^     | **BDISO**: A disk image of a Blu-ray disc, needs to be mounted in order to be played (like other ISOs) and is used for making encodes or remuxes.
| ^^     | **BDMV**: Short for “Blu-ray Disc Movie”, a container format used to store high-definition video, audio, and other related content on Blu-ray discs.
| ^^     | **Remux**: Videos sourced from disc releases without encoding, making them have very high quality and file sizes.
| ^^     | **Encode**: A video that has gone through lossless or lossy compression processes in order to save file size, also called a DVDRip or BDRip.
| ^^     | **Re-Encode**: An encode that has gone through the process of further encoding, thus degrading in quality.
| ^^     | **Mini-Encode**: A video where the priority is the smallest possible file size, even if the quality would greatly suffer as a result.
| Resolution | The number of pixels contained in each frame, a higher value means improved quality (unless it's an upscaled release). The most common ones are 360p, 480p, 576p, 720p, 1080p, and 2160p. Most anime nowadays are made in 1080p. So, most of the 2160p anime are upscalled. This upscale can/will cause artifacts, over sharpening, or aggressive denoising since it's not really possible to add details out of nothing.
| Video Codec | The encoding process for the video file. The most popular encoders today are **x264** (AVC) and **x265** (HEVC), with the latter being newer and able to achieve higher compression rates with less quality loss. To learn more about encoding, visit [**Codec Wiki**](https://av1.wiki/docs/introduction/prologue).
| Audio Format | **Lossless**: These retain the highest audio quality and have larger file sizes as a consequence. The most common one is FLAC.
| ^^     | **Lossy**: These formats aim to provide good quality while keeping file sizes small. The most popular ones today are AAC, AC3, EAC3 (all commonly found in Web releases), with MP3 being found in older releases.
| Subtitles | **Raw**: A video without subtitles.
| ^^     | **Fansubs**: Unofficial aka fan-made translations or an edited version of the official subtitle.
| ^^     | **Hardsubs**: Subtitles that are burned into the frames and are part of the video track itself, can't be turned off.
| ^^     | **Softsubs**: Subtitles that are contained on their own track inside a video file or a separate file that's loaded with the video, can be turned on or off.
| File Hash | These are [CRC32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) codes, used to detect errors during file transmission. For example: 7BAAC64C. CRC generates a 32-bit code for each file (in hexadecimal, it's 8 digits). Fansubbers include these codes in the filename so that users can easily [check](https://animechecker.sourceforge.net/) whether the downloaded file is corrupted or not. If the file is corrupted, the user will receive a different code than the one written in the file name.
| Container / Format | The container used for the video file, with the most widely used one today being **MKV**, for the ability to put multiple audio/subtitle tracks in one video file. The most popular one in the past was **MP4**, which focused on being compatible with a wide range of devices, but was only able to have burned-in hardsubs.


## Manga / LN File Naming

![Manga file name sections](/diagram/manfile.svg)

| Part | Description |
|-|-|
| Publisher | The publisher can be mainly two types. **CaaS (Chapters as a Service)** sites release chapters indvidually instead of volume. Examples: Manga Plus, Manga UP!, Comikey, Tapas etc. **Volume** websites sells the whole volume with better quality. Example: VIZ, Kodansha, Square Enix etc. |
| Source | Nowadays the primary source is digital, since it's easier to rip and usually higher quality. In the case of scans, the most used tag is c2c - cover to cover. |
| Uploader | The ripper of the manga, either an individual or group. If the manga is scanlated, the scanlation group is credited here. |
| PRE | Indicates that a digital release has issues the publisher has yet to fix (like missing/duplicated pages). PRE2 means the publisher has fixed some of those issues, but not all of them. |
| f | It indicated this is a fixed version after the initial upload. If there are further fixes, it will be put as f2, f3 etc. |
| Brackets | () -> Manga
| ^^ | {} -> Manhwa
| ^^ | [] -> Light Novel |
| Format | CBZ is the most common file format for manga, actually just a Zip container. There are also CBR(RAR), CB7(7zip), PDF, ePub etc. The image files inside are generally jpeg, png or webp. JPEGXL/JXL is a newer supported format which can provide really good quality under lower file size. |
